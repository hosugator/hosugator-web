---
created: 2026-07-23
updated: 2026-07-23
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - minio
  - s3
  - cost
  - storage
  - cloud-economics
publish: true
---
## Context
AOI 설비 10대(하루 150GB, 연 54TB 누적) 저장 확장성을 논의하던 중, S3와 MinIO(자체 호스팅)의 비용을 구체적 숫자로 비교했다.

> 원문: [[MinIO standalone means one server's local disks, not a control plane reaching across separate machines]]에서 이어짐.

## Insight
### S3는 저장량과 시간에 비례해 계속 커지는 청구서(OpEx)고, 자체 호스팅은 한 번 사면 끝나는 하드웨어(CapEx)다

```
S3    = 매달 청구 — 데이터가 쌓일수록, 시간이 지날수록 청구액이 계속 커짐 (삭제 안 하면 매년 배로)
MinIO = 하드웨어 일회성 구매 — 산 뒤로는 전기세 정도만 추가
```

이 구조 차이 때문에 "지금 얼마가 싼가"가 아니라 "데이터가 계속 누적되는 상황에서 시간이 지날수록 누가 유리한가"로 질문을 바꿔야 한다.

### 54TB 시나리오에서 S3의 1년치 저장 비용이 자체 서버 하드웨어 전체 구매가를 넘는다

|                            | 비용                                                                                                                                                                                | 비고                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| S3 Standard (~$0.023/GB-월) | 54TB 기준 월 약 $1,240, 연 약 $15,000                                                                                                                                                   | 2년차엔 108TB로 늘어 계속 커짐 |
| 자체 HDD (MinIO)             | 54TB 실사용(소거부호 오버헤드 감안 70~80TB 원본 필요 — [[Erasure coding overhead trades usable capacity for failure tolerance, and shrinks as the parity set grows]]) + 서버 1대 = 일회성 약 $2,000~3,500 | 하드웨어 수명 3~5년 이상      |

S3의 1년치 저장 비용만으로 자체 서버 하드웨어 전체(수명 3~5년)를 살 수 있는 수준이다.

### S3의 숨은 비용(egress·요청)은 "자주 꺼내 쓰는" 워크로드일수록 격차를 더 벌린다

- Egress(반출): 재학습을 위해 10TB를 로컬로 내려받으면 그 자체로 약 $900+. 자체 호스팅은 사내망 내부 이동이라 사실상 무료.
- 요청 비용: PUT/GET 등 1,000건당 과금 — 이미지 파일 수만~수십만 개를 다루면 무시 못할 수준으로 누적.
- 자체 서버는 전기세(200W 24시간 기준 연 $200~300 안팎) 외 추가 비용이 거의 없다.

즉 저장만 하고 거의 안 꺼내는 워크로드라면 S3와의 격차가 저장 비용만큼이지만, AOI처럼 재학습을 위해 주기적으로 대량 데이터를 꺼내 써야 하는 워크로드는 egress·요청 비용까지 겹쳐 격차가 더 벌어진다.

### S3(또는 콜드 티어)가 오히려 유리해지는 조건도 있다

- 운영 인력/의지가 없을 때: 디스크 장애 대응·서버 유지보수를 완전관리형에 위임하는 대가로 비싼 요금을 낸다고 보면 됨
- 정말 드물게 접근하는 순수 아카이브: S3 Glacier Deep Archive(~$0.001/GB-월)까지 내려가면 54TB 기준 연 약 $600으로 HDD와 비슷한 수준까지 근접 — 다만 꺼내는 데 12시간+ 소요와 별도 비용이 붙어, "거의 안 꺼낸다"는 전제가 깨지면 이 이점도 사라짐
- 성장 규모를 예측할 수 없을 때: 초기 하드웨어 투자 리스크를 지지 않아도 됨

## Decision
### 20260723
DTK AOI 공장은 인터넷 차단이 전제라, 이 비교에서 진짜 AWS S3는 애초에 선택지가 아니다.
이 비교는 "인터넷이 되는 환경이라면"의 일반 경제성 분석이고, DTK 맥락에서는 이 분석과 무관하게 자체 호스팅(MinIO)이 유일한 실질적 옵션이라는 걸 재확인하는 차원이다.
다만 이 경제성 원칙 자체는 인터넷이 되는 다른 환경(예: 개인 인프라)에서 S3 vs 자체 호스팅을 판단할 때도 그대로 적용된다.

## Related
- [[MinIO standalone means one server's local disks, not a control plane reaching across separate machines]] — 아키텍처 개념(이 노트는 그 위에서의 비용 비교)
- [[Erasure coding overhead trades usable capacity for failure tolerance, and shrinks as the parity set grows]] — "70~80TB 원본 필요"의 근거
- [[Raw data value is insurance against future information needs unknowable at storage time]] — 같은 AOI 저장 전략 논의의 앞 단계(무엇을 저장할지)