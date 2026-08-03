---
created: 2026-05-26
updated: 2026-07-20
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - github
  - security
  - ssh
  - 2fa
  - pat
publish: true
---
## Context
zettelkasten vault를 GitHub private repo로 관리하면서 보안 수준을 검토했다. 회사 컴퓨터(Windows, Ubuntu)에도 clone해서 사용 중이고, 향후 완전 삭제가 필요할 때를 대비해 정리했다.

## Insight
### GitHub 보안은 계정 보호와 기기 정리 두 축이 독립적이다

```
계정 보호  → 2FA (웹 로그인에만 적용)
기기 정리  → 로컬 파일 삭제 + SSH 키 제거 (물리적 접근 차단)
```

SSH 키 삭제나 PAT 만료는 GitHub와의 연결을 끊는 것이지, 이미 clone된 로컬 파일을 지우지 않는다. 기기에서 완전히 제거하려면 로컬 삭제가 본체다.

### SSH는 2FA를 우회한다

SSH 키 인증은 2FA와 독립적이다. SSH 개인 키를 가진 사람은 2FA 없이 repo에 접근 가능하다. 단, SSH 키 탈취는 물리적 기기 접근이나 악성코드가 필요해 현실적 위협이 낮다.

### PAT는 repo 단위 접근 제한과 즉시 무효화가 장점이다

| | SSH | Fine-grained PAT |
|--|--|--|
| 접근 범위 | 계정 전체 repo | 지정 repo만 |
| 만료 설정 | 없음 | 가능 |
| 유출 시 피해 | 전체 repo | 해당 repo만 |
| git 작업 흐름 | 영향 없음 | 영향 없음 |
| 로컬 파일 | 무관 | 만료 시 push/pull만 불가 |

회사 컴퓨터처럼 신뢰도 낮은 환경에는 SSH보다 Fine-grained PAT가 적합하다. 다른 repo는 SSH 유지, zettelkasten만 HTTPS로 전환 가능하다.

### 회사 컴퓨터 완전 삭제 체크리스트

```bash
rm -rf ~/zettelkasten              # 파일 + .git 히스토리
rm -rf ~/.config/obsidian          # Obsidian 캐시
sed -i '/zettelkasten/d' ~/.zsh_history  # 셸 히스토리
```

GitHub에서 해당 기기 SSH 키 Delete → 이후 해당 기기에서 SSH 접근 즉시 차단.

## Related
- [[Removing personal traces from a shared computer requires clearing more than login sessions]] — 브라우저·CLI 인증정보·Keychain 등 git/SSH 밖의 흔적까지 확장한 후속 노트