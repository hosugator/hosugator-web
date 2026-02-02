---
created: 2025-12-05
tags:
  - aws_saa
  - storage
  - file_storage
  - efs
  - fsx
  - hierarchical
  - nfs
  - smb
reference:
  - "[[Storage Classification]]"
  - "[[High-Performing and Scalable Storage Solutions]]"
  - "[[Cost-Optimized Storage Solutions]]"
---
# File Storage System (파일 스토리지 시스템)
## 정의
데이터를 폴더 계층 구조로 파일 단위로 저장하고 액세스하는 방식
## 특징
### 계층적 구조 (Hierarchical Structure)
데이터를 파일 경로(Path)를 기반으로 탐색하고 관리한다. 이 경로는 파일 이름, 파일 크기, 생성 날짜 등의 메타데이터와 함께 관리된다.
### 파일 잠금 (File Locking) 지원
여러 호스트 컴퓨터(인스턴스)가 동시에 파일에 접근하거나 수정할 때 데이터의 일관성을 유지하기 위해 파일 잠금 기능을 지원한다.
### 공유 액세스 (Shared Access)
여러 서버 또는 인스턴스에서 동시에 파일을 공유하고 관리하는 데 최적화되어 있으며, NFS(Network File System)나 SMB(Server Message Block)와 같은 기존의 파일 시스템 프로토콜을 사용한다.
## AWS 서비스 예시
- [[2. project/AWS_SAA/EFS]] (Elastic File System): 리눅스 기반 워크로드를 위한 확장 가능한 서버리스 NFS 파일 시스템.
- [[FSx]] (for Windows File Server / Lustre / NetApp ONTAP 등): 다양한 상용 및 고성능 파일 시스템을 위한 관리형 서비스.
## 사용 사례
- 홈 디렉터리: 수많은 사용자의 개인 파일을 중앙 집중식으로 저장하고 관리할 때.
- 웹 서비스/협업: 여러 웹 서버나 애플리케이션 인스턴스가 동일한 콘텐츠(이미지, 설정 파일 등)를 공유해야 할 때.
- 미디어 및 엔터테인먼트: 콘텐츠 제작, 편집, 스트리밍 등 파일 시스템 프로토콜이 필수적인 워크플로.
- 분석 워크로드: 파일의 일부에 쓰기(In-place writing) 기능 또는 파일 잠금이 필요한 분석 작업.