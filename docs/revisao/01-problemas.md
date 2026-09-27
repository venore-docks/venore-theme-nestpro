# Revisão do tema NestPro — 1. Problemas encontrados

Revisão de 27/09/2026 sobre `main` @ `d9c3cdb` (`package.json` 0.2.1), comparada ao core
`venore-docks` v0.6.0 e à cópia de referência do Venore Slime (`src/themes/venore-slime/`).

> Não existe um repositório `venore-plugin-nestpro`: o NestPro é o **tema** `@venore/theme-nestpro`.
> Esta revisão cobre esse tema.

Legenda de confiança: **[CERTAIN]** verificado no código · **[LIKELY]** inferência forte a partir
do código · **[UNCERTAIN]** hipótese que precisa de teste no navegador.

Documentos irmãos: [2. Recursos faltando](02-recursos-faltando.md) ·
[3. Melhorias de UX](03-melhorias-ux.md).

## Resumo

O tema é uma cópia do Venore Slime com o matiz trocado para azul. O problema de fundo é que a
cópia **parou no tempo**: o Slime do core recebeu correções e campos novos do contrato
(`showLoginLink`, `loginLinkHref`, `serializeJsonLd`, `z-50` no botão de colapso, estado pendente
no alternador Site/Admin) e o NestPro não. Além disso, a instância `nestpro` em produção ainda
usa uma tag antiga do tema.

## Tabela

| # | Severidade | Onde | Problema | Impacto | Correção sugerida | Confiança |
|---|---|---|---|---|---|---|
| P1 | Alta | branch `nestpro` do core, `package.json:56` | A instância fixa `@venore/theme-nestpro#v0.1.2`. O repositório já está em `v0.2.1` e o commit `d9c3cdb` (drawer mobile preso aberto) nem tem tag. | Produção não tem o azul "Delft blue" nem a correção do drawer: no celular, depois de navegar por um link do menu, um fundo invisível pode engolir todos os cliques. | Criar a tag `v0.2.2` em `d9c3cdb` e fazer o bump na branch `nestpro` (`chore(nestpro): bump @venore/theme-nestpro para v0.2.2`). | [CERTAIN] |
| P2 | Alta | `components/HeaderSlot.tsx:98-102` | O link "Entrar" é sempre renderizado para visitante; o campo `showLoginLink` do contrato é ignorado. | A configuração `nav.hideLoginLink` do admin não tem efeito com o NestPro ativo. | Ler `showLoginLink` e renderizar `null` quando for `false` (igual ao Slime do core). | [CERTAIN] |
| P3 | Média | `components/FooterSlot.tsx:12` | `loginLinkHref` não é lido, então o link "Entrar" no rodapé nunca aparece. | Somado a P2, a opção "esconder no header e mostrar no rodapé" não funciona nas duas pontas. | Renderizar o `Link` "Entrar" quando `loginLinkHref` não for `null` (copiar do Slime). | [CERTAIN] |
| P4 | Média | `manifest.ts` | O manifesto não declara `capabilities: { headerBehavior: true }`, mas o `HeaderSlot` lê `stickyEnabled`/`scrollShrinkEnabled`. | `/admin/themes` esconde o formulário de comportamento do header (`admin/themes/page.tsx:89`) com o NestPro ativo. O admin fica preso ao valor salvo quando outro tema estava ativo. | Declarar `capabilities: { headerBehavior: true }`. | [CERTAIN] |
| P5 | Média | `components/SidebarLeftSlot.tsx:70` | O botão flutuante de colapso usa `z-10`, abaixo do header `sticky` (`z-40`). O core corrigiu isso no Slime e em aurora/nebula/vega/halo/harbor. | Com header fixo, a seta de colapso aparece cortada ao meio pelo header. | Trocar para `z-50`. | [LIKELY] |
| P6 | Média | `components/Breadcrumbs.tsx:74` | O JSON-LD é serializado com `JSON.stringify` cru. O `@venore/theme-sdk/json-ld` exporta `serializeJsonLd` e diz que todo tema deve usá-lo. | Hoje o core já neutraliza `<`/`>` na origem (`toJsonLdSafeText` em `resolve-breadcrumbs.ts`), então o risco de XSS é baixo. Mas o tema depende de uma defesa que não controla. | Usar `serializeJsonLd` de `@venore/theme-sdk/json-ld`. | [CERTAIN] no código · [LIKELY] risco baixo |
| P7 | Média | `components/HeaderSlot.tsx:81-94` | No celular (abaixo de `sm`) o texto do alerta de notificação fica `hidden` (`display:none`) e o link fica só com spans decorativos. | O link de notificação fica **sem nome acessível** no celular, e o leitor de tela anuncia só "link". | Adicionar `aria-label={notificationAlert.label}` ao `Link` ou trocar `hidden` por `sr-only`. | [CERTAIN] |
| P8 | Média | `components/MobileNavDrawer.tsx:117-126` | Fechado, o drawer só sai da tela com `-translate-x-full` e não usa `inert`/`visibility:hidden`. | Abaixo de `lg`, o Tab do teclado passa por todos os links invisíveis do menu antes de chegar ao conteúdo. | Aplicar `inert` (ou `invisible` com transição) quando fechado abaixo de `lg`. | [CERTAIN] |
| P9 | Baixa | `components/MobileNavDrawer.tsx:89-105` | A trava de scroll do body (`position: fixed`) não observa a mudança de breakpoint. Se a janela passar de `lg` com o drawer aberto, `isOpen` continua `true`. | No desktop, a página fica sem rolar até o usuário recarregar, e o backdrop já está escondido por `lg:hidden`, então não há como fechar. | Fechar o drawer num listener de `matchMedia(OFF_CANVAS_MEDIA_QUERY)`. | [LIKELY] |
| P10 | Baixa | `components/UserMenu.tsx` | O dropdown `<details>` fecha só com clique fora. Ele não fecha com Escape nem ao navegar, e o header não remonta entre páginas. | Depois de clicar em "Minha conta" ou "Administração", o menu continua aberto na página nova. | Fechar em `usePathname()` e em Escape, ou migrar para o `DropdownMenu` do shadcn. | [LIKELY] |
| P11 | Baixa | `components/HeaderSlot.tsx:68-76` | O header-nav usa `<a>` em vez de `Link` e não tem regra responsiva. | Cada clique recarrega a página inteira. No celular, os itens competem com marca e avatar na mesma linha e podem estourar a largura. | Usar `Link`, esconder abaixo de `md` e levar os itens para o drawer. | [CERTAIN] `<a>` · [UNCERTAIN] estouro |
| P12 | Baixa | `components/SidebarNavLink.tsx:29,92` | O item ativo exige `pathname === href`. | Em `/blog/meu-post` o item "Blog" não fica destacado e o usuário perde a referência de onde está. | Considerar ativo também `pathname.startsWith(href + "/")` (exceto `/`). | [CERTAIN] |
| P13 | Baixa | `components/SidebarNavLink.tsx:36` | O accordion de agregador lê `useState(isActiveAncestor)` só na montagem. | Numa navegação client-side para o filho de outro agregador, o grupo novo não abre. | Sincronizar com `useEffect` quando `isActiveAncestor` virar `true`. | [LIKELY] |
| P14 | Baixa | `theme.css:119,240` | `--chart-6` usa o mesmo matiz (235) do `--primary`/`--chart-1`. No escuro, os dois têm L 0.62. O próprio comentário do topo diz que o chart-2 saiu do azul para não colidir, mas o chart-6 ficou. | As séries 1 e 6 de um gráfico ficam quase indistinguíveis. | Mover o `--chart-6` para outro matiz, como teal (~190) ou violeta (~290). | [CERTAIN] valores · [LIKELY] visual |
| P15 | Baixa | `manifest.ts:6` × `package.json:3` | O manifesto declara `version: "0.2.0"` e o pacote está em `0.2.1`. | `/admin/themes` mostra uma versão diferente da instalada. | Manter as duas em sincronia a cada release. | [CERTAIN] |
| P16 | Baixa | repositório inteiro | Não há testes, lint, typecheck nem CI. O Slime do core tem `HeaderSlot.test.tsx`, `SidebarLeftSlot.test.tsx` e `Breadcrumbs.test.tsx`. As regras de cor/fronteira do `eslint.config.mjs` do core não rodam aqui (é o gap "lint de fronteira nos repositórios dos plugins" do AGENTS.md). | Regressões como P2 a P5 passam sem aviso. | Ver [recursos R1 e R2](02-recursos-faltando.md). | [CERTAIN] |
| P17 | Baixa | `HeaderSlot.tsx:15-18`, `FooterSlot.tsx:7-11`, `manifest.ts:9`, `theme.css:1-7` | Os comentários estão desatualizados. O header é descrito como `h-16/lg:h-20` → `h-14`, mas o código usa `h-20/lg:h-24` → `h-16`. O rodapé diz que pinta com `brand.color`, mas usa `bg-primary/40`. Também há "desta sessão" em vários lugares. | Leva quem mantém o código a decisões erradas. | Reescrever os comentários com base no código atual. | [CERTAIN] |
| P18 | Baixa | `SidebarLeftSlot.tsx:116,184`, `sidebar-collapse-tooltip.ts:15` | Há valores arbitrários (`text-[11px]`, `max-w-[180px]`, `w-[calc(50%-0.125rem)]`). A regra do projeto proíbe tamanho/espaçamento cru, mas sem enforcement. | Os valores não acompanham `--sidebar-width-expanded` se o tema mudar a largura. | Derivar de variáveis do tema (`calc(var(--sidebar-width-expanded) - …)`) e usar a escala de tipo. | [CERTAIN] |
