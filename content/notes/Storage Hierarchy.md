---
created: 2026-01-20 11:34
tags:
  - Storage
  - Infrastructure
  - Network
  - das
  - nas
  - cloud_storage
  - 
updated: 2026-02-14 23:25
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AWS SAA]]"
publish: true
---
# Storage Hierarchy: Connection & Speed

## 본질 (Essence)
스토리지는 연산 장치와의 물리적 거리, 연결 통로(Bus/Network)의 규격, 통신 프로토콜의 복잡성에 따라 성능과 용도가 결정됨.

## 계층별 특성 (Structure)
- DAS (Direct Attached Storage)
	   - 연결: PCIe, SATA 등 내부 버스로 본체 직결.
	   - 특징: '짧고 굵은' 병렬 전용 통로. 이 선은 신호 간섭이 심해서 길이를 2미터만 늘려도 데이터 손실. 데이터 처리 단계가 거의 없어 속도가 가장 빠름(수천 MB/s). 
- NAS (Network Attached Storage)
	   - 연결: LAN(Local Area Network) 유선/무선 연결.
	   - 특징: 로컬 내 '공용 도로'. 쪼개고 조립하는 네트워크 프로토콜(SMB/NFS) 단계와 랜선의 물리적 대역폭 한계로 DAS보다 느림(백여 MB/s).
- Cloud Storage
	   - 연결: WAN(Wide Area Network) 인터넷 망 연결.
	   - 특징: '시내 공용 도로'. 물리적 거리와 외부 인터넷 대역폭, 높은 지연 시간(Latency)으로 인해 가장 느림.

## 속도 차이의 보틀넥 (Mechanism)
- 물리적 한계: 데이터 전송 통로(Lane)의 개수와 신호 클럭 속도 등 하드웨어 규격이 성능의 '고점'을 결정함.
- 논리적 오버헤드: 데이터의 쪼개기, 주소 지정, 재조립 및 검증 과정이 길어질수록 지연 시간이 증가하여 체감 속도가 저하됨.

## 확장 (Connection)
- 연결: 집 안의 엘리베이터(DAS) vs 마을 내 자전거 도로(NAS) vs 타 도시로 연결된 국도(Cloud)의 차이.
- 응용: 600TB와 같은 대용량 데이터 이전 시, 좁은 인터넷 망(Cloud) 대신 물리적 트럭(Snowball)을 사용하는 이유는 WAN의 물리적 대역폭 한계를 극복하기 위함임.

---
See Also: 
- [[Identity Federation]]