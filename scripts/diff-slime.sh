#!/usr/bin/env bash
# Mostra o que mudou no Shell do Venore Slime (core) desde o commit de onde o NestPro foi
# sincronizado pela última vez (SLIME_BASE, registrado no README). Rodar a cada release do core:
# o que aparecer aqui é candidato a portar pro NestPro.
#
# Uso: CORE_DIR=../venore-docks scripts/diff-slime.sh [ref-do-core, padrão origin/main]
set -euo pipefail

THEME_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CORE_DIR="$(cd "${CORE_DIR:-$THEME_DIR/../venore-docks}" && pwd)"
SLIME_BASE="$(grep -oE 'SLIME_BASE=[0-9a-f]+' "$THEME_DIR/README.md" | cut -d= -f2)"
TARGET="${1:-origin/main}"

git -C "$CORE_DIR" fetch -q origin
git -C "$CORE_DIR" diff --stat "$SLIME_BASE" "$TARGET" -- src/themes/venore-slime src/contexts/themes/contracts src/theme-sdk
git -C "$CORE_DIR" diff "$SLIME_BASE" "$TARGET" -- src/themes/venore-slime/components src/contexts/themes/contracts/types.ts src/theme-sdk
