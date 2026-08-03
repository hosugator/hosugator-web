---
created: 2025-11-12 00:00
updated: 2026-02-28 02:35
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AWS SAA]]"
tags:
  - aws
  - cloudfront
  - elasticache
  - caching
publish: true
---
# CloudFront vs ElastiCache 차이점

## essence
CloudFront는 최종 사용자에게 가까운 **네트워크 엣지 캐싱(CDN)**을 통해 웹 콘텐츠 전송을 가속화하는 반면, ElastiCache는 애플리케이션에 가까운 **인메모리 데이터 캐싱**을 통해 데이터베이스 부하를 경감하고 응답 속도를 높이는 데 사용된다.

## why
- **캐싱 전략 최적화**: 애플리케이션의 성능 병목 지점과 데이터 접근 패턴에 따라 가장 적절한 캐싱 솔루션을 선택하여 전체 시스템의 효율성을 극대화하기 위함이다.
- **비용 효율성**: 네트워크 전송 비용과 데이터베이스 컴퓨팅 비용을 동시에 절감하며, 사용자 경험과 인프라 운영 비용의 균형을 맞추기 위함이다.

## how
### 1. 캐싱 위치 및 대상 구분
- **CloudFront**: 전 세계 엣지 로케이션에 정적/동적 웹 콘텐츠를 캐싱.
- **ElastiCache**: 리전 내 AZ별로 인메모리 데이터(DB 조회 결과, 세션)를 캐싱.

### 2. 프로토콜 계층 및 용도 차이
- **CloudFront**: L7 (CDN), HTTP/HTTPS 프로토콜. 웹사이트 가속, 소프트웨어 다운로드.
- **ElastiCache**: L7 (인메모리 키-값 저장소), Redis/Memcached 프로토콜. DB 부하 경감, 실시간 랭킹.

## value
- AWS 클라우드 환경에서 웹 성능 최적화와 데이터베이스 확장성 확보를 위한 캐싱 전략을 명확히 이해하고, 서비스 요구사항에 맞는 솔루션을 효과적으로 설계할 수 있게 한다.

## connect
- [[Infra]]
- [[AWS SAA]]
- [[CloudFront]]
- [[ElastiCache]]
- [[Caching]]

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
