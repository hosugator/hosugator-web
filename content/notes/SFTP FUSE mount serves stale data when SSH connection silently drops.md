---
created: 2026-07-06
updated: 2026-07-06
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - sftp
  - raidrive
  - fuse
  - network-storage
publish: true
---
## Context
사내 NAS에 연결된 RaiDrive SFTP 마운트(`~/Z`)가 6/29 이후 4일간 파일 목록을 갱신하지 않았다. `cache-retention-read`가 1800초(30분)로 설정되어 있었음에도 캐시 만료가 일어나지 않았고, `raidrivecli list`는 `Mounted` 상태를 정상으로 표시했다.

## Insight
### 캐시 TTL은 SSH 연결이 살아있을 때만 동작한다

`cache-retention-read` 만료 시 마운트는 서버에 재조회를 시도하지만, SSH 연결 자체가 끊겨있으면 재조회가 불가능하고 마지막 캐시를 계속 서빙한다. 방화벽·서버 idle timeout으로 SSH가 조용히 끊기면(silent disconnect) 마운트는 살아있는 것처럼 보이지만 stale 데이터를 반환한다.

### `raidrivecli` 상태 진단만으로는 연결 건강성을 알 수 없다

`raidrivecli list`의 `Mounted` 표시는 실제 연결 건강성을 반영하지 않는다. `monitor` 명령은 라이선스 필요. 캐시 디렉토리(`/var/cache/raidrive/`)가 비어있었던 것으로 인메모리 캐시임을 확인 — 재부팅 없이도 remount로 초기화된다.

## Decision
### 데이터 갱신이 안 될 때는 remount가 가장 신뢰할 수 있는 해결책이다

```bash
raidrivecli unmount sftp && raidrivecli mount sftp
```

`cache-retention-read` 값 단축(예: 60초)은 연결이 살아있을 때의 갱신 주기만 조절할 뿐, silent disconnect 문제는 해결하지 못한다. 근본 해결은 서버 측 `ClientAliveInterval` 설정이지만, 사내 NAS 설정 변경이 필요하므로 현재는 remount로 운영한다.

## Related
- [[RaiDrive CLI SFTP 마운트 패턴 - Linux 클라우드 스토리지 연결]] — 마운트 설정 레퍼런스
- [[Abandoned raidrivecli mount automation]] — mount 자동화 포기 기록
- [[Re-read external state between decisions and freeze it within one]] — 외부 상태를 캐시할 때 갱신 경로 자체가 검증 대상이 되는 이유
