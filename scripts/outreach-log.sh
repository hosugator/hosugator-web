#!/usr/bin/env bash
# scripts/outreach-log.sh — S3 액세스 로그에서 이력서 링크(/r/{slug}) 열람을 읽는다.
#
#   npm run outreach:log                 열람 후보 목록 (기본)
#   npm run outreach:log -- --all        자가 접속 포함 전체
#   npm run outreach:log -- --session 20/Aug/2026:10:23:46
#                                        그 시각 전후 세션 재구성
#   npm run outreach:log -- --sync-only  로그만 내려받고 끝
#
# WHY 이 스크립트가 필요한가
#   GoatCounter 는 JS 로 신호를 보내므로 트래커 차단·기업 네트워크에 막힌다.
#   그래서 「이력서 링크가 열렸나」는 서버 로그로만 판정할 수 있다. 그 판정에
#   매번 같은 awk 를 손으로 치게 되는데, 필드 위치를 한 번 틀리면 조용히 0건이
#   나온다(에러가 아니라 빈 결과라 알아채기 어렵다). 그래서 파일로 고정한다.
#
# WHY 로그를 로컬로 내려받나 — S3 는 서버측 grep 을 제공하지 않는다. 객체를
#   가져와야 내용을 볼 수 있다. 다만 `aws s3 sync` 는 증분이라 두 번째부터는
#   새 파일만 받는다. (Athena 를 붙이면 서버측 질의가 되지만 테이블·파티션 관리가
#   붙는다 — 로그 전체가 수 MB 인 지금 규모에서는 과하다.)

set -euo pipefail

# 덮어쓸 수 있게 둔다: LOG_BUCKET=... npm run outreach:log
LOG_BUCKET="${LOG_BUCKET:-hosugator-access-logs-832199679639-ap-southeast-2-an}"
LOG_PREFIX="${LOG_PREFIX:-site/}"
# .next/ 아래에 둔다 — .gitignore 가 이미 무시하므로 로그가 커밋에 섞이지 않는다
CACHE_DIR="${CACHE_DIR:-.next/cache/s3logs}"

MODE="candidates"
SESSION_AT=""

while [ $# -gt 0 ]; do
  case "$1" in
    --all)       MODE="all" ;;
    --sync-only) MODE="sync" ;;
    --session)   MODE="session"; SESSION_AT="${2:-}"; shift ;;
    *) echo "✗ 모르는 옵션: $1" >&2; exit 1 ;;
  esac
  shift
done

command -v aws >/dev/null || { echo "✗ aws CLI 가 없습니다" >&2; exit 1; }
aws sts get-caller-identity >/dev/null 2>&1 || {
  echo "✗ AWS 세션이 만료됐습니다 — 'aws login' 후 다시 실행하세요" >&2; exit 1; }

# ── 1. 로그 동기화 ────────────────────────────────────────────────────────
mkdir -p "$CACHE_DIR"
echo "1. 로그 동기화 중 (s3://${LOG_BUCKET}/${LOG_PREFIX})…"
aws s3 sync "s3://${LOG_BUCKET}/${LOG_PREFIX}" "$CACHE_DIR/" --only-show-errors
echo "   파일 $(find "$CACHE_DIR" -type f | wc -l)개 / 라인 $(cat "$CACHE_DIR"/* 2>/dev/null | wc -l)줄"
[ "$MODE" = "sync" ] && exit 0


# ══ S3 액세스 로그 필드 지도 ═══════════════════════════════════════════════
#
#   $1 bucket_owner   $2 bucket   $3 [시각   $4 +0000]   $5 remote_ip
#   $6 requester      $7 req_id   $8 operation           $9 key
#   $10 $11 $12 = "GET /경로 HTTP/1.1"   ← 따옴표 안이 공백 3토막이라 3칸을 먹는다
#   $13 http_status
#
# ⚠ 여기가 이 스크립트에서 제일 잘 틀리는 곳이다. request_uri 가 따옴표로 묶여
#   있어도 awk 의 기본 분리는 따옴표를 모르므로 3필드로 센다. 그래서 상태 코드가
#   $10 이 아니라 $13 이다. 틀리면 조건이 항상 거짓이 되어 조용히 0건이 나온다.
#
# 요청자($6)로 갈리는 두 종류 ─ 이 구분이 계측의 핵심이다
#   svc:cloudfront.amazonaws.com                 → 방문자 (CloudFront 경유)
#   arn:aws:sts::...:assumed-role/github-...     → 배포 (CI 가 S3 에 직접 PUT)
# ═══════════════════════════════════════════════════════════════════════════

utc_to_kst() {  # "20/Aug/2026:10:23:46" → "08-20(목) 19:23"
  local t="$1" d hms
  d=$(echo "$t" | awk -F: '{print $1}' | tr '/' ' ')
  hms=$(echo "$t" | cut -d: -f2-4)
  TZ=Asia/Seoul date -d "$d $hms UTC" '+%m-%d(%a) %H:%M' 2>/dev/null || echo "$t"
}


# ── 2. 배포 시각 — 자가 접속 판별의 기준선 ────────────────────────────────
#
# WHY 배포 시각이 기준선인가
#   배포 직후에는 내가 반드시 확인하러 들어간다. 그 접속은 로그에서 방문자와
#   똑같이 생겼다(둘 다 CloudFront 경유). 구분할 유일한 단서가 「배포와 붙어
#   있는가」다. IP·UA 가 없으니 이것 말고 기댈 것이 없다.
#
# ── 채울 곳 1 ─────────────────────────────────────────────────────────────
# CI 가 S3 에 직접 PUT 한 기록만 뽑아 시각을 epoch 로 만든다.
# 힌트: requester 필드에 "github-actions-role" 이 들어있고, operation 은 PUT 이다.
DEPLOY_EPOCHS=$(
  grep -h "REST.PUT.OBJECT" "$CACHE_DIR"/* 2>/dev/null \
  | grep "github-actions-role" \
  | awk '{ gsub(/^\[/,"",$__); print $__ }' \
  | sort -u \
  | while read -r t; do
      d=$(echo "$t" | awk -F: '{print $1}' | tr '/' ' ')
      hms=$(echo "$t" | cut -d: -f2-4)
      date -d "$d $hms UTC" +%s 2>/dev/null
    done | sort -un
)

# ── 채울 곳 2 ─────────────────────────────────────────────────────────────
# 배포 시각으로부터 몇 초 안쪽을 「자가 확인」으로 볼 것인가.
#
# 판단 재료: 실측한 배포 인접 접속은 배포 후 2분 이내에 몰렸다. 반면 실제 열람
# 후보는 가장 가까운 배포와도 30분 이상 떨어져 있었다. 넓게 잡으면 진짜 열람을
# 자가 접속으로 지워버리고(치명적), 좁게 잡으면 내 접속이 후보에 섞인다(덜 치명적).
# → 어느 쪽 오류가 더 아픈지 정하고 값을 넣는다.
SELF_WINDOW=___   # 초 단위


is_self_visit() {  # epoch 를 받아 배포와 인접하면 0(참)
  local ts="$1" dep
  for dep in $DEPLOY_EPOCHS; do
    local diff=$(( ts - dep ))
    [ $diff -lt 0 ] && diff=$(( -diff ))
    [ $diff -le "$SELF_WINDOW" ] && return 0
  done
  return 1
}


# ── 3. 세션 재구성 모드 ───────────────────────────────────────────────────
#
# WHY 도착 이후가 보이나 — 엣지 캐시가 cold 면 요청이 오리진까지 와서 로그에
#   남는다. 트래픽이 적어 객체가 TTL 을 채우기 전에 밀려나기 때문이다.
#   ⚠ 보장이 아니다. warm 이면 도착 신호만 남고 이후가 통째로 사라진다.
#
# WHY 프리페치를 걸러야 하나 — Next.js <Link> 는 화면에 들어온 링크를 클릭 전에
#   미리 받는다. 그 요청도 로그에 남으므로 「요청 = 열람」이 아니다. 초기 로드
#   버스트(≈5초)에 몰린 .txt 요청은 프리페치로 보고 판정하지 않는다.
if [ "$MODE" = "session" ]; then
  [ -n "$SESSION_AT" ] || { echo "✗ --session 에 시각이 필요합니다" >&2; exit 1; }
  d=$(echo "$SESSION_AT" | awk -F: '{print $1}' | tr '/' ' ')
  hms=$(echo "$SESSION_AT" | cut -d: -f2-4)
  base=$(date -d "$d $hms UTC" +%s)

  echo; echo "세션 재구성 — 기준 $(utc_to_kst "$SESSION_AT") KST"
  echo "  T+초  상태  경로"

  # ── 채울 곳 3 ───────────────────────────────────────────────────────────
  # CloudFront 경유 요청만 남기고, 기준 시각부터 SESSION_SPAN 초 안의 것을 뽑는다.
  # 힌트: 위 필드 지도에서 requester=$6, key=$9, status=$13.
  SESSION_SPAN="${SESSION_SPAN:-300}"
  grep -h "svc:cloudfront.amazonaws.com" "$CACHE_DIR"/* 2>/dev/null \
  | awk '{ gsub(/^\[/,"",$3); print $3, $__, $__ }' \
  | while read -r t status key; do
      dd=$(echo "$t" | awk -F: '{print $1}' | tr '/' ' ')
      hh=$(echo "$t" | cut -d: -f2-4)
      ts=$(date -d "$dd $hh UTC" +%s 2>/dev/null) || continue
      off=$(( ts - base ))
      if [ $off -lt 0 ] || [ $off -gt "$SESSION_SPAN" ]; then continue; fi

      # 프리페치 표시 — 초기 버스트 안의 RSC 페이로드(.txt)
      mark=""
      if [ $off -le 5 ] && [[ "$key" == *.txt ]]; then mark="  (프리페치 추정)"; fi
      # 206 = 비디오 구간 요청 → 실제 재생. 프리페치로는 안 나온다
      if [ "$status" = "206" ]; then mark="  ← 미디어 재생"; fi

      # WHY 여기서 바로 출력하지 않고 탭으로 흘려보내나 — 로그 파일이 2,900개라
      #   grep 이 파일 순서대로 뱉는다. 시간순이 아니다. 궤적은 순서가 곧 의미이므로
      #   오프셋을 첫 필드로 내보내고 아래에서 수치 정렬한다.
      printf "%s\t%s\t%s%s\n" "$off" "$status" "$key" "$mark"
    done | sort -n | awk -F'\t' '{ printf "  T+%-5s %s  %s\n", $1, $2, $3 }'
  exit 0
fi


# ── 4. /r/* 열람 목록 ─────────────────────────────────────────────────────
echo; echo "2. /r/* 열람 기록"
echo

# ── 채울 곳 4 ─────────────────────────────────────────────────────────────
# CloudFront 경유(=방문자)의 GET 200 중 키가 r/ 로 시작하는 것만 남긴다.
# 배포 PUT 과 403(미배포 slug·디렉터리 요청)은 제외한다.
grep -h "REST.GET.OBJECT r/" "$CACHE_DIR"/* 2>/dev/null \
| awk '$__ == "svc:cloudfront.amazonaws.com" && $__ == 200 { gsub(/^\[/,"",$3); print $3, $9 }' \
| sort -t/ -k1 \
| while read -r t key; do
    dd=$(echo "$t" | awk -F: '{print $1}' | tr '/' ' ')
    hh=$(echo "$t" | cut -d: -f2-4)
    ts=$(date -d "$dd $hh UTC" +%s 2>/dev/null) || continue
    slug=$(echo "$key" | cut -d/ -f2)

    if is_self_visit "$ts"; then
      [ "$MODE" = "all" ] && printf "     %s  %-12s 자가확인(배포 인접)\n" "$(utc_to_kst "$t")" "$slug"
    else
      printf "  ★  %s  %-12s %s\n" "$(utc_to_kst "$t")" "$slug" "$t"
    fi
  done

echo
echo "  ★ = 열람 후보. 세션을 보려면 맨 오른쪽 UTC 시각을 넘긴다:"
echo "     npm run outreach:log -- --session <UTC시각>"
echo
echo "  ⚠ IP·UA 가 없으므로 ★ 가 상대방인지 본인인지는 확정할 수 없다."
echo "    지원처 전용 slug 는 신뢰도가 높고, base 는 재사용 링크라 낮다."
