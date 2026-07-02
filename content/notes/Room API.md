---
created: 2025-07-20 14:18
updated: 2026-02-15 13:43
type: insight
status: 2-stable
subject: "[[Software]]"
project: "[[Intel AI for Future Workforce]]"
tags:
  - 
publish: true
---
 내가 작성한 코드/어노테이션 (`@Entity`, `@Dao`, `@Database`)을 Room (정확히는 KSP와 Room의 어노테이션 프로세서)이 읽는다.
 여기에서 Room 컴파일러는 Kotlin 코드를 직접 이해할 수 없기에, KSP라는 번역기를 통해 이해하고 작업을 수행하게 된다.
 Room은 이 정보를 바탕으로 데이터베이스 스키마 생성, 데이터 접근 로직, 데이터베이스 초기화 및 관리에 필요한 `Kotlin/Java 소스 코드`를 자동으로 생성한다.
 Kotlin 컴파일러는 내가 작성한 원본 Kotlin 코드와 Room이 자동 생성한 소스 코드를 모두 JVM이 이해할 수 있는 형태인 바이트코드(`.class` 파일)로 번역한다.
 이 바이트코드와 기타 리소스들이 묶여 `.apk` 파일이 만들어지고, 이 `.apk` 파일이 안드로이드 디바이스에 설치된다.
 앱이 디바이스에서 실행될 때, `Room.databaseBuilder(...).build()`와 같이 Room이 생성한 코드들이 호출되면서 실제 디바이스 저장소에 `.db` 파일(데이터베이스)이 생성된다.
 그 후 코드에 따라 남은 데이터베이스 작업(삽입, 조회 등)이 수행된다.