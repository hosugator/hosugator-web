---
created: 2026-05-21
updated: 2026-05-21
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[DTK in 2026]]"
tags:
  - license
  - vscode
  - microsoft
  - opensource
publish: true
---
## Context

팀에서 VS Code 상업적 사용 가능 여부를 질의해서 라이선스를 검토하다가 발견. "VS Code는 MIT 오픈소스라서 무료"라고 단순하게 알고 있었는데, 실제 구조는 달랐다.

## Insight

### 소스코드와 배포 바이너리의 라이선스는 다르다

- GitHub의 소스코드: MIT 라이선스 (누구나 빌드·수정·배포 가능)
- microsoft.com에서 다운받는 설치 파일: Microsoft 독점 라이선스 적용

### 사내 개발 도구 사용은 제한 없음

금지 행위는 "VS Code 자체를 제품으로 재판매하거나 서비스화"하는 케이스에만 해당. 일반 기업에서 개발 도구로 쓰는 것은 규모·용도 무관하게 무료.

### 순수 MIT 빌드가 필요하면 VSCodium

Microsoft 텔레메트리·바이너리 없이 소스만으로 빌드한 VSCodium 프로젝트가 이 구조의 대안으로 존재.

## Verification

- VS Code 공식 라이선스 페이지(code.visualstudio.com/License) 직접 확인
- 팀장님 메일 초안 작성 시 이 구조를 기반으로 "상업적 사용 제한 없음" 결론 도출

## Related
- [[CodeBuild]]