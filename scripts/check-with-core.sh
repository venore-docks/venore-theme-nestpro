#!/usr/bin/env bash
# Roda typecheck, lint e testes do tema contra um checkout do core (venore-docks).
# O tema não tem dependências próprias: @venore/theme-sdk, react, next e lucide-react vêm do core,
# do mesmo jeito que acontece quando uma instância instala o pacote.
#
# Uso: CORE_DIR=../venore-docks scripts/check-with-core.sh
# (o core precisa ter `npm ci` rodado; os arquivos temporários são removidos no fim)
set -euo pipefail

THEME_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CORE_DIR="$(cd "${CORE_DIR:-$THEME_DIR/../venore-docks}" && pwd)"
REL="$(python3 -c "import os,sys;print(os.path.relpath(sys.argv[1],sys.argv[2]))" "$THEME_DIR" "$CORE_DIR")"
LINT_DIR="$CORE_DIR/src/themes/_nestpro_check"

cleanup() {
  rm -rf "$LINT_DIR" "$CORE_DIR/tsconfig.nestpro-check.json" "$CORE_DIR/vitest.nestpro-check.config.ts"
}
trap cleanup EXIT

# Resolução de react/next/lucide a partir dos arquivos do tema (fora da árvore do core).
[ -e "$THEME_DIR/node_modules" ] || ln -s "$CORE_DIR/node_modules" "$THEME_DIR/node_modules"

cat > "$CORE_DIR/tsconfig.nestpro-check.json" <<JSON
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "incremental": false },
  "include": ["$REL/**/*.ts", "$REL/**/*.tsx"],
  "exclude": ["$REL/node_modules"]
}
JSON

cat > "$CORE_DIR/vitest.nestpro-check.config.ts" <<TS
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
export default defineConfig({
  resolve: {
    alias: [
      { find: /^@venore\/theme-sdk$/, replacement: fileURLToPath(new URL("./src/theme-sdk/index.ts", import.meta.url)) },
      { find: /^@venore\/theme-sdk\/(.*)$/, replacement: fileURLToPath(new URL("./src/theme-sdk/", import.meta.url)) + "\$1.ts" },
      { find: /^next-auth$/, replacement: fileURLToPath(new URL("./src/test-support/stubs/next-auth.ts", import.meta.url)) },
      { find: "@", replacement: fileURLToPath(new URL("./src", import.meta.url)) },
    ],
  },
  test: {
    environment: "node",
    include: ["$REL/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "$REL/node_modules/**"],
  },
});
TS

cd "$CORE_DIR"

echo "== typecheck"
# O core pode ter erros próprios (ex.: arquivos *.generated ausentes num checkout sem build);
# só erros em arquivos do tema reprovam.
TSC_OUT="$(npx tsc -p tsconfig.nestpro-check.json 2>&1 || true)"
THEME_ERRORS="$(printf '%s\n' "$TSC_OUT" | grep -F "$REL/" || true)"
if [ -n "$THEME_ERRORS" ]; then
  printf '%s\n' "$THEME_ERRORS"
  exit 1
fi

echo "== lint (regras do core para src/themes: cor, fronteiras, hooks)"
mkdir -p "$LINT_DIR"
cp -r "$THEME_DIR/components" "$THEME_DIR"/*.ts "$LINT_DIR/"
npx eslint --max-warnings=0 "$LINT_DIR"

echo "== testes"
npx vitest run -c vitest.nestpro-check.config.ts
