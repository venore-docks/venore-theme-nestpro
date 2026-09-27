import Link from "next/link";
import type { NavItem } from "@venore/theme-sdk";

// Link externo (http/https) sai do router do Next e abre em nova aba; interno usa <Link> pra
// navegação client-side (antes era <a>, que recarregava a página inteira a cada clique).
export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

export function HeaderNavLink({ item, className }: { item: NavItem; className: string }) {
  if (isExternalHref(item.href)) {
    return (
      <a href={item.href} target="_blank" rel="noopener noreferrer" className={className}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}
