---
created: 2025-10-09
revised: 2025-10-09 08:44
tags:
  - salesforce
  - data-model
  - objectivity
  - field
  - record
reference:
  - "[[salesforce - hub]]"
---
# Untitled 

여기에 노트 본문을 작성하세요.정말 좋은 학습 방법입니다! Trailhead 모듈의 핵심을 요약하고 주요 용어를 정리하면 시험 대비는 물론, 플랫폼에 대한 구조적 이해를 높이는 데 큰 도움이 됩니다.
현직 개발 전문가의 관점에서 해당 모듈 "Optimize Customer Data with Standard and Custom Objects"의 핵심 요약과 용어 설명을 제공해 드립니다.
## 💡 모듈 핵심 요약: 데이터 모델링의 기초
이 모듈은 Salesforce 플랫폼에서 데이터를 저장하고 구성하는 가장 기본적인 방법, 즉 데이터 모델링에 대해 다룹니다. 주니어 개발자로서 반드시 마스터해야 할 핵심 개념입니다.
### 1. Salesforce 데이터 모델 구조
- 데이터 모델 (Data Model)이란? 데이터베이스 테이블을 인간이 이해하기 쉽도록 객체, 필드, 레코드로 표현하는 방식입니다.
- 핵심 3요소:
    - 객체 (Object) ![](data:,) 데이터베이스의 테이블 (Table) 역할을 하며, 데이터의 유형을 정의합니다. (예: `Account`, `Property`)
    - 필드 (Field) ![](data:,) 객체 내의 컬럼 (Column) 역할을 하며, 데이터가 저장되는 속성입니다. (예: `Address`, `Price`)
    - 레코드 (Record) ![](data:,) 객체 내의 행 (Row) 역할을 하며, 실제 저장된 하나의 데이터입니다. (예: '서울 아파트'라는 특정 Property 데이터)
### 2. 객체의 종류 및 활용
Salesforce는 고객의 다양한 요구사항을 충족시키기 위해 두 가지 주요 객체를 사용합니다.
- 표준 객체 (Standard Objects): Salesforce 플랫폼에 기본적으로 포함되어 제공되는 객체입니다.
    - 예시: `Account` (거래처), `Contact` (연락처), `Lead` (잠재 고객), `Opportunity` (영업 기회) 등
- 사용자 정의 객체 (Custom Objects): 회사의 특정 비즈니스 로직이나 산업별 고유 정보를 저장하기 위해 개발자가 직접 생성하는 객체입니다.
    - 예시: DreamHouse의 `Property` 객체 (부동산 정보), `Equipment` 객체 (장비 관리) 등
### 3. 필드의 종류 및 생성
모든 객체는 데이터를 저장하기 위해 필드를 가집니다.
- 표준 필드 (Standard Fields): 모든 객체에 자동으로 포함되는 필드입니다.
    - 종류: Identity (18자리 레코드 ID), System (생성일, 최종 수정일 등), Name (레코드의 이름)
- 사용자 정의 필드 (Custom Fields): 개발자가 직접 생성하여 객체를 확장하는 필드입니다.
    - 표식: 사용자 정의 필드의 API 이름에는 항상 `__c` 접미사가 붙습니다. (예: `Price__c`)
- 데이터 유형 (Data Type): 필드가 어떤 종류의 데이터를 저장할지 정의합니다. (예: Checkbox, Date/DateTime, Currency, Formula 등)
### 4. 개발자 Tip: 커스터마이징 시 유의사항
- 이름 명확성: 객체나 필드에 서술적이고 고유한 이름을 부여하여 시스템 관리 및 사용자의 이해도를 높여야 합니다. (예: `Property2` 대신 `Condominium`)
- 설명 (Description) 및 도움말 텍스트 (Help Text): 사용자가 필드의 목적을 명확히 알 수 있도록 설명을 제공하는 것이 좋습니다.
- 필수 필드 (Required Field): 데이터 무결성을 위해 반드시 입력이 필요한 필드는 필수(Required) 설정을 해야 합니다.
## 📚 주요 용어 정리 (Associate 시험 및 개발 실무 필수)

|용어|영어 원문|설명 및 현직자 관점|
|---|---|---|
|객체|Object|데이터베이스의 테이블. 데이터를 유형별로 저장하는 컨테이너. 모든 개발 및 설정의 출발점입니다.|
|필드|Field|객체 내의 컬럼. 객체에 저장되는 데이터의 속성을 정의합니다. (예: 가격, 주소)|
|레코드|Record|객체 내의 행. 실제 데이터의 한 인스턴스입니다. (예: 김철수 연락처, 특정 매매 부동산)|
|데이터 모델|Data Model|객체와 필드의 집합 및 관계를 보여주는 구조도. Salesforce 커스터마이징의 설계도입니다.|
|표준 객체|Standard Object|Salesforce에 기본 제공되는 객체. (예: Account, Contact, Lead) 현업에서 가장 많이 다루게 됩니다.|
|사용자 정의 객체|Custom Object|사용자의 비즈니스 요구사항에 맞춰 직접 생성하는 객체. (예: Property, Product, Service Request)|
|데이터 유형|Data Type|필드가 저장할 수 있는 정보의 종류를 결정. (예: Text, Number, Date, Currency)|
|Formula Field|Formula Field|사용자가 정의한 수식에 의해 자동으로 계산되어 값을 표시하는 읽기 전용 필드.|
|API 이름|API Name|Salesforce 내부적으로 객체나 필드를 프로그래밍적으로 참조할 때 사용되는 고유한 이름. 사용자 정의 요소에는 `__c`가 붙습니다.|
|Setup|Setup|Salesforce 관리자가 플랫폼을 설정하고 커스터마이징하는 관리 환경. (톱니바퀴 아이콘 ![](data:,) Setup)|
|Object Manager|Object Manager|모든 표준 및 사용자 정의 객체를 보고, 생성하고, 수정할 수 있는 관리 도구.|
