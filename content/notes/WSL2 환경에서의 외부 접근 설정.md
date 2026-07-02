---
created: 2026-04-29 15:07
updated: 2026-04-29 15:07
status: 1-draft
type: insight
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - WSL2
  - networking
  - port-forwarding
  - windows
  - devops
publish: true
---
## 핵심 개념

WSL2는 Windows 안에서 별도 가상 네트워크(172.x.x.x 대역)로 실행된다. VM처럼 동작하기 때문에, Windows 외부에서 WSL2 서비스에 접근하려면 Windows → WSL2 포트 포워딩이 필요하다.

---

## 환경별 비교

| 환경                   | 외부 접근을 위해 필요한 것       |
| -------------------- | --------------------- |
| Native Linux / macOS | IP 확인 + 방화벽 허용        |
| Windows (WSL 없이)     | Windows 방화벽 허용        |
| WSL2                 | 포트 포워딩 + 방화벽 허용 (2단계) |

---

## WSL2 포트 포워딩 설정 (관리자 PowerShell)

```powershell
# 1. WSL2 IP 확인
wsl hostname -I

# 2. 포트 포워딩 등록
netsh interface portproxy add v4tov4 listenport=<PORT> listenaddress=0.0.0.0 connectport=<PORT> connectaddress=<WSL2-IP>

# 3. Windows 방화벽 허용
netsh advfirewall firewall add rule name="<NAME>" dir=in action=allow protocol=TCP localport=<PORT>

# 4. Windows IP 확인 (외부에서 접속할 주소)
ipconfig
```

---

## 주의사항

- WSL2 IP는 재부팅마다 변경된다. 데모/공유 목적이면 재부팅 시마다 재설정하거나 자동화 스크립트 작성 필요.
- Vite 개발 서버는 `host: true` 필요. 기본값이 `localhost` 바인딩이라 외부 접근 불가. `vite.config.ts`에 `server: { host: true }` 추가.
- 접근 가능 여부 빠른 확인법: 핸드폰(같은 Wi-Fi)에서 접속 성공 = 같은 네트워크의 모든 기기 접속 가능.
- 회사 네트워크 주의: 관리형 LAN은 PC 간 직접 통신을 차단할 수 있다. `ping <IP>`로 먼저 확인.

---

## 관련 개념

- [[Node.js Worker 패턴 - 프로세스 간 통신과 Promise 큐]]
