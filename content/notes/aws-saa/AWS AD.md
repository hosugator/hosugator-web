---
created: 2025-12-30
tags: [Security, Identity, ActiveDirectory, DirectoryService]
---
# AWS AD (Directory Service)

## 요약 (Summary)
온프레미스의 기존 인증 체계([[AD]])를 AWS 클라우드로 확장하거나, AWS 내부에 독립적인 관리형 디렉토리를 구축하여 클라우드 자원의 통합 인증을 실현하는 서비스

## 배경 (Background)
- 탄생 배경: 기업들이 클라우드로 이전하면서 기존에 사용하던 윈도우 기반의 사용자 계정 및 권한 관리 체계를 포기하지 않고 그대로 클라우드 환경에서도 사용하고자 하는 니즈가 발생했다.
- 핵심 과제: 온프레미스에 있는 수천 명의 사용자 데이터를 클라우드로 일일이 옮기지 않고도, 어떻게 안전하고 낮은 지연시간으로 인증을 수행할 것인가?

## 솔루션 (Solution)
- 핵심 설계: 연결 방식에 따라 AWS Managed Microsoft AD, AD Connector, Simple AD로 구분하여 설계한다.
- 작동 메커니즘: 
	 - AWS Managed Microsoft AD: AWS 상에 실제 AD를 구축하고 온프레미스와 트러스트 관계를 맺어 동기화한다.
	 - AD Connector: 온프레미스 AD로 인증 요청을 전달하는 디렉토리 게이트웨이(프록시) 역할을 수행한다.
	 - Simple AD: Samba 4 기반의 소규모용 저렴한 디렉토리 서비스를 제공한다.

## 변별점 (Distinction)
- 비유: Managed AD는 해외 지사에 직접 현지 사무소를 차리는 것이고, AD Connector는 본사로 바로 연결되는 전용 전화선을 가설하는 것과 같다.
- 대안과의 차이: 
	 - [AD Connector]: 실제 데이터를 AWS에 저장하지 않으므로 보안성이 높고 운영 오버헤드가 가장 낮으나, 온프레미스 연결이 끊기면 인증이 불가능하다.
	 - [AWS Managed Microsoft AD]: 실제 AD 기능(Group Policy 등)을 클라우드에서 완벽히 구현할 수 있으나, 관리 비용과 설정 복잡도가 상대적으로 높다.

---
See Also:
- [[IAM Identity Center]]
- [[AD Connector]]
- [[Trust Relationship]]