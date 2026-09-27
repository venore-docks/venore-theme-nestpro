"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MainNavItem } from "@venore/theme-sdk";
import { cn } from "@venore/theme-sdk/ui";
import { NavIcon } from "@venore/theme-sdk/ui";
import { SIDEBAR_COLLAPSE_TOOLTIP_COLLAPSED_CLASSES, SIDEBAR_COLLAPSE_TOOLTIP_LABEL_CLASSES } from "./sidebar-collapse-tooltip";

// Único pedaço client do item de nav: aria-current depende da rota atual, que um server component
// de layout não tem como ler sem middleware escrevendo um header dedicado (não existe um hoje, e
// criar um só pra isso seria maior que o problema). usePathname() é o jeito direto do App Router —
// funciona também durante o SSR deste Client Component, por isso aria-current (e o estado inicial
// aberto/fechado do accordion abaixo) já chegam corretos no primeiro HTML, sem salto pós-hidratação.
//
// 180px de max-width pro rótulo (não um número solto — é o que sobra dentro de
// --sidebar-width-expanded=280px depois do padding do frame (px-5=20px×2), do padding do item
// (px-3=12px×2) e do ícone+gap (20px+12px), replicando a matemática do protótipo de referência
// pixel a pixel: 280 − 40 − 24 − 32 = 184 ≈ 180). Hoje a largura sai de
// --sidebar-width-expanded (sidebar-collapse-tooltip.ts). Sem barra de marcação (border-l): o
// destaque de item ativo/hover é só bg/text (bg-primary/10, text-primary).
//
// Ativo = rota exata; "na seção" = uma subpágina dele (/blog/meu-post dentro de /blog) — ganha
// só text-primary, sem o fundo, pra o usuário saber onde está sem confundir com a página atual.
// "/" nunca conta como seção (senão toda página marcaria o início).
export function isSectionOf(href: string, pathname: string | null): boolean {
  if (!pathname || href === "/") return false;
  const base = href.endsWith("/") ? href.slice(0, -1) : href;
  return pathname.startsWith(base + "/");
}

export function isDescendantActive(item: MainNavItem, pathname: string | null): boolean {
  if (item.href === null) {
    return item.children.some((child) => isDescendantActive(child, pathname));
  }
  return item.href === pathname || isSectionOf(item.href, pathname);
}

export function SidebarNavLink({
  item,
  collapsed,
  isAdmin,
  onRequestExpand,
}: {
  item: MainNavItem;
  collapsed: boolean;
  isAdmin: boolean;
  // Chamado quando um agregador é aberto com a sidebar colapsada — SidebarLeftSlot expande a
  // sidebar pra os filhos aparecerem com rótulo (U8 da revisão).
  onRequestExpand?: () => void;
}) {
  const pathname = usePathname();
  // Hooks precisam rodar sempre na mesma ordem independente do branch abaixo (Rules of Hooks) —
  // por isso os useState ficam aqui em cima, mesmo só sendo consumidos no branch de agregador.
  const isActiveAncestor = item.href === null && isDescendantActive(item, pathname);
  const [expanded, setExpanded] = useState(isActiveAncestor);

  // useState só lê o valor inicial: numa navegação client-side pra dentro de outro agregador, o
  // grupo novo precisa abrir sozinho. Ajuste de estado durante o render (padrão do React pra
  // "estado derivado de prop que mudou"), não useEffect. Nunca fecha automaticamente (respeita o
  // que o usuário abriu).
  const [wasActiveAncestor, setWasActiveAncestor] = useState(isActiveAncestor);
  if (isActiveAncestor !== wasActiveAncestor) {
    setWasActiveAncestor(isActiveAncestor);
    if (isActiveAncestor) setExpanded(true);
  }

  // item.href === null é o agregador (menu_items.targetType "label", contexts/cms): nunca navega,
  // abre/fecha os filhos no próprio main-nav (accordion) — decisão desta sessão em vez de
  // reaproveitar o pill Site/Admin, que troca navMode inteiro e não serve pra expor filhos de um
  // único item. Aberto por padrão quando a rota atual é de um descendente, pra chegar já expandido
  // no primeiro HTML (mesmo raciocínio de aria-current acima).
  if (item.href === null) {
    const contentId = `sidebar-nav-group-${item.key}`;

    return (
      <div>
        <button
          type="button"
          onClick={() => {
            if (collapsed) {
              onRequestExpand?.();
              setExpanded(true);
              return;
            }
            setExpanded((value) => !value);
          }}
          aria-expanded={expanded}
          aria-controls={contentId}
          data-active-ancestor={isActiveAncestor ? "true" : undefined}
          className={cn(
            "group/sidebar-collapse-target relative flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ui-motion-base outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isActiveAncestor ? "font-semibold text-primary" : "font-medium text-muted-foreground",
            "hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground",
          )}
        >
          <span aria-hidden="true" className="inline-flex size-5 shrink-0 items-center justify-center">
            <NavIcon iconKey={item.icon} className="size-4 shrink-0" />
          </span>
          <span
            className={cn(
              "flex-1",
              SIDEBAR_COLLAPSE_TOOLTIP_LABEL_CLASSES,
              collapsed && SIDEBAR_COLLAPSE_TOOLTIP_COLLAPSED_CLASSES,
            )}
          >
            {item.label}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 ui-motion-base",
              expanded && "rotate-180",
              collapsed && SIDEBAR_COLLAPSE_TOOLTIP_COLLAPSED_CLASSES,
            )}
          />
        </button>
        {expanded && (
          <div id={contentId} className={cn("ml-8 space-y-1", collapsed && "lg:ml-0")}>
            {item.children.map((child) => (
              <SidebarNavLink key={child.key} item={child} collapsed={collapsed} isAdmin={isAdmin} onRequestExpand={onRequestExpand} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isActive = !item.isExternal && pathname === item.href;
  const isInSection = !item.isExternal && !isActive && isSectionOf(item.href, pathname);
  const linkClassName = cn(
    "group/sidebar-collapse-target relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ui-motion-base outline-none focus-visible:ring-2 focus-visible:ring-ring",
    isActive
      ? "bg-primary/10 font-semibold text-primary"
      : isInSection
        ? "font-semibold text-primary hover:bg-muted active:bg-muted"
        : "font-medium text-muted-foreground hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground",
  );
  const content = (
    <>
      <span aria-hidden="true" className="inline-flex size-5 shrink-0 items-center justify-center">
        <NavIcon iconKey={item.icon} className="size-4 shrink-0" />
      </span>
      <span className={cn(SIDEBAR_COLLAPSE_TOOLTIP_LABEL_CLASSES, collapsed && SIDEBAR_COLLAPSE_TOOLTIP_COLLAPSED_CLASSES)}>
        {item.label}
      </span>
    </>
  );

  // Item externo (menu_items.targetType "external" — contexts/cms) nunca passa pelo router do
  // Next: <Link> navegaria client-side pra uma URL fora da app. Abre sempre em nova aba (regra de
  // negócio pedida pro CMS, menu-resolution.ts já resolve isso em opensInNewTab). Item interno com
  // opensInNewTab (checkbox do editor) continua <Link> — só ganha target/rel.
  if (item.isExternal) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      target={item.opensInNewTab ? "_blank" : undefined}
      rel={item.opensInNewTab ? "noopener noreferrer" : undefined}
      className={linkClassName}
    >
      {content}
    </Link>
  );
}
