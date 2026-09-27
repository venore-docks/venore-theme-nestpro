# Revisão do tema NestPro — 3. Melhorias de UX

Revisão de 27/09/2026 sobre `main` @ `d9c3cdb`. Leitura de código, sem teste em navegador. Por isso
itens visuais trazem a confiança marcada.
Legenda: **[CERTAIN]** verificado · **[LIKELY]** inferência · **[UNCERTAIN]** hipótese.

Documentos irmãos: [1. Problemas](01-problemas.md) · [2. Recursos faltando](02-recursos-faltando.md) · [4. O que foi implementado](04-implementacao.md).

| # | Impacto | Onde | Situação atual | Melhoria proposta | Confiança |
|---|---|---|---|---|---|
| U1 | Alto | `SidebarLeftSlot.tsx` (alternador Site/Admin) | Clicar em "Site"/"Admin" dispara uma Server Action sem nenhum retorno visual até a página trocar. Em rede lenta, parece que nada aconteceu e o usuário clica de novo. | Estado pendente com `useFormStatus` (spinner no segmento, botão desabilitado), como o Slime do core já faz com `NavModeSegmentButton`/`NavModeIconButton`. | [CERTAIN] |
| U2 | Alto | `HeaderSlot.tsx:46` | O header tem `h-20` no celular e `h-24` no desktop, e só encolhe para `h-16` depois de 96px de rolagem. No celular, são 80px fixos de 640-700px de tela. | `h-16` no celular e `lg:h-20`/`lg:h-24` a partir de `lg`. | [CERTAIN] valores · [LIKELY] percepção |
| U3 | Alto | `HeaderSlot.tsx:68-76` | O header-nav aparece em qualquer largura, espremido entre marca e avatar. | Esconder abaixo de `md` e mostrar esses itens no topo do drawer mobile. | [LIKELY] |
| U4 | Médio | `SidebarNavLink.tsx` | O item ativo só é destacado com a URL exata (ver P12). Em subpáginas, nada na sidebar indica onde o usuário está. | Destaque também para o ancestral da rota atual (mesmo `text-primary` do agregador ativo, sem o fundo). | [CERTAIN] |
| U5 | Médio | `UserMenu.tsx` | Não há setas do teclado entre itens, nem fechamento com Escape ou ao navegar. "Sair" não pede confirmação e fica logo abaixo dos outros itens. | Usar o `DropdownMenu` do shadcn (teclado, foco e fechamento prontos) e separar "Sair" visualmente com ícone. | [CERTAIN] |
| U6 | Médio | `HeaderSlot.tsx:99-101` | "Entrar" é um texto `text-xs` maiúsculo e cinza (`text-muted-foreground`), o elemento de menor destaque do header, mas é a principal ação para visitante. | Botão `bg-primary text-primary-foreground` pequeno, ou pelo menos contorno `border-ring`. | [LIKELY] |
| U7 | Médio | `MobileNavDrawer.tsx` | O backdrop aparece e some de uma vez (`{isOpen && …}`) enquanto o painel desliza. Falta `role="dialog"`/`aria-modal`, e não dá para fechar arrastando. | Transição de opacidade no backdrop (mantido montado com `opacity-0 pointer-events-none`), `role="dialog" aria-modal="true" aria-label="Navegação"` e, opcionalmente, deslizar para fechar. | [CERTAIN] |
| U8 | Médio | `SidebarNavLink.tsx:81-87` (sidebar colapsada) | Com a sidebar colapsada, abrir um agregador empilha os ícones dos filhos logo abaixo, sem recuo nem rótulo, e fica difícil saber o que é filho de quê. | No modo colapsado, abrir os filhos num flyout lateral (mesmo estilo do tooltip) em vez do accordion. | [LIKELY] |
| U9 | Médio | `HeaderSlot.tsx:81-94` | O alerta de notificação no celular é só um ponto pulsante, sem número nem texto (e sem nome acessível, ver P7). | Ícone de sino com badge numérico (R5), com rótulo textual a partir de `sm`. | [CERTAIN] |
| U10 | Baixo | `SidebarLeftSlot.tsx:134-137` | Menu vazio mostra só "—". | Mensagem curta, por exemplo "Nenhum item no menu". Para admin, um link para o editor de menus do CMS. | [CERTAIN] |
| U11 | Baixo | `Breadcrumbs.tsx` | No celular, os itens do meio viram um "…" que não é clicável. | Tornar o "…" um botão que expande a trilha completa. | [CERTAIN] |
| U12 | Baixo | `SidebarLeftSlot.tsx:70-84` | O botão de colapso (`size-11`) fica metade para fora da sidebar, sobre a borda do conteúdo, e aparece o tempo todo. | Mostrar só no hover/foco da sidebar (sempre visível para teclado via `focus-within`) e reduzir para `size-8` com área de toque preservada por padding. | [UNCERTAIN] gosto |
| U13 | Baixo | `FooterSlot.tsx:17` | A marca do rodapé usa `scale-125` com `origin-left` dentro de um `max-w-40`. O `transform` não ocupa espaço no layout, então a marca pode encostar ou passar da borda do painel. | Dimensionar pela altura (`size`) em vez de `scale`. | [UNCERTAIN] |
| U14 | Baixo | `theme.css` (modo claro) | O `--accent` claro `oklch(0.88 0.09 235)` é bem saturado para uma cor de fundo de destaque. Ao lado do `--primary`, o azul domina a página. | Testar `--accent` com croma ~0.05 no claro e validar contraste de `accent-foreground` (≥ 4.5:1). | [UNCERTAIN] |
