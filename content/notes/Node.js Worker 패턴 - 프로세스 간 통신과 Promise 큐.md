---
created: 2026-04-28 16:41
updated: 2026-04-28 16:41
status: 1-draft
type: insight
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - nodejs
  - ipc
  - async
  - promise
  - pattern
publish: true
---
## 핵심 전제

매 요청마다 프로세스를 새로 띄우면 cold-start 비용이 누적된다.  
프로세스를 한 번 띄우고 stdin/stdout으로 계속 통신하는 것이 Worker 패턴의 본질이다.

```
요청마다 spawn:  Python 초기화 + 모델 로드 × N회  → 요청당 6.5s
Worker 패턴:    Python 초기화 + 모델 로드 × 1회  → 캐시 후 요청당 0.4s
```

---

## stdin/stdout JSON 라인 프로토콜

프로세스 간 통신의 가장 단순한 형태. 줄바꿈(`\n`)이 메시지 구분자 역할을 한다.

Python 측 주의사항: `line_buffering=True`와 `flush=True`가 없으면 버퍼에 쌓여 상대방이 응답을 받지 못하는 교착 상태가 발생한다.

```python
sys.stdout.reconfigure(line_buffering=True)
print(json.dumps({"status": "ready"}), flush=True)

for line in sys.stdin:
    req = json.loads(line.strip())   # strip(): \n 제거
    result = process(req)
    print(json.dumps(result), flush=True)
```

- `strip()`: stdin에서 읽으면 줄 끝에 `\n`이 붙어 있어 JSON 파싱 실패 방지
- `for line in sys.stdin`: stdin이 닫힐 때(프로세스 종료 시)까지 무한 대기

---

## Promise 큐 패턴

Node.js는 비동기이므로 여러 요청이 동시에 들어올 수 있다. Python은 순서대로 처리한다.  
응답이 와도 어느 요청의 응답인지 알기 위해 FIFO 큐에 resolve를 순서대로 보관한다.

```
요청 A → queue: [A]    → stdin: A 전송
요청 B → queue: [A, B] → stdin: B 전송

Python 응답 A → queue.shift() → A의 resolve 호출
Python 응답 B → queue.shift() → B의 resolve 호출
```

FIFO가 성립하는 이유: Python이 순서대로 처리하므로 응답도 순서대로 온다.

---

## 핵심 구조 (에러 핸들링 제외)

```javascript
const { spawn } = require('child_process');
const readline = require('readline');

let worker = null;
const queue = [];

function startWorker() {
  worker = spawn('python3', ['worker.py']);
  const rl = readline.createInterface({ input: worker.stdout });

  rl.on('line', (line) => {
    const msg = JSON.parse(line);
    if (msg.status === 'ready') return;  // 준비 신호는 무시

    const item = queue.shift();          // FIFO: 맨 앞에서 꺼냄
    item.resolve(msg);                   // 기다리던 요청자에게 전달
  });
}

function callWorker(data) {
  return new Promise((resolve, reject) => {
    queue.push({ resolve, reject });                        // 보관
    worker.stdin.write(JSON.stringify(data) + '\n');        // 전송
    // 끝. 응답은 rl.on('line')이 받아서 resolve 호출
  });
}
```

---

## 구성 요소별 역할

| 구성 요소                      | 역할                                      |
| -------------------------- | --------------------------------------- |
| `child_process.spawn`      | 자식 프로세스 실행. stdin/stdout을 파이프로 자동 연결    |
| `readline.createInterface` | 텍스트 스트림을 줄 단위 이벤트로 변환                   |
| `rl.on('line', ...)`       | 줄바꿈 감지 시 콜백 실행 (이벤트 리스너)                |
| `queue`                    | resolve 함수를 FIFO 순서로 보관하는 배열            |
| `Promise`                  | 비동기 작업의 성공(resolve)/실패(reject) 두 가지 결말  |
| `queue.shift()`            | 배열 맨 앞에서 꺼냄 (FIFO). `pop()`은 맨 뒤 (LIFO) |

---

## 실제 서버 연결 패턴

```javascript
// HTTP 요청에서 입력값을 받아 Worker로 전달
app.post('/infer', async (req, res) => {
  const { image_path, ckpt_path } = req.body;
  const result = await callWorker({ image_path, ckpt_path });
  res.json(result);
});
```

실제 구현에서 추가되는 것들:
- workerReady 대기 로직 (준비 전 요청 큐잉)
- 타임아웃 처리 (일정 시간 응답 없으면 reject)
- Worker 프로세스 크래시 시 재시작

---

## 이 패턴을 한 번 직접 짜보면

실제 프로덕션 코드에서 에러 핸들링 코드를 봤을 때 "아, 이 구조에 타임아웃/재시작 로직을 추가한 것"으로 읽힌다.  
핵심 패턴을 이해하면 부가 기능은 읽기만 해도 파악된다.

---

## 관련 노트

- [[PyTorch GIL과 GPU Starvation - CPU·GPU 병렬성의 본질]] — Worker 패턴이 필요한 이유 (cold-start 비용)
- [[AI 에이전트 시대 실무자의 이해 수준 — 무엇을 알아야 하는가]] — 핵심 패턴 직접 짜기가 코드 레벨 어휘력을 쌓는 경로
