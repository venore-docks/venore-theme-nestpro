import type { BreadcrumbItem } from "@venore/theme-sdk";
import { serializeJsonLd } from "@venore/theme-sdk/json-ld";
import { BreadcrumbTrail } from "./BreadcrumbTrail";

// Puramente apresentacional — recebe a trilha e o JSON-LD já resolvidos no servidor
// (platform/breadcrumbs/resolve-breadcrumbs.ts) e só renderiza; nunca busca rota/entidade sozinho
// (Contrato de slot, mesmo princípio de HeaderSlot/FooterSlot). A lista em si é client
// (BreadcrumbTrail) só por causa do "…" expansível no celular; o JSON-LD continua aqui.
export function Breadcrumbs({
  breadcrumbs,
  breadcrumbsJsonLd,
}: {
  breadcrumbs: BreadcrumbItem[];
  breadcrumbsJsonLd: Record<string, unknown> | null;
}) {
  if (breadcrumbs.length === 0) return null;

  return (
    <>
      <nav aria-label="Breadcrumb" data-shell-region="breadcrumbs" className="mx-auto w-full max-w-6xl px-4 pt-5 sm:px-6 lg:px-8">
        <BreadcrumbTrail breadcrumbs={breadcrumbs} />
      </nav>
      {breadcrumbsJsonLd && (
        <script
          type="application/ld+json"
          // JSON-LD só pode ir pro DOM assim. Os rótulos vêm de conteúdo editado por usuários
          // (título de entry, nome de arquivo) — serializeJsonLd escapa `<` pra não fechar a tag.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbsJsonLd) }}
        />
      )}
    </>
  );
}
