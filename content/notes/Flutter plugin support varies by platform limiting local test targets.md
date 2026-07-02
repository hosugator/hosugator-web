---
created: 2026-06-14
updated: 2026-06-14
type: study
status: 2-stable
subject: "[[Software]]"
project: "[[Go2fit]]"
tags:
  - flutter
  - mobile
  - testing
  - platform
publish: true
---
## Context
GF-88 커뮤니티 피드 FE-BE 연동 테스트 중 macOS, Chrome, iOS Simulator, 실기기(무선) 순서로 실행을 시도했다. 각 타겟마다 다른 이유로 막혔고 Flutter 플러그인의 플랫폼 지원 범위가 테스트 전략에 직접 영향을 준다는 걸 체감했다.

## Insight
### 플랫폼별 Flutter 플러그인 지원 현황 (2026-06-14 기준)

| 플랫폼 | `kakao_flutter_sdk` | `flutter_secure_storage` | 결론 |
|--------|-------------------|--------------------------|------|
| iOS (기기/시뮬레이터) | ✅ | ✅ | 완전 동작 |
| macOS | ❌ (MissingPluginException) | ⚠️ keychain entitlement 필요 | 로그인 불가 |
| Chrome (web) | ⚠️ 웹 SDK 별도 | ❌ web 미지원 | 세션 불가 |
| Android | ✅ | ✅ | 완전 동작 |

### macOS 빌드 시 `flutter_secure_storage` 키체인 에러는 entitlement 문제다

에러 코드 `-34018`은 `com.apple.security.keychain-access-groups` entitlement 누락을 뜻한다. `macos/Runner/Release.entitlements`에 추가하면 해결되지만, 카카오 SDK 자체가 macOS 미지원이므로 근본적인 해결책이 아니다.

### iOS 실기기 무선 빌드는 Xcode SDK 버전이 기기 iOS 버전 이상이어야 한다

기기 iOS 26.5, Xcode에 iOS 26.2 SDK 없음 → 빌드 실패. `Xcode > Settings > Platforms`에서 해당 버전 다운로드 필요 (수 GB).

### 로그인이 필요한 앱의 dev 테스트 타겟 우선순위

`iOS Simulator > 실기기(유선) > 실기기(무선) > macOS > web`

## Related
- [[OAuth dev bypass by seeding test user and minting JWT directly]] — 플랫폼 제약을 우회하는 API 직접 테스트 패턴
