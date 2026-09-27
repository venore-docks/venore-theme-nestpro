import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { FooterSlotProps, HeaderSlotProps, SidebarLeftSlotProps, ThemeShellProps } from "@venore/theme-sdk";
import { HeaderSlot } from "./HeaderSlot";
import { FooterSlot } from "./FooterSlot";
import { SidebarLeftSlot } from "./SidebarLeftSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { Shell } from "./Shell";
import { isDescendantActive, isSectionOf } from "./SidebarNavLink";
import { nestproManifest } from "../manifest";
import { NESTPRO_COLOR_PALETTES } from "../color-palettes";

// Regressões da revisão de 27/09/2026 (docs/revisao/): cada bloco aponta o item (P*, R*, U*).

let mockPathname: string | null = null;
vi.mock("next/navigation", () => ({ usePathname: () => mockPathname }));
beforeEach(() => {
  mockPathname = null;
});

const brand: HeaderSlotProps["brand"] = {
  name: "NestPro",
  mode: "text",
  size: 100,
  scrolledSize: 80,
  position: "left",
  logoUrl: "/brand/logo.svg",
  scrolledLogoUrl: "/brand/logo.svg",
};

const headerProps: HeaderSlotProps = {
  brand,
  userbarEnabled: true,
  stickyEnabled: true,
  scrollShrinkEnabled: true,
  headerNavItems: [
    { key: "sobre", label: "Sobre", href: "/sobre" },
    { key: "externo", label: "Portal", href: "https://exemplo.org" },
  ],
  user: null,
  canAccessAdmin: false,
  onSignOut: async () => {},
  showLoginLink: true,
};

const footerProps: FooterSlotProps = {
  brand: { ...brand, color: "oklch(0.5 0.135 235)", description: "" },
  sitemapItems: [],
  creditsEnabled: false,
  loginLinkHref: null,
};

const sidebarProps: SidebarLeftSlotProps = {
  enabled: true,
  navMode: "main",
  navItems: [],
  navGroups: [],
  canToggleAdminNav: false,
  onToggleNavMode: async () => {},
  collapsed: false,
  onToggleCollapsed: async () => {},
};

describe("Header", () => {
  it("P2: respeita showLoginLink=false (sem link Entrar)", () => {
    expect(renderToStaticMarkup(<HeaderSlot {...headerProps} />)).toContain('href="/login"');
    expect(renderToStaticMarkup(<HeaderSlot {...headerProps} showLoginLink={false} />)).not.toContain('href="/login"');
  });

  it("U6: Entrar é um botão primário", () => {
    const html = renderToStaticMarkup(<HeaderSlot {...headerProps} />);
    expect(html).toMatch(/<a[^>]*class="[^"]*bg-primary[^"]*"[^>]*href="\/login"/);
  });

  it("P11/U3: header-nav usa Link interno, externo abre em nova aba, e some abaixo de md", () => {
    const html = renderToStaticMarkup(<HeaderSlot {...headerProps} />);
    expect(html).toMatch(/<nav[^>]*class="hidden [^"]*md:flex/);
    expect(html).toMatch(/<a[^>]*href="https:\/\/exemplo.org"[^>]*target="_blank"|<a[^>]*target="_blank"[^>]*href="https:\/\/exemplo.org"/);
  });

  it("R4: tem acesso à busca", () => {
    expect(renderToStaticMarkup(<HeaderSlot {...headerProps} />)).toMatch(/aria-label="Buscar"[^>]*href="\/busca"/);
  });

  it("P7/R5: alerta de notificação tem nome acessível em qualquer largura e contador", () => {
    const html = renderToStaticMarkup(
      <HeaderSlot
        {...headerProps}
        user={{ displayName: "Ana Souza", email: null, imageUrl: null }}
        notificationAlert={{ count: 12, href: "/mensagens", label: "12 mensagens não lidas" }}
      />,
    );
    expect(html).toMatch(/aria-label="12 mensagens não lidas"[^>]*href="\/mensagens"/);
    expect(html).toContain(">9+<");
  });
});

describe("Rodapé", () => {
  it("P3: mostra Entrar quando loginLinkHref vem preenchido", () => {
    expect(renderToStaticMarkup(<FooterSlot {...footerProps} />)).not.toContain(">Entrar<");
    expect(renderToStaticMarkup(<FooterSlot {...footerProps} loginLinkHref="/login" />)).toContain(">Entrar<");
  });

  it("R12: crédito é link pro site do projeto, em nova aba", () => {
    const html = renderToStaticMarkup(<FooterSlot {...footerProps} creditsEnabled />);
    expect(html).toMatch(/<a href="https:\/\/venore-docks.vercel.app" target="_blank" rel="noopener noreferrer"[^>]*>Venore Docks<\/a>/);
  });

  it("R8/U13: traço de acento usa brand.color e a marca não é escalada por transform", () => {
    const html = renderToStaticMarkup(<FooterSlot {...footerProps} />);
    expect(html).toContain("background-color:oklch(0.5 0.135 235)");
    expect(html).not.toContain("scale-125");
  });
});

describe("Sidebar", () => {
  it("U10: menu vazio tem mensagem em vez de travessão", () => {
    const html = renderToStaticMarkup(<SidebarLeftSlot {...sidebarProps} />);
    expect(html).toContain("Nenhum item no menu ainda.");
    expect(html).not.toContain(">—<");
  });

  it("U3: itens do header-nav aparecem no drawer só abaixo de md", () => {
    const html = renderToStaticMarkup(<SidebarLeftSlot {...sidebarProps} headerNavItems={headerProps.headerNavItems} />);
    expect(html).toMatch(/class="[^"]*md:hidden[^"]*"><a[^>]*href="\/sobre"/);
  });

  it("P5: botão de colapso fica acima do header sticky (z-50)", () => {
    expect(renderToStaticMarkup(<SidebarLeftSlot {...sidebarProps} />)).toContain("absolute top-4 right-0 z-50");
  });

  it("P8: SSR não marca a sidebar como inert (no desktop ela é a coluna visível)", () => {
    expect(renderToStaticMarkup(<SidebarLeftSlot {...sidebarProps} />)).not.toContain("inert");
  });

  it("P12/U4: subpágina marca o item da seção, e '/' nunca vira seção", () => {
    expect(isSectionOf("/blog", "/blog/meu-post")).toBe(true);
    expect(isSectionOf("/blog", "/blogueiros")).toBe(false);
    expect(isSectionOf("/", "/qualquer")).toBe(false);
    expect(
      isDescendantActive({ key: "g", label: "G", href: null, children: [{ key: "b", label: "B", href: "/blog" }] }, "/blog/x"),
    ).toBe(true);

    mockPathname = "/academy/curso-1";
    const html = renderToStaticMarkup(
      <SidebarLeftSlot {...sidebarProps} navItems={[{ key: "academy", label: "Academy", href: "/academy" }]} />,
    );
    expect(html).toMatch(/<a[^>]*class="[^"]*font-semibold text-primary[^"]*"[^>]*href="\/academy"/);
    expect(html).not.toContain('aria-current="page"');
  });
});

describe("Breadcrumbs", () => {
  const trail = [
    { key: "a", label: "Início", href: "/", current: false },
    { key: "b", label: "Meio", href: "/meio", current: false },
    { key: "c", label: "Atual", href: null, current: true },
  ];

  it("P6: JSON-LD escapa </script>", () => {
    const html = renderToStaticMarkup(
      <Breadcrumbs breadcrumbs={trail} breadcrumbsJsonLd={{ name: "</script><script>alert(1)</script>" }} />,
    );
    expect(html).not.toContain("</script><script>");
    expect(html).toContain("\\u003c/script");
  });

  it("U11: o '…' do celular é um botão com nome acessível", () => {
    const html = renderToStaticMarkup(<Breadcrumbs breadcrumbs={trail} breadcrumbsJsonLd={null} />);
    expect(html).toMatch(/<button[^>]*aria-label="Mostrar 1 níveis ocultos da trilha"/);
  });
});

describe("Shell", () => {
  it("R6: primeiro elemento é o link de pular pro conteúdo, apontando pro <main>", () => {
    const props: ThemeShellProps = {
      header: headerProps,
      footer: footerProps,
      sidebarLeft: sidebarProps,
      children: <p>conteúdo</p>,
      sidebarContextualEnabled: false,
      sidebarContextual: null,
      breadcrumbs: [],
      breadcrumbsJsonLd: null,
    };
    const html = renderToStaticMarkup(<Shell {...props} />);
    expect(html.startsWith('<a href="#conteudo"')).toBe(true);
    expect(html).toContain('<main id="conteudo"');
  });
});

describe("Manifesto, paletas e tokens", () => {
  const pkg = JSON.parse(readFileSync(fileURLToPath(new URL("../package.json", import.meta.url)), "utf-8")) as { version: string };
  const css = readFileSync(fileURLToPath(new URL("../theme.css", import.meta.url)), "utf-8");

  it("P4: declara capabilities.headerBehavior", () => {
    expect(nestproManifest.capabilities?.headerBehavior).toBe(true);
  });

  it("P15: versão do manifesto = versão do package.json", () => {
    expect(nestproManifest.version).toBe(pkg.version);
  });

  it("P14: nenhum --chart-2..7 literal usa o matiz de marca (235)", () => {
    const literalCharts = [...css.matchAll(/--chart-[2-7]:\s*oklch\([^)]*\)/g)].map((m) => m[0]);
    expect(literalCharts.length).toBeGreaterThan(0);
    for (const decl of literalCharts) expect(decl).not.toMatch(/\s235\)$/);
  });

  it("R10: tem paletas curadas além da rotação de matiz, com ids únicos", () => {
    const ids = NESTPRO_COLOR_PALETTES.map((p) => p.id);
    expect(ids).toContain("institucional");
    expect(ids).toContain("alto-contraste");
    expect(new Set(ids).size).toBe(ids.length);
  });
});
