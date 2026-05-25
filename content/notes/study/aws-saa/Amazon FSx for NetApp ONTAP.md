---
created: 2025-12-23
tags:
  - AWS_Storage
  - FSx_for_NetApp_ONTAP
  - Migration
reference:
  - "[[Amazon EFS]]"
  - "[[Amazon S3]]"
---
# Amazon FSx for NetApp ONTAP

## 정의 (Definition)
온프레미스 NetApp 스토리지의 데이터 관리 기능을 AWS 클라우드에서 동일하게 제공하는 완전 관리형 공유 파일 시스템

## 핵심 맥락 (Context & Why)
### Problem
온프레미스의 기업용 애플리케이션을 클라우드로 옮길 때 기존 스토리지의 프로토콜(SMB/iSCSI)이나 고유한 관리 기능(중복 제거, 고속 스냅샷 등)을 포기해야 하거나 아키텍처를 대폭 수정해야 하는 오버헤드가 발생함
### Solution
NetApp 고유의 ONTAP 기능을 클라우드에서 그대로 제공하여 기존 운영 방식을 유지하면서도 높은 가용성과 스토리지 효율성을 확보하며 마이그레이션 난이도를 낮춤

## 작동 원리 (Mechanism) 
### 다중 프로토콜 및 계층화 로직
하나의 파일 시스템 내에서 NFS, SMB, iSCSI 프로토콜 동시 지원 -> 고성능 SSD 계층과 저비용 용량 풀 계층 구성 -> 데이터 접근 빈도에 따라 지능적으로 데이터를 이동시키는 티어링 정책 적용 -> 온프레미스 NetApp과 SnapMirror를 통한 실시간 데이터 복제

## 유비 및 비교 (Analogy & Comparison)
### It's like
집(온프레미스)에서 쓰던 다기능 만능 수납장(NetApp 장비)을 통째로 이삿짐 센터에 맡겨 새 아파트(AWS) 거실에 그대로 배치하는 것과 같음. 수납 방식과 서랍 위치가 똑같아서 새로 적응할 필요가 없음
### vs (유사 개념): 
 - FSx for NetApp ONTAP: 파일과 블록 스토리지를 모두 지원하며 엔터프라이즈급 데이터 관리 기능(압축 등)이 강력함
 - Amazon EFS: 리눅스 전용 NFS 프로토콜에 특화된 단순하고 확장성 높은 파일 저장소

## 예시 및 구조 (Example/Structure)
기존 온프레미스 데이터센터 폐쇄 및 클라우드 이전 시나리오: `온프레미스 NetApp 스토리지 확인` -> `AWS에 FSx for NetApp ONTAP 생성` -> `SnapMirror로 데이터 전송` -> `기존 서버의 마운트 포인트를 FSx 엔드포인트로 변경`