# @venore/theme-nestpro

Tema do [Venore Docks](https://github.com/venore-docks/venore-docks) com a identidade do NestPro:
azul "Delft blue" (`oklch(0.5 0.135 235)`), modos claro e escuro, Shell com header, sidebar de
navegação e rodapé com sitemap.

## Requisitos

- Core **>= v0.6.0**: o tema usa `@venore/theme-sdk/json-ld` e aponta a busca para `/busca`,
  que só existem a partir dessa versão. Uma instância abaixo disso precisa de `git merge main`
  antes do bump do tema, senão o build falha (o deploy anterior continua no ar).
- Contrato de tema `7.0.0`.

## Instalação numa instância

No `package.json` do branch da instância:

```json
"@venore/theme-nestpro": "git+https://github.com/venore-docks/venore-theme-nestpro.git#vX.Y.Z"
```

Commit no padrão `chore(nestpro): bump @venore/theme-nestpro para vX.Y.Z` (AGENTS.md §8 do core).
Depois do deploy, ativar em `/admin/themes`.

## O que o tema suporta

| Recurso | Onde se configura |
| --- | --- |
| Header fixo e encolhimento ao rolar (`capabilities.headerBehavior`) | `/admin/themes` |
| Esconder "Entrar" do header e mostrar no rodapé | Configurações de navegação do core |
| Paletas: Institucional, Alto contraste e 4 rotações de matiz | `/admin/settings/brand` |
| Menu principal com agregadores (accordion), menu admin por seções | Editor de menus do CMS |
| Busca (ícone no header → `/busca`) | — |
| Alerta de notificação com contador | Plugins que publicam alertas (ex.: Academy) |
| Link "Pular para o conteúdo", impressão só do conteúdo | — |

## Relação com o Venore Slime

O Shell (`components/`) é derivado do Venore Slime do core (`src/themes/venore-slime/`), com os
imports trocados para `@venore/theme-sdk` e as mudanças listadas no [CHANGELOG](CHANGELOG.md).
Último sincronismo com o core: `SLIME_BASE=9c104892a749e476895b0daea472c61098e16bf6` (v0.6.0).

A cada release do core, rodar `scripts/diff-slime.sh` para ver o que mudou no Slime e no
contrato desde esse commit. Depois de portar, atualizar o `SLIME_BASE` acima.

## Desenvolvimento

O tema não tem dependências próprias. Tudo vem do core, como acontece numa instância:

```bash
git clone https://github.com/venore-docks/venore-docks ../venore-docks
(cd ../venore-docks && npm ci --ignore-scripts)
scripts/check-with-core.sh   # typecheck + lint com as regras do core + testes
```

O mesmo script roda no CI (`.github/workflows/ci.yml`).

## Revisões

- [docs/revisao/](docs/revisao/): revisão de 27/09/2026 (problemas, recursos, UX) e o que foi
  implementado a partir dela.
