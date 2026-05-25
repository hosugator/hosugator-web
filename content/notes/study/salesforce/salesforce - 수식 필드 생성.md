---
created: 2025-10-11
tags: [salesforce, formula_field, commission_calculation, cross_object_formula, conditional_logic]
reference:
  - "[[salesforce - hub]]"
---
> **Last revised:** `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`

# 수식 필드 생성 (Create Formula Fields)

## 핵심 용어 정의

| 용어 | 정의 | 역할 및 컨텍스트 |
| :--- | :--- | :--- |
| **Formula Field** (수식 필드) | 다른 필드의 값을 참조하여 동적으로 계산된 값을 표시하는 읽기 전용 사용자 정의 필드입니다. | 숫자, 텍스트, 통화, 날짜, 체크박스 등 다양한 유형의 값을 출력할 수 있습니다. |
| **Cross-Object Formula** (교차 객체 수식) | 현재 객체와 관련(Relationship)이 있는 다른 객체의 필드 값을 참조하는 수식입니다. | Opportunity에서 Account의 **Region** 및 **Zone** 필드를 참조할 때 사용됩니다. |
| **Conditional Logic** (조건부 로직) | $\text{IF()}$ 함수와 같은 논리 함수를 사용하여 특정 조건이 충족될 때만 다른 값을 출력하도록 제어하는 수식 작성 방식입니다. | **Stage**가 "Closed Won"일 때만 **Commission**을 계산하는 데 사용됩니다. |
| **ISPICKVAL()** | 선택 목록 필드 (Picklist)의 값을 확인하는 수식 함수입니다. | **StageName** 필드의 값이 **"Closed Won"**과 같은지 확인할 때 사용됩니다. |

## 1. Commission (수수료) 계산 필드 생성

### Commission 기본 수식 설정
**Opportunity** 객체에 금액의 10%를 계산하는 **Commission** 통화 필드를 생성합니다.

1.  Object Manager $\rightarrow$ **Opportunity** $\rightarrow$ **Fields & Relationships** $\rightarrow$ **New**를 클릭하고 Data Type으로 **Formula**를 선택합니다.
2.  Field Label 및 Field Name을 **Commission**으로 입력하고, Formula Return Type으로 **Currency**를 선택합니다.
3.  수식 입력: $\text{Amount * 0.1}$
4.  Field-Level Security 설정 시, **Sales User**와 **System Administrator**만 **Visible** (표시)되도록 설정하고 저장합니다.

### Commission 조건부 로직 추가 (Closed Won일 때만)
수수료가 Opportunity의 **Stage**가 **"Closed Won"**일 때만 계산되도록 수식을 수정합니다.

1.  Commission 필드를 **Edit**합니다.
2.  Advanced Formula 탭에서 수식을 다음의 조건부 로직을 사용하여 수정합니다.

$$ \text{IF( ISPICKVAL( StageName , "Closed Won") , Amount * 0.1, 0)} $$

* $\text{ISPICKVAL( StageName , "Closed Won")}$: StageName이 "Closed Won"인지 확인합니다.
* $\text{Amount * 0.1}$: 참일 경우 (Closed Won) 10%를 계산합니다.
* $\text{0}$: 거짓일 경우 (Closed Won이 아님) 0을 반환합니다.

3.  **Check Syntax** 후 저장합니다.

## 2. Region/Zone 교차 객체 수식 필드 생성

### Region/Zone 텍스트 필드 생성
Opportunity와 관련된 **Account** 레코드의 **Region** 및 **Zone** 정보를 표시하는 텍스트 필드를 생성합니다.

1.  Opportunity 객체의 Fields & Relationships에서 **New** $\rightarrow$ **Formula** $\rightarrow$ Return Type **Text**를 선택합니다.
2.  Field Label: **Region/Zone**, Field Name: **Region_Zone**을 입력합니다.
3.  Advanced Formula 탭에서 Account 객체의 필드를 참조하는 **교차 객체 수식**을 작성합니다.

$$ \text{TEXT( Account.Region\_\_c ) \& "/" \& TEXT( Account.Zone\_\_c )} $$

* **TEXT()**: 픽리스트 값 (Region 및 Zone)을 텍스트로 변환합니다.
* **&Concatenate ($\&$)**: 두 텍스트 문자열을 연결하는 연산자입니다.

4.  **Check Syntax** 후 저장합니다.

## 3. Amount After Discount 계산 필드 생성

### Discount Percentage (백분율) 필드 생성
할인 계산에 필요한 **Discount Percentage** 백분율 필드를 생성합니다.

1.  Opportunity 객체의 Fields & Relationships에서 **New** $\rightarrow$ **Percent**를 선택합니다.
2.  Field Label: **Discount Percentage**, Length: **3**을 입력합니다.
3.  Field-Level Security 설정 시, **Sales User**와 **System Administrator**만 **Visible**되도록 설정하고 저장합니다.

### Amount After Discount (할인 후 금액) 수식 필드 생성
할인이 적용된 후의 순수 금액을 계산하는 **Amount After Discount** 통화 필드를 생성합니다.

1.  Opportunity 객체의 Fields & Relationships에서 **New** $\rightarrow$ **Formula** $\rightarrow$ Return Type **Currency**를 선택합니다.
2.  Field Label: **Amount After Discount**, Field Name: **Amount_After_Discount**를 입력합니다.
3.  Simple Formula 탭에서 다음 수식을 작성합니다.

$$ \text{Amount * ( 1 - Discount\_Percentage\_\_c )} $$

* 수식은 $\text{금액} \times (1 - \text{할인율})$의 형태로 할인된 금액을 계산합니다.

4.  **Check Syntax** 후 저장합니다.