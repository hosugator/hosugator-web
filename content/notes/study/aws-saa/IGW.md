---
created: 2025-11-25
tags:
  - aws_saa
  - vpc
  - igw
  - internet
  - routing
  - public_subnet
  - aws
reference:
  - "[[High-Performing and Scalable Network Solutions]]"
  - "[[VPC Architecture for Performance and Security]]"
---
# Internet Gateway (IGW)
## 정의
[[VPC]]와 퍼블릭 인터넷 간에 양방향 통신을 가능하게 하는 논리적 연결 지점(게이트웨이 객체)

## 원리
### Enabling Public Connectivity (퍼블릭 연결 활성화)
VPC 내의 서브넷이 퍼블릭 서브넷으로 작동하려면 다음 세 가지 조건이 충족되어야 한다.
1. 서브넷이 연결된 Route Table에 대상이 IGW인 라우팅이 있어야 한다.
2. 리소스가 퍼블릭 IP 주소 또는 탄력적 IP 주소(EIP)를 가지고 있어야 한다.
3. 해당 리소스에 대한 Network ACL 및 Security Group이 트래픽을 허용해야 한다.
### No Single Point of Failure (단일 장애 지점 없음)
IGW는 AWS에 의해 관리되는 고가용성 및 중복성을 갖춘 서비스이므로, 단일 장애 지점 없이 확장성이 뛰어나다.
### Stateless Operation (무상태 작동)
IGW 자체는 트래픽에 대한 상태를 저장하거나 필터링하지 않는다. 단순한 라우팅 경로 역할만 수행한다.
### Cost (비용)
IGW를 사용하는 것에 대한 별도의 시간당 요금은 없지만, IGW를 통한 데이터 전송에 대해서는 AWS 표준 데이터 전송 요금이 부과된다.

---
See also:
- [[VPC]]
- [[ACL]]
