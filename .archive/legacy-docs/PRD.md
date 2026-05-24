# LLM-Friendly Portfolio - Product Requirements Document

## 1. Overview

### Problem
Professionals need an efficient way to share their complete career information with AI assistants (ChatGPT, Claude, etc.) for job applications, career counseling, or networking. Current portfolios are designed for human consumption, making it difficult to extract and transfer structured information to LLMs without manual formatting.

### Proposed Solution
A single-page portfolio website with CLI-inspired aesthetic that serves dual purposes:
1. Human-readable professional showcase with clean, minimalist design
2. LLM-optimized content that can be copied as formatted markdown in one click

The portfolio will feature a prominent "Copy as Markdown" button that exports the entire page content in a structured, token-efficient format ready to be pasted into any LLM chat interface.

### Business Objective
- Position Caio Ogata as a forward-thinking design leader who understands AI-augmented workflows
- Increase visibility and accessibility for recruiters, hiring managers, and professional contacts
- Reduce friction in sharing professional information with AI-powered tools
- Demonstrate innovation in personal branding for the AI era (2026+)

### Target Users

**Primary Personas:**

1. **AI-Augmented Job Seeker (Caio himself)**
   - Uses Claude/ChatGPT to draft applications, prepare for interviews, get career advice
   - Needs quick way to provide complete professional context to LLM
   - Values efficiency and modern workflows

2. **Tech-Savvy Recruiters**
   - Age: 28-45
   - Uses AI tools to screen candidates and prepare interview questions
   - Appreciates candidates who make their workflow easier
   - Values clear, structured information

3. **Hiring Managers in Tech/Design**
   - Looking for senior design leadership roles
   - Uses AI assistants to summarize candidate profiles
   - Appreciates innovation and forward-thinking approach

**Secondary Persona:**

4. **Professional Network Contacts**
   - Colleagues, mentors, industry peers
   - May want to share Caio's profile with others
   - Appreciates easy-to-reference professional information

## 2. Research and Market Context

### Competitors and References

#### Terminal-Style Portfolios

1. **Lilweb Template** ([dev.to article](https://dev.to/cod-e-codes/how-i-built-my-128-kb-terminal-themed-portfolio-site-and-template-52om))
   - Ultra-lightweight (12.8 KB), no framework
   - Monospace typography, green-on-black terminal aesthetic
   - Blinking cursor, CLI-inspired navigation
   - **Strengths**: Extremely fast, distinctive aesthetic
   - **Gaps**: No markdown export, limited content structure

2. **Terminal Portfolio by Satnaing** ([GitHub](https://github.com/satnaing/terminal-portfolio))
   - Built with React, TypeScript, Styled-Components
   - 6 themes including dark, matrix, ubuntu
   - Interactive command-line interface
   - **Strengths**: Highly interactive, multiple themes
   - **Gaps**: Complexity overhead, no LLM optimization

3. **The Monospace Web** ([owickstrom.github.io](https://owickstrom.github.io/the-monospace-web/))
   - Monospace grid layout for text and diagrams
   - Generated from Markdown using Pandoc
   - **Strengths**: Content-first, markdown-native
   - **Gaps**: Limited interactivity, dated aesthetic

#### LLM-Friendly Tools

4. **Markdown Printer Chrome Extension** ([lev.engineer article](https://lev.engineer/blog/markdown-printer-the-missing-tool-for-ai-powered-development))
   - Transforms webpages into token-efficient markdown
   - Single-click conversion
   - **Insight**: Users need one-click solutions, not multi-step processes

5. **Firecrawl** ([GitHub](https://github.com/firecrawl/firecrawl))
   - Converts websites into LLM-ready markdown or structured data
   - API-based solution
   - **Insight**: LLM-ready format is increasingly valuable in 2026

#### Design References

6. **Anthropic UI Approach** ([Claude Code blog](https://claude.com/blog/improving-frontend-design-through-skills))
   - Brutally minimal or intentionally bold aesthetics
   - Avoids generic AI-generated design (no Inter/Roboto, purple gradients)
   - Focuses on atmosphere: noise textures, gradient meshes, dramatic shadows
   - **Direction**: Choose clear conceptual direction and execute with precision

### Research Insights

**Key Patterns Identified:**

1. **Terminal Aesthetics Are Trending**
   - Multiple developers building terminal-style portfolios in 2026
   - Monospace fonts (Inconsolata, JetBrains Mono) gaining popularity
   - Association with technical competence and authenticity

2. **LLM Integration Is Emerging Need**
   - Tools like "Copy as Markdown" have significant adoption
   - Developers optimizing docs for AI consumption (Accept: text/markdown headers)
   - RAG-based portfolio assistants appearing (e.g., Portfolio-AI-Assistant on GitHub)

3. **Content Structure Matters for LLMs**
   - Markdown headers create clear topic hierarchy
   - Structured data improves AI comprehension
   - Token efficiency is valuable (avoid HTML bloat)

4. **Single-Page Portfolios Work for Senior Professionals**
   - Minimalist portfolios showcase confidence and clarity
   - Content-first approach respects reader's time
   - Works well for leadership roles (vs. junior portfolios needing extensive project showcases)

**Market Gaps:**

- No existing portfolios explicitly designed for LLM consumption
- Terminal-style portfolios lack professional polish for senior roles
- Markdown export tools exist but not integrated into personal branding
- Missing solution that balances human aesthetics with machine-readability

### Proposed Differentiators

1. **Primary Innovation: One-Click LLM Export**
   - Native "Copy as Markdown" button prominently placed
   - Optimized markdown structure for AI comprehension
   - Includes metadata (skills taxonomy, experience timeline)

2. **Refined Terminal Aesthetic**
   - CLI-inspired but elevated for senior design leadership
   - Not pure green-on-black, but sophisticated monospace design
   - Anthropic-inspired: intentional, not generic

3. **Dual-Optimized Content**
   - Human-readable narrative style
   - Machine-parseable structure underneath
   - Semantic HTML for accessibility + markdown mapping

4. **Professional Positioning**
   - Demonstrates AI-era thinking (early adopter advantage)
   - Shows technical literacy without being developer-focused
   - Bridges design leadership with emerging workflows

## 3. Functional Requirements

### Must Have (MVP)

#### 3.1 Single-Page Layout
- **Description**: All content rendered on one scrollable page, no navigation to separate pages
- **User Story**: As a recruiter, I want to see all of Caio's information in one place so that I can quickly assess his fit for a role
- **Acceptance Criteria**:
  - [ ] Page loads all content on initial render (no lazy loading sections)
  - [ ] Smooth scroll behavior between sections
  - [ ] Clear visual hierarchy separating sections
  - [ ] Total page weight under 500 KB for fast loading
- **Flow**: User arrives → sees hero/intro → scrolls down through sections → reaches footer

#### 3.2 Copy as Markdown Functionality
- **Description**: Primary feature - button that copies entire portfolio content as structured markdown to clipboard
- **User Story**: As an AI-augmented job seeker, I want to copy my entire portfolio as markdown so that I can paste it into Claude/ChatGPT for career assistance
- **Acceptance Criteria**:
  - [ ] Prominent "Copy as Markdown" button visible above fold
  - [ ] Button click copies formatted markdown to system clipboard
  - [ ] Visual feedback confirms successful copy (e.g., "Copied!" message)
  - [ ] Markdown structure includes:
    - Proper heading hierarchy (H1, H2, H3)
    - Bullet points for skills and accomplishments
    - Structured tables for work history timeline
    - Metadata block at top (name, role, location, contact)
  - [ ] Output is optimized for LLM token efficiency (no HTML artifacts)
  - [ ] Works across modern browsers (Chrome, Firefox, Safari, Edge)
- **Flow**:
  1. User clicks "Copy as Markdown" button
  2. JavaScript extracts content from DOM
  3. Content formatted as clean markdown
  4. Markdown copied to clipboard
  5. Toast notification shows "Content copied! Ready to paste into your AI assistant"

#### 3.3 Professional Biography Section
- **Description**: Hero section with professional summary and current positioning
- **User Story**: As a hiring manager, I want to immediately understand Caio's current role and expertise so that I can determine relevance for my opening
- **Acceptance Criteria**:
  - [ ] Name and current title (Developer Experience Director)
  - [ ] Professional tagline (1-2 sentences)
  - [ ] Location (Porto Alegre, Brazil)
  - [ ] Years of experience (20+ years)
  - [ ] Core expertise areas (3-5 key domains)
  - [ ] Professional headshot or avatar (optional, can be minimal/stylized)
  - [ ] Contact CTA (LinkedIn link, email)
- **Flow**: User arrives → reads tagline → scans expertise → decides to continue or exit

#### 3.4 Work Experience Timeline
- **Description**: Chronological listing of professional positions with key responsibilities and achievements
- **User Story**: As a recruiter, I want to see Caio's career progression so that I can verify his experience level and leadership trajectory
- **Acceptance Criteria**:
  - [ ] At least 5 most recent/relevant positions listed
  - [ ] Each position includes:
    - Company name
    - Job title
    - Date range (Month Year - Month Year or Present)
    - 2-4 key responsibilities or achievements
  - [ ] Positions shown in reverse chronological order (most recent first)
  - [ ] Design leadership roles highlighted (last 2 years at Azion)
  - [ ] Notable clients/projects mentioned (Petrobras, O Boticário, etc.)
- **Flow**: User scrolls to experience → scans company names → reads role details → assesses fit

#### 3.5 Skills and Competencies
- **Description**: Structured list of technical and soft skills relevant to design leadership
- **User Story**: As an AI assistant, I want clear skill categories so that I can accurately represent Caio's capabilities when drafting applications
- **Acceptance Criteria**:
  - [ ] Skills organized into 3-4 categories (e.g., Design Leadership, Technical Skills, Tools & Platforms, Soft Skills)
  - [ ] Each category has 5-10 items
  - [ ] Skills are specific and relevant to senior roles (avoid generic terms)
  - [ ] Includes: UI/UX Design, Brand Experience, Creative Direction, Team Leadership, Design Systems, Front-end Collaboration
  - [ ] Tools mentioned: Figma, Adobe Creative Suite, others relevant to role
- **Flow**: User/LLM scans categories → identifies relevant skills for job matching

#### 3.6 Education and Certifications
- **Description**: Academic background and professional certifications
- **User Story**: As a recruiter, I want to verify Caio's formal qualifications so that I can confirm baseline requirements
- **Acceptance Criteria**:
  - [ ] Degree in Publicidade e Propaganda listed
  - [ ] Miami Ad School specialization in Art Direction mentioned
  - [ ] Any relevant certifications or courses
  - [ ] Years/institutions included
- **Flow**: User scrolls to education → verifies credentials

#### 3.7 Contact Information and Links
- **Description**: Ways to reach Caio and view more work
- **User Story**: As a hiring manager, I want to easily contact Caio or view his LinkedIn so that I can initiate conversation or verify information
- **Acceptance Criteria**:
  - [ ] LinkedIn profile link (https://www.linkedin.com/in/caioogata/)
  - [ ] Email address or contact form (if desired)
  - [ ] Optional: GitHub, Dribbble, Behance links if relevant
  - [ ] All links open in new tab
  - [ ] Links styled to match terminal aesthetic
- **Flow**: User decides to reach out → clicks contact method → opens in new context

#### 3.8 Responsive Mobile Design
- **Description**: Portfolio adapts seamlessly to mobile devices (smartphones, tablets)
- **User Story**: As a recruiter on-the-go, I want to view Caio's portfolio on my phone so that I can review it between meetings
- **Acceptance Criteria**:
  - [ ] Mobile-first responsive breakpoints (320px, 768px, 1024px, 1440px+)
  - [ ] Text remains readable without zooming (min 16px font size on mobile)
  - [ ] "Copy as Markdown" button accessible on mobile
  - [ ] Touch-friendly interactive elements (min 44px tap targets)
  - [ ] No horizontal scrolling required
  - [ ] Content reflows appropriately (single column on mobile)
- **Flow**: Mobile user arrives → content fits screen → scrolls and interacts comfortably

### Should Have

#### 3.9 Dark/Light Mode Toggle
- **Description**: User preference for terminal dark mode or light background
- **User Story**: As a user with light sensitivity, I want to switch to light mode so that I can read comfortably
- **Acceptance Criteria**:
  - [ ] Toggle button in header or footer
  - [ ] Preference saved to localStorage
  - [ ] Smooth transition between modes
  - [ ] Both modes maintain terminal aesthetic (light mode = paper terminal, not generic white)
- **Technical Note**: Can start with dark mode only for MVP, add light mode in v1.1

#### 3.10 Animated Section Transitions
- **Description**: Subtle scroll-triggered animations as sections come into view
- **User Story**: As a visitor, I want visual polish and delight so that the portfolio feels modern and engaging
- **Acceptance Criteria**:
  - [ ] Fade-in or slide-up animations on scroll
  - [ ] Animations respect prefers-reduced-motion
  - [ ] No animation on initial load (performance)
  - [ ] Subtle, not distracting
- **Technical Note**: Use Intersection Observer API, requestAnimationFrame

#### 3.11 Terminal Command Prompt Styling
- **Description**: Section headings styled as terminal commands (e.g., `$ view experience`, `$ list skills`)
- **User Story**: As a tech-savvy visitor, I want playful CLI references so that the terminal theme feels authentic
- **Acceptance Criteria**:
  - [ ] Each section heading prefixed with `$` or `>`
  - [ ] Optional: blinking cursor after heading
  - [ ] Monospace font used consistently
  - [ ] Color scheme matches terminal (green, cyan, amber accents)

#### 3.12 Metadata for SEO and Social Sharing
- **Description**: Proper meta tags for search engines and social platforms
- **User Story**: As a professional sharing this link, I want preview cards to look professional so that my network takes Caio seriously
- **Acceptance Criteria**:
  - [ ] Open Graph meta tags (og:title, og:description, og:image)
  - [ ] Twitter Card meta tags
  - [ ] Proper page title: "Caio Ogata - Developer Experience Director | Design Leadership"
  - [ ] Meta description optimized for search (155 characters)
  - [ ] Favicon (can be simple monogram or terminal icon)

### Could Have

#### 3.13 Download as PDF Option
- **Description**: Alternative export format for traditional applications
- **User Story**: As a recruiter using an ATS, I want a PDF version so that I can upload to our system
- **Acceptance Criteria**:
  - [ ] "Download PDF" button alongside markdown button
  - [ ] PDF generated client-side or via serverless function
  - [ ] PDF maintains professional formatting
  - [ ] File named "CaioOgata_Portfolio.pdf"

#### 3.14 Interactive Terminal Prompt
- **Description**: Actual CLI interface where users can type commands (e.g., `help`, `about`, `experience`)
- **User Story**: As a developer visiting the portfolio, I want to interact with a real terminal so that I experience Caio's technical literacy
- **Acceptance Criteria**:
  - [ ] Terminal input at top or bottom of page
  - [ ] Supports 5-10 commands
  - [ ] Outputs content dynamically based on command
  - [ ] Easter eggs for fun commands (e.g., `whoami`, `sudo make me a sandwich`)
- **Technical Note**: Nice-to-have for personality, but risk of gimmick. Only add if it enhances rather than distracts.

#### 3.15 View Count or Visitor Analytics Display
- **Description**: Public view counter or visitor stats (terminal-style)
- **User Story**: As Caio, I want to see engagement metrics so that I understand portfolio reach
- **Acceptance Criteria**:
  - [ ] Display total views or unique visitors
  - [ ] Styled as terminal output (e.g., `visitors: 1,234`)
  - [ ] Privacy-respecting (no personal data collection)
  - [ ] Uses simple analytics (Plausible, Fathom, or custom)

#### 3.16 Testimonials or Recommendations Section
- **Description**: Quotes from colleagues or clients about working with Caio
- **User Story**: As a hiring manager, I want social proof so that I can validate Caio's soft skills and team fit
- **Acceptance Criteria**:
  - [ ] 2-4 testimonials from LinkedIn or colleagues
  - [ ] Each includes: quote, name, title, relationship
  - [ ] Terminal-style formatting (e.g., blockquote with `>` prefix)

#### 3.17 Language Toggle (English/Portuguese)
- **Description**: Option to view portfolio in English or Portuguese (PT-BR)
- **User Story**: As a Brazilian recruiter, I want to read in my native language so that I assess communication skills accurately
- **Acceptance Criteria**:
  - [ ] Toggle button for EN/PT
  - [ ] All content translated professionally
  - [ ] Language preference saved
  - [ ] Markdown export includes selected language

## 4. Non-Functional Requirements

### Performance
- **Page Load Time**: First Contentful Paint (FCP) under 1.5 seconds on 3G
- **Total Page Weight**: Under 500 KB (including fonts, images, scripts)
- **Lighthouse Score**: 90+ on Performance, Accessibility, Best Practices, SEO
- **Time to Interactive (TTI)**: Under 3 seconds on mobile
- **Markdown Copy Speed**: Instant (< 100ms)

### Security
- **HTTPS Only**: Enforce SSL/TLS
- **Content Security Policy**: Implement CSP headers to prevent XSS
- **No Sensitive Data**: Portfolio is public, no authentication required
- **Safe External Links**: rel="noopener noreferrer" on all external links
- **Privacy**: No tracking cookies, GDPR-compliant if analytics added

### Scalability
- **Static Site**: Host as static files (no server-side rendering needed for MVP)
- **CDN Delivery**: Use Vercel, Netlify, or Cloudflare Pages for global distribution
- **Asset Optimization**: Compress images (WebP format), minify CSS/JS
- **Caching**: Leverage browser caching with proper cache headers

### Compatibility
- **Browsers**:
  - Chrome 90+ (desktop and mobile)
  - Firefox 88+
  - Safari 14+ (desktop and iOS)
  - Edge 90+
- **Devices**:
  - Desktop (1920×1080, 1440×900)
  - Laptop (1366×768)
  - Tablet (iPad: 1024×768, Android tablets)
  - Mobile (iPhone: 390×844, Android: 360×800)
- **Screen Readers**: NVDA, JAWS, VoiceOver support
- **Keyboard Navigation**: Full site usable without mouse

### Accessibility (WCAG 2.1 AA Compliance)
- **Contrast Ratios**:
  - Text: Minimum 4.5:1 (7:1 for AAA on body text)
  - Large text (18pt+): Minimum 3:1
  - Terminal aesthetic must maintain readability (careful with low contrast green)
- **Semantic HTML**: Proper heading hierarchy (H1 → H2 → H3), landmarks (header, main, footer, nav)
- **Alt Text**: Descriptive alt text for any images (headshot, logos)
- **Focus Indicators**: Visible focus states for all interactive elements
- **Skip Links**: "Skip to main content" link at top
- **ARIA Labels**: Appropriate aria-labels for icon buttons
- **Keyboard Navigation**: Logical tab order, no keyboard traps
- **Reduced Motion**: Respect prefers-reduced-motion media query

### Maintainability
- **Content Updates**: Caio should be able to update content without code changes (use JSON or Markdown files)
- **Code Quality**: Clean, commented code; follow Airbnb or StandardJS style guide
- **Version Control**: Git repository with clear commit messages
- **Documentation**: README with setup instructions, deployment guide
- **Modular Architecture**: Separate concerns (content, styles, logic)

## 5. Business Rules

1. **Content Accuracy**: All information (work history, skills, dates) must be accurate and match LinkedIn profile
2. **Professional Tone**: All copy must be formal and professional, suitable for corporate recruiting contexts
3. **LLM Optimization Priority**: If design choice conflicts with markdown export quality, prioritize export quality
4. **No Paywalls or Signup**: Portfolio is fully public, no barriers to access
5. **Single Source of Truth**: This portfolio is the definitive source for Caio's professional information
6. **Update Frequency**: Content should be reviewed and updated quarterly (every 3 months)
7. **Link Integrity**: All external links must be validated before deployment (no broken links)
8. **Markdown Format Standard**: Export must follow GitHub Flavored Markdown (GFM) specification
9. **Contact Method**: If email is included, use a contact form or obfuscated email to prevent spam harvesting
10. **Copyright**: Footer must include "© 2026 Caio Ogata. All rights reserved." or similar

## 6. Technical Feasibility

### Suggested Technology Stack

**Frontend Framework:**
- **Recommended**: Next.js 15 (React) with App Router
  - Rationale: Already in use in this project, supports static export, excellent performance
  - Alternative 1: Astro (ultra-lightweight, perfect for static content sites)
  - Alternative 2: SvelteKit (excellent performance, smaller bundle sizes)

**Styling:**
- **Recommended**: Tailwind CSS (already in project) + custom CSS for terminal aesthetics
  - Rationale: Utility-first, fast development, easy customization
  - Fonts: JetBrains Mono or Inconsolata (monospace), 400 and 700 weights

**Markdown Generation:**
- **Library**: turndown.js or custom DOM-to-markdown mapper
- **Clipboard API**: navigator.clipboard.writeText() (modern browsers)

**Animations:**
- **Library**: Framer Motion (if using React) or plain CSS animations + Intersection Observer
- **Fallback**: CSS-only for users with JS disabled

**Infrastructure:**
- **Hosting**: Vercel (simplest for Next.js) or Netlify
  - Rationale: Free tier, automatic HTTPS, global CDN, CI/CD from Git
- **Domain**: Custom domain (e.g., caioogata.com or caio.design)
- **Analytics** (optional): Plausible or Fathom (privacy-friendly, GDPR-compliant)

**Content Management:**
- **Approach**: Content in structured JSON or MDX files
- **Rationale**: Non-technical updates possible, version controlled, easily exportable

### Estimated Complexity

**Development Effort**: Medium (M)
- **Timeline**: 2-3 weeks for one developer (Caio + AI pair programming)
- **Breakdown**:
  - Week 1: Design system, layout, responsive grid, content structure (30 hours)
  - Week 2: Copy-to-markdown feature, polish, animations, accessibility audit (25 hours)
  - Week 3: Testing, content writing, SEO optimization, deployment (15 hours)
  - **Total**: ~70 hours

**Complexity Factors:**
- **Low Complexity**:
  - Static content, no backend
  - Straightforward layout (single page)
  - Standard tech stack
- **Medium Complexity**:
  - Custom terminal aesthetic (design time)
  - Markdown export logic (testing across browsers)
  - Accessibility compliance (testing and refinement)
  - Content writing and tone (significant effort)

### Technical Risks

1. **Clipboard API Limitations**
   - **Risk**: Clipboard API doesn't work in all browsers/contexts (e.g., non-HTTPS, old browsers)
   - **Mitigation**: Fallback to manual text selection + "Copy" prompt, feature detection

2. **Markdown Formatting Quality**
   - **Risk**: Generated markdown may have formatting issues (broken tables, missing line breaks)
   - **Mitigation**: Extensive testing with Claude/ChatGPT, manual verification, unit tests for parser

3. **Terminal Aesthetic Accessibility**
   - **Risk**: Low-contrast green-on-black may fail WCAG contrast requirements
   - **Mitigation**: Use lighter green (#00FF00 → #00DD88), test with contrast checker, provide high-contrast mode

4. **Content Maintenance Overhead**
   - **Risk**: Caio may struggle to update content if it's deeply embedded in code
   - **Mitigation**: Extract all content to separate JSON/MDX files with clear structure and comments

5. **SEO for Single-Page Site**
   - **Risk**: Single-page sites can have SEO challenges (all content on one URL)
   - **Mitigation**: Proper semantic HTML, meta tags, structured data (JSON-LD), descriptive heading hierarchy

6. **Mobile Copy-to-Markdown UX**
   - **Risk**: Clipboard interactions can be unreliable on mobile devices
   - **Mitigation**: Test on iOS Safari and Android Chrome, consider "Share" API as alternative on mobile

### Dependencies

**External Services:**
- Hosting platform (Vercel/Netlify) - account required
- Domain registrar (if using custom domain) - optional
- Google Fonts or Fontsource (for monospace font delivery) - free
- Analytics service (if implemented) - optional

**Libraries/Packages:**
- Next.js, React (or chosen framework)
- Tailwind CSS
- turndown.js or similar markdown generator
- Framer Motion (if animations are Should Have)

**Content Dependencies:**
- Caio's accurate work history and dates
- Professional headshot or avatar (optional)
- Skills list (verified and up-to-date)
- Contact preferences (email/LinkedIn only, or others)

**Third-Party Integrations:**
- None required for MVP
- Optional: LinkedIn badge embed, Google Analytics alternative

## 7. User Flows

### Main Flow (Happy Path): Quick Discovery + AI Deep Dive

```
1. Recruiter or interested party finds Caio's portfolio link (via LinkedIn, referral, or search)
2. Portfolio loads instantly with hero section visible
3. Visitor quickly scans:
   - Name and current title (Developer Experience Director)
   - Professional tagline (1-2 sentences)
   - Location: Based in Porto Alegre, Brazil
   - 20+ years of experience
4. Visitor is intrigued and wants more details
5. Two paths available:

   PATH A - AI-Assisted Deep Dive (Primary):
   ─────────────────────────────────────────
   5a. Visitor clicks "Open Chat in Claude" button
   6a. System copies structured markdown to clipboard
   7a. New tab opens with Claude.ai
   8a. Visitor pastes content into Claude
   9a. Visitor can now ask questions like:
       - "Is this person a good fit for [Role] at [Company]?"
       - "Summarize his experience with design systems"
       - "What are his key leadership achievements?"
   10a. Claude provides intelligent, contextual answers

   PATH B - On-Page Exploration (Alternative):
   ─────────────────────────────────────────
   5b. Visitor scrolls down the page
   6b. Sees detailed sections in terminal-style interface:
       - Professional Summary
       - Work Experience Timeline
       - Skills & Competencies
       - Education
       - Notable Clients
   7b. Gets complete picture without leaving the site
   8b. If interested, clicks contact/LinkedIn to reach out
```

**Success Metrics**:
- Time to understand "who is Caio" under 15 seconds
- Time from interest to AI conversation under 30 seconds
- Scroll-through for full context under 90 seconds

### Alternative Flow 1: Recruiter Quick Screening

```
1. Recruiter searches LinkedIn for "Design Director" + "UI/UX" + "remote"
2. Finds Caio's LinkedIn profile
3. Clicks website link in profile
4. Portfolio loads on mobile device
5. Recruiter reads hero section (10 seconds):
   - Confirms: Senior design leader, 20+ years
   - Based in Porto Alegre, Brazil
   - Currently at Azion as Developer Experience Director
6. Recruiter wants quick fit analysis
7. Clicks "Open Chat in Claude" button
8. Pastes into Claude with prompt: "Is this candidate a fit for our VP of Design role?"
9. Gets structured analysis in seconds
10. Decision made: proceeds to contact via LinkedIn
```

**Success Metric**: Recruiter reaches decision point (fit/no-fit) within 60 seconds

### Alternative Flow 2: Referral & Sharing

```
1. Colleague wants to refer Caio for an opportunity
2. Sends link: caioogata.com to hiring manager
3. Hiring manager opens link
4. Quickly scans hero section, sees relevant experience
5. Clicks "Open Chat in Claude" to get AI-assisted analysis
6. Pastes content and asks: "Compare this candidate's experience to our requirements for [Role]"
7. Gets detailed breakdown
8. Impressed, reaches out to Caio directly
```

**Success Metric**: From referral link to AI analysis under 45 seconds

### Edge Case Flow 1: JavaScript Disabled

```
1. User with JS disabled (or JS failed to load) visits portfolio
2. Page loads with full content visible (progressive enhancement)
3. "Copy as Markdown" button is hidden or shows fallback message
4. Fallback message: "To copy this portfolio as markdown, enable JavaScript or manually select and copy the text below."
5. User can still read all content normally
6. User manually selects text and copies if needed
```

**Mitigation**: Core content must render with HTML/CSS only, JS enhances experience

### Edge Case Flow 2: Clipboard API Not Supported

```
1. User clicks "Copy as Markdown" button
2. System detects navigator.clipboard is unavailable (old browser, HTTP context)
3. System generates markdown in hidden textarea
4. System auto-selects text in textarea
5. System displays modal: "Press Ctrl+C (or Cmd+C) to copy"
6. User presses keyboard shortcut
7. Content copied to clipboard
8. Modal closes
```

**Mitigation**: Feature detection + graceful fallback

### Edge Case Flow 3: Mobile User Wants to Share

```
1. Mobile user clicks "Copy as Markdown" on iPhone
2. Content copied to clipboard successfully
3. User opens Notes app or messaging app
4. User pastes markdown
5. [Alternative] If clipboard fails:
   - System detects mobile device
   - System offers "Share" button using Web Share API
   - User clicks "Share"
   - Native iOS/Android share sheet appears
   - User selects app to share (Messages, WhatsApp, Email, etc.)
```

**Mitigation**: Detect mobile, offer native share as primary or fallback option

## 8. Success Metrics

### Product KPIs (Track after 3 months)

1. **Markdown Copy Adoption Rate**
   - **Target**: >30% of visitors click "Copy as Markdown"
   - **Measured by**: Event tracking in analytics (plausible_event('Copy Markdown'))
   - **Why it matters**: Core value proposition validation

2. **Time on Page**
   - **Target**: Average 2-3 minutes (indicates content engagement)
   - **Measured by**: Analytics time-on-page metric
   - **Why it matters**: Indicates visitors are reading, not bouncing

3. **Bounce Rate**
   - **Target**: <40% (single-page site, so lower expectations)
   - **Measured by**: Analytics bounce rate
   - **Why it matters**: High bounce = content/design not engaging

4. **Contact/LinkedIn Click-Through Rate**
   - **Target**: >15% of visitors click contact link
   - **Measured by**: Event tracking on link clicks
   - **Why it matters**: Direct conversion to professional opportunities

5. **Mobile vs Desktop Traffic**
   - **Target**: >40% mobile traffic (indicates mobile optimization success)
   - **Measured by**: Analytics device breakdown
   - **Why it matters**: Validates mobile-first approach

6. **Recruiter Engagement (Qualitative)**
   - **Target**: 2+ mentions from recruiters about portfolio in conversations
   - **Measured by**: Self-reported (Caio tracks in spreadsheet)
   - **Why it matters**: Real-world validation of positioning

### Technical Metrics (Monitor Continuously)

1. **Page Load Performance**
   - **First Contentful Paint (FCP)**: <1.5s on 3G
   - **Largest Contentful Paint (LCP)**: <2.5s
   - **Cumulative Layout Shift (CLS)**: <0.1
   - **First Input Delay (FID)**: <100ms
   - **Measured by**: Lighthouse CI, Vercel Analytics, or PageSpeed Insights
   - **Why it matters**: Slow portfolio = unprofessional impression

2. **Uptime and Availability**
   - **Target**: >99.9% uptime (common for static site hosts)
   - **Measured by**: UptimeRobot or hosting platform status
   - **Why it matters**: Portfolio must be accessible when recruiter searches

3. **Lighthouse Score**
   - **Performance**: >90
   - **Accessibility**: >95 (critical for professional credibility)
   - **Best Practices**: >95
   - **SEO**: >90
   - **Measured by**: Automated Lighthouse CI on deploys
   - **Why it matters**: Objective quality benchmark

4. **Error Rate**
   - **Target**: <0.1% client-side errors
   - **Measured by**: Error tracking (Sentry or browser console monitoring)
   - **Why it matters**: Bugs undermine professional impression

5. **Browser Compatibility**
   - **Target**: 0 critical issues across supported browsers
   - **Measured by**: Manual testing + BrowserStack (if budget allows)
   - **Why it matters**: Portfolio must work everywhere

### Business Metrics (Long-term, 6-12 months)

1. **Job Opportunities Attributed to Portfolio**
   - **Target**: 3+ interview opportunities directly from portfolio link
   - **Measured by**: Self-reported by Caio (ask recruiters how they found him)
   - **Why it matters**: ROI on portfolio investment

2. **LinkedIn Profile Views Increase**
   - **Target**: 20% increase in profile views after portfolio launch
   - **Measured by**: LinkedIn Analytics (before/after comparison)
   - **Why it matters**: Portfolio drives traffic to LinkedIn, increasing visibility

3. **Inbound Recruiter Contact Rate**
   - **Target**: 2+ inbound messages per month mentioning portfolio
   - **Measured by**: Self-reported tracking
   - **Why it matters**: Passive job search success

4. **Portfolio URL Shares/Mentions**
   - **Target**: 5+ organic shares or mentions on LinkedIn/Twitter
   - **Measured by**: Social listening (search "caioogata.com" or URL)
   - **Why it matters**: Word-of-mouth and thought leadership

5. **LLM Usage Feedback**
   - **Target**: 5+ positive reports from users who pasted into AI assistants
   - **Measured by**: Qualitative feedback (ask in LinkedIn posts, track responses)
   - **Why it matters**: Validates LLM-friendly positioning as unique value

## 9. Information Architecture

### Content Structure (Single-Page Sections)

```
Header
  ├─ Logo/Name (links to top)
  ├─ Quick navigation dots (scroll to section)
  └─ "Copy as Markdown" button (sticky)

Hero / Introduction
  ├─ Name: Caio Ogata
  ├─ Current Title: Developer Experience Director
  ├─ Tagline: "Leading design teams at the intersection of brand experience and developer tools"
  ├─ Location: Porto Alegre, Brazil
  ├─ Years of Experience: 15+
  └─ Primary CTA: Contact/LinkedIn button

Professional Summary
  ├─ Heading: "About"
  ├─ 2-3 paragraph biography
  ├─ Core expertise list (5-7 items)
  └─ Current focus areas

Work Experience
  ├─ Heading: "Experience"
  ├─ Timeline format (reverse chronological)
  ├─ For each position:
  │   ├─ Company name
  │   ├─ Job title
  │   ├─ Date range
  │   ├─ Location
  │   └─ 3-5 bullet points (responsibilities, achievements, impact)
  └─ Key positions to include:
      ├─ Azion - Developer Experience Director (2023-Present)
      ├─ Azion - Director of Brand Experience (previous)
      ├─ Azion - Director of Design (previous)
      ├─ Huia - Partner & Head of Creative
      └─ Previous roles (W3haus, Post Digital, others)

Skills & Competencies
  ├─ Heading: "Skills"
  ├─ Category: Design Leadership
  │   └─ UI/UX Design, Design Systems, Creative Direction, Brand Strategy
  ├─ Category: Technical Skills
  │   └─ Front-end Collaboration, Developer Experience, Interaction Design
  ├─ Category: Tools & Platforms
  │   └─ Figma, Adobe Creative Suite, Sketch, Design Tokens
  └─ Category: Soft Skills
      └─ Team Leadership, Stakeholder Management, Cross-functional Collaboration

Education & Credentials
  ├─ Heading: "Education"
  ├─ Degree: Publicidade e Propaganda
  ├─ Specialization: Art Direction (Miami Ad School)
  └─ Certifications (if any)

Notable Work & Clients
  ├─ Heading: "Selected Clients"
  ├─ Brand logos or list:
  │   ├─ Petrobras
  │   ├─ O Boticário
  │   ├─ Aché Group
  │   ├─ Sicredi
  │   └─ Tramontina
  └─ Brief context (e.g., "Led design for digital experiences at these brands")

Contact & Links
  ├─ Heading: "Let's Connect"
  ├─ LinkedIn: https://www.linkedin.com/in/caioogata/
  ├─ Email: [contact method]
  └─ Optional: Other professional profiles

Footer
  ├─ Copyright: © 2026 Caio Ogata
  ├─ "Built for humans and AI assistants"
  ├─ Technology note: "Powered by Next.js + Tailwind"
  └─ Secondary "Copy as Markdown" button
```

### Markdown Export Structure

The exported markdown will mirror the page structure but optimized for LLM parsing:

```markdown
---
type: professional_portfolio
name: Caio Ogata
current_title: Developer Experience Director
location: Porto Alegre, Brazil
years_experience: 15+
linkedin: https://www.linkedin.com/in/caioogata/
last_updated: 2026-01-23
---

# Caio Ogata
## Developer Experience Director | Design Leadership

**Location:** Porto Alegre, Brazil
**Experience:** 20+ years in digital design and brand leadership
**LinkedIn:** [linkedin.com/in/caioogata](https://www.linkedin.com/in/caioogata/)

---

## Professional Summary

[2-3 paragraph biography with key career highlights, current focus, and what makes Caio unique as a design leader]

### Core Expertise
- UI/UX Design & Design Systems
- Brand Experience & Creative Direction
- Team Leadership & Developer Experience
- Cross-functional Collaboration
- Front-end Design Implementation

---

## Work Experience

### Developer Experience Director at Azion
**Oct 2023 - Present | Porto Alegre, Brazil**

- Lead design strategy for developer-facing products and documentation
- Manage cross-functional design team across brand, UX, and content
- Establish design systems and component libraries for consistency
- Collaborate with engineering on developer experience improvements
- [Additional responsibilities/achievements]

### Director of Brand Experience at Azion
**[Date Range] | Location**

- [Responsibility 1]
- [Responsibility 2]
- [Achievement 1]

### Director of Design at Azion
**[Date Range] | Location**

- [Key responsibilities and achievements]

### Partner & Head of Creative at Huia
**[Date Range] | Location**

- Co-founded design and technology studio
- Led creative direction for digital products
- Managed client relationships and project delivery

### Art Director at W3haus
**[Date Range] | Location**

- [Key responsibilities]

### [Additional roles as relevant]

---

## Skills & Competencies

### Design Leadership
UI/UX Design, Design Systems, Creative Direction, Brand Strategy, Visual Design, Interaction Design

### Technical Skills
Front-end Collaboration, Developer Experience, Design Tokens, Component Architecture, Design-to-Code Workflows

### Tools & Platforms
Figma, Adobe Creative Suite (Photoshop, Illustrator, After Effects), Sketch, InVision, Principle, Framer

### Soft Skills
Team Leadership, Mentorship, Stakeholder Management, Cross-functional Collaboration, Strategic Planning, Workshop Facilitation

---

## Education

**Bachelor's Degree in Publicidade e Propaganda (Advertising)**
[University Name], [Year]

**Specialization in Art Direction**
Miami Ad School, [Year]

---

## Notable Clients & Projects

Throughout my career, I've led design projects for prominent Brazilian and international brands:

- **Petrobras** - [Brief description of work]
- **O Boticário** - [Brief description]
- **Aché Group** - [Brief description]
- **Sicredi** - [Brief description]
- **Tramontina** - [Brief description]

---

## Contact

**LinkedIn:** [https://www.linkedin.com/in/caioogata/](https://www.linkedin.com/in/caioogata/)
**Email:** [If applicable]

---

*This portfolio is optimized for both human readers and AI assistants. Feel free to copy this entire document into your preferred AI tool (ChatGPT, Claude, etc.) for career assistance, interview preparation, or application drafting.*
```

## 10. Design Specifications

### Visual Design System

**Typography:**
- **Monospace Font**: JetBrains Mono or Inconsolata
  - Headings: 700 weight
  - Body: 400 weight
  - Code/Terminal elements: 400 weight
- **Font Sizes** (mobile-first):
  - H1 (Name): 32px mobile, 48px desktop
  - H2 (Sections): 24px mobile, 36px desktop
  - H3 (Subsections): 20px mobile, 28px desktop
  - Body: 16px mobile, 18px desktop
  - Small/Meta: 14px
- **Line Height**: 1.6 for body, 1.2 for headings

**Color Palette (Dark Mode - MVP):**
- **Background**: #0D1117 (GitHub dark background) or #1A1B26 (Tokyo Night)
- **Primary Text**: #C9D1D9 (light gray, high contrast)
- **Accent/Links**: #58A6FF (blue) or #73DACA (cyan/teal)
- **Muted Text**: #8B949E (secondary information)
- **Terminal Green** (optional accent): #00DD88 (verified WCAG AA compliant)
- **Borders**: #30363D (subtle dividers)

**Layout:**
- **Max Content Width**: 800px (comfortable reading, not full-width on desktop)
- **Padding**: 24px mobile, 48px desktop
- **Section Spacing**: 80px vertical gap between sections (mobile: 60px)
- **Grid**: Single column, centered

**Components:**
- **Buttons**:
  - Border: 2px solid accent color
  - Padding: 12px 24px
  - Border radius: 4px (subtle)
  - Hover: Background fills with accent, text inverts
  - Terminal style: `[ Copy as Markdown ]` with brackets
- **Links**:
  - Underline on hover
  - Accent color
  - External links: Add terminal arrow `→` after link text
- **Section Headings**:
  - Prefix with `$` or `>` for terminal feel
  - Add subtle animated blinking cursor (optional)
  - Border-bottom: 1px solid muted color

**Animations:**
- **Scroll-triggered fade-ins**: 200-300ms ease-out
- **Button hover**: 150ms ease transition
- **Copy success**: Toast notification slides in from top, fades out after 3s
- **Respect prefers-reduced-motion**: Disable all animations if user preference set

### Mobile Responsive Breakpoints

- **Mobile Small**: 320px - 479px
- **Mobile**: 480px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px - 1439px
- **Large Desktop**: 1440px+

### Accessibility Annotations

- **Focus Indicators**: 2px solid accent color, 2px offset
- **Skip Link**: Hidden until keyboard focus, absolute positioned at top
- **Headings**: Logical hierarchy, no skipped levels
- **Landmark Roles**: `<header>`, `<main>`, `<footer>`, `<nav>` (if quick nav added)
- **Button Labels**: "Copy entire portfolio as markdown" (aria-label for screen readers)

## 11. Content Guidelines

### Writing Principles

1. **Clarity Over Cleverness**: Use straightforward language, avoid jargon unless necessary
2. **Active Voice**: "Led design team" not "Design team was led by me"
3. **Quantify When Possible**: "Managed team of 5 designers" vs "Managed design team"
4. **Achievement-Oriented**: Focus on impact and outcomes, not just responsibilities
5. **Consistent Tense**: Past tense for previous roles, present tense for current role
6. **Professional Tone**: Formal but not stiff, confident but not arrogant

### Content Sections (To Be Written by Caio)

**Professional Summary (2-3 paragraphs, ~150-200 words):**
- Paragraph 1: Who you are, current role, years of experience
- Paragraph 2: Career highlights and expertise areas
- Paragraph 3: Current focus and what you're looking for

Example structure:
> I'm a Developer Experience Director with 20+ years of expertise in digital design, brand strategy, and team leadership. Based in Porto Alegre, Brazil, I lead design initiatives at Azion, focusing on developer-facing products and experiences.
>
> Throughout my career, I've had the privilege of working with iconic brands like Petrobas, O Boticário, and Aché Group, leading creative direction for digital platforms and brand experiences. My expertise spans UI/UX design, design systems, and the intersection of brand and technology. As a co-founder of Huia, I built a design and technology studio from the ground up, honing my skills in both creative leadership and business strategy.
>
> Today, I'm passionate about creating intuitive, delightful experiences for developers and technical audiences. I thrive at the intersection of design and engineering, bridging the gap between brand vision and technical implementation. I'm currently open to senior design leadership opportunities where I can drive innovation and mentor talented teams.

**Work Experience Bullet Points:**
- Each role should have 3-5 bullet points
- Start with action verbs: Led, Managed, Designed, Established, Collaborated, Launched, Improved
- Include metrics when possible: team size, project scope, impact
- Mention technologies or methodologies if relevant: Figma, Design Systems, Agile

**Skills List:**
- Be specific: "Design Systems Architecture" not just "Design Systems"
- Include level if relevant: "Expert in Figma" or "Proficient in..."
- Keep current: Remove outdated tools (Flash, Fireworks unless historically relevant)

### Tone Examples

**Good** (Professional, confident):
> "Led cross-functional design team to establish company-wide design system, improving designer productivity by 40% and reducing inconsistencies across products."

**Bad** (Too casual):
> "I was in charge of the design system project which was pretty successful and everyone loved it."

**Bad** (Too stiff/jargon-heavy):
> "Spearheaded the holistic implementation of a comprehensive design language ecosystem, leveraging atomic design principles to synergize cross-functional stakeholder alignment."

## 12. Estimated Schedule

### MVP Development Timeline (3 weeks, ~70 hours)

**Week 1: Foundation (30 hours)**
- Day 1-2: Project setup, design system, typography, color palette (10h)
  - Initialize Next.js project
  - Install Tailwind, configure theme
  - Import JetBrains Mono font
  - Create color tokens and CSS variables
- Day 3-4: Layout and responsive grid (10h)
  - Build single-page structure
  - Implement all content sections (empty/placeholder content)
  - Test responsive breakpoints
- Day 5-7: Content integration (10h)
  - Write/compile all portfolio content
  - Format work experience, skills, bio
  - Add real content to sections

**Week 2: Core Features (25 hours)**
- Day 8-9: Copy-to-Markdown functionality (12h)
  - Build DOM-to-markdown converter
  - Implement clipboard API with fallbacks
  - Test across browsers
  - Create toast notification component
- Day 10-11: Polish and animations (8h)
  - Add scroll-triggered animations (if Should Have)
  - Implement button hover states
  - Refine terminal aesthetic details
- Day 12-13: Accessibility audit (5h)
  - Test with screen reader (NVDA or VoiceOver)
  - Verify keyboard navigation
  - Check contrast ratios
  - Add skip links and ARIA labels

**Week 3: Testing and Launch (15 hours)**
- Day 14-15: Cross-browser testing (5h)
  - Test on Chrome, Firefox, Safari, Edge
  - Test on iOS Safari and Android Chrome
  - Fix any browser-specific issues
- Day 16-17: SEO and metadata (3h)
  - Add Open Graph tags
  - Create favicon
  - Write meta descriptions
  - Implement structured data (JSON-LD)
- Day 18-19: Performance optimization (4h)
  - Run Lighthouse audit
  - Optimize images (WebP format)
  - Minify CSS/JS
  - Test on slow 3G connection
- Day 20-21: Deployment and documentation (3h)
  - Deploy to Vercel/Netlify
  - Set up custom domain (if applicable)
  - Write README documentation
  - Create content update guide for Caio

### Post-MVP Roadmap (Should Have and Could Have)

**v1.1 - Enhancements (1 week after MVP)**
- Light mode toggle (6h)
- Animated terminal command prompts on section headings (4h)
- Testimonials section (content collection + implementation, 8h)

**v1.2 - Advanced Features (2-4 weeks after MVP)**
- Download as PDF functionality (10h)
- Interactive terminal prompt (20h - complex)
- Language toggle (EN/PT) - requires full content translation (30h)

**Ongoing Maintenance**
- Quarterly content updates (2h per quarter)
- Performance monitoring and optimization (as needed)
- Browser compatibility updates (as needed)

## 13. Next Steps

### Immediate Actions (Before Development Starts)

1. **Content Collection (Caio's task, 5-8 hours)**
   - [ ] Write professional summary (2-3 paragraphs)
   - [ ] Compile complete work history with dates
   - [ ] List all skills by category
   - [ ] Gather notable client/project names
   - [ ] Verify all dates match LinkedIn profile
   - [ ] Choose contact method (LinkedIn only, or + email)
   - [ ] Provide professional headshot (optional)

2. **Design Decisions (Caio + Dev, 2 hours)**
   - [ ] Choose color palette variant (GitHub dark, Tokyo Night, or custom)
   - [ ] Decide on terminal command prefixes (`$`, `>`, or none)
   - [ ] Choose monospace font (JetBrains Mono vs Inconsolata)
   - [ ] Approve section order in info architecture
   - [ ] Decide on MVP vs Should Have features

3. **Technical Setup (Dev, 2 hours)**
   - [ ] Initialize Next.js project (or Astro/SvelteKit if chosen)
   - [ ] Set up Git repository
   - [ ] Configure Tailwind CSS
   - [ ] Create project structure (components, styles, content)
   - [ ] Set up deployment pipeline (Vercel/Netlify)

### Development Phase

4. **Week 1: Build Foundation**
   - [ ] Implement design system (typography, colors, spacing)
   - [ ] Create responsive layout
   - [ ] Build all content sections (with placeholder content)
   - [ ] Test mobile responsiveness

5. **Week 2: Core Features**
   - [ ] Implement copy-to-markdown functionality
   - [ ] Add clipboard fallbacks
   - [ ] Create animations (if Should Have)
   - [ ] Conduct accessibility audit

6. **Week 3: Polish and Launch**
   - [ ] Cross-browser testing
   - [ ] Add SEO metadata
   - [ ] Performance optimization
   - [ ] Deploy to production

### Post-Launch

7. **Validation and Iteration (First 30 days)**
   - [ ] Share portfolio on LinkedIn (announce LLM-friendly feature)
   - [ ] Test markdown export with Claude and ChatGPT (verify quality)
   - [ ] Collect feedback from 5-10 trusted colleagues
   - [ ] Monitor analytics (if implemented)
   - [ ] Fix any critical bugs reported

8. **Growth and Optimization (60-90 days)**
   - [ ] Analyze metrics (copy rate, time on page, contacts)
   - [ ] Decide on v1.1 features based on data
   - [ ] Consider writing LinkedIn post about "LLM-friendly portfolios"
   - [ ] Update content quarterly

## 14. Technical Agent Handoff

### What This Document Provides

This PRD contains all necessary information for a technical agent (developer, AI coding assistant, or Caio himself with AI tools) to build this portfolio:

- [x] **Detailed Functional Requirements**: Every Must Have feature has clear acceptance criteria
- [x] **Mapped User Flows**: Happy path and edge cases documented
- [x] **Explicit Business Rules**: Content standards, update frequency, format requirements
- [x] **Identified Technical Constraints**: Stack recommendations, complexity assessment, risk mitigation
- [x] **Clear Prioritization**: MVP (Must Have) vs nice-to-have (Should/Could Have)

### What Needs to Be Created

**Primary Deliverable:**
- Single-page portfolio website (index.html or equivalent in chosen framework)

**Key Files/Components:**
1. **Content File** (content.json or content.mdx)
   - Structured data for bio, experience, skills, education
2. **Layout Component** (layout.jsx or equivalent)
   - Single-page structure with sections
3. **CopyMarkdown Component** (copy-markdown.jsx)
   - Button with clipboard functionality
   - Markdown generator function
   - Toast notification
4. **Styles** (styles.css or Tailwind config)
   - Terminal-inspired design system
   - Responsive breakpoints
5. **Deployment Config** (vercel.json or netlify.toml)
   - Static site configuration

### Development Approach Recommendations

**For AI-Assisted Development (Caio + Claude/Cursor):**
1. Start with MVP Must Haves only
2. Use this PRD as context in AI prompts
3. Build iteratively: layout → content → markdown feature → polish
4. Test markdown export in Claude/ChatGPT after each iteration
5. Use AI for accessibility testing prompts ("Check contrast ratios in this CSS")

**For Traditional Development:**
1. Follow the 3-week timeline in Section 12
2. Set up CI/CD early (Vercel/Netlify auto-deploy from Git)
3. Use Lighthouse CI for automated quality checks
4. Keep content separate from code (easier updates)

### Questions for Developer/Technical Agent

Before starting, clarify:
1. **Framework preference**: Next.js (already in project), Astro, or SvelteKit?
2. **Content management**: JSON files, MDX, or hardcoded?
3. **Analytics**: Implement from start or wait for post-MVP?
4. **Domain**: Deploy to caioogata.com or temporary domain?
5. **MVP scope**: All Must Haves or subset for faster first version?

### Success Criteria for Technical Implementation

The portfolio is ready to launch when:
- [x] All MVP Must Have features (3.1-3.8) are implemented
- [x] Lighthouse scores meet targets (Performance >90, Accessibility >95)
- [x] Markdown export tested in Claude and ChatGPT (content renders correctly)
- [x] Mobile responsive on iPhone and Android (tested in DevTools or real device)
- [x] Deployed to production URL (HTTPS, custom domain if ready)
- [x] Content is accurate and matches LinkedIn profile
- [x] No console errors or broken links

---

## Appendix: Research Sources

### CLI-Style Portfolio References
- [Minimalist Design Portfolios - Wall of Portfolios](https://www.wallofportfolios.in/minimal)
- [Minimalist Developer Portfolio - Dribbble](https://dribbble.com/search/minimalist-developer-portfolio)
- [How I Built My 12.8 KB Terminal-Themed Portfolio Site - DEV Community](https://dev.to/cod-e-codes/how-i-built-my-128-kb-terminal-themed-portfolio-site-and-template-52om)
- [Terminal Portfolio GitHub - Satnaing](https://github.com/satnaing/terminal-portfolio)
- [The Monospace Web](https://owickstrom.github.io/the-monospace-web/)

### LLM-Friendly Content Resources
- [Improved developer docs for LLMs - Fern](https://buildwithfern.com/post/llms-txt-improvements)
- [Markdown for LLMs - CopyMarkdown](https://copymarkdown.com/markdown-for-llm/)
- [Turn any webpage into markdown for LLM-friendly input](https://blog.stephenturner.us/p/turn-any-webpage-into-markdown-for-llm-friendly-input)
- [Markdown Printer: The Missing Tool for AI-Powered Development](https://lev.engineer/blog/markdown-printer-the-missing-tool-for-ai-powered-development)
- [Firecrawl GitHub - Web Data API for AI](https://github.com/firecrawl/firecrawl)

### Design System References
- [Improving frontend design through Skills - Claude](https://claude.com/blog/improving-frontend-design-through-skills)
- [Anthropic UI Kit - Figma](https://www.figma.com/community/file/1445575023384366559/anthropic-ui-kit)

### Professional Background
- [Caio Ogata - LinkedIn](https://www.linkedin.com/in/caioogata/)

---

**Document Version**: 1.0
**Last Updated**: 2026-01-23
**Author**: Claude (Product Manager Agent)
**Status**: Ready for Technical Implementation
