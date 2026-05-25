---
created: 2025-12-17 Wed
tags:
  - aws_saa
  - iam
  - organizations
  - scp
  - permissions_boundary
  - governance
reference:
  - "[[AWS Organizations 및 SCP (권한 중앙 관리)]]"
  - "[[IAM Policy]]"
---
# AWS Hierarchical Privilege Model (SCP, Boundary, IAM)

## 정의 (Definition)
조직 전체의 보안 가드레일(SCP)부터 개별 사용자의 세부 권한(IAM Policy)까지, 권한의 범위를 단계적으로 제한하고 필터링하는 계층적 접근 제어 구조

## 핵심 맥락 (Context & Why)
- Problem: 수많은 계정과 사용자가 존재하는 대규모 환경에서 개별 IAM 정책만으로 보안 통제를 유지하기 어렵고, 권한 관리자가 자신에게 과도한 권한을 부여하는 '권한 상승' 위험이 존재한다.
- Solution: 상위 계층에서 최대 허용 범위(Guardrail)를 먼저 설정하고, 하위 계층에서 실제 수행 권한을 부여하는 방식을 통해 중앙 집중식 통제와 개별 자율성을 동시에 확보한다.

## 작동 원리 (Mechanism)
권한은 상위에서 하위로 흐르며, 각 단계의 교집합(Intersection)이 최종 유효 권한이 된다.

1.  SCP (조직 계층): Organizations 루트/OU에 적용되며, 해당 계정이 가질 수 있는 절대적 권한의 상한선을 결정한다. (가장 강력한 Deny)
2.  Permissions Boundary (계정/엔티티 계층): 개별 사용자/역할이 가질 수 있는 최대 권한 범위를 제한하여 권한 남용을 방지한다.
3.  IAM Policy (사용자 계층): 실제 업무에 필요한 세부 액션을 허용한다.
- 최종 권한: `SCP Allow` ∩ `Boundary Allow` ∩ `IAM Policy Allow` (단, 어디든 명시적 Deny가 있다면 무조건 거부됨)

## 유비 및 비교 (Analogy & Comparison)
- It's like: 건물 보안 시스템
	- SCP: 건물 전체의 출입 가능 시간 설정 (밤에는 아무도 못 들어감)
	- Permissions Boundary: 부서별 출입 가능 층수 제한 (개발팀은 5층 이상 못 감)
	- IAM Policy: 개별 사원증에 부여된 특정 방의 열쇠 (501호실 입실 허용)
- vs 계층별 비교:

| 계층 | 적용 대상 | 주요 목적 | 관리 지점 |
| :--- | :--- | :--- | :--- |
| [[SCP]] | OU, Account | 조직 전체 보안 가드레일 설정 | Organizations (Root) |
| [[Boundary]] | User, Role | 위임된 관리자의 권한 남용 방지 | IAM (Account) |
| [[IAM Policy]] | User, Group, Role | 실질적인 업무 수행 권한 부여 | IAM (Account) |

## 예시 및 구조 (Example/Structure)
### 개발자 권한 통제 시나리오
- SCP: "이 조직의 모든 계정은 `billing` 관련 액션을 수행할 수 없음" (Root 적용)
- Boundary: "이 개발자 역할은 오직 `S3`와 `EC2` 서비스만 건드릴 수 있음" (Role 적용)
- IAM Policy: "이 사용자에게 `AdministratorAccess`(모든 권한)를 부여함" (User 적용)
- 결과: 해당 개발자는 IAM에서 모든 권한을 받았음에도 불구하고, 상위 계층의 제한 때문에 S3와 EC2의 관리 기능만 사용 가능하며 결제 정보는 볼 수 없다.

---
See Also:
- [[Principle of Least Privilege]]
- [[AWS Organizations Structure]]
- [[Effective Permissions Calculation]]