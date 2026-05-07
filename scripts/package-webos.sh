#!/usr/bin/env bash
# ============================================================
# ON AIR — webOS .ipk 패키징 스크립트
# ------------------------------------------------------------
# 요구사항:
#   1) Node.js 18+ 설치
#   2) webOS TV CLI 설치:
#        npm install -g @webosose/ares-cli
#   3) TV에서 개발자 모드 활성화 (https://webostv.developer.lge.com/develop/app-test/)
#
# 사용법:
#   bash scripts/package-webos.sh                 # .ipk 빌드만
#   bash scripts/package-webos.sh install         # 빌드 후 TV에 설치
#   bash scripts/package-webos.sh install launch  # 빌드+설치+실행
#
# 환경변수:
#   TV_DEVICE   ares-setup-device 에 등록한 디바이스 이름 (기본: tv)
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$ROOT/build"
TV_DEVICE="${TV_DEVICE:-tv}"
APP_ID="$(grep -E '"id"' "$ROOT/appinfo.json" | head -1 | sed -E 's/.*"id"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')"

mkdir -p "$OUT"

echo "▶ webOS .ipk 패키징 — $APP_ID"
ares-package "$ROOT" -o "$OUT" --no-minify

IPK="$(ls -1t "$OUT"/*.ipk | head -1)"
echo "✓ 생성 완료: $IPK"

if [[ "${1:-}" == "install" || "${1:-}" == "launch" ]]; then
  echo "▶ TV 에 설치 ($TV_DEVICE)"
  ares-install --device "$TV_DEVICE" "$IPK"
fi

if [[ "${1:-}" == "launch" || "${2:-}" == "launch" ]]; then
  echo "▶ 앱 실행"
  ares-launch --device "$TV_DEVICE" "$APP_ID"
fi
