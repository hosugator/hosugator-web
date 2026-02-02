---
created: 2026-01-09
tags:
  - AWS
  - Hybrid_Cloud
  - Infrastructure
---
# Hybrid Resource Model of Storage Gateway

## 본질 (Essence)
> 내 땅(온프레미스 자원)을 일부 내어주고 클라우드의 관리자와 무한한 창고를 입주시키는 '등가교환' 방식의 스토리지 입구

## 구조 (Mechanism)
- **정의**: AWS Storage Gateway를 온프레미스 VM(가상 머신)으로 배포하여, 사용자 로컬 자원과 클라우드 자원을 결합해 운영하는 아키텍처 모델
- **핵심**: 
    1. **연산 자원(CPU/RAM)**: 사용자 서버의 자원을 빌려 게이트웨이 소프트웨어(관리자)를 구동함
    2. **저장 자원(Local Disk)**: 사용자 스토리지 일부를 '로컬 캐시'로 점유하여 데이터 접근 속도를 최적화함
    3. **클라우드 연결**: 이렇게 확보된 전초기지를 통해 S3 등의 무한한 클라우드 용량을 로컬 네트워크 속도로 연결함

## 확장 (Connection)
- **연결**: [[iSCSI/NFS/SMB]]는 이 전초기지와 사용자 컴퓨터를 잇는 '보이지 않는 케이블' 역할을 함
- **응용**: 클라우드 도입 초기, 모든 데이터를 한 번에 옮기기 어렵거나 로컬의 빠른 응답 속도가 반드시 필요한 하이브리드 환경 설계 시 필수 개념

---
See Also: [[AWS Storage Gateway]], [[Virtual Machine]], [[Local Caching]]