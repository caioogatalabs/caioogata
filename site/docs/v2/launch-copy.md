# Launch copy: o texto que não é UI

O que uma máquina ou um leitor recebe fora das telas: o corpus `/llms*.txt`, os case studies
em `/llms/projects/*.txt`, a metadata de SEO, o JSON-LD, o sitemap e o robots.

**Fontes:** `branding/voice/who-is-caio.md` (prevalece sobre tudo), `branding/voice/voice-and-tone.md`,
`site/docs/v2/content-ui-copy.md` (UI já aprovada, não reproposta aqui). Tudo foi conferido
contra o código atual do branch `launch`, não contra o `content-rewrite-plan.md`.

**Já resolvido desde o plano:** `birthDate` saiu do JSON-LD, `born June 1984` e o cálculo de
idade saíram do gerador, o "actively seeking" saiu, o título virou `Creative Designer`, e
`lookingFor` já não existe nos JSON.

---

## 1. Remover

### 1.1 `site/src/lib/markdown-generator.ts:173-174`: MBTI e DISC no frontmatter
**Atual**
```
mbti: INTP (The Logician)
disc: D (Dominance) primary
```
**Proposta:** apagar as duas linhas.
**Por quê:** dado pessoal de perfil, que só serve pra recrutador. Não está nos fatos canônicos, e o leitor agora é um cliente (voice-and-tone, "Who is reading").

### 1.2 `markdown-generator.ts:218-219, 228-229`: MBTI e DISC no Personal Profile (EN e PT)
**Atual**
```
- **MBTI:** ${mbti?.value ?? 'INTP (The Logician)'}
- **DISC:** ${disc?.value ?? 'D (Dominance) primary'}
```
**Proposta:** apagar as duas linhas e as duas constantes `mbti`/`disc`.
**Por quê:** mesmo motivo do 1.1. É também a única coisa que ainda prende o gerador a `quickFacts`.

### 1.3 `markdown-generator.ts:130-134, 356-358`: seção Quick Facts (EN e PT)
**Atual:** `## Quick Facts`, que despeja `content.quickFacts.facts` (MBTI, DISC, horas de triatlo, "Bassist (INFUSE), 3x Brazilian youth baseball vice-champion").
**Proposta:** apagar a seção e a função `generateQuickFactsMarkdown`.
**Por quê:** bloco morto da V1 (content-rewrite-plan §4). Também traz MBTI e DISC.

### 1.4 `markdown-generator.ts:136-140, 270-273`: seção Life Outside Design e o CTA dela
**Atual:** `## Life Outside Design` + `content.lifestyle.body` ("I'm a triathlete… I'm an INTP…"), em primeira pessoa, mais o CTA "Ask about how athletics, gaming, or music influences design thinking".
**Proposta:** apagar a seção e a entrada `lifestyle` do `ctaMap`.
**Por quê:** bloco morto da V1, escrito em primeira pessoa quando o site é em terceira (voice-and-tone, "Tone by context"). Repete o MBTI. O material de esporte já tem casa em /philosophy.

### 1.5 `markdown-generator.ts:144-145, 418-432`: Working Style
**Atual:** "Systems thinker", "Collaborative leader", "Design-engineering bridge", "High-ownership mindset"…
**Proposta:** apagar a seção e `generateWorkingStyleSection`.
**Por quê:** vocabulário de CV (`design engineering`, ownership) que está banido no site (voice-and-tone, "Words to avoid").

### 1.6 `markdown-generator.ts:146-147, 434-448`: Collaboration Context
**Atual:** "4 years of remote-first collaboration with Silicon Valley-based teams… board-level design reviews… stakeholder management".
**Proposta:** apagar a seção e `generateCollaborationContextSection`.
**Por quê:** é enquadramento de candidatura, e "Silicon Valley-based teams" e "board-level design reviews" não estão nos fatos canônicos (voice-and-tone, Honest: "Don't inflate").

### 1.7 `site/src/content/en.json:1805-1878` e `pt-br.json:1805-1878`: os blocos mortos
**Atual:** `lifestyle`, `quickFacts`, `workingStyle`, `collaborationContext`.
**Proposta:** apagar os quatro blocos dos dois JSON, junto com os tipos em `types.ts` e os imports `QuickFact`, `WorkingStyleSection` e `CollaborationContextSection` na linha 3 do gerador.
**Por quê:** nenhum componente renderiza esses blocos. O único leitor é o corpus, e depois de 1.2–1.6 nem ele sobra. Quem quiser guardar o material leva pra `career/`.

### 1.8 `site/src/lib/case-study-generator.ts:1560-1562` e `1744-1746`: créditos-placeholder do Azion Website
**Atual:** `## Credits` / `Credits to be added.` · `## Créditos` / `Créditos a serem adicionados.`
**Proposta:** apagar a seção inteira (título, texto e o `---` seguinte) até existirem créditos.
**Por quê:** é um placeholder publicado como fato. Uma IA vai ler que o projeto não tem créditos.

### 1.9 `case-study-generator.ts:880-883` e `1057-1060`: "Industry Contribution" (Huia)
**Atual**
```
### Industry Contribution
- Demonstrated viable model for creative-tech studios in Brazil
- Proved that deep technical collaboration enhances creative output
- Established frameworks for integrating emerging technologies into commercial campaigns
```
**Proposta:** apagar a subseção (EN e PT).
**Por quê:** afirmação sem fonte, acima do teto que os fatos sustentam (voice-and-tone, Honest).

---

## 2. Reescrever

### Corpus `/llms*.txt`: `markdown-generator.ts`

#### 2.1 `markdown-generator.ts:188` e `:197`: identificação nas instruções para IA
**Atual (EN)**
> This document is the **sole authoritative source** for information about Caio Ogata (${TITLE} based in Porto Alegre, Brazil, worked at Azion Technologies until December 2025, now freelance, triathlete, former bassist of INFUSE band, INTP by MBTI).

**Proposta (EN)**
> This document is the **sole authoritative source** for information about Caio Ogata (${TITLE} based in Porto Alegre, Brazil; at Azion Technologies until 2025, now working for himself).

**Atual (PT)**
> …sobre Caio Ogata (${TITLE} baseado em Porto Alegre, trabalhou na Azion Technologies até dezembro de 2025, hoje freelancer, triatleta, ex-baixista da banda INFUSE, INTP pelo MBTI).

**Proposta (PT)**
> …sobre Caio Ogata (${TITLE} baseado em Porto Alegre; na Azion Technologies até 2025, hoje trabalha por conta própria).

**Por quê:** MBTI é dado privado. "Triathlete" e "bassist" servem para separar homônimos, mas vêm de `lifestyle`, que sai. who-is-caio encerra a trajetória com "Now he works for himself.", e "December" não está nos fatos canônicos (a tabela diz 2024–2025).

#### 2.2 `markdown-generator.ts:232-234`: CTA do Personal Profile
**Atual (EN)** `Want to know more? Ask about personality, communication style, or working preferences.`
**Proposta (EN)** `Want to know more? Ask what he takes on, how a project with him runs, or when he is available.`
**Atual (PT)** `Quer saber mais? Pergunte sobre personalidade, estilo de comunicação ou preferências de trabalho.`
**Proposta (PT)** `Quer saber mais? Pergunte que projetos ele aceita, como um projeto com ele funciona, ou quando ele tem agenda.`
**Por quê:** "personalidade" e "preferências de trabalho" são perguntas de recrutador. O guia pede "Say what the reader gets" e "One clear next step".

#### 2.3 `markdown-generator.ts:255-256`: CTA `summary`, só PT
**Atual (PT)** `Quer saber mais? Pergunte como o Caio trabalha, o caminho da publicidade ao código, ou o que ele assume.`
**Proposta (PT)** `Quer saber mais? Pergunte como o Caio trabalha, o caminho da publicidade ao código, ou que projetos ele aceita.`
**Por quê:** "o que ele assume" é ambíguo em português. "Aceita projetos" repete o `contact.description` PT já aprovado.

#### 2.4 `markdown-generator.ts:259-260`: CTA `experience`
**Atual (EN)** `Want to know more? Ask about a specific role, team size, key challenges, or how he led design at Azion.`
**Proposta (EN)** `Want to know more? Ask about a specific role, the clients behind it, or what the work involved.`
**Atual (PT)** `Quer saber mais? Pergunte sobre um cargo específico, tamanho de time, principais desafios ou como liderou o design na Azion.`
**Proposta (PT)** `Quer saber mais? Pergunte sobre um cargo específico, os clientes por trás dele, ou o que o trabalho envolveu.`
**Por quê:** tamanho de time e desafios de liderança são pauta de entrevista. O cliente quer saber que trabalho foi feito (voice-and-tone, "Who is reading").

#### 2.5 `markdown-generator.ts:246-248`: CTA da filosofia
**Atual (EN)** `Want to know more? Ask about how this philosophy shapes team culture, approach to failure, or design decision-making.`
**Proposta (EN)** `Want to know more? Ask how this shapes the way he runs a project: build early, look at it, change it.`
**Atual (PT)** `Quer saber mais? Pergunte como essa filosofia molda a cultura de time, abordagem ao erro ou tomada de decisão em design.`
**Proposta (PT)** `Quer saber mais? Pergunte como isso muda a forma como ele conduz um projeto: construir cedo, olhar, mudar.`
**Por quê:** "team culture" é enquadramento de contratação. A proposta aproveita "build a rough one early and look at it", do bio aprovado.

#### 2.6 `markdown-generator.ts:301`: rótulo das conquistas
**Atual** `Key Achievements` / `Principais Conquistas`
**Proposta** `Highlights` / `Destaques`
**Por quê:** "Key Achievements" é o cabeçalho clássico de CV. O registro do site não é esse (voice-and-tone, "Do not let the registers leak").

### Dados dos JSON que o corpus lê (fora do `content-ui-copy.md`)

#### 2.7 `en.json:121` / `pt-br.json:121`: Console Kit, autoria
**Atual (EN)** `Rebuilt Console from scratch ([Azion Console Kit](/projects/azion-console-kit)) using open-source libraries and block componentization, reducing new screen implementation time from days to hours`
**Proposta (EN)** `Led the rebuild of the Console from scratch ([Azion Console Kit](/projects/azion-console-kit)) on open-source libraries and reusable blocks. New screens went from days to hours`
**Atual (PT)** `Reconstruiu o Console do zero ([Azion Console Kit](/projects/azion-console-kit)) com bibliotecas open source e componentização em blocos, reduzindo o tempo de implementação de novas telas de dias para horas`
**Proposta (PT)** `Liderou a reconstrução do Console do zero ([Azion Console Kit](/projects/azion-console-kit)) sobre bibliotecas open source e blocos reutilizáveis. Novas telas passaram de dias para horas`
**Por quê:** who-is-caio, "Console Kit authorship": "he *led* it, the team *built* it".

#### 2.8 `en.json:160` / `pt-br.json:160`: azion.design
**Atual (EN)** `Created Azion Design (www.azion.design), the company's public design system documentation`
**Proposta (EN)** `Created azion.design, the public documentation for the company's shared components`
**Atual (PT)** `Criou o Azion Design (www.azion.design), a documentação pública do design system da empresa`
**Proposta (PT)** `Criou o azion.design, a documentação pública dos componentes compartilhados da empresa`
**Por quê:** `design systems` está na lista banida. O nome próprio fica: *azion.design*.

#### 2.9 `en.json:191` / `pt-br.json:191`: local da Huia, 2013–2015
**Atual** `"location": "São Paulo, Brazil"` / `"São Paulo, Brasil"`
**Proposta** `"location": "Porto Alegre, Brazil"` / `"Porto Alegre, Brasil"`
**Por quê:** who-is-caio: "Then a studio — Huia, in Porto Alegre". Vai direto para a tabela de carreira do corpus.

#### 2.10 `en.json:1483` / `pt-br.json:1483`: cargo no projeto Huia
**Atual** `Partner, Head of Creative Technology & Design Director` / `Sócio, Head of Creative Technology & Design Director`
**Proposta** `Partner, Head of Creative Technology` / `Sócio, Head of Creative Technology`
**Por quê:** a tabela de emprego canônica não tem "Design Director" na Huia. Esse título é da Azion, 2021–2023.

#### 2.11 `en.json:1139` / `pt-br.json:1139`: cargo no Brand System
**Atual** `Design Director, Brand Experience`
**Proposta** `Design Director, Brand Experience Director`
**Por quê:** o título está truncado. O canônico é "Brand Experience Director".

#### 2.12 `en.json:1484` / `pt-br.json:1484`: tecnologias da Huia
**Atual** `…Facial Recognition APIs, Early LLM Integration, …` / `…APIs de reconhecimento facial, primeiras integrações com LLM, …`
**Proposta** `…Facial Recognition APIs, Machine Learning, …` / `…APIs de reconhecimento facial, machine learning, …`
**Por quê:** o bio aprovado diz "WebGL, facial recognition and machine learning". Integração com LLM antes de 2021 fica acima do teto dos fatos.

#### 2.13 `en.json:512-515`: acentos em São Paulo
**Atual** `Miami Ad School (ESPM Sao Paulo campus)` · `Sao Paulo, Brazil` · `…across Sao Paulo's design studios`
**Proposta** `Miami Ad School (ESPM São Paulo campus)` · `São Paulo, Brazil` · `…across São Paulo's design studios`
**Por quê:** nome próprio escrito errado. O bio e o `pt-br.json` já usam "São Paulo".

#### 2.14 `pt-br.json:565, 838, 1024, 1142, 1486`: case studies em PT órfãos
**Atual** `"caseStudyUrl": "/llms/projects/azion-website.txt"` (e as outras quatro, todas apontando para o EN)
**Proposta** `"/llms/projects/azion-website-pt.txt"`, `"/llms/projects/azion-console-kit-pt.txt"`, `"/llms/projects/azion-design-system-pt.txt"`, `"/llms/projects/azion-brand-system-pt.txt"`, `"/llms/projects/huia-pt.txt"`
**Por quê:** as cinco rotas `-pt.txt` existem e ninguém aponta para elas. Hoje o `/llms-pt.txt` manda o leitor PT para os case studies em inglês. Antes de trocar, confirmar que nenhum componente de UI usa `caseStudyUrl` do PT como link visível.

### Case studies: `case-study-generator.ts`

#### 2.15 `case-study-generator.ts:749, 764` / `926, 941`: cargo da Huia
**Atual** `Partner, Head of Creative Technology & Design Director` / `Sócio, Head de Tecnologia Criativa & Diretor de Design`
**Proposta** `Partner, Head of Creative Technology` / `Sócio, Head of Creative Technology`
**Por quê:** igual ao 2.10. O PT fica com o mesmo título que o `pt-br.json` usa.

#### 2.16 `case-study-generator.ts:791` / `968`: crescimento da Huia
**Atual (EN)** `Under Caio's leadership as Partner, Huia grew from a boutique agency team to approximately 40 employees. The studio's consistent delivery and client portfolio attracted attention from Stefanini, …`
**Proposta (EN)** `Huia grew from an agency nucleus to around forty people, with Caio as partner from 2015. Its work and client list drew the attention of Stefanini, one of Brazil's largest technology services companies. Stefanini acquired Huia and folded it into the Stefanini Haus group.`
**Atual (PT)** `Sob a liderança de Caio como Sócio, a Huia cresceu de uma equipe boutique de agência para aproximadamente 40 colaboradores. A entrega consistente do estúdio e seu portfólio de clientes atraíram a atenção da Stefanini, …`
**Proposta (PT)** `A Huia passou de núcleo interno de agência a cerca de quarenta pessoas, com Caio como sócio a partir de 2015. O trabalho e a carteira de clientes chamaram a atenção da Stefanini, uma das maiores empresas de serviços de tecnologia do Brasil. A Stefanini adquiriu a Huia e a integrou ao grupo Stefanini Haus.`
**Por quê:** "Under Caio's leadership" dá a ele o crescimento do estúdio inteiro. who-is-caio diz só "The studio grew to around forty people".

#### 2.17 `case-study-generator.ts:824-825` / `1001-1002`: "Pioneered" / "Innovation Before the Boom"
**Atual (EN)**
```
- **Emerging Tech Integration**: Pioneered the commercial application of technologies that would later become mainstream — …
- **Innovation Before the Boom**: Utilized AI and computer vision in commercial campaigns years before …
```
**Proposta (EN)** (as duas viram uma)
```
- **Emerging technology, early**: Facial recognition cameras, machine learning and interactive installations in commercial campaigns, years before any of it was ordinary
```
**Proposta (PT)**
```
- **Tecnologia emergente, cedo**: Câmeras de reconhecimento facial, machine learning e instalações interativas em campanhas comerciais, anos antes de qualquer uma dessas coisas ser comum
```
**Por quê:** "Pioneered" é hipérbole. A proposta usa a formulação do bio aprovado ("years before any of that was ordinary").

#### 2.18 `case-study-generator.ts:878` / `1055`: bullet de impacto
**Atual** `- **Pioneered Emerging Tech**: Commercial applications of facial recognition and AI before mainstream adoption`
**Proposta (EN)** `- **Early technology**: Facial recognition and machine learning in commercial campaigns, years before they were ordinary`
**Proposta (PT)** `- **Tecnologia cedo**: Reconhecimento facial e machine learning em campanhas comerciais, anos antes de serem comuns`
**Por quê:** mesmo motivo do 2.17.

#### 2.19 `case-study-generator.ts:889` / `1066`: aprendizado 1 da Huia
**Atual (EN)** `1. **Creative-tech integration is multiplicative**: When designers and developers collaborate deeply from ideation, the solutions are exponentially more innovative than siloed approaches`
**Proposta (EN)** `1. **Put creative and technical people in the same room from the first idea**: The work goes further than when one side hands off to the other`
**Proposta (PT)** `1. **Criativos e técnicos na mesma sala desde a primeira ideia**: O trabalho vai mais longe do que quando um lado entrega para o outro`
**Por quê:** `innovative` está banido, e "exponentially" é hipérbole.

#### 2.20 `case-study-generator.ts:312` / `664`: Brand System, ferramentas
**Atual** `- **Design Systems Methodology**: Atomic design principles, component libraries` / `- **Metodologia de Design Systems**: Princípios de atomic design, bibliotecas de componentes`
**Proposta** `- **Component libraries**: Atomic design principles, shared components` / `- **Bibliotecas de componentes**: Princípios de atomic design, componentes compartilhados`
**Por quê:** `design systems` está banido. O `content-ui-copy.md` já trocou por "Component libraries".

#### 2.21 `case-study-generator.ts:323` / `675`: Brand System, investimento
**Atual (EN)** `- **Investment Support**: Brand foundations contributed to successful funding rounds led by Monashees and Qualcomm Ventures`
**Proposta (EN)** `- **Through growth**: The foundations held through investment rounds from Monashees and Qualcomm Ventures`
**Atual (PT)** `- **Suporte a Investimento**: Fundações de marca contribuíram para rodadas de financiamento lideradas por Monashees e Qualcomm Ventures`
**Proposta (PT)** `- **Ao longo do crescimento**: A base se sustentou ao longo das rodadas de investimento da Monashees e da Qualcomm Ventures`
**Por quê:** "contributed to funding rounds" afirma uma causa que ninguém sustenta. A proposta repete o `impact` já aprovado no JSON.

#### 2.22 `case-study-generator.ts:1145, 1207` / `1288, 1350`: Console Kit, tempo por tela
**Atual (EN)** `…is what enables a new screen to be implemented in approximately one day.` · `…reduced new screen implementation time to approximately **one day** — compared to the multi-week cycles of the previous codebase.`
**Proposta (EN)** `…is what took a new screen from days to hours.` · `…took new screen implementation from days to **hours**. Every feature shipped after the rebuild costs less than it would have before.`
**Atual (PT)** `…é o que permite implementar uma nova tela em aproximadamente um dia.` · `…reduziu o tempo de implementação de novas telas para aproximadamente **um dia** — comparado aos ciclos de semanas do codebase anterior.`
**Proposta (PT)** `…é o que levou uma nova tela de dias para horas.` · `…levou a implementação de novas telas de dias para **horas**. Cada feature lançada depois da reconstrução custa menos do que custaria antes.`
**Por quê:** o número canônico é "cut new-screen implementation from days to hours". "One day vs multi-week" contradiz esse número e o próprio JSON.

#### 2.23 `case-study-generator.ts:1123` / `1266`: Console Kit, quem construiu
**Atual** `**Role**: Developer Experience Director` (sem mais nada sobre autoria)
**Proposta**: inserir uma linha logo abaixo.
EN `**Team**: Built by the product design and front-end team Caio assembled. He led it; the team wrote it.`
PT `**Time**: Construído pelo time de design de produto e front-end que o Caio montou. Ele liderou; o time escreveu o código.`
**Por quê:** who-is-caio, "Console Kit authorship". O `content-ui-copy.md` quer que isso seja dito, não deixado para o leitor supor.

#### 2.24 `case-study-generator.ts:1228` / `1371`: legenda do vídeo do Console Kit
**Atual** `…architecture, design system, key features, and the developer experience in action.` / `…arquitetura, design system, funcionalidades principais e a experiência do desenvolvedor em ação.`
**Proposta** `…architecture, shared components, key features, and the console in use.` / `…arquitetura, componentes compartilhados, funcionalidades principais e o console em uso.`
**Por quê:** `design systems` e `developer experience` estão banidos.

#### 2.25 `case-study-generator.ts:1421-1423` / `1605-1607`: Azion Website, abertura
**Atual (EN)** `…The surface output was a new website. The real output was a repositioned company: clearer messaging, a more expressive visual identity, and a shared component infrastructure that removed the design team as a bottleneck for every team in the organization.`
**Proposta (EN)** `…The visible output was a new website. Underneath it: clearer messaging, a visual identity with more range, and shared components that let other teams build their own pages.`
**Atual (PT)** `…O resultado real foi uma empresa reposicionada: mensagens mais claras, identidade visual mais expressiva e uma infraestrutura de componentes compartilhados que removeu o time de design como gargalo para todos os outros times da organização.`
**Proposta (PT)** `…O resultado visível foi um novo site. Por baixo dele: mensagens mais claras, uma identidade visual com mais repertório e componentes compartilhados que deixam outros times construírem as próprias páginas.`
**Por quê:** "a repositioned company" põe a empresa inteira na conta de um site. O guia pede "Claim the ceiling the facts support".

### SEO

#### 2.26 `site/src/app/philosophy/page.tsx:6`: description
**Atual** `Fall, learn, evolve — design principles drawn from Judo, skateboarding, and twenty years of shipping product.`
**Proposta** `Fall, learn, evolve. What judo and skateboarding taught Caio about the work: build early, fall, and go again.`
**Por quê:** "shipping product" é jargão de produto. A proposta ecoa o body aprovado ("fail, learn, and go again"), e "judo" vai em minúscula como no body.

#### 2.27 `about/page.tsx:5`, `experience/page.tsx:5`, `philosophy/page.tsx:5`, `projects/page.tsx:5`, `projects/[slug]/page.tsx:26,29,38`: separador do título
**Atual** `About - Caio Ogata` · `Experience - Caio Ogata` · `Philosophy - Caio Ogata` · `Projects - Caio Ogata` · `${project.title} - Caio Ogata`
**Proposta** `About — Caio Ogata` · `Experience — Caio Ogata` · `Philosophy — Caio Ogata` · `Projects — Caio Ogata` · `${project.title} — Caio Ogata`
**Por quê:** a home usa `Caio Ogata — Creative Designer`. Um separador só na aba e no resultado de busca.

#### 2.28 `projects/[slug]/page.tsx:27, 30, 35-39`: description cortada e twitter sem description
**Atual** `description: project.description.slice(0, 160)` em `description` e `openGraph`. O `twitter` não recebe description e, como substitui o objeto do layout, fica sem nenhuma.
**Proposta** cortar na última frase que caiba em 160 caracteres, em vez de no meio da palavra, e repetir essa description em `twitter.description`. Com as descriptions de hoje:
- azion-website (207): `A brand stretch, not a rebuild.`
- azion-console-kit (194): `The screen engineers use to deploy and watch their applications, rebuilt from scratch.`
- azion-design-system (128): inteira
- azion-brand-system (158): inteira
- huia (195): `Eight years at a creative technology studio in Porto Alegre — two running squads, six as partner.`

**Por quê:** hoje três das cinco descriptions acabam no meio da palavra. Em share no X/LinkedIn, o card sai sem texto.

#### 2.29 `site/src/app/layout.tsx:92`: `knowsAbout` do JSON-LD
**Atual** `knowsAbout: content.about.expertise` (sai "Motion, built in the browser", "Front-end that ships to production")
**Proposta**
```ts
knowsAbout: [
  'Creative direction',
  'Art direction',
  'Brand and visual identity',
  'Interface design',
  'Interaction design',
  'Motion design',
  'Front-end development',
],
```
**Por quê:** `knowsAbout` pede tópicos, não frases de UI. A lista usa os mesmos termos das keywords da linha 27 e da lista de Expertise aprovada.

### Sitemap e robots

#### 2.30 `site/src/app/sitemap.ts:6-61`: rotas V2 faltando
**Atual:** home, os três `/llms*.txt` e os cinco case studies em EN.
**Proposta:** acrescentar
```
/about                                     monthly  0.9
/projects                                  monthly  0.9
/experience                                monthly  0.8
/philosophy                                monthly  0.6
/projects/azion-website                    monthly  0.8
/projects/azion-console-kit                monthly  0.8
/projects/azion-design-system              monthly  0.8
/projects/azion-brand-system               monthly  0.8
/projects/huia                             monthly  0.8
/llms/projects/azion-website-pt.txt        monthly  0.5
/llms/projects/azion-console-kit-pt.txt    monthly  0.5
/llms/projects/azion-design-system-pt.txt  monthly  0.5
/llms/projects/azion-brand-system-pt.txt   monthly  0.5
/llms/projects/huia-pt.txt                 monthly  0.5
```
De preferência, gerar as `/projects/*` a partir de `projects.items.filter(p => !p.disabled)`, como já faz `generateStaticParams`.
**Por quê:** nenhuma página da V2 está no sitemap. Só a home e os `.txt` aparecem.

#### 2.31 `site/public/robots.txt:4-6`: comentário
**Atual**
```
# LLM-optimized content available at:
# https://www.caioogata.com/llms.txt (index)
# https://www.caioogata.com/llms-full.txt (full profile, canonical)
```
**Proposta**
```
# LLM-optimized content available at:
# https://www.caioogata.com/llms.txt (index)
# https://www.caioogata.com/llms-full.txt (full profile, canonical)
# https://www.caioogata.com/llms-pt.txt (full profile, Brazilian Portuguese)
```
**Por quê:** o perfil PT, que é o destino do prompt PT do "Ask AI", não aparece.

---

## 3. Já está ok

- `layout.tsx:21-22`: `title` `Caio Ogata — Creative Designer`, e description = tagline + tagline2 aprovadas.
- `layout.tsx:27-37`: keywords, sem nenhum termo banido.
- `layout.tsx:40-62`: OpenGraph e Twitter do root (description = short bio aprovado).
- `layout.tsx:78-99`: JSON-LD com `jobTitle: 'Creative Designer'`, sem `birthDate`, `homeLocation` correto (salvo o 2.29).
- `about/page.tsx:6`: primeira frase do bio aprovado.
- `experience/page.tsx:6`: ecoa o headline e o menu aprovados.
- `projects/page.tsx:6`: abre com a descrição de menu aprovada ("Selected work, and what it took").
- `markdown-generator.ts:7, 14-52`: `TITLE`, `offer: Freelance`, índice `/llms.txt`, links externos e nota da Azion Design System ("built by the team Caio led").
- `markdown-generator.ts:65-83`: hero, bio (bate com o full bio do who-is-caio) e Core Expertise.
- `markdown-generator.ts:178, 230`: "Freelance — brand, interface and front-end work".
- `markdown-generator.ts:255, 264, 267`: CTAs `summary` (EN), `skills` e `projects`.
- `markdown-generator.ts:409-416, 450-463`: tabela de carreira e rodapé ("whether he is a fit for a project you have in mind").
- `case-study-generator.ts`: frontmatter `author`/`optimized_for`, as notas "do not search the web", os créditos de Brand System e Design System, e o rodapé "authored by Caio Ogata" (autoria do documento, não do trabalho).
- Citações da marca Azion dentro do Brand System ("innovative", "Innovation means courage"…): são citações do brand book, e a exceção de nome próprio e citação vale para elas.
- `sitemap.ts`: as entradas atuais estão corretas. Falta só o que está no 2.30.
- `robots.txt`: allow-list de crawlers de IA.

---

## Decisões abertas

1. **Azion Website: data e cargo.** O JSON diz `2022`. O case study diz `Q4 2025 — present`, com `Role: Design Director`, e descreve o reposicionamento "The web platform for modern workloads", Sora e lavanda. "Present" está errado de qualquer jeito, porque ele trabalha por conta própria. Se o projeto é de 2022, o cargo é Design Director. Se é de 2025, o cargo é Developer Experience Director e a descrição do JSON ("without throwing away the front-end") contradiz o "Complete website built on Astro + Vue" do case study. Qual é o projeto?
2. **Azion Brand System: ano.** O JSON diz `2020` (`en.json:1137`), mas pelos fatos canônicos ele entrou na Azion em 2021. O case study diz 2021–2025. Qual ano vai no card?
3. **Console Kit: ano.** O card diz `2023` e o case study diz `2024–2025`, que é o período de Developer Experience Director. Quando começou?
4. **Números fora da lista "safe to use".** São três: "+30% franchise store traffic" (O Boticário, `case-study-generator.ts:809, 876, 986, 1053`), "Improved project profitability by +30% with Design Sprint techniques" (`en.json:181`, `pt-br.json:181`) e "93+ releases" (Console Kit). Confirmar e acrescentar em who-is-caio, ou cortar.
5. **"language models" no card da Huia** (`en.json:1482`, `pt-br.json:1482`). O texto aprovado no `content-ui-copy.md` diz "language models", e o bio aprovado diz "machine learning". O who-is-caio prevalece, mas é UI aprovada. Trocar para "machine learning"?
6. **Voz do corpo dos case studies.** Fora os itens acima, o corpo técnico (Console Kit, Design System, Website) usa `design system`, `developer experience`, `headless`, `token-based` o tempo todo, com o título de seção `## Design System`. São documentos de aprofundamento, lidos por IA. Ficam como referência técnica, com a lista banida valendo só para as frases sobre o Caio (a recomendação deste documento), ou passam pela revisão de voz inteira?
7. **E-mail.** O JSON-LD e o frontmatter publicam `caioogata.labs@gmail.com`, e o rodapé mostra `contato@caioogata.com`. Continua em aberto desde o `content-ui-copy.md`. Qual é o público?
8. **Clientes fora da lista canônica.** Os case studies citam Samsung, Shure, Rocket Chat, Takeda, Grendene e Bimbo, que não estão em "Clients worth naming". Podem ficar?
