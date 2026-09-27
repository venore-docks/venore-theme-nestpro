# Revisão do tema NestPro — 4. O que foi implementado

Implementação aprovada em 27/09/2026 ("OK, de acordo com os documentos. Pode implementar."),
publicada como **v0.3.0** no `main` deste repositório. Validação: `scripts/check-with-core.sh`
contra o core v0.6.0 (typecheck, lint com as regras do core e 56 testes, todos passando).

Legenda: ✅ feito · 🟡 parcial · ⏸️ depende de decisão ou de mudança fora deste repositório.

## Problemas

| # | Status | O que mudou |
|---|---|---|
| P1 | ⏸️ | Mexe em produção. Falta criar a tag `v0.3.0` e fazer o bump na branch `nestpro` do core, que também precisa de `git merge main` antes (está 23 commits atrás e não tem `/busca` nem `@venore/theme-sdk/json-ld`). Aguarda o ok do Adoniran. |
| P2 | ✅ | `HeaderSlot` respeita `showLoginLink`. |
| P3 | ✅ | `FooterSlot` mostra "Entrar" quando `loginLinkHref` vem preenchido. |
| P4 | ✅ | `capabilities: { headerBehavior: true }` no manifesto. |
| P5 | ✅ | Botão de colapso com `z-50`. |
| P6 | ✅ | `serializeJsonLd` de `@venore/theme-sdk/json-ld`. |
| P7 | ✅ | O link de notificação tem `aria-label` e `title` em qualquer largura. |
| P8 | ✅ | O drawer fechado abaixo de `lg` recebe `inert`. |
| P9 | ✅ | O drawer fecha quando a janela passa para `lg` (listener de `matchMedia`). |
| P10 | ✅ | O menu do usuário fecha com Escape (devolvendo o foco) e ao mudar de rota. |
| P11 | ✅ | O header-nav usa `Link` (`HeaderNavLink`), link externo abre em nova aba e a nav só aparece a partir de `md`. |
| P12 | ✅ | `isSectionOf`: subpágina marca o item da seção. `/` nunca conta como seção. |
| P13 | ✅ | O accordion abre ao navegar para dentro dele (ajuste de estado no render). |
| P14 | ✅ | `--chart-6` em teal (190) nos dois modos. |
| P15 | ✅ | Manifesto e `package.json` em 0.3.0, com um teste que garante a igualdade. |
| P16 | ✅ | Testes, CI e script de checagem (ver R1/R2). |
| P17 | ✅ | Comentários reescritos com base no código atual. |
| P18 | 🟡 | `text-[11px]` virou `text-xs` e a largura do rótulo deriva de `--sidebar-width-expanded`. O `w-[calc(50%-0.125rem)]` do alternador ficou, porque é geometria do componente, não decisão de design. |

## Recursos

| # | Status | O que mudou |
|---|---|---|
| R1 | ✅ | 4 arquivos de teste com 56 testes: os 3 portados do Slime e `revisao-2026-09.test.tsx`, que cobre cada item desta revisão. |
| R2 | ✅ | `.github/workflows/ci.yml` faz checkout do core, `npm ci` e roda `scripts/check-with-core.sh` (tsc, ESLint do core com `--max-warnings=0` e Vitest). |
| R3 | 🟡 | Os componentes foram ressincronizados com o Slime do core v0.6.0. O `SLIME_BASE` está no README e `scripts/diff-slime.sh` mostra o que mudou desde então. A alternativa de o core exportar o Shell do Slime pelo SDK depende de mudança no core e fica como proposta. |
| R4 | 🟡 | Ícone de busca no header apontando para `/busca`. O ideal é o core expor `searchHref` no contrato (proposta, depende do core). |
| R5 | ✅ | Sino com badge numérico (`9+` acima de 9). |
| R6 | ✅ | "Pular para o conteúdo" no início do `Shell`, com alvo em `<main id="conteudo">`. |
| R7 | ⏸️ | A identidade própria (tipografia, raio, sidebar escura do NestPro original) é uma decisão de design e não entrou aqui. A paleta "Institucional" é um primeiro passo. |
| R8 | ✅ | O traço de acento do rodapé usa `brand.color`. |
| R9 | ✅ | `README.md` e `CHANGELOG.md`. |
| R10 | ✅ | Paletas curadas "Institucional" e "Alto contraste" antes das 4 rotações de matiz. |
| R11 | ✅ | `@media print` no `theme.css`: esconde as regiões marcadas com `data-shell-region` e deixa o fundo branco. |
| R12 | ✅ | O crédito do rodapé virou link para `https://venore-docks.vercel.app`, a homepage do repositório do core. |

## UX

| # | Status | O que mudou |
|---|---|---|
| U1 | ✅ | Alternador Site/Admin com `useFormStatus` (spinner e desabilitado durante o envio). |
| U2 | ✅ | Header com `h-16` no celular e `lg:h-24` no desktop. Rolado: `h-14` / `lg:h-16`. |
| U3 | ✅ | Header-nav escondido abaixo de `md`. Os itens aparecem no topo do drawer. |
| U4 | ✅ | Item da seção atual em `text-primary`, sem fundo. |
| U5 | 🟡 | Setas, Home/End, Escape e fechamento ao navegar, mais ícone e separação em "Sair". O `DropdownMenu` do shadcn não está exposto no `@venore/theme-sdk/ui`, por isso o `<details>` foi mantido. |
| U6 | ✅ | "Entrar" é um botão primário. |
| U7 | 🟡 | Backdrop com fade e `role="dialog"`/`aria-modal`/`aria-label` quando aberto. Não entrou o gesto de arrastar para fechar. |
| U8 | ✅ | Clicar num agregador com a sidebar colapsada expande a sidebar e abre o grupo. |
| U9 | ✅ | Ver P7/R5. |
| U10 | ✅ | Mensagens "Nenhum item no menu ainda." e "Nenhuma seção administrativa disponível.". |
| U11 | ✅ | O "…" da trilha virou um botão que expande a trilha (`BreadcrumbTrail`). |
| U12 | 🟡 | O botão de colapso fica com 70% de opacidade fora do hover/foco da sidebar. O tamanho continua `size-11` porque o spec do core exige alvo de toque de 44px, e o teste portado do Slime cobre isso. |
| U13 | ✅ | Marca do rodapé com `size × 1.25` em vez de `scale-125`. |
| U14 | ✅ | `--accent` claro passou de `oklch(0.88 0.09 235)` para `oklch(0.9 0.055 235)`. O contraste com `accent-foreground` continua alto (L 0.9 contra 0.28). [UNCERTAIN] o resultado visual: validar no navegador. |

## Não verificado

A validação foi por typecheck, lint e testes de markup (SSR). Nada foi aberto num navegador:
animações, `inert`, impressão e o visual das paletas novas precisam de uma olhada numa instância
de preview antes do bump em produção.
