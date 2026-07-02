---
created: 2026-06-02
updated: 2026-06-02
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
tags:
  - git
  - lfs
  - gitlab
  - devops
  - networking
publish: true
---
## Context
Synology NAS에서 Docker로 운영하는 self-hosted GitLab(`http://aaronyi.synology.me:30080/`)에 LFS 오브젝트를 push하려고 했다. 커밋 push는 21MB/s로 정상 동작했지만, LFS 업로드는 0%에서 무한 대기 상태가 됐다.
이전에 LFS 도입을 결정한 배경 → [[Git LFS over symlinks for binary repo files because symlink targets break on clone]]

## Insight
### GitLab LFS batch API는 external_url 기준으로 업로드 URL을 내려준다
```
[1] 클라이언트 → POST /info/lfs/objects/batch  (외부 URL 기준, 성공)
[2] GitLab 응답 → "upload to http://gitlab/..."  ← external_url이 내부 호스트명일 때
[3] 클라이언트 → PUT http://gitlab/... (포트 80)  ← 외부에서 접근 불가, 무한 대기
```
GitLab의 `external_url`이 내부 컨테이너 호스트명(`http://gitlab/`)으로 잘못 설정되어 있으면, LFS 오브젝트 업로드 URL이 외부에서 접근 불가한 주소로 내려온다. 에러 메시지도 없이 0%에서 멈추기 때문에 원인을 찾기 어렵다.

### hairpin NAT은 git push는 해결하지만 LFS upload URL 문제는 해결 못 한다
`/etc/hosts`에 `gitlab` → 외부 IP를 등록해 DNS 문제를 우회했고, hairpin NAT이 지원되어 git push 자체는 성공했다.
그러나 LFS batch 응답의 업로드 URL은 `http://gitlab/`(포트 80)이므로, 외부 IP 포트 80이 열려 있지 않으면 여전히 실패한다.
**근본 해결책**: GitLab 서버에서 `external_url 'http://aaronyi.synology.me:30080'` 설정 후 `gitlab-ctl reconfigure`.

## Decision
LFS 완전 제거. 일반 git 오브젝트 추적으로 전환.
**이유:**
- 바이너리 파일 총량 ~46MB — 일반 추적으로 관리 가능한 수준
- self-hosted GitLab 서버 설정 변경은 NAS 관리자 개입 필요 (즉시 불가)
- 단독 개발자 레포, 대용량 바이너리 증가 계획 없음
**전환 조건:** GitLab `external_url` 교정이 이루어지고 바이너리 파일이 GB 단위로 증가하면 LFS 재도입 검토.
**조치:**
```bash
git lfs migrate export --include="*.pdf,*.pptx,*.png,..." --everything
# .gitattributes에서 filter=lfs 제거
git lfs uninstall
git push --force-with-lease origin feat/model-AOI
git push --force-with-lease hong feat/model-AOI
```

## Consequences
- LFS 제거로 히스토리 131개 커밋 SHA 재작성 (LFS 도입 이전 커밋은 무변경)
- GitHub, NAS GitLab 양쪽 force push 필요
- 이후 바이너리 파일은 일반 git 오브젝트로 추적 — clone 시 전체 다운로드

## Related
- [[Git LFS over symlinks for binary repo files because symlink targets break on clone]] — 이 노트에 의해 superseded
- [[DVC manages ML data versions the way git manages code]] — GB~TB 규모 ML 데이터 발생 시 대안
