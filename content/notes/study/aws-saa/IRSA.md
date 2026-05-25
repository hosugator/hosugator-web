---
created: 2025-12-29
tags: [EKS, Security, IAM]
---
# IRSA (IAM Roles for Service Accounts)

## 요약 (Summary)
EKS 클러스터의 개별 Pod에 특정 IAM Role을 직접 할당하여, 컨테이너 단위로 AWS 리소스 접근 권한을 세밀하게 제어하는 보안 방식

## 배경 (Background)
- 탄생 배경: 과거에는 EKS 노드(EC2)에 IAM Role을 부여했으나, 이는 해당 노드에서 실행되는 모든 Pod이 동일한 권한을 공유하게 되어 보안상 취약했음
- 핵심 과제: 동일한 노드 위에서도 애플리케이션(Pod)별로 서로 다른 권한을 가져야 하는 '최소 권한의 원칙'을 실현해야 했음

## 솔루션 (Solution)
- 핵심 설계: Kubernetes의 Service Account와 AWS IAM Role을 OIDC(OpenID Connect) 자격 증명 공급자를 통해 논리적으로 연결함
- 작동 메커니즘: Pod 생성 시 특정 Service Account를 지정 -> OIDC를 통해 IAM Role의 임시 자격 증명을 획득 -> 해당 Pod만 허용된 AWS 리소스에 접근함

## 변별점 (Distinction)
- 비유: 아파트 전체(EC2)에 하나의 마스터키를 두는 대신, 각 호실(Pod)마다 전용 디지털 도어락 비밀번호를 따로 설정하여 옆집 사람이 내 방에 들어오지 못하게 하는 것과 같음
- 대안과의 차이: 
	 - [EC2 Instance Profile]: 노드 단위로 권한을 주어 관리는 편하나 Pod 간 권한 분리가 불가능한 반면, IRSA는 관리 요소는 늘어나지만 완벽한 보안 격리를 제공함

---
See Also:
- [[OIDC Identity Provider]]
- [[Kubernetes Service Account]]