---
created: 2026-06-14
updated: 2026-06-16
type: study
status: 2-stable
subject: "[[App]]"
project: "[[Go2fit]]"
tags:
  - flutter
  - ios
  - xcode
  - debugging
publish: true
---
## Context
GF-88 커뮤니티 UI 연동 후 실기기에서 테스트하는 과정에서 Xcode를 닫았더니 앱이 종료됐다. flutter run vs Xcode 재생 버튼의 차이, debug vs release 빌드의 동작 차이를 실제로 체감했다.

## Insight
### flutter run과 Xcode 재생 버튼은 역할이 다르다

| 도구            | 역할                                         |
| ------------- | ------------------------------------------ |
| `flutter run` | Dart 컴파일 → Xcode 빌드 트리거 → Hot Reload 채널 유지 |
| Xcode 재생 버튼   | iOS 빌드 + 서명 + 기기 배포 (flutter run 없이)       |

무선 환경에서는 `flutter run`이 Dart VM 연결에 실패(mDNS 타임아웃 75초)하므로 **Xcode 재생 버튼이 더 안정적**이다. 단, Hot Reload는 불가능하다.

### debug 빌드는 Xcode 디버그 세션에 종속된다

`flutter run`(debug mode)으로 설치된 앱은 Xcode의 디버그 세션에 attach된 상태다. Xcode를 닫으면 iOS가 디버그 프로세스를 종료시켜 앱도 함께 죽는다.
release 빌드(`flutter build ios --release`)는 Dart 코드가 네이티브 기계어로 미리 컴파일되어 Dart VM 자체가 없다. Xcode 없이 완전히 독립 실행된다.

### flutter attach로 이미 실행 중인 앱에 Hot Reload를 붙일 수 있다

Xcode가 앱을 실행했고 Dart VM URL을 알고 있을 때:

```bash
flutter attach --debug-uri http://127.0.0.1:<port>/<token>/
```

이후 `r`로 Hot Reload 가능. Xcode 로그 하단에서 URL 확인:

```
flutter: The Dart VM service is listening on http://127.0.0.1:55445/PZP0BdbyXMc=/
```

### flutter run은 기기에 설치된 release 빌드를 debug 빌드로 덮어쓴다

`flutter build ios --release` + `flutter install`로 독립 실행 앱을 설치해도, 이후 `flutter run`을 실행하면 debug 빌드로 재설치된다. Xcode 없이 실행되던 앱이 다시 Xcode 세션 종속 상태로 돌아간다.

**개발 워크플로우 기준:**
- 코드 수정 중 → `flutter run` (Hot Reload 목적)
- 독립 실행 검증 시 → `flutter build ios --release && flutter install` (명시적으로 마지막에 실행)

## Related
- [[Flutter plugin support varies by platform limiting local test targets]] — 플랫폼별 테스트 타겟 선택 전략
