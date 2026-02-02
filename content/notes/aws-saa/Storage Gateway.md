---
created: 2025-11-13
tags: [aws_saa, storage_gateway, hybrid, file, volume, tape, cache]
reference:
  - https://docs.aws.amazon.com/storage-gateway/latest/userguide/what-is-storage-gateway.html
---
# AWS Storage Gateway

## 정의
온프레미스 환경에 설치되는 가상 어플라이언스로, 로컬 스토리지와 [[S3]]·[[EBS]]·[[Glacier]]를 하나의 저장 공간처럼 연결해 주는 하이브리드 클라우드 스토리지 서비스

## 비유
사무실 책상 위 로컬 서랍과 원격 창고(S3) 사이에  
자동 상자 정리 로봇을 두면,  
사용자은 서랍만 열면 되고, 로봇이 자주 쓰는 물건은 서랍에, 나머지는 창고로 실어 나르는 시스템

## 제공 모드
- [[File Gateway]] : NFS/SMB 공유 폴더 → 뒤에 S3 버킷 연결, 자주 쓴 파일은 로컬 캐시
- [[Volume Gateway]] : iSCSI 블록 볼륨 제공, 스냅샷은 S3에 increment 백업
  - Stored Mode : 전체 데이터 로컬 유지
  - Cached Mode : 자주 쓴 블록만 로컬, 전체는 S3
- [[Tape Gateway]] : 가상 VTL(Virtual Tape Library), 백업 소프트웨어가 물리 테이프 대신 사용, 테이프는 S3/Glacier로 이관

## 주요 기능
- 로컬 캐시 디스크 : 자주 접근 데이터를 온프레미스 SSD/HDD에 보관, 나머지는 클라우드
- 암호화 : 전송 중 TLS, 휴지 S3-SSE, KMS 지원
- 백본 대역폭 절약 : 데이터 압축·중복 제거 후 전송

## 특징
- 가상 어플라이언스 형태(VMware, Hyper-V, KVM, EC2 AMI) 제공
- 요금 : 게이트웨이 시간당 0.10USD + S3/EBS/Glacier 실 사용량 + 캐시 디스크 비용
- 로컬 사이트 재해 시 S3 스냅샷으로 EC2 볼륨 복원 가능