import type { Language } from '@/content/types'

export function generateAzionBrandSystemCaseStudy(language: Language = 'en'): string {
  const isEnglish = language === 'en'
  const today = new Date().toISOString().split('T')[0]

  if (isEnglish) {
    return `---
type: project_case_study
project: Azion Brand System
slug: azion-brand-system
client: Azion Technologies
industry: Edge Computing Platform
role: Design Director, Brand Experience Director
duration: 2021-2025
author: Caio Ogata
last_updated: ${today}
optimized_for: Claude, ChatGPT, Gemini, LLMs
---

# Azion Brand System — Complete Case Study

## Project Overview

**Client**: Azion Technologies
**Industry**: Edge Computing Platform
**Project Type**: Comprehensive Brand Identity System
**Duration**: 2021–2025
**Role**: Design Director, Brand Experience Director
**Deliverable**: Azion Brand Book v2 (complete brand guidelines and visual identity system)

---

## Company Context & Challenge

### Company Origin
Azion was founded in 2011 by Rafael Umann. The name derives from the Italian word "azione" (action), establishing the brand's core identity around movement, momentum, and decisive execution.

**Company Mission**: "Power the hyper-connected economy"

**Technical Foundation**:
- Started from the CEO's couch
- MVP required 20 developers and 2 years to build
- By 2016, launched all platform modules (full-stack: build, secure, deliver, observe)
- Edge network expanded to 100+ locations globally
- Hosting 20,000+ applications
- Investment rounds led by Monashees and Qualcomm Ventures

**The Challenge**: Transform from a technically-focused platform into a brand that communicates innovation, reliability, and aspiration to both enterprise decision-makers and developers. The brand needed to work across multiple contexts: product interfaces, developer documentation, enterprise sales, and market communications.

---

## Strategic Brand Foundation

### Brand Values

The brand system was built on four core values that guide all visual and verbal expression:

1. **High Standards** — "At Azion, meeting high expectations is the standard. Exceeding them sets us apart and drives our success."
2. **Move Fast** — "At Azion, we move fast in response to a challenge or opportunity."
3. **Ownership** — "At Azion, we are empowered to act and accountable for our actions."
4. **Innovation** — "At Azion, we develop solutions that unlock new possibilities."

### Brand Essence

**Emotional Truth**: "I feel energized to build more innovative technology."

**Platform Promise**: "An edge computing platform that simplifies how I build, secure, deliver and observe better applications, faster."

**Product Attributes**:
- Self-service and easy to use
- Open, extensible, and API-driven
- Reliable and performant, backed by a 100% uptime SLA
- Built-in modern security
- Real-time observability
- Compliant with the highest standards

### Brand Pyramid
The brand pyramid clarifies fundamentals and sets strategic foundation:
- **Essence**: Energy to build innovative technology
- **Emotional Benefits**: Motivated, understood, empowered, supported — like anything is possible
- **Logical Benefits**: Enterprise-grade open platform, fully programmable, hardware agnostic, highly reliable software-defined edge network, security-centric
- **Functional Benefits**: Easily create serverless, low-latency applications running anywhere with general purpose, low-code, no lock-in, simplified development

---

## Brand Personality & Voice Architecture

The brand personality was defined across four dimensions, each with a spectrum from approachable to bold:

### 1. Innovative (Confident → Bold)
"Innovation means courage. It means doing something that hasn't been done before. That is why we use high contrast in our images. We want to stand out from everyone in order to be seen. It demonstrates boldness."

### 2. Relatable (Open → Collaborative)
"We want to be relatable. We don't want to be a simple mirror on the wall. That's why we use diverse shapes, and open definitions that can be interpreted and used widely. This creates a vision where people can see themselves in us, not the other way around."

### 3. Clever (Concise → Punchy)
"We are clever and punchy. We create inventive and dazzling focal points, building precise, dramatic and well defined compositions."

### 4. Driven (Motivating → Aspirational)
"Our goal is to inspire. We want people to feel free to explore patterns and shapes, inciting curiosity. We do this by creating pieces with a strong concept, a narrative tied to the message and that goes beyond literal images."

### Brand Persona
If Azion was a person: connected, cool, and invested in today's world and its technologies. Young but secure, professionally experienced. Knows what they want and runs after it. Able to communicate with different audiences — can explain any subject to a development specialist, but also to their grandmother.

---

## Voice & Tone Guidelines

### Core Voice Principles

"We're bold and clear, not formal or too familiar."

**Audience Understanding**:
- Target audience is motivated by building the smartest, fastest, most secure tech applications
- They're innovators and tech can't always keep up with them
- Concerned with cost, scale, and security
- Feel inspired but underserved by competitors who hype speeds and feeds

**How We Make Them Feel**: Motivated, understood, empowered, and supported — like anything is possible.

### Voice Dimensions

**Confident**: Our tech is legit, our goals are bold, and the edge is just the beginning. With confidence and attitude, we're pushing limits. Headlines: "The Edge is just the Beginning", "Unlock your infinite potential", "Build without limits."

**Community**: Our platform doesn't mean much without innovators to build on it. With accessible language and arms wide open, we grow a community. Headlines: "From devs to devs", "Build on your own terms", "Join the edge revolution."

**Informative**: Edge computing is revolutionary, but the way companies talk about it isn't. We're bringing energy with clarity, brevity, and wit. Headlines: "Go beyond with edge computing", "Bring better apps to market faster."

**Empowering**: We use the concept of customer first — our customers are building incredible things and Azion enables them. Headlines: "Built for enterprises, loved by developers", "Scale your applications and their potential."

### Writing Rules

- Lead with benefits, tell them our product will improve their lives
- Write directly, clearly, with a touch of familiarity
- Start with big claims first, then back with details — after we have attention
- Put customers in evidence, communicating their achievements first
- Are bold and confident to get their respect
- Use contractions to be conversational
- American English unless personalized for UK/Europe
- Customers are "customers" (not "users")

### Headline Hierarchy

**Main Headlines** (brand promises):
- "The edge platform for modern applications"
- "Respect the legacy. Empower innovation."
- "Go beyond with edge computing."
- "Open, flexible, powerful!"

**Supporting Headlines** (benefits):
- "Embrace the power of serverless"
- "No-Ops, Just Code"
- "Any-sized audience: use Azion's software-defined global network to scale"

**Elevator Pitch**: "Azion is an edge platform that simplifies how you build and run modern applications anywhere: in more than 100 Azion-operated data centers, or on remote devices, on-premises and multi-cloud."

---

## Four Product Pillars

### 1. Build
**Theme**: Innovation, transformation, modernization
**Messaging**: "Everything you need to build, innovate and scale. Discover the full potential of application modernization at the edge. With Azion, your potential to create the future is limitless."
**Visual Language**: Binary codes and people coding as main representation. Combination of humans and computers working to push technology. Elements of organization and multiple screens.
**Concepts**: Innovation, transformation, modernization

### 2. Secure
**Theme**: Protection, confidentiality, resilience
**Messaging**: "Don't give threats a chance: count on real-time web application security. The edge's resiliency depends on its protection."
**Visual Language**: Shield as main element. Symbols of security: lockers, shields, passwords, walls, blockers, alerts, credentials. Technology symbols: cybersecurity, biometry, Face ID, data centers, protection against hackers.
**Concepts**: Protection, confidentiality, resilience

### 3. Deploy
**Theme**: Agility, flexibility, orchestration
**Messaging**: "Global Reach: with edge nodes at more than 100 sites around the world, Azion is always close to your users. Orchestrate and manage applications and devices anywhere."
**Visual Language**: Edge network globe and cube representing applications. Retail symbols, information traveling between computers and people, data centers exchanging information, multiple connected devices. Feelings of availability, velocity, low latency, workload automation.
**Concepts**: Agility, flexibility, orchestration

### 4. Observe
**Theme**: Analysis, insights, data-driven
**Messaging**: "Act on insights closer to where data is created. Never look at your applications the same way again. Analyze every requisition in real-time."
**Visual Language**: Graphics as main element. People looking at screens, data and alert symbols, VR glasses, paths, reports, focus points, multiple screens. Feelings of control, decision, reflection, direction, proximity, real-time, insights.
**Concepts**: Analysis, insights, data-driven

---

## Visual Identity System

### Logo & Signature

**Logo Concept**: The type shape, with straight lines and square base, is a contemporary reference to digital aesthetics. The slight inclination refers to speed, a characteristic of the service.

**Versions**:
- **Preferred**: Lettering "Azion" without decoder, horizontal position
- **Secondary**: With "Technologies" decoder, for administrative materials
- **Reduced**: Letter "A" for social media profiles and favicon

**Chromatic Variations**:
- **Orange** (#F3652B): Institutional materials, paid ads, thumbnails, social media avatars
- **Dark** (#1E1E1E): Orange backgrounds, dark backgrounds
- **Light** (#F2F2F2): When dark contrast is needed

**Rules**:
- Maintain security area margins
- Respect minimum reduction for readability
- Consider background contrast when choosing variation
- Never place on orange elements when using preferred version

### Color Palette

**Primary Colors**:
- **Orange $orange-500**: #F3652B / RGB 243, 101, 43 / CMYK 0, 59, 96, 0 / Pantone 165 C — Brand identity color, focal points, details, labels
- **Black $grey-900**: Dark backgrounds, authority, technical precision
- **White $grey-75**: Clarity, space, simplicity

**Application Rules**:
- Colors designed for texts and backgrounds only
- Shade variations or different colors should be avoided
- Chromatic gradation available for light and shadow work
- Semantic colors for products only (error, attention, success, informational)

### Typography

**Primary Typeface**: Roboto (institutional sans-serif)
- Versatile with good readability and wide range of weights
- Sans serif variation only — other Roboto versions not allowed
- Available weights: Thin, Extra Light, Light, Regular, Medium, Semi Bold, Bold, Extra Bold, Black (plus italics)

**Hierarchy**:
- H1-H6 for both light and dark backgrounds
- Body text with smaller, lighter weight, preferably lighter grey for focus on titles
- Highlights using color variations and/or weights
- Links in underline style

### Illustration System

**Philosophy**: "It is impossible to think of representing our platform without first remembering the origin of our name. The essence of 'azione' (action) gives clear direction: communicate through illustrations showing elements in motion, highlighting impact of technologies."

**Overview Principle**: "We chose a clear and succinct illustration approach: minimalist and simple design to establish faster and more meaningful contact with our public."

**Edge Computing Representation**: "Edge computing brings computation and storage closer to user devices, avoiding latency issues and improving performance. To make our technology tangible we use straightforward elements — lines, dots to show the edge of applications, creating the feeling of hyper-connectivity."

**Light System**: "To illuminate creative assets, we use a live orange light to show applications (represented by cubes). The objective is to pass the sensation of action when applications are built and run. Secondary lights used in white."

**Character Usage**:
- People characters for market communications, social channels, marketplace launches, employer branding
- Purpose: Connect with people creatively, closer to users, represent brand with personality
- NOT used in platform and products — instead use geometric shapes, machines, binary codes
- Differentiator from competitors who tend to be more formal

**Product Representation**: Geometric shapes to represent elements closer to developers' daily life. Elements should illustrate benefits, how services simplify the way to create new possibilities.

### Iconography

**Organization**: Product, System, Brand groups
**Styles**: Light, Bold, Solid
**Design Process**: Start by identifying orientation (horizontal, vertical, square, circular) and build within respective grid
**Purpose**: Help users quickly identify actions or information through easy-to-understand graphical representations

### Photography Guidelines

**Photo Editing**: Key to maintaining coherent visual line. Focus on shades of orange complementing color palette. Remove blue, cyan, green, magenta tones, or work with black & white.

**Screenshots**: Deep shadows and round corners for pop-out "window" sensation. Default corner radius 4pts. Combination of 6 different drop shadows.

**Azion People Pictures**: Natural light, clear backgrounds, neutral tones or Azion palette, be natural and professional but not formal. "We are edgy, after all."

**What NOT to use**: Graphic interference, excessive hand-focused photos, forced poses, non-Azion illustrations, fake scenarios, over-lighting, blue filters, childish content, low quality images.

---

## Communication Applications

### Social Media
- Visual showcase on Instagram
- Timeline format on LinkedIn/Twitter for impactful messages
- Hashtags: #Azion, #AzionTech, #HyperConnectedEconomy, #EdgeComputing
- Emojis allowed with judgment

### Email & Sales
- Professional but not formal tone
- Lead with benefits
- Structure: Greeting → Context → Value proposition → CTA → Sign-off
- Closings: "Thanks", "Best", "Talk to you soon", "Looking forward to it", "Cheers"

### Content Guidelines
- Spell out numbers zero through nine, numerals for 10+
- Em dashes (—) connect thoughts, en dashes (–) for ranges, hyphens (-) for compound words
- Title case for headings
- Capitalize proper nouns and Azion products
- Follow Merriam-Webster or APA style guide

### Glossary of Key Terms
Edge Computing, Centralized Data Center, Cloud Computing, Cloud Node, Content Delivery Network (CDN), Edge Analytics, Edge Node, Full Stack, Function, Latency, Over-the-Top Service Provider (OTT), Serverless, Load Balancing/Balancer, Edge Functions, Edge-Native, Edge Firewall, Zero-Day Threats, Engine, Vendor Lock-In, Troubleshooting, Front-End, Back-End, Compliance

---

## Design Process & Methodology

### Strategic Approach

1. **Discovery & Audit** — Analyzed existing brand touchpoints, competitor positioning, and internal stakeholder needs across product, marketing, engineering, and sales
2. **Brand Strategy Development** — Defined values, personality, voice through collaborative workshops with leadership
3. **Visual Identity Exploration** — Developed multiple visual directions rooted in brand strategy, tested across product and marketing contexts
4. **System Design** — Built scalable components: color, typography, iconography, illustration, photography guidelines
5. **Documentation & Tooling** — Created comprehensive Brand Book v2 in Figma, enabling team adoption and consistent execution

### Tools & Technologies
- **Figma**: Primary design and documentation platform
- **Brand Strategy Frameworks**: Personality mapping, voice spectrum analysis, brand pyramid
- **Design Systems Methodology**: Atomic design principles, component libraries
- **Illustration Systems**: Motion-based visual language, orange light system
- **Iconography**: Multi-style icon system (Light, Bold, Solid)

---

## Impact & Results

### Organizational Impact
- **Unified Brand Experience**: Consistent visual and verbal identity across 100+ edge locations and 20,000+ hosted applications
- **Cross-Functional Adoption**: System successfully adopted by design, marketing, product, and engineering teams
- **Investment Support**: Brand foundations contributed to successful funding rounds led by Monashees and Qualcomm Ventures
- **Scalable Foundation**: Enabled rapid expansion while maintaining brand coherence

### Product Impact
- **Four-Pillar Communication**: Clear differentiation of Build, Secure, Deploy, Observe capabilities
- **Developer Appeal**: "Built for enterprises, loved by developers" positioning achieved
- **Enterprise Credibility**: Professional, confident brand presence supporting B2B sales

### System Scalability
- **Component Library**: Reusable visual and verbal components accelerating content creation
- **Clear Guidelines**: Reduced decision-making time for designers and marketers
- **Quality Consistency**: Maintained brand integrity across diverse outputs and teams

---

## Key Learnings

1. **Action-Oriented Identity**: The Italian origin "azione" provided clear creative direction — all brand expressions communicate movement, momentum, and impact
2. **Engineer-to-Engineer Voice**: Technical audiences require clarity and honesty. Balance aspiration with precision, never overselling
3. **Visual Confidence**: High contrast, bold color, dramatic compositions differentiate from conservative enterprise competitors
4. **Flexible System**: Must work across technical documentation, developer tools, enterprise sales, and market communications
5. **Customer-First Language**: Positioning customers as "customers" and speaking from their perspective creates empowering communication

---

## Deliverables

- Azion Brand Book v2 (comprehensive Figma document)
- Visual Identity System (color palette, typography, logo usage, chromatic variations)
- Illustration Guidelines (motion-based visual language, light system, edge computing representations)
- Icon Library (Product, System, Brand icons in Light, Bold, Solid styles)
- Photography Guidelines (treatment, composition, usage rules, screenshot standards)
- Voice & Tone Guide (writing principles, headline examples, glossary, copyediting process)
- Communication Templates (social media, email, presentation formats)
- Product Pillar Framework (visual and verbal identity for Build, Secure, Deploy, Observe)

---

## Credits

This project was made possible by a talented team of designers and brand professionals:

- **Morgana Johann** — Design Manager — [LinkedIn](https://www.linkedin.com/in/morgana-johann/)
- **Fernanda Mizzin** — Brand Manager — [LinkedIn](https://www.linkedin.com/in/fernandamizzin/)
- **Guilherme Ganc** — [LinkedIn](https://www.linkedin.com/in/guilherme-ganc-53961089/)
- **Danusa Araújo** — [LinkedIn](https://www.linkedin.com/in/danusa-c/)
- **Gabriela Kuhn** — [LinkedIn](https://www.linkedin.com/in/gabrielakuhn/)
- **Mateus Moura** — [LinkedIn](https://www.linkedin.com/in/mateus-moura-536681136/)
- **Nathalia Oliveira** — [LinkedIn](https://www.linkedin.com/in/nathaliapoliveira/)

---

## Downloads

- [Azion Brand Book v2 (PDF)](https://www.caioogata.com/projects/azion-brand-system/azion-brand-book-v2.pdf)

---

*This case study was authored by Caio Ogata and is optimized for both human readers and AI assistants. For more information, visit [https://www.caioogata.com](https://www.caioogata.com).*

*Last updated: ${today}*`
  }

  return `---
type: project_case_study
project: Sistema de Marca Azion
slug: azion-brand-system
client: Azion Technologies
industry: Plataforma de Edge Computing
role: Design Director, Brand Experience Director
duration: 2021-2025
author: Caio Ogata
last_updated: ${today}
optimized_for: Claude, ChatGPT, Gemini, LLMs
---

# Sistema de Marca Azion — Estudo de Caso Completo

## Visão Geral do Projeto

**Cliente**: Azion Technologies
**Setor**: Plataforma de Edge Computing
**Tipo de Projeto**: Sistema Abrangente de Identidade de Marca
**Duração**: 2021–2025
**Papel**: Design Director, Brand Experience Director
**Entrega**: Azion Brand Book v2 (diretrizes completas de marca e sistema de identidade visual)

---

## Contexto da Empresa & Desafio

### Origem da Empresa
A Azion foi fundada em 2011 por Rafael Umann. O nome deriva da palavra italiana "azione" (ação), estabelecendo a identidade central da marca em torno de movimento, momentum e execução decisiva.

**Missão da Empresa**: "Power the hyper-connected economy" (Impulsionar a economia hiperconectada)

**Fundação Técnica**:
- Começou no sofá do CEO
- MVP exigiu 20 desenvolvedores e 2 anos para construir
- Em 2016, lançou todos os módulos da plataforma (full-stack: build, secure, deliver, observe)
- Rede edge expandida para mais de 100 localizações globalmente
- Hospedando mais de 20.000 aplicações
- Rodadas de investimento lideradas por Monashees e Qualcomm Ventures

**O Desafio**: Transformar de uma plataforma focada tecnicamente em uma marca que comunica inovação, confiabilidade e aspiração tanto para tomadores de decisão empresariais quanto para desenvolvedores. A marca precisava funcionar em múltiplos contextos: interfaces de produto, documentação para desenvolvedores, vendas corporativas e comunicações de mercado.

---

## Fundação Estratégica da Marca

### Valores da Marca

O sistema de marca foi construído sobre quatro valores centrais que guiam toda expressão visual e verbal:

1. **High Standards (Altos Padrões)** — "Na Azion, atender altas expectativas é o padrão. Excedê-las nos diferencia e impulsiona nosso sucesso."
2. **Move Fast (Mover Rápido)** — "Na Azion, nos movemos rapidamente em resposta a um desafio ou oportunidade."
3. **Ownership (Propriedade)** — "Na Azion, somos capacitados para agir e responsáveis por nossas ações."
4. **Innovation (Inovação)** — "Na Azion, desenvolvemos soluções que desbloqueiam novas possibilidades."

### Essência da Marca

**Verdade Emocional**: "Me sinto energizado para construir tecnologia mais inovadora."

**Promessa da Plataforma**: "Uma plataforma de edge computing que simplifica como eu construo, protejo, entrego e observo aplicações melhores, mais rápido."

**Atributos do Produto**:
- Self-service e fácil de usar
- Aberto, extensível e orientado a API
- Confiável e performático, com SLA de 100% uptime
- Segurança moderna integrada
- Observabilidade em tempo real
- Conforme com os mais altos padrões

### Pirâmide de Marca
A pirâmide de marca clarifica fundamentos e estabelece base estratégica:
- **Essência**: Energia para construir tecnologia inovadora
- **Benefícios Emocionais**: Motivado, compreendido, empoderado, apoiado — como se tudo fosse possível
- **Benefícios Lógicos**: Plataforma aberta enterprise-grade, totalmente programável, hardware agnostic, rede edge software-defined altamente confiável, centrada em segurança
- **Benefícios Funcionais**: Criar facilmente aplicações serverless de baixa latência rodando em qualquer lugar, com propósito geral, low-code, sem lock-in e processo de desenvolvimento simplificado

---

## Arquitetura de Personalidade & Voz da Marca

A personalidade da marca foi definida em quatro dimensões, cada uma com um espectro do acessível ao ousado:

### 1. Innovative (Inovador) — Confident → Bold (Confiante → Ousado)
"Inovação significa coragem. Significa fazer algo que não foi feito antes. Por isso usamos alto contraste em nossas imagens. Queremos nos destacar de todos para sermos vistos. Demonstra ousadia."

### 2. Relatable (Identificável) — Open → Collaborative (Aberto → Colaborativo)
"Queremos ser identificáveis. Não queremos ser um simples espelho na parede. Por isso usamos formas diversas e definições abertas que podem ser interpretadas e usadas amplamente. Isso cria uma visão onde as pessoas podem se ver em nós, não o contrário."

### 3. Clever (Inteligente) — Concise → Punchy (Conciso → Impactante)
"Somos inteligentes e impactantes. Criamos pontos focais inventivos e deslumbrantes, construindo composições precisas, dramáticas e bem definidas."

### 4. Driven (Determinado) — Motivating → Aspirational (Motivador → Aspiracional)
"Nosso objetivo é inspirar. Queremos que as pessoas se sintam livres para explorar padrões e formas, incitando curiosidade. Fazemos isso criando peças com um conceito forte, uma narrativa ligada à mensagem que vai além de imagens literais."

### Persona da Marca
Se a Azion fosse uma pessoa: conectada, cool, investida no mundo atual e suas tecnologias. Jovem mas segura, profissionalmente experiente. Sabe o que quer e corre atrás. Capaz de se comunicar com diferentes audiências — pode explicar qualquer assunto para um especialista em desenvolvimento, mas também para sua avó.

---

## Diretrizes de Voz & Tom

### Princípios Centrais de Voz

"Somos ousados e claros, não formais ou muito familiares."

**Entendimento da Audiência**:
- Público-alvo motivado por construir as aplicações tecnológicas mais inteligentes, rápidas e seguras
- São inovadores e a tecnologia nem sempre acompanha
- Preocupados com custo, escala e segurança
- Sentem-se inspirados mas subatendidos por concorrentes que vendem apenas specs

**Como os Fazemos Sentir**: Motivados, compreendidos, empoderados e apoiados — como se tudo fosse possível.

### Dimensões de Voz

**Confiante**: Nossa tech é legítima, nossos objetivos são ousados, e a edge é apenas o começo. Headlines: "The Edge is just the Beginning", "Unlock your infinite potential", "Build without limits."

**Comunidade**: Nossa plataforma não significa muito sem inovadores para construir nela. Com linguagem acessível e braços abertos, crescemos uma comunidade. Headlines: "From devs to devs", "Build on your own terms", "Join the edge revolution."

**Informativa**: Edge computing é revolucionário, mas a forma como empresas falam sobre isso não é. Trazemos energia com clareza, brevidade e sagacidade. Headlines: "Go beyond with edge computing", "Bring better apps to market faster."

**Empoderadora**: Usamos o conceito de customer first — nossos clientes constroem coisas incríveis e a Azion os capacita. Headlines: "Built for enterprises, loved by developers", "Scale your applications and their potential."

### Regras de Escrita

- Lidere com benefícios, diga que nosso produto vai melhorar suas vidas
- Escreva de forma direta, clara, com um toque de familiaridade
- Comece com grandes afirmações, depois sustente com detalhes — depois de captar a atenção
- Coloque clientes em evidência, comunicando suas conquistas primeiro
- Seja ousado e confiante para ganhar respeito
- Use contrações para ser conversacional
- Inglês americano a menos que personalizado para UK/Europa
- Clientes são "customers" (não "users")

### Hierarquia de Headlines

**Headlines Principais** (promessas de marca):
- "The edge platform for modern applications"
- "Respect the legacy. Empower innovation."
- "Go beyond with edge computing."
- "Open, flexible, powerful!"

**Headlines de Suporte** (benefícios):
- "Embrace the power of serverless"
- "No-Ops, Just Code"
- "Any-sized audience: use Azion's software-defined global network to scale"

**Elevator Pitch**: "Azion é uma plataforma edge que simplifica como você constrói e roda aplicações modernas em qualquer lugar: em mais de 100 data centers operados pela Azion, ou em dispositivos remotos, on-premises e multi-cloud."

---

## Quatro Pilares de Produto

### 1. Build (Construir)
**Tema**: Inovação, transformação, modernização
**Mensagem**: "Tudo que você precisa para construir, inovar e escalar. Descubra o potencial completo da modernização de aplicações na edge. Com a Azion, seu potencial para criar o futuro é ilimitado."
**Linguagem Visual**: Códigos binários e pessoas codificando como representação principal. Combinação de humanos e computadores trabalhando para impulsionar a tecnologia. Elementos de organização e múltiplas telas.

### 2. Secure (Proteger)
**Tema**: Proteção, confidencialidade, resiliência
**Mensagem**: "Não dê chance às ameaças: conte com segurança de aplicação web em tempo real. A resiliência da edge depende de sua proteção."
**Linguagem Visual**: Escudo como elemento principal. Símbolos de segurança: cadeados, escudos, senhas, muros, bloqueadores, alertas, credenciais. Símbolos tecnológicos: cibersegurança, biometria, Face ID, data centers, proteção contra hackers.

### 3. Deploy (Implantar)
**Tema**: Agilidade, flexibilidade, orquestração
**Mensagem**: "Alcance Global: com edge nodes em mais de 100 sites ao redor do mundo, a Azion está sempre próxima dos seus usuários. Orquestre e gerencie aplicações e dispositivos em qualquer lugar."
**Linguagem Visual**: Globo da rede edge e cubo representando aplicações. Símbolos de varejo, informação viajando entre computadores e pessoas, data centers trocando informações, múltiplos dispositivos conectados. Sensações de disponibilidade, velocidade, baixa latência, automação de workload.

### 4. Observe (Observar)
**Tema**: Análise, insights, orientado a dados
**Mensagem**: "Aja sobre insights mais perto de onde os dados são criados. Nunca mais olhe suas aplicações da mesma forma. Analise cada requisição em tempo real."
**Linguagem Visual**: Gráficos como elemento principal. Pessoas olhando para telas, dados e símbolos de alerta, óculos VR, caminhos, relatórios, pontos de foco, múltiplas telas. Sensações de controle, decisão, reflexão, direção, proximidade, tempo real, insights.

---

## Sistema de Identidade Visual

### Logo & Assinatura

**Conceito do Logo**: A forma tipográfica, com linhas retas e base quadrada, é uma referência contemporânea à estética digital. A leve inclinação remete à velocidade, característica do serviço.

**Versões**:
- **Preferencial**: Lettering "Azion" sem decodificador, posição horizontal
- **Secundária**: Com decodificador "Technologies", para materiais administrativos
- **Reduzida**: Letra "A" para perfis de redes sociais e favicon

**Variações Cromáticas**:
- **Laranja** (#F3652B): Materiais institucionais, anúncios pagos, thumbnails, avatares de redes sociais
- **Dark** (#1E1E1E): Fundos laranja, fundos escuros
- **Light** (#F2F2F2): Quando contraste escuro é necessário

### Paleta de Cores

**Cores Primárias**:
- **Laranja $orange-500**: #F3652B / RGB 243, 101, 43 / CMYK 0, 59, 96, 0 / Pantone 165 C — Cor de identidade da marca, pontos focais, detalhes, labels
- **Preto $grey-900**: Fundos escuros, autoridade, precisão técnica
- **Branco $grey-75**: Clareza, espaço, simplicidade

**Regras de Aplicação**:
- Cores projetadas para textos e fundos apenas
- Variações de tons ou cores diferentes devem ser evitadas
- Gradação cromática disponível para trabalho com luz e sombra
- Cores semânticas apenas para produtos (erro, atenção, sucesso, informacional)

### Tipografia

**Fonte Primária**: Roboto (sans-serif institucional)
- Versátil com boa legibilidade e ampla gama de pesos
- Apenas variação sans serif — outras versões de Roboto não permitidas
- Pesos disponíveis: Thin, Extra Light, Light, Regular, Medium, Semi Bold, Bold, Extra Bold, Black (mais itálicos)

**Hierarquia**:
- H1-H6 para fundos claros e escuros
- Texto corpo com peso menor e mais leve, preferencialmente cinza mais claro para foco nos títulos
- Destaques usando variações de cor e/ou peso
- Links em estilo underline

### Sistema de Ilustração

**Filosofia**: "É impossível pensar em representar nossa plataforma sem primeiro lembrar da origem do nosso nome. A essência de 'azione' (ação) nos dá uma direção clara: comunicar através de ilustrações que mostram elementos em movimento, destacando o impacto das tecnologias."

**Princípio Geral**: "Escolhemos uma abordagem de ilustração clara e sucinta: design minimalista e simples para estabelecer contato mais rápido e significativo com nosso público."

**Representação de Edge Computing**: "Edge computing traz computação e armazenamento mais perto dos dispositivos dos usuários, evitando problemas de latência e melhorando performance. Para tornar nossa tecnologia tangível, usamos elementos diretos — linhas, pontos para mostrar a edge das aplicações, criando a sensação de hiperconectividade."

**Sistema de Luz**: "Para iluminar nossos ativos criativos, usamos uma luz laranja viva para mostrar aplicações (representadas por cubos). O objetivo é passar a sensação de ação quando as aplicações são construídas e executadas. Luzes secundárias em branco."

**Uso de Personagens**:
- Personagens de pessoas para comunicações de mercado, canais sociais, lançamentos do marketplace, employer branding
- Propósito: Conectar-se com pessoas de forma criativa, mais próximos dos usuários, representar marca com personalidade
- NÃO usados em plataforma e produtos — em vez disso, formas geométricas, máquinas, códigos binários
- Diferenciador de concorrentes que tendem a ser mais formais

### Iconografia

**Organização**: Grupos de Produto, Sistema, Marca
**Estilos**: Light, Bold, Solid
**Processo**: Identificar orientação (horizontal, vertical, quadrado, circular) e construir dentro da grade respectiva

### Diretrizes de Fotografia

**Edição de Fotos**: Chave para manter linha visual coerente. Foco em tons de laranja complementando paleta. Remover tons azul, ciano, verde, magenta, ou trabalhar em preto e branco.

**Screenshots**: Sombras profundas e cantos arredondados para sensação de janela "pop-out". Raio de canto padrão 4pts. Combinação de 6 sombras diferentes.

**Fotos de Pessoas Azion**: Luz natural, fundos claros, tons neutros ou paleta Azion, ser natural e profissional mas não formal. "Somos edgy, afinal."

---

## Processo de Design & Metodologia

### Abordagem Estratégica

1. **Discovery & Auditoria** — Analisou pontos de contato existentes, posicionamento de concorrentes e necessidades de stakeholders internos
2. **Desenvolvimento de Estratégia de Marca** — Definiu valores, personalidade, voz através de workshops colaborativos com liderança
3. **Exploração de Identidade Visual** — Desenvolveu múltiplas direções visuais enraizadas na estratégia, testadas em contextos de produto e marketing
4. **Design de Sistema** — Construiu componentes escaláveis: cor, tipografia, iconografia, ilustração, fotografia
5. **Documentação & Ferramentas** — Criou Brand Book v2 abrangente no Figma, permitindo adoção e execução consistente

### Ferramentas & Tecnologias
- **Figma**: Plataforma primária de design e documentação
- **Frameworks de Estratégia de Marca**: Mapeamento de personalidade, análise de espectro de voz, pirâmide de marca
- **Metodologia de Design Systems**: Princípios de atomic design, bibliotecas de componentes
- **Sistemas de Ilustração**: Linguagem visual baseada em movimento, sistema de luz laranja
- **Iconografia**: Sistema de ícones multi-estilo (Light, Bold, Solid)

---

## Impacto & Resultados

### Impacto Organizacional
- **Experiência de Marca Unificada**: Identidade visual e verbal consistente em mais de 100 localizações edge e 20.000+ aplicações hospedadas
- **Adoção Cross-Funcional**: Sistema adotado com sucesso por times de design, marketing, produto e engenharia
- **Suporte a Investimento**: Fundações de marca contribuíram para rodadas de financiamento lideradas por Monashees e Qualcomm Ventures
- **Fundação Escalável**: Possibilitou expansão rápida mantendo coerência de marca

### Impacto no Produto
- **Comunicação dos Quatro Pilares**: Diferenciação clara das capacidades Build, Secure, Deploy, Observe
- **Apelo ao Desenvolvedor**: Posicionamento "Construída para empresas, amada por desenvolvedores" alcançado
- **Credibilidade Empresarial**: Presença de marca profissional e confiante apoiando vendas B2B

---

## Entregas

- Azion Brand Book v2 (documento Figma abrangente)
- Sistema de Identidade Visual (paleta de cores, tipografia, uso de logo, variações cromáticas)
- Diretrizes de Ilustração (linguagem visual baseada em movimento, sistema de luz, representações de edge computing)
- Biblioteca de Ícones (ícones de Produto, Sistema e Marca em estilos Light, Bold, Solid)
- Diretrizes de Fotografia (tratamento, composição, regras de uso, padrões de screenshot)
- Guia de Voz & Tom (princípios de escrita, exemplos de headlines, glossário, processo de copyediting)
- Templates de Comunicação (formatos de redes sociais, email, apresentação)
- Framework dos Pilares de Produto (identidade visual e verbal para Build, Secure, Deploy, Observe)

---

## Créditos

Este projeto foi possível graças a um time talentoso de designers e profissionais de marca:

- **Morgana Johann** — Design Manager — [LinkedIn](https://www.linkedin.com/in/morgana-johann/)
- **Fernanda Mizzin** — Brand Manager — [LinkedIn](https://www.linkedin.com/in/fernandamizzin/)
- **Guilherme Ganc** — [LinkedIn](https://www.linkedin.com/in/guilherme-ganc-53961089/)
- **Danusa Araújo** — [LinkedIn](https://www.linkedin.com/in/danusa-c/)
- **Gabriela Kuhn** — [LinkedIn](https://www.linkedin.com/in/gabrielakuhn/)
- **Mateus Moura** — [LinkedIn](https://www.linkedin.com/in/mateus-moura-536681136/)
- **Nathalia Oliveira** — [LinkedIn](https://www.linkedin.com/in/nathaliapoliveira/)

---

## Downloads

- [Azion Brand Book v2 (PDF)](https://www.caioogata.com/projects/azion-brand-system/azion-brand-book-v2.pdf)

---

*Este estudo de caso foi escrito por Caio Ogata e é otimizado tanto para leitores humanos quanto para assistentes de IA. Para mais informações, visite [https://www.caioogata.com](https://www.caioogata.com).*

*Última atualização: ${today}*`
}
