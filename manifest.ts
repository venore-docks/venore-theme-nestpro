import type { ThemeManifest } from "@venore/theme-sdk";

export const nestproManifest: ThemeManifest = {
  key: "nestpro",
  name: "NestPro",
  version: "0.1.0",
  themeContractVersion: "7.0.0",
  // logoUrl real vem de contexts/settings (upload em /admin/settings/brand) — isto só declara os
  // valores padrão de exibição. Cor aproxima o "Delft blue" do NestPro original
  // (nestpro/app/globals.css --primary: hsl(235 25% 30%)).
  brandAesthetics: { mode: "svg", size: 100, scrolledSize: 80, position: "left", color: "hsl(235 25% 30%)" },
  colorModes: ["light", "dark"],
};
