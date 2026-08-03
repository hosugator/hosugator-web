---
created: 2026-07-24
updated: 2026-07-24
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - nas
  - minio
  - object-storage
  - architecture
publish: true
---
## Context
AOI 원본 이미지 저장소를 정하며 NAS와 MinIO(S3)를 비교하다가, 기존에 정리해둔 [[Storage System Strategy]], [[Object Storage System]]이 이미 구조·성능 축의 비교는 다뤄놨다는 걸 확인했다. 오늘 새로 나온 건 "왜 이렇게 다르게 설계됐는가"라는 설계 의도 축이었다.

## Insight
### NAS와 S3의 차이는 구조보다 "누구를 위해 설계됐는가"에서 갈린다
NAS(NFS/SMB)는 사람이 파일 하나씩 열어보는 용도로 발전한 프로토콜이고, S3는 자동화된 시스템끼리 대량의 데이터를 자동으로 주고받는 용도(다수의 생산자 → 자동 트리거 → 대량 처리)에 맞게 발전했다. [[Object Storage System]]에서 이미 정리한 "평면 구조·원자적 쓰기·API 기반 접근"이라는 특징들이 전부 이 자동화 지향성에서 파생된다 — 사람이 폴더를 눈으로 훑는 게 아니라 프로그램이 인덱스로 찾고, 여러 프로그램이 락 없이 동시에 쓰고, HTTP 요청 하나하나가 독립적이라 연결 상태에 의존하지 않는 식.

### 이벤트 알림·presigned URL은 "ML 전용 기능"이 아니라 자동화 파이프라인 설계의 자연스러운 결과다
S3가 ML을 겨냥해 만들어진 건 아니다 — 원래 AWS의 범용 웹 스케일 저장소다. 다만 자동화 파이프라인에 필요한 기능(새 객체 생겼을 때 알림, 임시 자격증명으로 업로드 권한 위임)을 설계에 포함했고, 마침 ML 워크로드가 "다수의 생산자가 자동으로 데이터를 쌓고 자동으로 처리하는" 패턴을 자주 띠기 때문에 잘 맞아떨어질 뿐이다. NAS(NFS/SMB)는 이런 자동화 시나리오를 프로토콜 표준에 넣지 않았다 — 신규 파일 감지도 폴링이나 신뢰성 낮은 inotify로 대체해야 한다.

## Related
- [[Object Storage System]] — 객체 스토리지의 구조적 특징(평면 구조, 원자적 쓰기, API 접근) 정의. 이 노트는 그 특징들이 "왜" 그렇게 설계됐는지의 이유를 추가
- [[Storage System Strategy]] — File/Block/Object 비교표. "저장 방식의 익숙함(NAS와 유사해 마이그레이션 용이)" 언급이 이미 있었는데, [[Existing team familiarity can outweigh a technically superior tool's advantages in real adoption decisions]]가 그 지점을 확장
- [[NFS and SMB]] — NAS 프로토콜(NFS/SMB) 자체의 세부 비교
- [[MinIO standalone means one server's local disks, not a control plane reaching across separate machines]] — 같은 AOI 스토리지 결정 과정의 앞 단계 노트
