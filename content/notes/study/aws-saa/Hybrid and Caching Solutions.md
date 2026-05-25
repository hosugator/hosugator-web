---
created: 2025-11-24
tags: [aws_saa, hybrid_storage, caching, storage_gateway, cloudfront, transfer_acceleration, low_latency, edge_computing]
reference:
  - "[[High-Performing and Scalable Storage Solutions]]"
  - "[[S3 Performance and Optimization]]"
---
# Hybrid and Caching Solutions (하이브리드 및 캐싱 솔루션)
## 정의
온프레미스 환경과 AWS 클라우드 스토리지를 통합하거나, 데이터 전송 및 검색 성능을 향상시키기 위해 엣지 로케이션을 활용하는 Caching 전략을 구현하는 서비스
## 원리
### Protocol Conversion (프로토콜 변환 - Storage Gateway)
온프레미스에서 사용되는 표준 파일/블록/테이프 프로토콜(NFS, SMB, iSCSI)을 AWS의 객체 스토리지(S3) 또는 블록 스토리지(EBS)가 이해할 수 있는 형태로 자동 변환하여 데이터를 클라우드에 투명하게 저장한다.
### Edge Caching (엣지 캐싱 - CloudFront)
데이터를 사용자와 가장 가까운 엣지 로케이션에 캐시하여, 원본 서버까지의 요청 경로(Round-Trip Time)를 단축함으로써 데이터 검색(Download) 지연 시간을 최소화하고 성능을 극대화한다.
### Optimized Ingestion (최적화된 데이터 수집)
S3 Transfer Acceleration은 공용 인터넷을 통한 장거리 전송 시 발생하는 병목 현상을 AWS의 고속 백본 네트워크로 우회하여 데이터 수집(Upload) 성능을 높인다.
### Hybrid Storage Solution (하이브리드 스토리지 솔루션)
Storage Gateway는 기존 온프레미스 인프라를 유지하면서 클라우드의 무한한 확장성을 활용할 수 있게 하여, 백업 및 아카이브 솔루션에 매우 적합하다.
### Performance Enhancement (성능 향상)
CloudFront는 캐싱 외에도 최적화된 TCP 연결 및 Anycast 라우팅을 활용하여 HTTP 요청을 가장 가까운 AWS 엣지로 유도함으로써, 웹 애플리케이션의 성능과 가용성을 향상시킨다.

---
See also:
- AWS [[Storage Gateway]]
- Amazon [[CloudFront]]
- S3 Transfer Acceleration: [[S3 Performance and Optimization]]에서 다룬 바와 같이, CloudFront의 엣지 로케이션을 활용하여 S3 버킷으로의 업로드 성능을 가속화한다.
