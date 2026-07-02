---
created: 2025-11-20 00:00
updated: 2026-02-28 05:35
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[MOC - AWS SAA]]"
tags:
  - aws
  - scaling
  - vertical_scaling
  - horizontal_scaling
publish: true
---
# Scaling Comparison (수직 vs. 수평 크기 조정 비교)

## essence
애플리케이션의 수요 및 로드 증가에 대응하여 시스템 용량을 확장하는 두 가지 근본적인 접근 방식(수직적 확장: 단일 서버 성능 향상, 수평적 확장: 서버 개수 증가)의 장단점을 분석하는 비교 연구이다.

## why
- **아키텍처 설계 의사결정**: 워크로드의 특성, 비용 제약, 가용성 요구사항에 따라 가장 효율적인 확장 전략을 선택하여 클라우드 인프라를 최적화하기 위함이다.
- **탄력성(Elasticity) 구현**: 클라우드의 가장 큰 장점인 수요 기반 자동 리소스 조절 기능을 효과적으로 활용하여 시스템의 운영 효율성을 극대화하기 위함이다.

<h2>how</h2>
<h3>1. 확장 방식 구분</h3>
- **수직적 크기 조정 (Vertical Scaling)**: 단일 인스턴스의 CPU, RAM 등 사양을 높여 용량을 확장. (Scale-up)
- **수평적 크기 조정 (Horizontal Scaling)**: 서버의 개수를 늘려 컴퓨팅 자원을 확장. (Scale-out)

<h3>2. 장단점 및 적합 워크로드 파악</h3>
- **Vertical**: 구현 단순, 초기 비용 효율적, SPOF 존재, 확장 한계 명확. (중소규모 DB)
- **Horizontal**: 무한한 확장성, 높은 가용성/내결함성, 탄력적 대응, 아키텍처 복잡. (웹/앱 티어, 마이크로서비스)

<h2>value</h2>
- 클라우드 환경에서 애플리케이션의 성장 단계와 트래픽 특성에 맞춰 가장 적절한 확장 전략을 수립하여 비용 효율적인 고성능, 고가용성 아키텍처를 설계한다.

<h2>connect</h2>
- [[MOC - Infra]]
- [[MOC - AWS SAA]]
- [[Horizontal Scaling]]
- [[Vertical Scaling]]
- [[Elasticity and Loose-Connected Architecture]]

## Child
```dataview
TABLE
	updated,
	created,
	status
FROM ""
WHERE project = this.file.link
OR subject = this.file.link
SORT status ASC, updated DESC, created DESC
```
