---
created: 2025-12-24
tags:
  - Networking
  - Windows
  - Storage
reference:
  - "[[SMB]]"
  - "[[Amazon FSx for Windows File Server]]"
---
# 네트워크 드라이브 매핑 (Network Drive Mapping)

## 정의 (Definition)
네트워크 경로를 통해 연결된 원격 공유 폴더에 사용하지 않는 드라이브 문자(D~Z)를 할당하여 로컬 디스크처럼 접근할 수 있게 만드는 연결 방식

## 핵심 맥락 (Context & Why)
### Problem
원격 서버의 공유 자원에 접근할 때마다 매번 `\\192.168.1.100\shared_folder`와 같은 긴 네트워크 경로(UNC Path)를 입력하는 것은 매우 번거로우며, 일부 레거시 소프트웨어는 로컬 드라이브 경로가 아니면 파일을 읽지 못하는 경우가 있음 
### Solution
네트워크 경로를 특정 알파벳 기호(예: Z:)에 고정(Mapping)함으로써 사용자가 내 PC에서 바로 접근할 수 있게 하고 소프트웨어 호환성을 확보함

## 작동 원리 (Mechanism) 
### 드라이브 문자 할당
운영체제의 가용 알파벳 중 하나를 선택 -> 원격 SMB 서버의 공유 경로와 연결 설정 -> 윈도우 탐색기에 해당 알파벳의 드라이브 생성
### 투명한 데이터 전송
사용자가 Z: 드라이브의 파일을 클릭 -> 운영체제가 리다이렉터를 통해 SMB 프로토콜로 변환 -> 네트워크를 통해 원격지 파일 데이터 수신 -> 사용자에게 로컬 파일처럼 표시

## 유비 및 비교 (Analogy & Comparison)
### It's like
전화번호부에 있는 긴 번호를 일일이 누르는 대신 '단축 번호' 1번에 저장하여 버튼 하나로 통화하는 것과 같음
### vs (드라이브 문자): 
 - C: 드라이브: 운영체제가 설치된 실제 물리적 로컬 하드 디스크 
 - Z: 드라이브: 실제로는 멀리 떨어진 서버에 존재하지만 논리적으로 연결된 가상의 공유 디스크

## 예시 및 구조 (Example/Structure)
윈도우 탐색기에서 `\\fs-12345.corp.amazon.com\share` 경로를 (Z:) 드라이브로 연결하면, `Z:\game_data\config.json`과 같은 경로로 파일 접근이 가능해짐

---
See Also:
- [[SMB Protocol Details]]
- [[Amazon FSx Mount Guide]]