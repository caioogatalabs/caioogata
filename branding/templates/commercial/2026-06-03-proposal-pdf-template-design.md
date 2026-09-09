# Spec — Template de Proposta Comercial (PDF) com o Design System V2

> **Atualização 2026-06-09 (implementado):** O template foi refinado para servir de base ao agente `briefing-proposal-skill`, espelhando o modelo do Figma (frame 912:93).
> - **Tipografia = Epilogue + JetBrains Mono** (V2 padrão; **Fabio XM foi substituído — não usar**).
> - **Marca na capa = COLab** (não mais a marca pessoal); conteúdo em `institutional.json`.
> - **Página 1200×1697px** (proporção A4) p/ bater 1:1 com o Figma; grid: margem 62, gutter 16, col 75, label cols 1‑2 + conteúdo cols 3‑12. Tabelas: Item 209 (escopo) / Ferramenta 257 (stack) → 3ª coluna na col 6.
> - **Coluna de Valor por item + fechamento (Invoice):** `render.py compute_pricing()` configurável via `meta` (`hourly_rate`=120, `tax_pct`=0.20, `dilution_months`=12). Itens `exempt_if_with_website` → "incluído"; setup diluído na mensalidade; imposto sobre (serviço+diluído); Total/mês. Bloco de termos de pagamento incluído.
> - Substitui o `generate_proposal_pdf.py` (reportlab). Cópia em `briefing-proposal-skill/templates/commercial/`.
> Detalhes vivos na memória `proposal-figma-port.md`. O texto abaixo é o design original (V1 do template).

---


**Data:** 2026-06-03
**Pillar canônico:** `branding/templates/commercial/`
**Consumidor:** agente Python `briefing-proposal-skill` (em `~/ClaudeWorkspace/briefing-proposal-skill`)
**Escopo desta spec:** template de **PROPOSTA**. O template de **invoice** é follow-up (reusa a mesma base) e está fora desta spec.

---

## 1. Objetivo

Substituir o template de proposta atual (reportlab, Courier, fundo creme) por um template **fiel ao design system V2 do site** — grid 12 colunas, tipografia Epilogue + JetBrains Mono, tokens OKLCH, direção "Architectural Brutalism" — renderizado como PDF A4 para enviar a clientes.

O documento abre com uma **capa institucional** (quem é o Caio, para gerar confiança, espelhando o header do site) e, a partir da página 2, apresenta a proposta do projeto.

---

## 2. Arquitetura e pipeline

**Motor:** HTML/CSS renderizado por **Chromium headless via Playwright** (`page.pdf`). Escolhido por reproduzir 1:1 o design system do site (CSS Grid nativo, OKLCH, web fonts variáveis) — o mesmo motor que renderiza o site. Trade-off (binário do browser, processo por render) é irrelevante no contexto: roda local, baixo volume.

**Fluxo:**
```
proposta-<projeto>.json  ─┐
institutional.json       ─┼─► Jinja2 (render) ─► proposal.html ─► Playwright page.pdf ─► proposta-<projeto>.pdf
proposal.css + fonts     ─┘
```

**Arquivos (canônico em `branding/templates/commercial/`):**
```
branding/templates/commercial/
├── proposal.html.j2     # template Jinja2
├── proposal.css         # design system para print (tokens + grid + @page)
├── institutional.json   # conteúdo institucional estável (espelha o site)
├── render.py            # Jinja2 + Playwright → PDF
├── fonts/
│   ├── Epilogue-Variable.woff2
│   └── JetBrainsMono-Variable.woff2
└── assets/
    └── logo-co.svg
```
A skill `briefing-proposal-skill` recebe uma **cópia** desses arquivos (convenção do monorepo: `branding/` é fonte canônica, consumidores recebem cópias). `render.py` substitui o `generate_proposal_pdf.py` baseado em reportlab.

**Dependências do agente:** `pip install playwright jinja2` + `playwright install chromium` (substitui `reportlab`/`pypdf`/`Pillow`).

---

## 3. Design tokens (mapeados para print)

Fonte da verdade: `site/src/tokens/primitives.css` + `site/src/tokens/semantic.css`. O `proposal.css` importa/replica esses valores. Tema **light**, mas adaptado para papel (não o cinza médio `neutral-200` do site — página inteira em cinza fica pesada para impressão).

| Papel | Token | Valor |
|-------|-------|-------|
| Fundo (papel) | near-white | `neutral-50` — `oklch(0.93 0.003 270)` |
| Tinta (texto) | `--color-text-primary` (light) | `neutral-800` — `oklch(0.10 0.004 270)` |
| Texto secundário | `--color-text-secondary` (light) | `neutral-600` |
| Linhas/réguas | `--color-border` | `neutral-300` |
| Acento gráfico | brand yellow | `oklch(0.91 0.17 96)` (`#FAEA4D`) |

**Regra do amarelo:** acento **gráfico apenas** (réguas, marcadores `→`, bloco da capa, régua do Total, caixas `[ ]`). **Nunca em texto** — amarelo sobre near-white falha contraste. Espelha o "fathers" usando vermelho só em logo/rodapé.

**Tipografia (a combinação das duas):**
- **JetBrains Mono** → eyebrows `→ SEÇÃO`, headers de tabela, números (`font-variant-numeric: tabular-nums`), meta (data·versão·página), tags, custo. *(padrão "fathers")*
- **Epilogue** → título da capa (Display), frase-destaque da bio, headings de categoria, todo texto de leitura/explicação em colunas. *(padrão "Virtu Legal")*
- Escala: usar as variáveis `--text-display-md/lg`, `--text-heading-lg/md/sm`, `--text-body-lg/md/sm`, `--text-label-lg/sm` de `semantic.css`.

**Grid:** CSS Grid 12 colunas, `gap: 20px`; container = área útil da página (margens do `@page`). Spans válidos: 6-6, 4-4-4, 3-3-3-3, 8-4, 10-2.

---

## 4. Setup de página

```css
@page {
  size: A4;
  margin: 18mm 16mm 20mm;
  @bottom-left  { content: "www.caioogata.com"; }     /* site em destaque */
  @bottom-right { content: "<data> · v<versão> · " counter(page); }
}
```
- Rodapé corrido (páginas ≥ 2): **`www.caioogata.com`** (esq, destaque) · `data · versão · página` (dir), JetBrains Mono pequeno, régua fina amarela no topo do rodapé.
- **Sem** linha de localização/relocação (enquadramento de busca de emprego não cabe em proposta comercial).
- Render no Playwright com `printBackground: true` e `displayHeaderFooter` desligado (rodapé via CSS `@page`/running elements, para herdar fontes/tokens).

---

## 5. Página 1 — Capa institucional

Conteúdo **estável**, vem de `institutional.json` (espelha o site; editável sem tocar no template). Não é específico do projeto.

**Layout (top → bottom):**

1. **Topbar (espelha o header do site):** monograma **CO** (`logo-co.svg`, esq) · links mono à direita com **`www.caioogata.com`** em destaque + `LinkedIn · GitHub · caioogata.labs@gmail.com`. Régua fina embaixo.
2. **Welcome + AI** (mono): `Welcome to Caio Ogata Portfolio` / `This project is built for humans and AI assistance.`
3. **Tags** (eyebrow mono): `Design Director · Design Systems & Developer Experience · Design Engineering`
4. **Destaque — frase da bio** (Epilogue Display, span 10), centro da página:
   > *"My work bridges brand strategy, product craft, and technical implementation — designing and building at the intersection of design systems, developer experience, and product engineering, where craft and technical rigor reinforce each other rather than compete."*
5. **Bloco de confiança** (2 colunas, 6-6, Epilogue body):
   - **Esq — experiência:** parágrafo curto (de `about`/`hero.summary`): 15 anos em UI; 4 anos como Developer Experience Director em edge platform global; Azion (Design Director → Brand Experience → DevEx Director); antes, Huia/Stefanini.
   - **Dir — clientes:** `clients.shortDescription` + lista em mono: `Petrobras · O Boticário · Itaú · Magalu · Netshoes · Tramontina · Sicredi · Mondelez · LG · Novartis …`
6. **Caixas de stat** (opcional, padrão Virtu, colchetes amarelos): `[ 15 anos UI ]  [ 6.000+ commits ]  [ Open source em produção: Itaú · Magalu · Netshoes ]`

**`institutional.json` (fonte: `site/src/content/en.json`):**
```json
{
  "logo": "assets/logo-co.svg",
  "welcome": "Welcome to Caio Ogata Portfolio",
  "ai_note": "This project is built for humans and AI assistance.",
  "tags": ["Design Director", "Design Systems & Developer Experience", "Design Engineering"],
  "links": { "site": "www.caioogata.com", "linkedin": "...", "github": "...", "email": "caioogata.labs@gmail.com" },
  "bio_highlight": "My work bridges brand strategy...",
  "experience_blurb": "15 anos em UI...",
  "clients_blurb": "Two decades of work for brands across Brazil and beyond.",
  "clients": ["Petrobras", "O Boticário", "Itaú", "Magalu", "Netshoes", "..."],
  "stats": [{ "label": "anos UI", "value": "15" }, { "label": "commits", "value": "6.000+" }]
}
```

---

## 6. Página 2+ — A proposta

Quebra de página forçada após a capa (`break-before: page`). Abre com o **cabeçalho do projeto** (o meta que antes era a capa):

> `Proposta` (label mono) · **`meta.title`** (Epilogue Heading LG) · linha mono `Preparado por: meta.prepared_by · Cliente: meta.client · meta.date · v meta.version`

Seguido imediatamente por `→ VISÃO GERAL`. Da página 2 em diante, o layout aprovado:

| # | Seção | Referência | Layout (spans) | Fonte no JSON |
|---|-------|-----------|----------------|---------------|
| Header projeto | meta | — | título + linha mono | `meta` |
| 1 | Visão Geral | Virtu | `→ VISÃO GERAL`. `context` lead (span 8) + `objective` (span 4) | `overview` |
| 2 | Proposta de Valor | Virtu | `→ PROPOSTA DE VALOR`. `value_proposition` em 2 col (6-6); frase-chave como lead | `value_proposition` |
| 3 | Escopo | fathers | `→ ESCOPO`. Por categoria: nome (Epilogue Heading) + tabela `# · Item · Descrição`. `#` mono, item/desc Epilogue. Tag "opcional"/cadência quando houver. **Horas nunca aqui** | `categories[]` |
| 4 | Stack Técnica | fathers | `→ STACK`. Tabela `Ferramenta · Função · Custo` (custo como tag mono) | `stack.tools[]` |
| 5 | Fora do Escopo | fathers | `→ FORA DO ESCOPO`. Lista com marcador `×`, Epilogue body | `exclusions[]` |
| 6 | Valores e Condições | fathers totals | `→ VALORES`. Linhas à direita (label + valor mono tabular); **Total** com régua amarela/bold. Setup + Mensalidade no modelo recorrente | `commercial.lines/payment/note` |
| 7 | Timeline | fathers | `→ TIMELINE`. Marcos (label + prazo). **Só se existir no JSON** | `timeline` (opcional) |
| 8 | Próximos Passos | Virtu | `→ PRÓXIMOS PASSOS`. Lista numerada Epilogue. **Só se existir** | `next_steps` (opcional) |
| 9 | Estimativa de Horas | fathers + Virtu | **Só se `meta.include_hours`**. Tabela final `Item · Setup(h) · Mensal(h)` + totais; totais também em caixas `[ ]`: `[ 4h setup ] [ 14h/mês ]` | `categories[].items[].*_hours`, `totals` |

---

## 7. Modelo de dados (input) e variações

Input = **JSON da proposta final** (não os `products/*.json` do catálogo). Shape de referência: `proposta-site-gerenciado-inteligencia.json`.

Campos: `meta` (`label, prepared_by, client, date, version, include_hours, title`), `overview` (`context, objective`), `value_proposition`, `product_model`, `categories[]` → `items[]`, `stack.tools[]`, `totals`, `exclusions[]`, `commercial` (`lines[], payment, note`).

**Variações que o template DEVE tratar:**
1. **Modelo:** `product_model == "recorrente_mensal"` → seção Valores mostra Setup + Mensalidade; tabela de horas tem colunas Setup(h)/Mensal(h). Caso contrário (projeto one-time) → valor fechado; horas como coluna única `hours` se presente.
2. **Horas por item em 3 formatos:** (a) ausente → sem coluna de horas; (b) `hours` (número único, ex. website-single-page); (c) `setup_hours` + `monthly_hours` (recorrente). A seção 9 adapta as colunas conforme o formato presente.
3. **`meta.include_hours`** → toggle da seção 9 inteira (entra ou não no PDF do cliente).
4. **`optional: true`** em item → tag "opcional". **`exempt_if_with_website`** → nota quando aplicável.
5. **Seções opcionais** (`timeline`, `next_steps`) → renderizam só quando presentes e não-vazias.
6. **`phases`** (produtos de marca) → se presente, pode informar a ordem/agrupamento do escopo (tratar como metadado; não quebra o layout por categoria).

**Regras de conteúdo herdadas da SKILL.md (mantidas):**
- Nunca escrever notas internas no documento (nada de "estimativa interna", "pode ser omitido").
- Proposta única (sem opção A/B).
- PT-BR por padrão, profissional e acessível.
- Horas sempre como **tabela única ao final**, nunca inline no escopo.

---

## 8. Robustez (print)

- Tabelas que quebram página: `thead { display: table-header-group }` (repete header) + `tr { break-inside: avoid }`.
- Seções: `break-inside: avoid` em blocos curtos; headings com `break-after: avoid`.
- Fontes variáveis woff2 self-hosted via `@font-face` (sem dependência de rede no render).
- `printBackground: true` no Playwright (acentos amarelos e fundos pintam).
- Imagens/SVG (logo) embutidos por caminho local absoluto ou data-URI.

---

## 9. Fora de escopo (follow-ups)

- **Template de invoice** — reusa base (tokens, fonts, @page, rodapé, capa institucional opcional); estrutura própria (info de cobrança, tabela de itens com Qty/Unit/Cost, totais com impostos). Spec separada.
- **Briefing operacional** (`generate_briefing_pdf.py`) — migração análoga para o novo motor; fora desta spec.
- Logos de clientes como imagens (em vez de texto) na capa — possível evolução; por ora, texto.

---

## 10. Critérios de aceite

1. `render.py <proposta.json> <out.pdf>` gera um A4 com capa institucional (pág. 1) + proposta (pág. 2+).
2. Tipografia Epilogue + JetBrains Mono renderizadas corretamente (self-hosted), tema light papel, amarelo só como acento.
3. As 3 variações de horas e os 2 modelos (projeto/recorrente) renderizam sem quebrar.
4. `meta.include_hours == false` remove a seção de horas inteira.
5. Tabelas longas repetem header e não cortam linhas no meio.
6. `www.caioogata.com` em destaque no topbar da capa e no rodapé corrido.
7. Visual fiel ao DS do site (validado contra as referências "fathers" p/ tabelas e "Virtu Legal" p/ conteúdo).
