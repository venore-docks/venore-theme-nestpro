import Link from "next/link";
import { Sitemap } from "@venore/theme-sdk/ui";
import type { FooterSlotProps } from "@venore/theme-sdk";
import { PlatformBrand } from "./PlatformBrand";

// Marca num painel accent-soft + grid de sitemap real (Sitemap, componente reutilizável fora do
// tema), mesma composição do PlatformFooter de referência (protótipo venore-docks,
// platform-frame.tsx). brand.color (manifest.brandAesthetics.color) pinta o traço de acento sob
// a marca — cor injetada via prop, não token semântico shadcn (mesma exceção documentada em
// build-birthday-pdf-html.ts). Server component puro, sem I/O — quem busca dado (getBrandConfig +
// getMenuByLocation("sitemap")) é platform/theme-rendering/resolve-theme-slot-props.ts.
// Site do projeto (homepage declarada no repositório venore-docks/venore-docks).
const CREDITS_HREF = "https://venore-docks.vercel.app";

export function FooterSlot({ brand, sitemapItems, creditsEnabled, loginLinkHref }: FooterSlotProps) {
  return (
    <footer data-shell-region="footer" className="mt-auto grid gap-8 border-t border-border px-4 py-12 text-muted-foreground sm:px-6 lg:grid-cols-[max-content_minmax(0,1fr)] lg:gap-12 lg:px-8">
      <div className="w-fit max-w-full justify-self-start space-y-5 rounded-panel border border-border bg-accent/14 px-6 py-6">
        <div>
          {/* 125% do tamanho do header via `size` (altura real no layout), não `scale-125`:
              transform não ocupa espaço, e a marca podia encostar/passar da borda do painel. */}
          <div className="max-w-full">
            <PlatformBrand
              name={brand.name}
              mode={brand.mode}
              size={brand.size * 1.25}
              scrolledSize={brand.scrolledSize * 1.25}
              position={brand.position}
              logoUrl={brand.logoUrl}
              scrolledLogoUrl={brand.scrolledLogoUrl}
              isScrolled={false}
            />
          </div>
          {/* Traço de acento em brand.color = manifest.brandAesthetics.color deste tema
              (resolve-theme-slot-props.ts); vazio cai pro primary. */}
          <span
            aria-hidden
            className={"mt-4 block h-0.5 w-10 rounded-full " + (brand.color ? "opacity-60" : "bg-primary/40")}
            style={brand.color ? { backgroundColor: brand.color } : undefined}
          />
        </div>
        {brand.description.trim().length > 0 && (
          <p className="max-w-[34ch] text-pretty text-xs leading-6 text-muted-foreground">{brand.description}</p>
        )}
      </div>

      <div className="space-y-4 pt-1">
        <Sitemap items={sitemapItems} />
        {loginLinkHref && (
          // Deliberado, separado do sitemap: só aparece quando o admin escondeu "Entrar" do
          // header (nav.hideLoginLink) e pediu explicitamente pra manter um acesso no rodapé
          // (nav.showLoginInFooter) — platform/nav-visibility/get-nav-visibility.ts.
          <Link
            href={loginLinkHref}
            className="inline-flex rounded-sm text-xs font-medium uppercase tracking-caps text-muted-foreground/56 outline-none ui-motion-base hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Entrar
          </Link>
        )}
      </div>

      {creditsEnabled ? (
        <div data-credits className="col-span-full border-t border-border pt-4 text-xs text-muted-foreground">
          <a
            href={CREDITS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm outline-none ui-motion-base hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            Venore Docks
          </a>
        </div>
      ) : null}
    </footer>
  );
}
