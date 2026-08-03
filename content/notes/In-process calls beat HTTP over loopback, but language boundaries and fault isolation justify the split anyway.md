---
created: 2026-07-13
updated: 2026-07-13
type: study
status: 2-stable
subject: "[[CS]]"
project: "[[Align AI]]"
tags:
  - network
  - http
  - ipc
  - architecture
publish: true
---
## Context
Align-AI FastAPI를 로컬 `curl`로 테스트하며(loopback, `localhost:8000`) "이게 인터넷 망을 타는 건가?"라는 질문에서 시작해, "그럼 프론트/백엔드를 아예 합치면 더 빠른가?"까지 이어졌다. 
이 질문들에 답하려면 우선 이 지식이 어느 분야인지부터 정리할 필요가 있었다.

## Insight
### "통신 > IPC > 네트워크 > 프로토콜" 순으로 범위가 좁아진다

```
통신(Communication) — 가장 넓은 범주
  └─ IPC (프로세스 간 통신) — 프로세스 경계를 넘는 데이터 교환 전반
       └─ 네트워크(Networking) — IPC 중에서도 네트워크 소켓을 쓰는 경우
            └─ 프로토콜(Protocol) — 네트워크 통신의 구체적 규칙 (HTTP, TCP, IP...)
```

OSI/TCP-IP 계층 구조 자체는 [[Protocol Stack]], [[TCP]]에 이미 정리되어 있음 — 여기서는 "이 지식이 통신의 어느 범주에 속하는가"만 다룬다.

### loopback은 LAN보다 빠르다 — 물리 장치를 아예 안 거치기 때문

| 경로                   | 예시                   | 특성                                          |
| -------------------- | -------------------- | ------------------------------------------- |
| loopback (127.0.0.1) | 로컬 `curl` 테스트        | 물리 네트워크 카드(NIC)를 아예 안 거침, 커널이 메모리 안에서 바로 복사 |
| LAN                  | 같은 클러스터/사무실 통신       | 실제 스위치/카드를 거치지만 홉 수가 적음                     |
| 인터넷                  | hosugator.com ↔ 브라우저 | ISP 다수를 거쳐 감, 지연 크고 변동적                     |

"내부망 속도"라는 직관은 방향은 맞지만, loopback은 내부망보다도 한 단계 더 빠르다 — 내부망조차 거치는 물리 계층 자체를 loopback은 건너뛴다.

### in-process 함수 호출이 HTTP(loopback 포함)보다 빠른 이유

HTTP는 loopback이라도 아래를 전부 거친다:

```
1. 직렬화 (JSON 인코딩, multipart 파싱)
2. 커널 소켓 버퍼로 복사 (syscall)
3. 반대편에서 소켓 버퍼 → 메모리 복사
4. 역직렬화
```

함수 호출은 이 중 아무것도 안 한다 — CPU 명령어 하나로 같은 메모리의 함수를 실행하고 데이터도 참조로 넘어간다. 그래서 나노초~마이크로초(함수 호출) vs 수백 마이크로초~수 밀리초(loopback HTTP) 수준의 차이가 난다.

### 그런데 이 차이가 실제로 의미 있으려면 "본 작업" 자체가 가벼워야 한다

Align-AI 추론 자체가 CPU에서 1.6초~18초 걸리는 걸 이미 겪었다(CPU 코어 1→4 상향 실험). 이 앞에서 HTTP 오버헤드(마이크로초~밀리초)는 반올림 오차 수준이다. "속도"만 보면 분리가 손해지만, 그 손해가 무시할 만한 크기인지는 실제 작업 비용과 비교해야 판단할 수 있다.

### 그럼에도 HTTP로 분리하는 이유는 속도가 아니라 언어 경계와 장애 격리다

1. 언어/런타임 경계: Next.js(Node.js)와 추론 서버(Python)는 서로 다른 프로세스/런타임이라 애초에 함수 호출로 직접 이을 방법이 없다. HTTP(또는 다른 IPC)가 유일한 다리.
2. 장애 격리: 추론 Pod이 죽어도 UI 프로세스는 영향 없음.
3. 독립 배포/스케일링: k8s Deployment 두 개를 각각 독립적으로 롤링 업데이트·스케일 가능.

같은 언어(예: 추론도 JS로 재작성)였다면 in-process 임베드로 네트워크 홉 자체를 없앨 수도 있었을 것 — 하지만 지금 쓰는 numpy/opencv/albumentations 전처리 파이프라인이 Python 생태계라 그 옵션은 없다.

### 이 트레이드오프는 "분산 컴퓨팅의 오류들(Fallacies of Distributed Computing)"의 1번 항목과 같다

"The network is reliable"(네트워크는 안전하다는 착각)로 시작하는 유명한 목록이 있다. 오늘 겪은 "네트워크는 공짜가 아니고, 함수 호출과 다르다"는 실감이 정확히 이 계열의 통찰이다.

## Related
- [[Protocol Stack]] — HTTP/TCP/IP 계층 구조의 원 자료 (OSI/TCP-IP 모델 자체)
- [[TCP]] — loopback도 결국 TCP 위에서 동작(HTTP가 TCP를 감싼 형태)
- [[Software abstraction repeatedly extracts structure from values at increasing scales, a fractal pattern]] — 같은 날 나온 다른 일반화, 이번 노트는 "분리의 비용과 이유"에 초점
