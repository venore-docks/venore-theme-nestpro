# Changelog

## v0.3.0 — 27/09/2026

Implementa a [revisão de 27/09/2026](docs/revisao/). Requer core >= v0.6.0.

### Correções
- "Entrar" respeita `showLoginLink` e aparece no rodapé quando `loginLinkHref` vem preenchido.
- Manifesto declara `capabilities.headerBehavior`, então `/admin/themes` volta a mostrar o formulário de header.
- Botão de colapso da sidebar fica acima do header fixo (`z-50`).
- JSON-LD da trilha passa por `serializeJsonLd`.
- Alerta de notificação tem nome acessível no celular.
- Drawer fechado fica `inert` (o Tab não passa mais por links invisíveis) e fecha ao virar desktop, soltando a rolagem.
- Menu do usuário fecha com Escape e ao navegar, e ganhou navegação por setas.
- Header-nav usa `Link` (sem recarregar a página) e abre links externos em nova aba.
- Item da sidebar fica destacado também em subpáginas, e o accordion abre ao navegar para dentro dele.
- `--chart-6` saiu do azul de marca (teal, 190).
- A versão do manifesto passa a acompanhar a do `package.json`.
- Comentários desatualizados corrigidos. A largura do rótulo da sidebar agora deriva de `--sidebar-width-expanded`.

### Novidades
- Busca no header, contador no alerta de notificação, link "Pular para o conteúdo" e crédito do rodapé com link para o site do projeto.
- Paletas curadas "Institucional" e "Alto contraste".
- Estilos de impressão.
- Testes (56), CI, README, scripts `check-with-core.sh` e `diff-slime.sh`.

### UX
- Estado de carregamento no alternador Site/Admin.
- Header mais baixo no celular (`h-16`).
- "Entrar" como botão primário.
- Header-nav vai para o drawer abaixo de `md`.
- Backdrop do drawer com fade, `role="dialog"`.
- Agregador clicado com a sidebar colapsada expande a sidebar.
- Mensagem de menu vazio.
- "…" da trilha expansível no celular.
- Botão de colapso mais discreto fora do hover.
- Marca do rodapé dimensionada sem `transform`, e traço de acento na cor de marca.
- `--accent` claro com croma menor.

## v0.2.1
- Link externo no main-nav abre em nova aba.

## v0.2.0
- Matiz azul "Delft blue" sobre o Shell do Venore Slime.

## v0.1.x
- Scaffold do tema e correções de marca e alerta de notificação.
