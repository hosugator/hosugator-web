---
created: 2026-04-21
updated: 2026-04-21
subject: "[[Software]]"
project: "[[Edge AI LMR]]"
type: insight
status: 1-draft
tags:
  - python
  - argparse
  - cli
publish: true
---
# Python argparse의 원리와 기본값 처리

\`argparse\` 라이브러리는 터미널의 문자열 인수를 파이썬 객체로 변환해주는 강력한 도구이다.

## 주요 역할
1. **파싱(Parsing)**: \`sys.argv\` 리스트의 문자열 파편들을 분석하여 \`args.cycles\`와 같은 속성으로 접근 가능한 객체로 변환한다.
2. **타입 변환**: 입력된 문자열을 \`int\`, \`float\` 등 지정된 타입으로 자동 변환하며, 오류 시 에러 메시지를 제공한다.
3. **기본값(Default) 처리**: 사용자가 옵션을 생략했을 때 \`default\` 파라미터에 정의된 값을 자동으로 할당한다.

## 작동 방식
- 사용자가 명령어를 입력하지 않아도 \`argparse\`는 정의된 기본값을 사용하여 프로그램을 실행한다.
- \`--help\` 또는 \`-h\` 옵션을 통해 개발자가 정의한 도움말 문서를 자동으로 생성하여 보여준다.
