import { generateHueRotationPalettes, THEME_HUE_PRESETS } from "@venore/theme-sdk/palettes";

// Ponto de partida aproxima o "Delft blue" do bloco base de theme.css (refatoração parcial desta
// sessão: cópia do Venore Slime com o matiz girado pro azul) — presets alternativos que o admin
// pode escolher em /admin/settings/brand, girando o matiz a partir daqui.
export const NESTPRO_COLOR_PALETTES = generateHueRotationPalettes(
  {
    light: {
      primary: "oklch(0.5 0.135 235)",
      primaryForeground: "oklch(0.99 0.008 235)",
      accent: "oklch(0.88 0.09 235)",
      accentForeground: "oklch(0.28 0.03 235)",
      ring: "oklch(0.5 0.12 235)",
    },
    dark: {
      primary: "oklch(0.62 0.115 235)",
      primaryForeground: "oklch(0.16 0.018 235)",
      accent: "oklch(0.4 0.055 235)",
      accentForeground: "oklch(0.93 0.02 235)",
      ring: "oklch(0.55 0.1 235)",
    },
  },
  THEME_HUE_PRESETS,
);
