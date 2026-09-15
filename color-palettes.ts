import { generateHueRotationPalettes, THEME_HUE_PRESETS } from "@venore/theme-sdk/palettes";

// Ponto de partida aproxima o "Delft blue" / "French gray" do NestPro original — presets
// alternativos que o admin pode escolher em /admin/settings/brand, girando o matiz a partir daqui.
// A identidade EXATA (fidelidade 1:1 ao NestPro) mora em theme.css, não aqui.
export const NESTPRO_COLOR_PALETTES = generateHueRotationPalettes(
  {
    light: {
      primary: "oklch(0.36 0.05 265)",
      primaryForeground: "oklch(0.96 0.01 265)",
      accent: "oklch(0.78 0.03 265)",
      accentForeground: "oklch(0.25 0.02 265)",
      ring: "oklch(0.5 0.06 265)",
    },
    dark: {
      primary: "oklch(0.42 0.09 265)",
      primaryForeground: "oklch(0.95 0.01 265)",
      accent: "oklch(0.3 0.04 265)",
      accentForeground: "oklch(0.95 0.01 265)",
      ring: "oklch(0.55 0.1 265)",
    },
  },
  THEME_HUE_PRESETS,
);
