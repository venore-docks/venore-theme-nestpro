"use client";

import { useEffect, useRef } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import type { HeaderUserInfo, NavItem } from "@venore/theme-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "@venore/theme-sdk/ui";
import { ColorModeToggle } from "@venore/theme-sdk/ui";

function initials(displayName: string) {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
}

type UserMenuProps = {
  user: HeaderUserInfo;
  canAccessAdmin: boolean;
  onSignOut: () => Promise<void>;
  // Links que plugins ativos contribuem pro menu do usuário (ex.: "Mensagens" do Academy) —
  // resolvido na composição (resolveThemeSlotProps), o tema só renderiza. `icon` é ignorado aqui:
  // os itens fixos do menu ("Minha conta", "Administração") também são só texto.
  userNavItems?: NavItem[];
};

// Dropdown com <details>/<summary> (mesmo padrão de src/app/(auth)/login/page.tsx) — só
// "use client" pra cobrir o que HTML puro não dá: <details> nativo não fecha sozinho ao clicar
// fora, nem com Escape, nem ao navegar (o header não remonta entre páginas, então o menu ficava
// aberto na página nova depois de clicar em "Minha conta"). Aqui:
//   - clique fora (mousedown) fecha;
//   - Escape fecha e devolve o foco ao <summary>;
//   - mudança de rota fecha;
//   - ↑/↓ movem o foco entre os itens, Home/End vão pro primeiro/último.
// Abrir/fechar pelo summary continua nativo. `group` aqui é o próprio <details>.
const menuItemClass =
  "cursor-pointer rounded-lg px-2.5 py-2 text-sm text-muted-foreground ui-motion-base outline-none hover:bg-muted hover:text-foreground active:bg-muted active:text-foreground focus-visible:ring-2 focus-visible:ring-ring";

export function UserMenu({ user, canAccessAdmin, onSignOut, userNavItems = [] }: UserMenuProps) {
  const firstName = user.displayName.split(/\s+/)[0];
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      const details = detailsRef.current;
      if (!details || !details.open) return;
      if (event.target instanceof Node && !details.contains(event.target)) {
        details.open = false;
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDetailsElement>) {
    const details = detailsRef.current;
    if (!details || !details.open) return;

    if (event.key === "Escape") {
      event.preventDefault();
      details.open = false;
      details.querySelector("summary")?.focus();
      return;
    }

    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const items = Array.from(details.querySelectorAll<HTMLElement>("[data-menu] a[href], [data-menu] button:not([disabled])"));
    if (items.length === 0) return;
    event.preventDefault();
    const current = items.indexOf(document.activeElement as HTMLElement);
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? items.length - 1
          : event.key === "ArrowDown"
            ? (current + 1) % items.length
            : (current - 1 + items.length) % items.length;
    items[next]?.focus();
  }

  return (
    <details ref={detailsRef} className="group relative" onKeyDown={handleKeyDown}>
      <summary aria-label={`Menu de ${user.displayName}`} className="flex cursor-pointer list-none items-center gap-2 rounded-full py-1 pr-2 pl-1 ui-motion-base outline-none hover:bg-muted active:bg-muted focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
        <Avatar>
          {user.imageUrl ? <AvatarImage src={user.imageUrl} alt={user.displayName} /> : null}
          <AvatarFallback>{initials(user.displayName)}</AvatarFallback>
        </Avatar>
        <span className="hidden text-sm font-medium sm:inline">{firstName}</span>
      </summary>

      <div data-menu className="absolute right-0 top-full z-50 mt-2 w-64 rounded-panel border border-border bg-popover p-2 text-popover-foreground shadow-float">
        <div className="border-b border-border px-2 pt-1.5 pb-3">
          <p className="truncate text-sm font-semibold">{user.displayName}</p>
          {user.email ? <p className="truncate text-xs text-muted-foreground">{user.email}</p> : null}
        </div>

        <div className="flex flex-col gap-0.5 py-1.5">
          <ColorModeToggle className={menuItemClass} />

          {canAccessAdmin ? (
            <Link href="/admin" className={menuItemClass}>
              Administração
            </Link>
          ) : null}

          <Link href="/account" className={menuItemClass}>
            Minha conta
          </Link>

          {userNavItems.map((item) => (
            <Link key={item.key} href={item.href} className={menuItemClass}>
              {item.label}
            </Link>
          ))}
        </div>

        <form action={onSignOut} className="mt-1 border-t border-border pt-1.5">
          <button type="submit" className={menuItemClass + " flex w-full items-center gap-2 text-left font-medium"}>
            <LogOut className="size-4" aria-hidden="true" />
            Sair
          </button>
        </form>
      </div>
    </details>
  );
}
