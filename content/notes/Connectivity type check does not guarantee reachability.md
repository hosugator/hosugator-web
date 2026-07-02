---
created: 2026-06-20
updated: 2026-06-29
type: insight
status: 2-stable
subject: "[[App]]"
project: "[[Go2fit]]"
tags:
  - flutter
  - mobile
  - offline
  - networking
publish: true
---
## Context
go2fit FE(feat/GF-89)에서 오프라인 큐 구현 중, `connectivity_plus`의 `checkConnectivity()`로 오프라인 여부를 판단하고 온라인이면 API를 호출하도록 했다. 비행기 모드를 켠 직후 운동을 저장하자 오프라인 분기가 타지 않고 온라인 경로로 진입해 `SocketException: Failed host lookup`이 발생했다.

## Insight
### Connectivity type ≠ reachability

`connectivity_plus`는 네트워크 인터페이스 타입(WiFi, cellular, none)을 반환할 뿐, 실제 인터넷 도달 가능 여부를 보장하지 않는다. iOS에서 비행기 모드를 켜도 인터페이스 상태가 즉시 갱신되지 않아 `ConnectivityResult.none`이 아닌 값이 잠깐 반환될 수 있다.

### catch fallback이 connectivity 체크보다 신뢰성 높다

connectivity 체크(LBYL)를 1차 방어선으로 두되, `SocketException` / `ClientException`을 catch해 큐로 fallback(EAFP)하는 2단계 구조가 race condition을 커버한다.

```dart
} catch (e) {
  final isNetworkError =
      e is SocketException || e.toString().contains('ClientException');
  if (isNetworkError) {
    await _enqueueWorkouts();
    _lastSaveWasOffline = true;
    ...
  }
}
```

## Related
- [[Offline sync queue scope is bounded by data loss risk not feature parity]] — 오프라인 큐 설계 원칙
- [[LBYL checks state before acting while EAFP catches failure after attempting]] — 이 패턴의 상위 개념: Defensive programming, LBYL vs EAFP
