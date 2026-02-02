---
created: 2025-12-05
tags: [aws_saa, file_storage, fsx, windows_file_server, lustre, ontop, openzfs]
reference:
  - "[[Storage Classification]]"
  - "[[EFS vs FSx Comparison]]"
---
# FSx (File System)
## 정의 (Definition)
클라우드 환경에서 널리 사용되는 특정 파일 시스템들을 기반으로 고성능과 기능을 제공하는 완전 관리형 파일 스토리지 서비스
## 핵심 맥락 (Context & Why)
 문제: 기존 온프레미스에서 사용하던 상용(Windows, NetApp ONTAP) 또는 고성능(Lustre, OpenZFS) 파일 시스템을 클라우드에서 운영하는 데 필요한 관리 오버헤드가 높다.
 해결: AWS가 특정 파일 시스템의 기능과 성능을 완전 관리형 서비스로 제공하여, 고객이 애플리케이션이나 워크플로를 변경하지 않고 클라우드로 쉽게 마이그레이션할 수 있게 한다.
## 유비 및 비교 (Analogy & Comparison)
 Like: 전문적인 기능을 갖춘 엔터프라이즈급 NAS(Network Attached Storage) 장비를 클라우드에서 임대하여 사용하는 것과 유사하다.
 vs [[EFS]]: EFS가 단일 NFS 기반의 범용 파일 시스템을 제공하는 반면, FSx는 Lustre(HPC), Windows File Server(SMB), ONTAP, OpenZFS 등 워크로드에 맞게 선택 가능한 전문화된 파일 시스템을 제공한다.
## 예시 및 구조 (Example/Structure)
### 고성능 컴퓨팅(HPC) 작업 가속화
1. 대규모 데이터 처리 작업(예: 기상 모델링)을 수행하는 [[EC2]] 플릿이 FSx for Lustre를 마운트한다.
2. Lustre 파일 시스템은 초당 테라바이트급의 처리량으로 컴퓨팅 인스턴스에 데이터를 제공한다.
3. 이를 통해 I/O 병목 현상 없이 분석 및 계산 속도를 극대화한다.