# LinkedIn Job Application Automation
**Semi-automated cover letter generation + application tracking**
Caio Ogata · Porto Alegre · 2026

---

## What This Does

For each pending job in `docs/job-search-2026.csv`:

1. **Fetches the job description** from LinkedIn (auto-fetch → fallback to paste)
2. **Generates a personalized cover letter** via Claude API, matching your voice and the JD
3. **Shows you a review panel** with the letter and LinkedIn form data
4. **You confirm** → CSV updated, cover letter saved, LinkedIn URL opened
5. **Repeat** for the next job

You still click **Apply** on LinkedIn. The script handles the brain work.

---

## Setup (One Time)

### 1. Install Python dependencies

```bash
cd portolio-v1/scripts/linkedin-apply
pip3 install -r requirements.txt
```

### 2. Set your Anthropic API key

You already have this from Claude Code:

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

To make it permanent, add that line to your `~/.zshrc` or `~/.bash_profile`.

### 3. Add your phone number (optional but recommended)

Open `profile.py` and fill in:
```python
"phone": "+55 51 9XXXX-XXXX",
```

### 4. Add your CV PDF path (optional)

The script reminds you to upload the PDF manually during each application.
If you want the path displayed: add `"cv_path": "/path/to/Caio-Ogata-CV.pdf"` to `PERSONAL_INFO` in `profile.py`.

---

## Usage

### See all pending jobs
```bash
python3 main.py --list
```

### Start processing (interactive, one job at a time)
```bash
python3 main.py
```

### Filter options
```bash
python3 main.py --country EUA           # US jobs only
python3 main.py --category "Design Engineer"  # One category
python3 main.py --match Alto            # High-match jobs only
python3 main.py --limit 5              # Max 5 jobs this session
python3 main.py --job 9               # Single job by number (#9 = Ramp)
```

### Batch mode (generate all, no pauses)
```bash
python3 main.py --batch --country EUA
```
Useful for generating all cover letters overnight. Review them in `output/cover-letters/`.

---

## During a Session

For each job you'll see:

```
[2/68] #9 Design Engineer @ Ramp
  New York NY · EUA · Senior
  Match: Alto | Design Engineer
  🔑 React · TypeScript · CSS · Figma · Cursor · Claude Code...

Step 1/3: Fetching job description...
  ✅ JD fetched (2,847 chars)

Step 2/3: Generating cover letter with Claude...

──────────────────────────────────────────────────────────────
  COVER LETTER PREVIEW
──────────────────────────────────────────────────────────────
  Ramp's bet on design engineering caught my attention...
  [full letter]
──────────────────────────────────────────────────────────────

  📋 LINKEDIN FORM DATA
  Name:     Caio Ogata
  Email:    caioogata.labs@gmail.com
  Phone:    +55 51 9XXXX-XXXX
  LinkedIn: https://linkedin.com/in/caioogata
  Portfolio:https://caioogata.com
  CV:       📎 Upload your PDF manually

What do you want to do?
  [a] Apply    — save cover letter, mark as applied
  [s] Skip     — move to next job
  [e] Edit     — regenerate with feedback
  [v] View JD  — show full job description again
  [q] Quit     — stop and save progress

  →
```

### Edit / Regenerate
Press `e`, then describe what to change:
```
→ e
What should be changed? → Make it more concise and emphasize the design systems work at Azion
Regenerating...
✅ Regenerated!
```

---

## Output Files

```
scripts/linkedin-apply/
├── output/
│   ├── cover-letters/
│   │   ├── 009-ramp-design-engineer.txt
│   │   ├── 012-vercel-design-engineer.txt
│   │   └── ...
│   └── logs/
│       └── session-20260302-103045.json
```

### Cover letter file format
```
JOB: Design Engineer @ Ramp
LOCATION: New York NY | EUA
URL: https://linkedin.com/jobs/view/...
DATE: 2026-03-02 10:32
MATCH: Alto | SENIORITY: Senior
KEYWORDS: React · TypeScript · CSS...

--- COVER LETTER ---

[full text ready to paste]
```

---

## CSV Updates

After each `[a] Apply`, the CSV is updated:

| Field | Before | After |
|-------|--------|-------|
| `Etapa` | Mapeado | Candidatado |
| `Data_Candidatura` | (empty) | 2026-03-02 10:32 |
| `Notas_Processo` | (empty) | Your notes |
| `Resposta` | (empty) | [Pendente] + first 200 chars of letter |

---

## About LinkedIn Fetch

**Auto-fetch uses LinkedIn's public guest job API** (`/jobs-guest/jobs/api/`). This works for most public job listings without requiring authentication.

If a job returns an error (expired, gated, etc.), the script will ask you to:
1. Open the URL in your browser
2. Copy the full job description text
3. Paste it into the terminal (press Enter twice to finish)

---

## Cover Letter Model

Using `claude-3-5-haiku-20241022` by default (fast, ~$0.001/letter = ~$0.07 for all 68 jobs).

To use higher quality Sonnet, edit `generator.py`:
```python
MODEL = "claude-3-5-sonnet-20241022"  # Better quality, ~10x more expensive
```

---

## Project Files

```
scripts/linkedin-apply/
├── main.py          # Main CLI orchestrator
├── profile.py       # Caio's professional profile (edit to update info)
├── fetcher.py       # LinkedIn JD fetcher with auto/manual fallback
├── generator.py     # Cover letter generator (Claude API)
├── tracker.py       # CSV read/write + session logging
├── requirements.txt # pip dependencies
└── README.md        # This file
```

---

## Troubleshooting

**`ANTHROPIC_API_KEY not set`**
```bash
export ANTHROPIC_API_KEY="sk-ant-your-key-here"
```

**LinkedIn fetch fails for all jobs**
Normal in some corporate network environments. Just paste the JD manually — the script will prompt you.

**Cover letter sounds off**
Press `e` to regenerate with specific feedback. Or edit `profile.py` → `VOICE_GUIDELINES` to tune the persona.

**CSV not updating**
Check you have write permissions: `ls -la portolio-v1/docs/job-search-2026.csv`

---

*Built with Claude Code · March 2026*
