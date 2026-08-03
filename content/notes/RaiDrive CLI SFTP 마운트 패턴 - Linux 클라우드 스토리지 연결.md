---
created: 2026-05-07
updated: 2026-05-07
type: insight
status: 2-stable
subject: "[[Infra]]"
project: "[[AOI]]"
tags:
  - linux
  - sftp
  - raidrive
  - fuse
  - network-storage
  - ubuntu
publish: true
---

# RaiDrive CLI SFTP 마운트 패턴 - Linux 클라우드 스토리지 연결

## 개요

RaiDrive CLI는 SFTP, WebDAV, 클라우드 스토리지(Google Drive, pCloud 등)를 FUSE 기반으로 로컬 디렉토리에 마운트하는 Linux 도구다. GUI 없이 터미널 명령어로 조작한다.

## 설치 조건

| 항목 | 내용 |
|---|---|
| **패키지 형식** | `.deb` (Debian/Ubuntu) |
| **의존성** | `fuse3` |
| **아키텍처** | x86_64 → AMD64, Raspberry Pi / Apple M → ARM64 |

```bash
sudo apt install fuse3
sudo dpkg -i raidrive_*.deb
```

## SFTP 마운트 명령어

```bash
# 기본 문법
raidrivecli add sftp sftp://[user]@[host]:[port]/[remote-path] --mount-path [local-path]

# 비밀번호 인증
raidrivecli add sftp sftp://user@192.168.1.100/data --mount-path ~/remote

# SSH 키 인증 (권장)
raidrivecli add sftp sftp://user@192.168.1.100/data \
  --private-key-file ~/.ssh/id_ed25519 \
  --mount-path ~/remote
```

실행 후 비밀번호 프롬프트가 나오면 **대상 서버의 계정 비밀번호** 입력. 화면에 아무것도 표시되지 않는 게 정상.

## 드라이브 관리 명령어

```bash
raidrivecli list              # 등록된 드라이브 목록 및 상태
raidrivecli mount [label]     # 수동 마운트
raidrivecli unmount [label]   # 언마운트
raidrivecli remove [id]       # 드라이브 설정 삭제
```

## 마운트 후 접근

마운트 경로는 일반 디렉토리처럼 접근 가능하다.

```bash
ls ~/remote          # 터미널
# yazi → ~/remote 로 이동
# GNOME Files → Ctrl+L → /home/user/remote 입력
```

## 사내 사설 IP 서버 마운트 패턴

192.168.x.x 대역은 로컬 네트워크 사설 IP다. 외부 인터넷이 아닌 **같은 사내망(LAN) 서버**에 접속하는 패턴.

```
[내 PC] ──LAN──> [서버 192.168.x.x:22] ──> /Vdata (원격 경로)
                                              ↓
                                         ~/Z (로컬 마운트)
```

- 포트 22: SFTP 기본 포트 (생략 가능)
- 계정: **로컬 Ubuntu 계정이 아닌** 대상 서버의 계정

## Linux 패키지 형식 비교

| 형식 | 샌드박스 | 설치 | 업데이트 | 특징 |
|---|---|---|---|---|
| `.deb` | 없음 | `dpkg` / `apt` | apt 관리 | 시스템 완전 통합, root 필요 |
| **AppImage** | **없음** | 실행 권한만 | 수동 | 파일 하나, FUSE 자유롭게 사용 가능 |
| Snap | strict | `snap` | 자동 | 파일시스템 접근 제한 → SFTP/FUSE 도구 부적합 |
| Flatpak | 있음 | `flatpak` | 자동 | 범용 샌드박스 |

> SFTP 마운트, pCloud 등 파일시스템 접근이 필요한 도구는 **AppImage 또는 .deb**가 적합. Snap의 strict confinement는 FUSE 마운트를 차단할 수 있음.

## 아키텍처 선택 기준

| CPU | 아키텍처 |
|---|---|
| Intel / AMD (일반 PC, 서버) | **AMD64 (x86_64)** |
| Raspberry Pi, AWS Graviton, Apple M1/M2 | ARM64 (aarch64) |

`uname -m` 으로 현재 머신 확인: `x86_64` → AMD64 선택.

## 관련 노트

- [[snap 패키지 샌드박스 제약과 대안 선택 기준]]
- [[Linux 개발환경 dotfiles 부트스트랩 구조 패턴]]
- [[Ubuntu X11 Caps Lock 한글 리매핑 패턴 (fcitx5)]]
- [[SFTP FUSE mount serves stale data when SSH connection silently drops]] — silent disconnect 시 stale 데이터 서빙 문제 및 remount 해결책
