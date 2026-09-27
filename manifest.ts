import type { ThemeManifest } from "@venore/theme-sdk";

export const nestproManifest: ThemeManifest = {
  key: "nestpro",
  name: "NestPro",
  version: "0.3.0",
  themeContractVersion: "7.0.0",
  // logoUrl real vem de contexts/settings (upload em /admin/settings/brand) — isto só declara os
  // valores padrão de exibição. Shell derivado do Venore Slime (ver README, "Relação com o
  // Venore Slime"), matiz girado pro "Delft blue" do NestPro (theme.css --primary). `color` pinta
  // o traço de acento sob a marca no rodapé (FooterSlot).
  brandAesthetics: { mode: "svg", size: 100, scrolledSize: 80, position: "left", color: "oklch(0.5 0.135 235)" },
  colorModes: ["light", "dark"],
  // HeaderSlot lê stickyEnabled/scrollShrinkEnabled — sem isto /admin/themes esconde o formulário
  // de comportamento do header com o NestPro ativo.
  capabilities: { headerBehavior: true },
};
