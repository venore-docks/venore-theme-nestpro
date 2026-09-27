import type { ContentSlotProps } from "@venore/theme-sdk";
import { Breadcrumbs } from "./Breadcrumbs";

// Alvo do link "Pular para o conteúdo" (Shell.tsx).
export const MAIN_CONTENT_ID = "conteudo";

export function ContentSlot({
  children,
  sidebarContextualEnabled,
  sidebarContextual,
  breadcrumbs,
  breadcrumbsJsonLd,
}: ContentSlotProps) {
  const showSidebar = sidebarContextualEnabled && sidebarContextual != null;

  return (
    <div data-sidebar-contextual={showSidebar} className="flex-1 min-w-0 bg-(image:--app-background)">
      <Breadcrumbs breadcrumbs={breadcrumbs} breadcrumbsJsonLd={breadcrumbsJsonLd} />
      <div
        className={`mx-auto flex max-w-6xl gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8 lg:py-12 ${
          showSidebar ? "flex-col lg:flex-row" : ""
        }`}
      >
        <main id={MAIN_CONTENT_ID} tabIndex={-1} className="min-w-0 flex-1 text-foreground outline-none">{children}</main>
        {showSidebar && <aside data-shell-region="sidebar-contextual" className="w-full shrink-0 text-foreground lg:w-72">{sidebarContextual}</aside>}
      </div>
    </div>
  );
}
