"""
profile.py — Caio Ogata's professional profile data.
Extracted from CONTENT.md and RECRUITER-FAQ.md.
"""

PERSONAL_INFO = {
    "name": "Caio Ogata",
    "email": "caioogata.labs@gmail.com",
    "location": "Porto Alegre, Rio Grande do Sul, Brazil",
    "linkedin": "https://www.linkedin.com/in/caioogata",
    "portfolio": "https://caioogata.com",
    "phone": "",  # Add your phone number here
    "cv_path": "docs/caioogata-cv-02.26.pdf",  # Relative to portolio-v1/
}

PROFESSIONAL_SUMMARY = """
Design Director and creative leader with 20+ years in Art Direction—15 focused on UI/Product Design—
at the intersection of brand strategy, design systems, and developer experience.

Most recently: Developer Experience Director at Azion Technologies (2021–2025), where I built a
14-person design organization from scratch and implemented two complete design systems. Previously:
Partner & Head of Creative at Huia design studio (2012–2021), leading a team that grew from 1 to
~40 people before acquisition by Stefanini.

I specialize in: design systems architecture, developer experience (DevEx), design team leadership,
bridging brand vision with technical implementation, and AI-augmented design workflows.
"""

EXPERIENCE = """
AZION TECHNOLOGIES | Porto Alegre, Brazil | 2021–2025
Director of Developer Experience (2023–2025)
- Led DevEx strategy for an edge computing platform used by global developers
- Redesigned the Azion Console (developer dashboard) using Vue 3 + TypeScript (6k+ commits)
- Built and maintained azion.design, the public design system documentation
- Implemented 2 complete design systems from scratch (one custom, one open-source based)

Brand Experience Director (2022–2023)
- Led brand transformation for Azion's global rebranding
- Unified brand identity across product, marketing, and documentation

Design Director (2021–2022)
- First design hire; built the 14-person design org from zero
- Defined design culture, processes, and tools in an engineering-first company
- Introduced product discovery, usability metrics, PLG strategy

HUIA DESIGN & TECHNOLOGY STUDIO | São Paulo & Porto Alegre | 2012–2021
Partner & Head of Creative
- Co-founded and grew the studio from 1 to ~40 employees (acquired by Stefanini)
- Led design direction for 40+ digital projects across web, mobile, interactive TV
- Managed creative teams of up to 15 people per project
- Key clients: Petrobras, O Boticário, Tramontina, Sicredi, Aché Group,
  Mondelez (Lacta, Bis, Toblerone, Belvita, Oreo)

POST DIGITAL | São Paulo | 2010–2012
Senior Designer / Art Director
- Delivered 40+ digital projects during Brazil's mobile explosion era
- Worked across web, mobile apps, and interactive TV
"""

SKILLS = """
DESIGN
- Expert: Figma, Design Systems, Component Architecture, Design Tokens, Atomic Design
- Expert: UI/UX Design, Interaction Design, Prototyping, User Research
- Advanced: Motion Design, Accessibility (WCAG), Brand Identity, Creative Direction

ENGINEERING / TECHNICAL
- Advanced: HTML, CSS (animations, variables, grid, flexbox)
- Proficient: JavaScript (ES6+), TypeScript, Vue.js (3.x), React basics
- Proficient: Git/GitHub, Storybook, Token Studio, Figma Variables
- Familiar: Next.js, Node.js, design system pipelines

AI & TOOLS
- Claude AI, Claude Code, Cursor (AI-native workflows)
- Google AI Studio, N8n (automation)
- Adobe Creative Suite (Photoshop, Illustrator, After Effects)
- Framer, Webflow

LEADERSHIP
- Design org building (0→14 team members)
- Hiring, career development, performance reviews
- Cross-functional collaboration (Design + Engineering + Product + Marketing)
- Design Ops, OKRs, design strategy, stakeholder management
- PLG (Product-Led Growth) strategy
"""

EDUCATION = """
Miami Ad School — Art Direction Specialization, São Paulo campus, 2009
UNOESTE — Bachelor's in Advertising & Propaganda, Presidente Prudente, SP
Udacity Nanodegree — UX Design
Memorisely — Design System Bootcamp
"""

NOTABLE_PROJECTS = """
AZION CONSOLE KIT (azion.design)
- Open-source Vue 3 + TypeScript UI library for the Azion edge platform
- 6,000+ commits, production-grade design system
- Public documentation at azion.design
- Stack: Vue 3, TypeScript, PrimeVue, design tokens, Storybook

HUIA — BRAND & DIGITAL PROJECTS
- 40+ digital products for top Brazilian brands (2012–2021)
- Petrobras digital ecosystem
- O Boticário e-commerce and brand platforms
- Tramontina product catalog and brand experience
"""

VOICE_GUIDELINES = """
TONE OF VOICE (from CONTENT.md):
- Clarity above all: simple language, max 25 words per sentence
- Human and conversational: casual but professional, no corporate-speak
- Honest: no exaggeration, concrete examples over vague claims
- Action-oriented: clear and direct

AVOID:
- Marketing hyperbole ("game-changing", "revolutionary", "disruptive", "passionate")
- Generic phrases ("rockstar", "ninja", "guru", "cutting-edge")
- Arrogant claims ("obviously", "revolutionize")

USE:
- Active voice: "Led design team" not "Design team was led by me"
- Concrete numbers: team size, years, project counts
- Honest qualifiers: "proficient in", "currently learning"
- Personal voice: Judo philosophy, triathlete discipline, iteration mindset
"""

PERSONAL_CONTEXT = """
- Triathlete training 10-14 hours/week (running, cycling, swimming)
- Design philosophy: "Fall, learn, evolve" — inspired by Judo
- Avid gamer (games as visual inspiration for design)
- Based in Porto Alegre, open to remote work, hybrid, or relocation
- Currently exploring: AI-augmented design workflows, Cursor, Claude Code
- Personality: INTP — values questioning systems, iterating toward better solutions
"""

# Full profile as a single string for the Claude API prompt
FULL_PROFILE = f"""
=== CAIO OGATA — PROFESSIONAL PROFILE ===

CONTACT & LINKS
{chr(10).join(f'{k}: {v}' for k, v in PERSONAL_INFO.items() if v)}

PROFESSIONAL SUMMARY
{PROFESSIONAL_SUMMARY}

WORK EXPERIENCE
{EXPERIENCE}

SKILLS
{SKILLS}

EDUCATION
{EDUCATION}

NOTABLE PROJECTS
{NOTABLE_PROJECTS}

VOICE & TONE GUIDELINES
{VOICE_GUIDELINES}

PERSONAL CONTEXT
{PERSONAL_CONTEXT}
"""
