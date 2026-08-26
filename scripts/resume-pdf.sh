#!/usr/bin/env bash
# scripts/resume-pdf.sh — 이력서 페이지를 헤드리스 Chrome 으로 PDF 로 찍는다.
#
#   npm run resume:pdf              공개용  /resume/         → public/resume.pdf
#   npm run resume:pdf -- lynens    회사용  /resume/lynens/  → resumes/resume-lynens.pdf
#
# WHY package.json 한 줄이 아니라 스크립트 파일인가
#   npm 은 `--` 뒤의 인자를 스크립트 문자열 「끝」에 이어 붙인다. 기존처럼 URL 이
#   마지막에 오는 한 줄이면 `-- lynens` 가 URL 뒤에 붙어 Chrome 이 두 번째 페이지를
#   열려고 한다. 인자를 원하는 자리에 꽂으려면 "$@" 를 쓸 수 있는 셸이 필요하다.
#
# WHY 출력 디렉터리가 슬러그 유무로 갈리나  ← 이 스크립트에서 가장 중요한 줄
#   public/ 은 빌드가 out/ 으로 복사해 S3 에 올린다. 회사 맞춤본을 여기 두면
#   hosugator.com/resume-lynens.pdf 로 아무나 열 수 있고, 다른 회사가 「이 사람이
#   어디에 어떤 문장으로 냈는지」를 보게 된다. resumes/ 는 빌드가 건드리지 않아
#   git 으로 버전만 남고 배포되지 않는다. 그래서 기본값은 항상 안전한 쪽이 아니라
#   「공개용은 public, 회사용은 resumes」로 갈라 둔다.

set -euo pipefail

SLUG="${1:-}"
PORT="${PORT:-3000}"
# 설치 경로가 다른 환경을 위해 덮어쓸 수 있게 둔다: CHROME=/path/to/chrome npm run resume:pdf
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

if [ -n "$SLUG" ]; then
  # trailingSlash: true 라 끝 슬래시가 없으면 308 로 튕긴다 — 헤드리스에서는 빈 PDF 가 된다
  URL="http://localhost:${PORT}/resume/${SLUG}/"
  OUT="resumes/resume-${SLUG}.pdf"
  mkdir -p resumes
else
  URL="http://localhost:${PORT}/resume/"
  OUT="public/resume.pdf"
fi

if [ ! -x "$CHROME" ]; then
  echo "✗ Chrome 을 찾지 못했습니다: $CHROME" >&2
  echo "  CHROME=/경로/to/chrome npm run resume:pdf -- ${SLUG}" >&2
  exit 1
fi

# WHY 먼저 확인하나 — dev 서버가 없거나 슬러그가 틀리면 Chrome 은 오류 페이지를
# 「성공적으로」 PDF 로 찍는다. 종료 코드가 0 이라 실패를 눈치채지 못하고 빈 이력서를
# 제출하게 된다. 실제로 이 스크립트를 만들며 그렇게 한 번 뽑혔다.
#
# WHY 두 원인을 갈라 보나 — 「서버가 없다」와 「그런 슬러그가 없다」는 고칠 곳이 다르다.
# curl 은 접속 자체가 안 되면 7(connect failed)을 내고, 붙었는데 4xx 면 22(-f 기준)를 낸다.
HTTP_CODE=$(curl -s -o /dev/null -w '%{http_code}' "$URL") || CURL_RC=$?
if [ "${CURL_RC:-0}" -ne 0 ] || [ "$HTTP_CODE" = "000" ]; then
  echo "✗ dev 서버에 접속할 수 없습니다 (${URL})." >&2
  echo "  다른 터미널에서 npm run dev 를 먼저 띄우세요." >&2
  exit 1
fi
if [ "$HTTP_CODE" != "200" ]; then
  echo "✗ ${URL} → HTTP ${HTTP_CODE}. 그런 이력서 페이지가 없습니다." >&2
  echo "  app/resume/${SLUG}/page.tsx 가 있는지, 슬러그 철자가 맞는지 확인하세요." >&2
  exit 1
fi

echo "→ ${URL}  →  ${OUT}"

"$CHROME" \
  --headless=new \
  `# 구 헤드리스는 렌더링 경로가 달라 print CSS 가 화면과 다르게 나온다` \
  --no-sandbox \
  --disable-gpu \
  --no-pdf-header-footer \
  `# 이게 없으면 브라우저가 URL·날짜를 머리말/꼬리말에 박아 넣는다` \
  --run-all-compositor-stages-before-draw \
  --virtual-time-budget=6000 \
  `# 위 둘이 없으면 웹폰트·레이아웃이 안정되기 전에 찍혀 글자가 밀린다` \
  --print-to-pdf="$OUT" \
  "$URL"

echo "✓ ${OUT}"
