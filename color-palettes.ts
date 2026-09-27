import type { ColorPalette } from "@venore/theme-sdk";
import { generateHueRotationPalettes, THEME_HUE_PRESETS } from "@venore/theme-sdk/palettes";

// Ponto de partida aproxima o "Delft blue" do bloco base de theme.css — presets que o admin pode
// escolher em /admin/settings/brand. Dois tipos:
//   - curadas (abaixo): variações pensadas pra marca NestPro, não só rotação de matiz;
//   - rotação de matiz (THEME_HUE_PRESETS): mesmo L/C da base, outro hue.
const BASE = {
  light: {
    primary: "oklch(0.5 0.135 235)",
    primaryForeground: "oklch(0.99 0.008 235)",
    accent: "oklch(0.9 0.055 235)",
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
};

const CURATED_PALETTES: ColorPalette[] = [
  {
    // Azul-marinho sóbrio, próximo do Delft original (hsl(235 25% 30%)): croma baixo, mais escuro.
    id: "institucional",
    name: "Institucional",
    light: {
      primary: "oklch(0.38 0.07 255)",
      "primary-foreground": "oklch(0.99 0.005 255)",
      accent: "oklch(0.92 0.03 255)",
      "accent-foreground": "oklch(0.26 0.03 255)",
      ring: "oklch(0.42 0.07 255)",
    },
    dark: {
      primary: "oklch(0.68 0.07 255)",
      "primary-foreground": "oklch(0.15 0.015 255)",
      accent: "oklch(0.36 0.04 255)",
      "accent-foreground": "oklch(0.94 0.015 255)",
      ring: "oklch(0.6 0.07 255)",
    },
  },
  {
    // Alto contraste: primary mais escuro/claro que a base, texto secundário e bordas mais
    // marcados — pra quem tem baixa visão ou telas de projeção.
    id: "alto-contraste",
    name: "Alto contraste",
    light: {
      primary: "oklch(0.4 0.15 240)",
      "primary-foreground": "oklch(1 0 0)",
      accent: "oklch(0.88 0.06 240)",
      "accent-foreground": "oklch(0.18 0.03 240)",
      ring: "oklch(0.35 0.15 240)",
      foreground: "oklch(0.15 0.02 240)",
      "card-foreground": "oklch(0.15 0.02 240)",
      "muted-foreground": "oklch(0.35 0.025 240)",
      border: "oklch(0.75 0.02 240)",
      input: "oklch(0.65 0.02 240)",
    },
    dark: {
      primary: "oklch(0.78 0.12 240)",
      "primary-foreground": "oklch(0.12 0.02 240)",
      accent: "oklch(0.45 0.07 240)",
      "accent-foreground": "oklch(0.98 0.01 240)",
      ring: "oklch(0.8 0.12 240)",
      foreground: "oklch(0.98 0.005 240)",
      "card-foreground": "oklch(0.98 0.005 240)",
      "muted-foreground": "oklch(0.85 0.02 240)",
      border: "oklch(0.5 0.02 240)",
      input: "oklch(0.55 0.02 240)",
    },
  },
];

export const NESTPRO_COLOR_PALETTES: ColorPalette[] = [
  ...CURATED_PALETTES,
  ...generateHueRotationPalettes(BASE, THEME_HUE_PRESETS),
];
