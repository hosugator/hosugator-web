---
created: 2026-06-12
updated: 2026-06-12
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[DTK in 2026]]"
tags:
  - tmux
  - cli
  - claude-code
  - automation
  - aiops
  - experiment
publish: true
---
## Context
팀 동료와 tmux 고급 명령어 얘기를 하다가 send-keys, capture-pane을 알게 됐다. Claude Code에 명령어를 요청하고 내가 직접 다른 터미널에 복붙해서 실행하는 워크플로우를 쓰고 있었는데, 이 방식과 어떤 관계인지 탐색했다.

## Insight
### send-keys + capture-pane은 Claude Code 내부 Bash 도구와 동일한 패턴이다

```
Claude Code 내부 Bash 도구
  명령 전달 → subprocess (파이프, 비가시)
  출력 수신 ← stdout 캡처

tmux 방식
  명령 전달 → send-keys → 팬 셸 (가시)
  출력 수신 ← capture-pane → VT 텍스트 버퍼
```

패턴이 같다 — 명령 주입 → 실행 → 출력 캡처. 중간 매개체만 다르다. 결정적 차이는 **실행 가시성**이다. tmux 방식은 사용자가 옆 팬에서 명령이 입력되고 출력이 쌓이는 걸 지켜볼 수 있다.

### capture-pane은 화면 캡처가 아니라 VT 텍스트 버퍼를 읽는다

tmux는 각 팬마다 소프트웨어 가상 터미널(VT) 버퍼를 내부적으로 유지한다. capture-pane은 이 텍스트 버퍼를 읽는 것이다. 팬이 숨겨져 있거나 다른 윈도우에 있어도 버퍼는 계속 쌓이고, 결과는 텍스트라서 grep/awk/tail이 바로 붙는다.

```bash
# 팬 출력에서 에러만 추출
tmux capture-pane -t session:0.1 -p | grep "ERROR" | tail -20
```

### Claude Code가 인접 팬에 명령을 위임하면 복붙 오류를 제거하면서 가시성을 유지한다

현재 워크플로우 — Claude가 명령어를 제안하면 내가 별도 터미널에 복붙 → 복붙 과정에서 오타·포맷 오류 발생 가능.

send-keys 위임 방식:
```bash
tmux send-keys -t main:1.2 "kubectl get pods -n production" Enter
tmux capture-pane -t main:1.2 -p | tail -20
```

Claude가 명령을 팬에 직접 입력하므로 오타가 없고, 실행 과정은 옆 팬에서 그대로 보인다.

### tmux + 오픈 모델로 서버 로그를 감시하는 패턴은 AIOps의 DIY 구현이다

AIOps(AI for IT Operations)는 이미 산업 표준 영역이다. 상용 도구들이 같은 개념을 구현하고 있다.

```
규칙 기반 (Prometheus, AlertManager): 임계값 초과 시 알림, 예외 없음
판단 기반 (tmux + LLM): 컨텍스트 읽고 상황 판단, 불명확하면 사람에게 에스컬레이션
```

"사람이 옆 팬에서 볼 수 있다"는 특성이 안전장치다. 완전 자율 실행보다 "AI 제안 + 사람 승인" 구조를 유지하면 hallucination 위험을 통제할 수 있다.
오픈 모델 품질이 프로덕션 수준에 올라온 게 2024-2025년 즈음이라, 이 패턴은 아직 얼리어답터 실험 단계다. 추후 직접 실험해볼 가치 있음.

## Related
- [[Terminal emulators render text streams locally while multiplexers persist sessions on the host]] — tmux가 세션을 유지하는 원리
