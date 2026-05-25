---
created: 2026-05-24
updated: 2026-05-24
type: insight
status: 2-stable
subject: "[[MOC - AI]]"
project: "[[2026 자기계발]]"
tags: [linkedin, agentic-ai, reversibility, post]
---

## Post text

```
Agentic AI 시대, 가장 자주 듣는 질문:
"어디까지 AI에게 맡겨도 될까?"

더 명확한 기준으로 답변 가능한 질문은 — "무엇을 절대 위임하면 안 되는가?"

───

AI 에이전트를 실제 공정에 배포하면서 얻은 기준 하나.

결정의 가역성(Reversibility).

구현 세부사항, 문서화, 테스트 코드 — 위임해도 된다.
틀렸을 때 되돌릴 수 있으니까.

문제 정의, 아키텍처, 데이터 모델 — 반드시 사람이 있어야 한다.
틀리면 수개월 후에 대가를 치르니까.

비가역적 결정을 AI에 위임하는 순간,
빠르게 잘못된 방향으로 달리는 것이다.
나중의 수정 비용이 속도 이득을 초과한다.

───

그리고 이해의 기준도 바뀐다.

"내가 짠 코드를 줄 단위로 설명할 수 있는가"
→ 더 이상 유효한 기준이 아니다.

"이 시스템의 전제와 한계를 설명할 수 있는가"
→ 이것이 에이전트 시대의 책임 범위다.

전동공구가 생겼다고 목수가 나무의 결과(grain)와
하중 계산을 몰라도 되는 건 아닌 것처럼.

───

AI가 대신하는 것: 대패질 (구현 동작)
여전히 사람 몫: 어느 방향으로 깎을지 (설계 판단)

AI 에이전트를 쓰는 팀이라면 한 번은 짚어봐야 할 질문.
우리 팀의 비가역적 결정은 누가 내리고 있나?

#AIAgent #AgenticAI #SoftwareEngineering #AI개발 #개발문화
```

## Image

생성 도구: Python + Pillow (`pip install pillow`)
출력 경로: `~/zettelkasten/linkedin_post_visual.png`
재생성: 아래 스크립트 실행

```python
# /// script
# requires-python = ">=3.10"
# dependencies = ["pillow"]
# ///
# 실행: uv run --script "LinkedIn post - Reversibility as AI agent delegation criterion.md" 불가
# → python3로 직접 실행하거나 아래 코드를 별도 .py로 저장 후 실행

from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 900
img = Image.new("RGB", (W, H), "#0f0f0f")
draw = ImageDraw.Draw(img)

FONT = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
def f(size, bold=False):
    try: return ImageFont.truetype(FONT, size, index=7 if bold else 0)
    except: return ImageFont.load_default()

C_GREEN="#22c55e"; C_RED="#ef4444"; C_WHITE="#f8f8f8"
C_GRAY="#888888"; C_BORDER="#2a2a2a"; C_CARD_L="#0d1f0d"; C_CARD_R="#1f0d0d"

draw.text((W//2, 55), "결정의 가역성 (Reversibility)", font=f(36,True), fill=C_WHITE, anchor="mm")
draw.text((W//2, 100), "AI 에이전트 시대, 무엇을 위임하고 무엇을 지켜야 하는가", font=f(17), fill=C_GRAY, anchor="mm")
draw.line([(80,125),(W-80,125)], fill=C_BORDER, width=1)

col_w=(W-200)//2; lx=80; rx=lx+col_w+40

# LEFT — Reversible
draw.rounded_rectangle([lx,145,lx+col_w,700], radius=12, fill=C_CARD_L, outline=C_GREEN, width=2)
draw.rounded_rectangle([lx+2,145,lx+col_w-2,230], radius=12, fill="#0a2a0a")
draw.text((lx+col_w//2,178), "O  위임 가능", font=f(24,True), fill=C_GREEN, anchor="mm")
draw.text((lx+col_w//2,212), "Reversible Decisions", font=f(15), fill=C_GREEN, anchor="mm")
draw.line([(lx+30,233),(lx+col_w-30,233)], fill="#1a3a1a", width=1)
for i,(ko,en) in enumerate([
    ("구현 세부사항","Implementation details"),
    ("문서화 & 포매팅","Documentation & formatting"),
    ("테스트 코드 작성","Test code generation"),
    ("반복적 리팩토링","Iterative refactoring"),
]):
    y=260+i*72
    draw.text((lx+45,y), f"• {ko}", font=f(20), fill=C_WHITE)
    draw.text((lx+45,y+26), f"  {en}", font=f(15), fill=C_GRAY)
draw.line([(lx+30,553),(lx+col_w-30,553)], fill="#1a3a1a", width=1)
draw.text((lx+col_w//2,585), "틀려도 되돌릴 수 있다", font=f(17), fill=C_GREEN, anchor="mm")

# RIGHT — Irreversible
draw.rounded_rectangle([rx,145,rx+col_w,700], radius=12, fill=C_CARD_R, outline=C_RED, width=2)
draw.rounded_rectangle([rx+2,145,rx+col_w-2,230], radius=12, fill="#2a0a0a")
draw.text((rx+col_w//2,178), "X  반드시 사람이", font=f(24,True), fill=C_RED, anchor="mm")
draw.text((rx+col_w//2,212), "Irreversible Decisions", font=f(15), fill=C_RED, anchor="mm")
draw.line([(rx+30,233),(rx+col_w-30,233)], fill="#3a1a1a", width=1)
for i,(ko,en) in enumerate([
    ("문제 정의","Problem framing"),
    ("아키텍처 결정","Architecture decisions"),
    ("외부 인터페이스 설계","External interface design"),
    ("데이터 모델","Data modeling"),
]):
    y=260+i*72
    draw.text((rx+45,y), f"• {ko}", font=f(20), fill=C_WHITE)
    draw.text((rx+45,y+26), f"  {en}", font=f(15), fill=C_GRAY)
draw.line([(rx+30,553),(rx+col_w-30,553)], fill="#3a1a1a", width=1)
draw.text((rx+col_w//2,585), "틀리면 수개월 후 대가를 치른다", font=f(17), fill=C_RED, anchor="mm")

# Bottom insight
draw.rounded_rectangle([80,720,W-80,835], radius=10, fill="#141414", outline=C_BORDER, width=1)
draw.text((W//2,758), "비가역적 결정을 AI에 위임하면  →  빠르게 잘못된 방향으로 달리는 것", font=f(17), fill=C_WHITE, anchor="mm")
draw.text((W//2,800), "나중의 수정 비용이 속도 이득을 초과한다", font=f(17), fill=C_GRAY, anchor="mm")
draw.text((W//2,865), "Seungwan Hong  ·  AI Developer  ·  linkedin.com/in/seungwanhong", font=f(14), fill="#444444", anchor="mm")

import os
out = os.path.expanduser("~/zettelkasten/linkedin_post_visual.png")
img.save(out)
print("Saved:", out)
```

## Source notes

이 포스팅은 아래 세 노트를 합성해 작성했다.

- [[Agentic AI가 일으키는 out of the loop]] — 가역성 프레임워크 (핵심 소스)
- [[AI 에이전트 시대 실무자의 이해 수준 — 무엇을 알아야 하는가]] — 이해 기준의 변화, 전동공구 비유
- [[AI 개발 효율성 증가가 사업의 성장을 이끌어내는가]] — 속도 이득 vs 수정 비용 맥락
