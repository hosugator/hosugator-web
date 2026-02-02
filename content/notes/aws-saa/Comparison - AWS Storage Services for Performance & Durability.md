---
created: 2025-12-19 Fri
tags: [comparison, decision_making]
reference:
  - "[[Amazon EC2 Instance Store]]"
  - "[[Amazon EBS]]"
  - "[[Amazon S3]]"
---
# Comparison - AWS Storage Services for Performance & Durability

## 비교 목적 (Objective)
비디오 처리와 같은 고성능 작업과 대규모 데이터 보관 요구사항이 공존할 때, 성능과 내구성 사이의 최적의 스토리지 조합을 선정하기 위함입니다.

## 요소별 상세 비교 (Feature Matrix)

| 비교 기준 | [[Amazon EC2 Instance Store]] | [[Amazon EBS]] | [[Amazon S3]] |
| :--- | :--- | :--- | :--- |
| **핵심 철학** | 로컬 물리 연결을 통한 극강의 속도 | 네트워크 연결을 통한 데이터 영구 보존 | 무제한 확장성과 최고 수준의 내구성 |
| **장점 (Pros)** | 가장 낮은 지연 시간 및 최대 I/O 성능 제공 | 인스턴스와 독립적으로 존재하며 스냅샷 지원 | 99.999999999% 내구성 및 저렴한 저장 비용 |
| **단점 (Cons)** | 인스턴스 중지/종료 시 데이터 영구 삭제 | 네트워크 대역폭 제한에 따른 성능 제약 존재 | 객체 기반 저장소로 OS 부팅 등에는 부적합 |
| **비용/관리** | 인스턴스 비용에 포함 (추가 비용 없음) | 할당량 기반 과금 및 성능(IOPS)별 차등 | 실제 사용량 기반 과금 및 티어별 최적화 |

## 선택 기준 및 로직 (Selection Criteria)

### [[Amazon EC2 Instance Store]]를 선택해야 하는 경우
* **조건:** 데이터가 휘발되어도 무방하며, 비디오 렌더링이나 실시간 분석 등 'Maximum possible I/O'가 최우선인 경우
    * *Ex:* 비디오 인코딩 작업 중 생성되는 대용량 임시 스크래치 데이터 처리

### [[Amazon EBS]]를 선택해야 하는 경우
* **조건:** 성능과 데이터 보존이 모두 중요하며, 파일 시스템 수준의 접근(Read/Write)이 필요한 경우
    * *Ex:* 관계형 데이터베이스(RDS)의 데이터 파일 저장소 또는 운영체제(OS) 볼륨

### [[Amazon S3]]를 선택해야 하는 경우
* **조건:** 대규모 데이터를 매우 안전하게 보관해야 하거나, 아카이빙을 통해 비용을 절감해야 하는 경우
    * *Ex:* 300TB 규모의 원본 미디어 콘텐츠 보관 및 900TB 규모의 장기 보관용 아카이브(Glacier)

---
**Conclusion:**
최대 성능의 임시 작업은 Instance Store, 영구적인 대용량 보관은 S3가 정답입니다.