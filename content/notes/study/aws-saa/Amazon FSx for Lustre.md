---
created: 2025-12-23
tags:
  - AWS_Storage
  - FSx_for_Lustre
  - HPC
reference:
  - "[[FSx]]"
  - "[[Amazon FSx for NetApp ONTAP]]"
---
# Amazon FSx for Lustre

## 정의 (Definition)
고성능 컴퓨팅(HPC) 및 대규모 데이터 처리를 위해 설계된 S3 연동형 병렬 파일 시스템

## 핵심 맥락 (Context & Why)
### Problem
수백 개 이상의 EC2 인스턴스가 동시에 대규모 데이터에 접근해야 하는 환경에서 일반적인 공유 스토리지(EFS)나 객체 스토리지(S3)는 지연 시간과 처리량 한계로 인해 성능 병목을 유발함
### Solution
병렬 아키텍처를 사용하는 Lustre를 통해 밀리초 미만의 지연 시간과 초당 수백 GB의 처리량을 제공하며 S3와 데이터를 직접 주고받는 기능을 통해 데이터 파이프라인 효율을 극대화함

## 작동 원리 (Mechanism) 
### S3 데이터 처리 로직
S3 버킷 연결 설정 -> 데이터 필요 시 S3에서 FSx로 메타데이터 및 실제 데이터 인입(Lazy Load 가능) -> 수백 대의 EC2가 병렬로 고속 연산 수행 -> 처리 완료된 결과물을 FSx 명령어를 통해 다시 S3로 내보내기(Export) -> FSx 자원 회수

## 유비 및 비교 (Analogy & Comparison)
### It's like
S3가 거대한 창고라면 FSx for Lustre는 창고 바로 옆에 설치한 초고속 자동화 컨베이어 벨트 시스템과 같음. 물건을 창고에서 잠시 꺼내 고속으로 가공한 뒤 다시 창고에 넣는 작업에 최적화됨
### vs (유사 개념): 
 - FSx for Lustre: 분산 병렬 처리에 특화되어 있으며 분석 및 계산용 임시 스토리지로 자주 활용됨
 - FSx for NetApp ONTAP: 기업용 데이터 관리 기능(복제, 스냅샷 등)이 풍부하며 온프레미스 스토리지의 클라우드 이전에 적합함

## 예시 및 구조 (Example/Structure)
기상 예측 모델링 시스템 구축 시나리오: `S3에 관측 데이터 저장` -> `FSx for Lustre(SSD) 생성 및 S3 연결` -> `수백 대의 C계열 인스턴스가 연산 수행` -> `최종 예측 데이터를 S3로 백업`