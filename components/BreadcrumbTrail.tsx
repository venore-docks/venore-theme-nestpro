"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@venore/theme-sdk";

// Colapso mobile ("primeiro e último visíveis"): abaixo de `sm` os itens do meio ficam
// `hidden` (mobile-first — base sem prefixo é o estado mobile) e no lugar deles aparece um botão
// "…". `display:none` tira esses itens também da árvore de acessibilidade, por isso o "…" é um
// botão de verdade (com nome acessível) que expande a trilha completa, não uma reticência
// decorativa sem saída.
export function BreadcrumbTrail({ breadcrumbs }: { breadcrumbs: BreadcrumbItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const hasCollapsibleMiddle = breadcrumbs.length > 2 && !expanded;

  return (
    <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
      {breadcrumbs.map((item, index) => {
        const isFirst = index === 0;
        const isLast = index === breadcrumbs.length - 1;
        const isCollapsedOnMobile = hasCollapsibleMiddle && !isFirst && !isLast;

        return (
          <li key={item.key} className={`items-center gap-1 ${isCollapsedOnMobile ? "hidden sm:flex" : "flex"}`}>
            {!isFirst && <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground/56" />}
            {item.current ? (
              <span aria-current="page" className="font-medium text-foreground">
                {item.label}
              </span>
            ) : item.href ? (
              <Link
                href={item.href}
                className="rounded-sm px-1 py-0.5 ui-motion-base outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {item.label}
              </Link>
            ) : (
              <span>{item.label}</span>
            )}
            {isFirst && hasCollapsibleMiddle && (
              <span className="flex items-center gap-1 sm:hidden">
                <ChevronRight aria-hidden="true" className="size-3 shrink-0 text-muted-foreground/56" />
                <button
                  type="button"
                  onClick={() => setExpanded(true)}
                  aria-label={`Mostrar ${breadcrumbs.length - 2} níveis ocultos da trilha`}
                  className="rounded-sm px-1 py-0.5 ui-motion-base outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                >
                  …
                </button>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
