---
created: 2025-11-17
tags: [aws_saa, aws, efs, storage, nfs, file_system]
reference:
---
# Elastic File System (EFS)

## 정의 (Definition)
AWS 컴퓨팅 서비스 및 온프레미스 리소스를 위해 설계된, 용량 및 성능 관리가 필요 없이 자동으로 확장 및 축소되는 완전 관리형 NFS 파일 시스템

## 핵심 맥락 (Context & Why)
 문제: [[EC2]] 인스턴스 간 데이터 공유, 파일 잠금, 수동 용량 프로비저닝 및 관리에 따른 오버헤드가 발생.
 해결: 서버리스 구조와 NFS 프로토콜을 통해 수천 개의 컴퓨팅 인스턴스가 동시에 접근할 수 있는 고가용성 공유 스토리지 환경을 제공한다.

## 유비 및 비교 (Analogy & Comparison)
 Like: 컴퓨터에 연결된 네트워크 드라이브(NAS)와 유사하나, 용량이 무한대에 가깝게 자동으로 늘어나고 AWS가 고가용성 및 내구성(Multi-AZ)을 보장한다.
 vs [[FSx]]: FSx가 특정 고성능 파일 시스템(Windows, Lustre 등)을 제공하는 반면, EFS는 Linux 기반의 범용 NFS 파일 공유에 초점을 맞춘다.

## 예시 및 구조 (Example/Structure)
### 서버리스 환경의 영구 데이터 공유
1. 다수의 [[EC2]] 인스턴스, [[Lambda]] 함수가 EFS의 마운트 대상에 연결한다.
2. EFS Standard는 데이터를 여러 [[AZ]]에 분산 저장하여 고가용성을 유지한다.
3. 모든 컴퓨팅 리소스가 동일한 NFSv4 프로토콜을 통해 파일 데이터를 읽고 쓰며 일관성을 유지한다.