---
created: 2025-11-14
tags: [aws_saa, lambda, serverless, event_driven, compute, runtime]
reference:
  - https://docs.aws.amazon.com/lambda/latest/dg/what-is-lambda.html
---
# AWS Lambda (Serverless Compute)
## 정의
서버를 프로비저닝하거나 관리할 필요 없이, 이벤트에 응답하여 코드를 실행할 수 있게 하는 이벤트 중심(Event-driven)의 서버리스 컴퓨팅 서비스

## 요소
### Function (함수)
Lambda에서 실행되는 코드와 구성 설정의 기본 단위이다. 지원되는 언어(Node.js, Python, Java 등) 중 하나로 작성된다.

### Event Source (이벤트 소스)
함수를 트리거하는 AWS 서비스 또는 외부 서비스이다. (예: S3에 파일 업로드, DynamoDB 테이블 업데이트, API Gateway를 통한 HTTP 요청)

### Runtime (런타임)
함수 코드를 실행하기 위해 사용되는 언어 환경이다. AWS는 런타임 환경에 대한 보안 패치 및 관리를 책임진다.

### Concurrency (동시성)
특정 시점에 함수가 동시에 처리할 수 있는 요청 수를 의미하며, Lambda의 확장성(Scaling)을 이해하는 핵심 지표이다.

## 원리
### FaaS (Function as a Service)
컴퓨팅 자원을 함수(Function) 단위로 추상화하여 제공하는 모델이다. 코드를 패키징하여 업로드하면, AWS가 코드를 실행하는 데 필요한 모든 인프라를 관리한다.

### 자동 크기 조정 및 탄력성
요청이 들어올 때마다 자동으로 함수 인스턴스를 확장(Scale-out)하고, 요청이 없으면 인스턴스를 종료하여 용량을 0으로 축소(Scale-in to Zero)한다. 사용자는 용량 계획이 불필요하다.

### Cold Start (콜드 스타트)
함수가 오랜 시간 사용되지 않아 인스턴스가 종료된 상태에서 새로운 요청이 들어왔을 때, AWS가 환경을 초기화(코드 로딩 및 런타임 설정)하는 데 걸리는 추가적인 지연 시간이다.

## 특징
### Serverless Defined (서버리스의 정의)
- No Infrastructure Management: 프로비저닝하거나 관리할 인프라(서버, OS)가 없다.
- Automatic Scaling: 수요에 따라 자동으로 크기가 조정된다.
- Pay-per-use: 사용한 컴퓨팅 시간(ms)과 요청 수에 대해서만 비용을 지불한다. (유휴 비용 없음)
- Built-in HA/Fault Tolerance: 가용성 및 내결함성이 AWS에 의해 내장되어 있다.

### Cost Optimization (비용 최적화)
실행된 시간(밀리초 단위)에 대해서만 비용을 청구하므로, 간헐적으로 실행되거나 트래픽 변동이 큰 워크로드에 가장 비용 효율적이다.

### Execution Time Limit (실행 시간 제한)
단일 함수 호출의 최대 실행 시간은 15분으로 제한된다. 장기 실행 프로세스에는 적합하지 않다.

## 비교
| 구분 | AWS Lambda (Function) | AWS Fargate (Container) |
| :--- | :--- | :--- |
| 추상화 단위 | 코드/함수 레벨 (가장 높은 추상화) | 컨테이너 레벨 (OS 추상화) |
| 최대 실행 시간 | 15분으로 제한된다. | 거의 무제한 (서비스/태스크 지속 시간 동안) |
| 적합 워크로드 | 데이터 변환, 백엔드 API, 파일 이벤트 처리 등 짧은 작업 | 웹 서버, 마이크로서비스, 장기 실행 백엔드 작업 |
| 이식성/자유도 | 낮음 (AWS 런타임에 종속) | 높음 (Docker 이미지를 사용한 높은 이식성) |

## 예시
### 이미지 썸네일 생성 워크플로우
1. 사용자가 Amazon S3 버킷에 고해상도 이미지를 업로드한다. (Event Source)
2. S3 버킷에 발생한 `ObjectCreated` 이벤트가 Lambda 함수를 자동으로 트리거한다.
3. Lambda 함수는 실행되어 원본 이미지를 다운로드하고 썸네일 크기로 변환(Image Transformation)한다.
4. 변환된 썸네일 이미지를 S3의 다른 버킷에 저장하고, Lambda는 종료되어 ms 단위로 비용이 청구된다.