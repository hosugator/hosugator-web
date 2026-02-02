---
created: 2026-01-07
tags:
  - comparison
  - aws
  - storage
  - block
  - file
  - object
---
# Comparison: Block vs File vs Object Storage

## 비교 목적 (Objective)
데이터의 관리 단위, 접근 방식, 수정 효율성에 따른 최적의 스토리지 형식 선정

## 요소별 상세 비교 (Feature Matrix)
| 비교 기준 | [[Block Storage]] | [[File Storage]] | [[Object Storage]] |
| :--- | :--- | :--- | :--- |
| 사용자 비유 | 찰흙 / 바이너리 (Raw Data) | 도서관의 책 (정형) | 자유로운 보따리 (비정형) |
| 관리 단위 | 블록 (Block) | 파일 (File) | 객체 (Object) |
| 접근 방식 | iSCSI / 광채널 (직접 제어) | NFS / SMB (공유 프로토콜) | HTTP API / REST (키-값) |
| 수정 방식 | 필요한 블록만 부분 수정 (고효율) | 파일 시스템을 통한 수정 | 전체를 새로 업로드 (전체 교체) |
| 확장성 | 제한적 (인스턴스 종속적) | 중간 (수천 개 서버 공유 가능) | 무한대 (인터넷 규모 확장) |
| 주요 용도 | 데이터베이스(DB), 운영체제(OS) | 문서 공유, 홈 디렉토리 | 빅데이터, 정적 웹 호스팅, 백업 |

## 선택 기준 및 로직 (Selection Logic)

- Block Storage가 적합한 경우
	- 조건 (IF): 초저지연 성능이 필요하고 데이터베이스처럼 세밀한 제어가 필수일 때
	- 이유 (THEN): 운영체제가 직접 블록 단위로 데이터를 주무를 수 있어 효율이 가장 높음

- File Storage가 적합한 경우
	- 조건 (IF): 여러 사용자가 익숙한 폴더 구조로 문서를 공유하고 편집해야 할 때
	- 이유 (THEN): 계층적 구조를 제공하여 인간과 애플리케이션이 이해하기 가장 쉬움

- Object Storage가 적합한 경우
	- 조건 (IF): 데이터 양이 방대하고, 수정보다는 안전한 보관과 대규모 접근이 중요할 때
	- 이유 (THEN): 메타데이터와 데이터를 함께 저장하며, 전 세계 어디서든 API로 쉽게 접근 가능함

## Conclusion
성능과 통치권은 **Block**, 공유와 편의성은 **File**, 확장성과 비용은 **Object**를 선택하는 것이 아키텍처 설계의 기본 원칙입니다.

---
See Also:
- [[EBS]]
- [[EFS]]
- [[S3]]
- [[NFS]]
- [[SMB]]
- [[iSCSI]]