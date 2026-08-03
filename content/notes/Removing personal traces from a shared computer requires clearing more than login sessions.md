---
created: 2026-07-20
updated: 2026-07-20
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - security
  - privacy
  - device-cleanup
  - browser
publish: true
---
## Context
[[GitHub repository security has two independent axes account protection and device cleanup]]에서 git/SSH 흔적 제거를 정리해뒀던 걸 다시 찾다가, "크롬 브라우저는 로그아웃만 하면 되는지"를 물으며 범위가 브라우저와 그 밖의 전반으로 확장됐다.

## Insight
### 로그아웃은 계정 동기화만 끊을 뿐, 로컬에 저장된 데이터는 그대로 남는다

크롬에서 구글 계정 로그아웃을 해도 프로필에 로컬로 저장된 다음 데이터는 그대로 남는다:

- 저장된 비밀번호(크롬 비밀번호 관리자), 자동완성 데이터
- 방문 기록 — 로그인 상태와 무관하게 로컬에 계속 쌓임
- 쿠키/세션 — 구글 계정만 로그아웃했지, GitHub·Slack·Gmail 등 다른 사이트 로그인 세션은 별개로 남음
- 다운로드 목록 및 실제 다운로드된 파일, 설치한 확장 프로그램, 캐시된 사이트별 저장 데이터

제대로 지우려면 로그아웃이 아니라 프로필 자체를 삭제하거나(설정 → 사용자 및 그룹 → 프로필 삭제), 인터넷 사용 기록 삭제에서 전체 기간 + 모든 항목을 체크해야 한다.

### 브라우저 밖에도 개인 흔적이 남는 지점이 최소 여섯 곳 더 있다 (Windows + Ubuntu 듀얼부팅 기준)

회사 노트북이 macOS가 아니라 기존 Windows + Ventoy로 듀얼부팅한 Ubuntu(ML 작업용) 구조라면, 두 OS 각각에 흔적이 남는다는 걸 감안해야 한다.

1. 패키지 매니저/클라우드 CLI 인증정보 — Ubuntu 쪽은 `~/.npmrc`, `~/.pypirc`, `~/.docker/config.json`, `~/.aws/credentials`, `gcloud auth list`, `~/.kube/config`. Windows 쪽은 `%USERPROFILE%`(예: `C:\Users\이름`) 밑에 동일한 파일들이 별도로 존재할 수 있음 — OS별로 각각 확인 필요.
2. 자격증명 저장소 — macOS Keychain이 아니라, Windows는 자격 증명 관리자(Credential Manager)(Git for Windows 사용 시 Git Credential Manager가 여기 저장), Ubuntu는 GNOME Keyring(`seahorse`/"암호 및 키" 앱으로 확인·삭제)에 SSH 키 passphrase나 저장된 로그인 정보가 남는다.
3. IDE 계정 동기화 — VS Code Settings Sync는 OS 무관하게 동일 — 개인 GitHub/MS 계정으로 로그인되어 있으면 로그아웃 + 로컬 캐시 삭제.
4. 개인 클라우드 동기화 — iCloud는 해당 없고, Windows에 기본 연동된 OneDrive(개인 계정으로 로그인했다면) 또는 Google Drive/Dropbox 클라이언트 로그아웃 + 로컬 동기화 폴더 삭제.
5. 셸/터미널 히스토리 — Ubuntu는 `~/.bash_history`(또는 zsh 사용 시 `~/.zsh_history`), Windows는 PowerShell 히스토리가 `$env:APPDATA\Microsoft\Windows\PowerShell\PSReadLine\`에 파일로 남음(cmd.exe는 세션 종료 시 기본적으로 사라짐).
6. 최근 항목 목록 — Windows는 파일 탐색기의 "빠른 실행"/최근 파일 목록과 작업 표시줄 앱별 "최근 항목"(Jump List), Ubuntu(GNOME)는 파일 관리자(Nautilus)의 "최근 사용" 목록(`~/.local/share/recently-used.xbel`)에 개인 문서 경로가 남을 수 있음.

Ventoy 듀얼부팅 특유의 고려사항: Ventoy는 보통 USB에 ISO를 올려 부팅하는 방식이라, 영속성(persistence) 설정 여부에 따라 완전히 다른 그림이 된다 — persistence가 없으면 Ubuntu 환경이 재부팅마다 초기화되어 위 항목들이 애초에 안 쌓이고, persistence가 있으면 그 USB 자체가 하나의 저장 장치라 내장 디스크와 별개로 그 USB도 정리/폐기 대상에 포함해야 한다.

### 디스크 완전 삭제까지 필요한지는 상황(위협 모델)에 따라 다르다

`rm -rf`는 파일시스템 메타데이터만 지우고 실제 디스크 블록은 (특히 HDD에서) 포렌식 복구가 가능할 수 있다. 정말 민감한 상황이면 `shred`/`srm` 같은 도구나 SSD의 TRIM에 맡겨야 하지만, 일반적인 회사 컴퓨터 반납 시나리오에서는 과할 수 있어 위협 수준에 맞춰 판단한다.

## Related
- [[GitHub repository security has two independent axes account protection and device cleanup]] — git/SSH/PAT에 특화된 원 노트, 이 노트가 브라우저 이외 전반으로 확장
