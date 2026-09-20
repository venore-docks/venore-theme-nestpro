import type { ThemeManifest } from "@venore/theme-sdk";

export const nestproManifest: ThemeManifest = {
  key: "nestpro",
  name: "NestPro",
  version: "0.2.0",
  themeContractVersion: "7.0.0",
  // logoUrl real vem de contexts/settings (upload em /admin/settings/brand) — isto só declara os
  // valores padrão de exibição. Refatoração parcial desta sessão: cópia do Venore Slime (mesmo
  // Shell/raio/motion/tipografia), matiz girado pro "Delft blue" original do NestPro (theme.css
  // --primary: oklch(0.5 0.135 235)) em vez do verde do Slime.
  brandAesthetics: { mode: "svg", size: 100, scrolledSize: 80, position: "left", color: "oklch(0.5 0.135 235)" },
  colorModes: ["light", "dark"],
};
