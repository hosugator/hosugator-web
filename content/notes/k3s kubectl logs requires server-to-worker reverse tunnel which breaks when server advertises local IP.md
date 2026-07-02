---
created: 2026-06-28
updated: 2026-06-28
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - k3s
  - kubernetes
  - networking
  - tailscale
  - remotedialer
publish: true
---
## Context
맥북 Rancher Desktop Lima VM을 k3s worker node로 join했다. `kubectl get nodes`는 Ready, Pod 스케줄링도 성공했는데 `kubectl logs`만 502 Bad Gateway로 실패했다. 원인을 찾는 데 상당한 시간이 걸렸다.

## Insight
### k3s의 두 통신 방향은 완전히 독립적으로 동작한다

```
방향 1 (agent → server): Pod 스케줄링, 노드 등록, heartbeat
  Lima VM → 100.110.4.54:6443 (K3S_URL, Tailscale)
  → 정상 동작

방향 2 (server → agent kubelet): kubectl logs, exec, port-forward
  회사 PC → remotedialer tunnel → 100.66.98.34:10250 (Lima VM kubelet)
  → 실패
```

방향 1이 정상이어도 방향 2는 별도로 뚫려야 한다. Pod가 생성된다고 logs가 된다는 보장이 없다.

### remotedialer는 server가 advertise하는 IP로 tunnel을 맺는다

k3s agent는 서버에 접속하면서 서버가 advertise하는 주소 목록을 받는다. agent의 내부 load balancer가 이 주소들을 등록하고, remotedialer tunnel도 이 주소 중 하나로 연결을 시도한다.

```
# Lima VM agent log (문제 상황)
Remotedialer proxy error; reconnecting...
error="dial tcp 192.168.100.142:6443: connection refused"
url="wss://192.168.100.142:6443/v1-k3s/connect"
```

서버가 로컬 IP(`192.168.100.142`)를 advertise하고 있어서, Lima VM이 그 IP로 tunnel을 맺으려다 실패했다. Lima VM은 Tailscale을 통해서만 서버에 접근 가능하기 때문이다.

### 진단 순서

1. `kubectl logs` → 502 확인
2. worker node에서 `sudo tail -f /var/log/k3s-agent.log | grep remotedialer` → tunnel 연결 실패 IP 확인
3. 실패 IP가 Tailscale IP가 아니면 server `advertise-address` 문제

## Decision
**k3s server config.yaml에 `advertise-address`를 Tailscale IP로 설정**

```yaml
# /etc/rancher/k3s/config.yaml (서버)
advertise-address: "100.110.4.54"
tls-san:
  - "100.110.4.54"
```

`tls-san`을 함께 추가해야 Tailscale IP로 접속 시 TLS 인증서 검증이 통과된다.

설정 후 `sudo systemctl restart k3s` 필요.

**전환 조건**: 서버가 로컬 네트워크 내 다른 클라이언트도 서빙해야 하는 경우, `advertise-address`를 변경하면 해당 클라이언트에서 kubeconfig 갱신이 필요할 수 있다.

## Consequences
- 설정 후 Lima VM agent가 `wss://100.110.4.54:6443/v1-k3s/connect`로 tunnel 수립
- `kubectl logs`, `kubectl exec`, port-forward 모두 정상 동작
- 기존 align-ai-inference Pod는 k3s 재시작 후 자동 복구됨

## Related
- [[WSL2 Worker Node fails on cross-node pod networking due to NAT and TCP-only port proxy]] — 같은 "방향 2" 문제의 다른 사례. WSL2는 Flannel VxLAN(UDP)이 막혀서 pod 네트워크 자체가 불가했고, 오늘은 remotedialer(TCP)가 막혀서 logs만 불가했다.
- [[Tailscale establishes P2P tunnel through simultaneous outbound hole punching not server relay]] — Tailscale이 이미 뚫려있어도 k3s 내부 tunnel이 별도로 필요한 이유
- [[Rancher Desktop over OrbStack because Apache 2.0 allows commercial use without restriction]] — Lima VM worker node 구성 과정
