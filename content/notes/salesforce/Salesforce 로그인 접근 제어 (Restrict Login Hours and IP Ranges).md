---
created: 2025-10-10
revised: 2025-10-10 15:35
tags:
  - salesforce
  - security
  - profiles
  - login_hours
  - ip_ranges
  - custom_support_profile
reference:
  - "[[salesforce - hub]]"
---
# Salesforce 로그인 접근 제어 (Restrict Login Hours and IP Ranges)
## 개요 및 목표
**프로필** 설정을 사용하여 특정 사용자들이 **언제** (Login Hours) 그리고 **어디서** (Login IP Ranges) 조직에 로그인할 수 있는지 제한하여 **무단 접근 가능성**을 줄이는 것이 목표입니다.
* **Support Users 요구사항**: 회사 표준 근무 시간에만, 회사 네트워크에서만 로그인 허용.
* **Other Users 요구사항**: 24/7 접근 허용, 회사 네트워크 및 VPN 로그인 허용.
## Custom: Support Profile 로그인 제한 설정
**Support Profile** 사용자들에게 **표준 업무 시간** (월~금, 8:00 AM to 6:00 PM)에만 로그인을 허용하고, 나머지 시간은 차단합니다.
* **참고**: 먼저 **Setup** $\rightarrow$ **Company Information**에서 조직의 **Default Time Zone**을 **Pacific [Standard or Daylight] Time (America/Los_Angeles)**으로 설정해야 합니다.
### Login Hours 설정 (시간대: Pacific Time)
1.  **Setup** $\rightarrow$ Quick Find에서 `Profiles`를 검색하여 **Custom: Support Profile**을 선택합니다.
2.  **Login Hours** 아래의 **Edit**을 클릭하여 아래와 같이 설정합니다.

|요일|시작 시간|종료 시간|
|---|---|---|
|**Sunday**|12:00 AM|12:00 AM (종일 차단)|
|**Monday**|8:00 AM|6:00 PM|
|**Tuesday**|8:00 AM|6:00 PM|
|**Wednesday**|8:00 AM|6:00 PM|
|**Thursday**|8:00 AM|6:00 PM|
|**Friday**|8:00 AM|6:00 PM|
|**Saturday**|12:00 AM|12:00 AM (종일 차단)|
### Login IP Ranges 설정
**Login IP Ranges**가 설정되면, 해당 범위 내의 IP 주소에서만 로그인할 수 있도록 **접근이 제한**됩니다. (모든 다른 IP는 차단). 챌린지 목적상 모든 IP 범위가 허용되도록 설정합니다.
1.  **Login IP Ranges** 아래의 **New**를 클릭합니다.
2.  **Start IP Address**와 **End IP Address**를 아래와 같이 설정합니다.

|필드|값|
|---|---|
|**Start IP Address**|`0.0.0.0`|
|**End IP Address**|`255.255.255.255`|
|**Description**|`San Diego`|