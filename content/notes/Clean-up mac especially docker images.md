---
created: 2026-05-24
updated: 2026-05-24
type: study
status: 2-stable
subject: "[[Infra]]"
project: "[[Self-development in 2026]]"
tags:
  - docker
  - storage
  - cleanup
  - macos
publish: true
---

## Context

macOS 로컬 디스크(460GB)가 가용 공간 3.7GB까지 차서 시스템 경고 발생. 분석 결과 주요 원인은 여러 프로젝트(sodam-diary, cureat, dotodo, go2fit, hosugator)의 Docker 아티팩트 누적과 Xcode 관련 파일들이었다.

주요 점유 항목:
- Docker 이미지·컨테이너·볼륨·빌드캐시: ~130GB (buildx 볼륨 14.7GB, sodam-diary 이미지 등 장기 방치)
- Xcode iOS DeviceSupport (iPhone 13 Pro, iOS 18.5~26.3 누적): ~26GB
- iOS Simulator 런타임 (iOS 18.6 + iOS 26.3): ~43GB
- Android SDK: 15GB
- Xcode DerivedData: 4.1GB

## Decision

**전체 삭제 후 필요 시 재생성** 전략 채택.

1. **Docker 전체 (`docker system prune -a --volumes -f`)**: 운영 환경은 Oracle Cloud에 있어 로컬 이미지는 재빌드 가능. 실행 중이던 go2fit 테스트 DB, k3d 클러스터도 Oracle DB와 Oracle k3s로 대체 가능.
2. **iOS DeviceSupport 구버전 삭제**: iPhone 13 Pro가 iOS 26.3.1로 업그레이드됨. 18.x 버전 4개 폴더와 26.3.1 구버전 1개 삭제, 최신 1개만 유지.
3. **iOS Simulator 런타임 전체 삭제**: 무선 연결이 불안정해 실물 기기 테스트도 어려운 상황. 시뮬레이터 필요 시 Xcode에서 재다운로드.
4. **Android SDK 삭제**: Flutter 앱이지만 iOS 빌드만 사용. Android 빌드 필요 시 재설치.
5. **Xcode DerivedData 삭제**: 빌드 아티팩트, 재빌드 시 자동 재생성.

## Consequences

- 3.7GB → 150GB 여유 공간 확보 (+127GB)
- Docker 이미지 재사용 불가: 다음 로컬 빌드 시 `docker build` 또는 `docker pull` 필요
- iOS 시뮬레이터 필요 시 Xcode → Settings → Platforms에서 재다운로드 (약 16~19GB/버전)
- Android 빌드 필요 시 Flutter가 자동으로 Android SDK 재설치 안내

재발 방지: Docker는 프로젝트 종료 시 `docker system prune -a`로 정리하는 습관 필요.
