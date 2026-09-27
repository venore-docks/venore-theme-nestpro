import Link from "next/link";
import { Bell, Search } from "lucide-react";
import type { HeaderSlotProps } from "@venore/theme-sdk";
import { HeaderNavLink } from "./HeaderNavLink";
import { UserMenu } from "./UserMenu";
import { MobileNavToggleButton } from "./MobileNavToggleButton";
import { PlatformBrand } from "./PlatformBrand";
import { HeaderScrollSentinel } from "./HeaderScrollSentinel";

// Rota de busca pública do core (src/app/(platform)/busca, core >= v0.6.0). O contrato de slot
// ainda não entrega um `searchHref`; enquanto isso o tema aponta pra rota fixa.
const SEARCH_HREF = "/busca";

// Header compacto que se ELEVA ao rolar em vez de inverter de cor. Continua server component; o
// único client real é HeaderScrollSentinel (sibling), que escreve `data-scrolled` no <header> via
// DOM. Todo o resto reage por seletor CSS (`data-[scrolled=true]:` no próprio elemento). Único que
// recebe `isScrolled` boolean de verdade é PlatformBrand, porque também roda fora do header
// (preview de admin/settings/brand).
//
// Alturas (mobile-first):
//   top      → h-16 no celular, lg:h-24 no desktop; bg-card, borda hairline, sem sombra.
//   scrolled → h-14 / lg:h-16; bg-card translúcido + backdrop-blur, borda definida, shadow-header.
//
// stickyEnabled/scrollShrinkEnabled vêm de contexts/settings (platform/header-behavior) — o
// manifesto declara `capabilities.headerBehavior` pra /admin/themes mostrar o formulário.
// stickyEnabled também liga o backdrop-blur no estado top. scrollShrinkEnabled=false →
// HeaderScrollSentinel nem monta, então `data-scrolled` fica sempre "false".
//
// header-nav só aparece a partir de `md`; abaixo disso os mesmos itens vão pro topo do drawer
// mobile (SidebarLeftSlot recebe `headerNavItems` do Shell).
export function HeaderSlot({
  brand,
  userbarEnabled,
  stickyEnabled,
  scrollShrinkEnabled,
  headerNavItems,
  user,
  canAccessAdmin,
  onSignOut,
  notificationAlert,
  userNavItems,
  showLoginLink,
}: HeaderSlotProps) {
  const navLinkClass =
    "rounded-lg px-3 py-1.5 text-xs font-medium uppercase tracking-caps text-muted-foreground ui-motion-base outline-none hover:bg-muted hover:text-foreground active:bg-muted focus-visible:ring-2 focus-visible:ring-ring";
  const iconButtonClass =
    "ui-icon-button-lg relative ui-motion-base outline-none text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <>
      {scrollShrinkEnabled && <HeaderScrollSentinel />}
      <header
        id="site-header"
        data-shell-region="header"
        data-scrolled="false"
        className={
          "group/header z-40 flex h-16 items-center justify-between gap-4 border-b border-header-border-subtle bg-card px-4 text-foreground ui-motion-emphasis sm:px-6 lg:h-24 " +
          (stickyEnabled ? "sticky top-0 backdrop-blur-sm " : "") +
          (scrollShrinkEnabled
            ? "data-[scrolled=true]:h-14 data-[scrolled=true]:border-border data-[scrolled=true]:bg-card/85 data-[scrolled=true]:shadow-header data-[scrolled=true]:backdrop-blur-xl lg:data-[scrolled=true]:h-16 "
            : "") +
          (brand.position === "center" ? "relative" : "")
        }
      >
        <div className="flex items-center gap-2">
          <MobileNavToggleButton />
          <Link
            href="/"
            aria-label={brand.name}
            className={
              "inline-flex items-center rounded-lg py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-ring " +
              (brand.position === "center" ? "absolute left-1/2 -translate-x-1/2" : "")
            }
          >
            <PlatformBrand {...brand} isScrolled={false} />
          </Link>
        </div>

        {headerNavItems.length > 0 && (
          <nav aria-label="Navegação do cabeçalho" className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {headerNavItems.map((item) => (
              <HeaderNavLink key={item.key} item={item} className={navLinkClass} />
            ))}
          </nav>
        )}

        <div className="flex items-center gap-1.5">
          <Link href={SEARCH_HREF} aria-label="Buscar" className={iconButtonClass}>
            <Search className="size-5" aria-hidden="true" />
          </Link>

          {userbarEnabled ? (
            user ? (
              <>
                {notificationAlert && <NotificationLink alert={notificationAlert} className={iconButtonClass} />}
                <UserMenu user={user} canAccessAdmin={canAccessAdmin} onSignOut={onSignOut} userNavItems={userNavItems} />
              </>
            ) : showLoginLink ? (
              <Link
                href="/login"
                className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground ui-motion-base outline-none hover:bg-primary/90 active:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Entrar
              </Link>
            ) : null
          ) : null}
        </div>
      </header>
    </>
  );
}

// Sino com contador. O texto (`label`) já vem pronto de quem produziu o alerta
// (platform/notifications/notification-registry.ts) — vira o nome acessível do link em qualquer
// largura (antes ficava `hidden` no celular e o link ficava sem nome) e tooltip nativo (`title`).
function NotificationLink({
  alert,
  className,
}: {
  alert: NonNullable<HeaderSlotProps["notificationAlert"]>;
  className: string;
}) {
  const countText = alert.count > 9 ? "9+" : String(alert.count);

  return (
    <Link href={alert.href} aria-label={alert.label} title={alert.label} className={className}>
      <Bell className="size-5" aria-hidden="true" />
      {alert.count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[0.625rem] font-semibold leading-none text-primary-foreground"
        >
          {countText}
        </span>
      ) : (
        <span aria-hidden="true" className="absolute top-2 right-2 size-2 rounded-full bg-primary" />
      )}
    </Link>
  );
}
