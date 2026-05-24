#!/usr/bin/env python3
"""
main.py — LinkedIn Job Application Automation for Caio Ogata
============================================================

Semi-automated workflow:
  1. Reads job-search-2026.csv (pending jobs only)
  2. For each job: fetches JD → detects if cover letter is needed
  3. Generates cover letter ONLY if the job requires one
  4. Shows review panel → YOU confirm → CSV updated
  5. Rinse and repeat

Usage:
  python3 main.py                    # Process all pending jobs
  python3 main.py --batch            # Auto-mode: no review pauses
  python3 main.py --job 1            # Process a single job by number
  python3 main.py --category "Design Engineer"  # Filter by category
  python3 main.py --country EUA      # Filter by country
  python3 main.py --limit 5          # Process only 5 jobs
  python3 main.py --list             # List all pending jobs
"""

import os
import sys
import argparse
import textwrap
from pathlib import Path

# Add parent directory to path for local imports
sys.path.insert(0, str(Path(__file__).parent))

from fetcher import get_jd_interactive
from generator import generate_cover_letter, regenerate_with_feedback, jd_requires_cover_letter
from tracker import (
    load_jobs,
    save_jobs,
    get_pending_jobs,
    mark_applied,
    mark_skipped,
    save_cover_letter,
    SessionLogger,
)
from profile import PERSONAL_INFO


# ─── COLORS (no extra deps, just ANSI) ─────────────────────────────────────────

class C:
    RESET  = "\033[0m"
    BOLD   = "\033[1m"
    DIM    = "\033[2m"
    GREEN  = "\033[92m"
    YELLOW = "\033[93m"
    RED    = "\033[91m"
    BLUE   = "\033[94m"
    CYAN   = "\033[96m"
    GRAY   = "\033[90m"

def bold(s):  return f"{C.BOLD}{s}{C.RESET}"
def green(s): return f"{C.GREEN}{s}{C.RESET}"
def yellow(s):return f"{C.YELLOW}{s}{C.RESET}"
def red(s):   return f"{C.RED}{s}{C.RESET}"
def blue(s):  return f"{C.BLUE}{s}{C.RESET}"
def cyan(s):  return f"{C.CYAN}{s}{C.RESET}"
def gray(s):  return f"{C.GRAY}{s}{C.RESET}"
def dim(s):   return f"{C.DIM}{s}{C.RESET}"


# ─── DISPLAY HELPERS ───────────────────────────────────────────────────────────

def print_header():
    print()
    print(bold(cyan("╔══════════════════════════════════════════════════════════╗")))
    print(bold(cyan("║     LINKEDIN JOB APPLICATION AUTOMATION                 ║")))
    print(bold(cyan("║     Caio Ogata · Porto Alegre · 2026                    ║")))
    print(bold(cyan("╚══════════════════════════════════════════════════════════╝")))
    print()


def print_job_card(job: dict, index: int, total: int):
    """Print a job info card."""
    num   = job.get("Nº", "?")
    title = job.get("Cargo", "Unknown Role")
    comp  = job.get("Empresa", "Unknown Company")
    loc   = job.get("Local", "")
    country = job.get("País", "")
    seniority = job.get("Seniority", "")
    match = job.get("Match", "")
    cat   = job.get("Categoria", "")
    keys  = job.get("Keywords_JD", "")

    match_color = green if match == "Alto" else yellow

    print()
    print(f"  {dim(f'[{index}/{total}]')} {bold(f'#{num}')} {bold(blue(title))} @ {bold(comp)}")
    print(f"  {gray(loc + ' · ' + country + ' · ' + seniority)}")
    print(f"  {match_color(f'Match: {match}')} {dim('|')} {gray(cat)}")
    if keys:
        # Wrap keywords nicely
        wrapped = textwrap.fill(keys, width=70, initial_indent="  🔑 ", subsequent_indent="     ")
        print(gray(wrapped))
    print()


def print_cover_letter(cover_letter: str):
    """Display cover letter with a border."""
    print()
    print(dim("─" * 62))
    print(bold("  COVER LETTER PREVIEW"))
    print(dim("─" * 62))
    # Wrap and indent the letter
    paragraphs = cover_letter.split("\n\n")
    for para in paragraphs:
        wrapped = textwrap.fill(para.strip(), width=60, initial_indent="  ", subsequent_indent="  ")
        print(wrapped)
        print()
    print(dim("─" * 62))


def print_form_data(job: dict, cover_letter_required: bool = False):
    """Show the data to fill in the LinkedIn form."""
    from pathlib import Path
    print()
    print(bold("  📋 LINKEDIN FORM DATA"))
    print(dim("  " + "─" * 50))
    print(f"  Name:     {PERSONAL_INFO['name']}")
    print(f"  Email:    {PERSONAL_INFO['email']}")
    phone = PERSONAL_INFO.get('phone', '')
    print(f"  Phone:    {phone if phone else yellow('⚠️  Add phone in profile.py')}")
    print(f"  LinkedIn: {PERSONAL_INFO['linkedin']}")
    print(f"  Portfolio:{PERSONAL_INFO['portfolio']}")
    cv_path = PERSONAL_INFO.get('cv_path', '')
    if cv_path:
        print(f"  CV:       {green('📎 ' + cv_path)}")
    else:
        print(f"  CV:       {yellow('⚠️  Set cv_path in profile.py')}")
    if cover_letter_required:
        print(f"  CL:       {cyan('📝 Cover letter generated (see above)')}")
    else:
        print(f"  CL:       {dim('Not required for this job')}")
    print(dim("  " + "─" * 50))
    print()


def ask_cover_letter_needed() -> bool:
    """Ask whether this job requires a cover letter."""
    print(f"  {bold('Does this job require a cover letter?')}")
    print(f"  {green('[y]')} Yes — generate a personalized cover letter")
    print(f"  {yellow('[n]')} No  — skip directly to form data review")
    print()
    while True:
        choice = input("  → ").strip().lower()
        if choice in ("y", "yes", "s", "sim"):
            return True
        elif choice in ("n", "no", ""):
            return False
        else:
            print(f"  {red('Press y or n')}")


def ask_action(has_cover_letter: bool = False, batch_mode: bool = False) -> str:
    """
    Ask user what to do with this job.
    Returns: 'apply', 'skip', 'edit', 'quit', 'next'
    """
    if batch_mode:
        return "next"  # In batch mode, just save and continue

    print(f"  {bold('What do you want to do?')}")
    print(f"  {green('[a]')} Apply    — mark as applied, open LinkedIn URL")
    print(f"  {yellow('[s]')} Skip     — move to next job")
    if has_cover_letter:
        print(f"  {blue('[e]')} Edit     — regenerate cover letter with feedback")
    print(f"  {cyan('[v]')} View JD  — show full job description again")
    print(f"  {red('[q]')} Quit     — stop and save progress")
    print()

    while True:
        choice = input("  → ").strip().lower()
        if choice in ("a", "apply"):
            return "apply"
        elif choice in ("s", "skip", ""):
            return "skip"
        elif choice in ("e", "edit") and has_cover_letter:
            return "edit"
        elif choice in ("v", "view"):
            return "view"
        elif choice in ("q", "quit", "exit"):
            return "quit"
        else:
            print(f"  {red('Invalid choice.')} Press a/s/v/q" + ("/e" if has_cover_letter else ""))


# ─── MAIN WORKFLOW ─────────────────────────────────────────────────────────────

def process_job(
    job: dict,
    jobs: list[dict],
    logger: SessionLogger,
    index: int,
    total: int,
    batch_mode: bool = False,
    api_key: str | None = None,
) -> bool:
    """
    Process a single job application.
    Returns True if we should continue, False if user quit.
    """
    print_job_card(job, index, total)

    # ── Step 1: Get JD ──────────────────────────────────────────────────────
    print(f"  {bold('Step 1/3:')} Fetching job description...")
    url = job.get("URL", "")
    jd_text = get_jd_interactive(url, job)

    if not jd_text.strip():
        print(f"  {red('❌ No job description available. Skipping.')}")
        mark_skipped(jobs, job.get("Nº"), reason="No JD available")
        save_jobs(jobs)
        logger.log_skipped(job, "No JD available")
        return True

    stored_jd = jd_text  # Keep for potential regeneration

    # ── Step 2: Cover letter (only if needed) ───────────────────────────────
    cover_letter = ""
    cl_required = False

    if not batch_mode:
        print()
        # Auto-detect from JD keywords, show hint
        if jd_requires_cover_letter(jd_text):
            print(f"  {yellow('📝 JD mentions a cover letter requirement.')}")

        cl_required = ask_cover_letter_needed()
    else:
        # In batch mode, auto-detect from JD
        cl_required = jd_requires_cover_letter(jd_text)

    if cl_required:
        print(f"\n  {bold('Step 2/3:')} Generating cover letter with Claude...")

        gen_result = generate_cover_letter(
            job_title=job.get("Cargo", ""),
            company=job.get("Empresa", ""),
            location=job.get("Local", ""),
            job_description=jd_text,
            api_key=api_key,
        )

        if not gen_result["success"]:
            print(f"  {red('❌ Generation failed:')} {gen_result['error']}")
            logger.log_error(job, gen_result["error"])
            input("  Press Enter to continue...")
            return True

        cover_letter = gen_result["cover_letter"]
        print(f"  {green('✅ Cover letter ready.')}")
    else:
        print(f"  {dim('Step 2/3: Cover letter — not required, skipping.')}")

    # ── Step 3: Review and decide ────────────────────────────────────────────
    print(f"\n  {bold('Step 3/3:')} Review\n")

    while True:
        if cover_letter:
            print_cover_letter(cover_letter)
        print_form_data(job, cover_letter_required=bool(cover_letter))

        action = ask_action(has_cover_letter=bool(cover_letter), batch_mode=batch_mode)

        if action == "view":
            print()
            print(bold("  FULL JOB DESCRIPTION:"))
            print(dim("─" * 62))
            lines = stored_jd.split("\n")
            for line in lines[:50]:
                print(f"  {gray(line)}")
            if len(lines) > 50:
                print(dim(f"  ... ({len(lines) - 50} more lines)"))
            print(dim("─" * 62))
            continue

        elif action == "edit" and cover_letter:
            print(f"\n  {bold('What should be changed?')} (describe in plain English)")
            feedback = input("  → ").strip()
            if not feedback:
                continue

            print(f"\n  {cyan('Regenerating...')}")
            regen = regenerate_with_feedback(
                original_letter=cover_letter,
                feedback=feedback,
                job_title=job.get("Cargo", ""),
                company=job.get("Empresa", ""),
                job_description=stored_jd,
                api_key=api_key,
            )
            if regen["success"]:
                cover_letter = regen["cover_letter"]
                print(f"  {green('✅ Regenerated!')}")
            else:
                print(f"  {red('❌ Regeneration failed:')} {regen['error']}")
            continue

        elif action in ("apply", "next"):
            # Save cover letter file if one was generated
            cl_path = None
            if cover_letter:
                cl_path = save_cover_letter(job, cover_letter)

            # Update CSV
            notes = ""
            if not batch_mode:
                notes = input(f"  {dim('Any notes to save? (Enter to skip):  ')}").strip()

            cl_note = f"Cover letter: {cover_letter[:200]}..." if cover_letter else "No cover letter required"
            mark_applied(jobs, job.get("Nº"), cover_letter or "", notes or cl_note)
            save_jobs(jobs)
            logger.log_applied(job, str(cl_path) if cl_path else "no-cover-letter")

            print(f"\n  {green('✅ Marked as applied!')}")
            if cl_path:
                print(f"  {dim('Cover letter saved to:')} {cl_path.name}")
            print(f"\n  {bold('👉 Now go to LinkedIn and apply manually:')}")
            print(f"  {cyan(job.get('URL', ''))}")
            cv_path = PERSONAL_INFO.get('cv_path', '')
            if cv_path:
                print(f"  {dim('📎 Upload CV from:')} {green(cv_path)}")
            if not batch_mode:
                print(f"\n  {dim('Press Enter when done to continue to next job...')}")
                input()
            return True

        elif action == "skip":
            reason = ""
            if not batch_mode:
                reason = input(f"  {dim('Reason for skipping? (Enter to skip):  ')}").strip()
            mark_skipped(jobs, job.get("Nº"), reason)
            save_jobs(jobs)
            logger.log_skipped(job, reason)
            print(f"  {yellow('⏭️  Skipped.')}")
            return True

        elif action == "quit":
            print(f"\n  {yellow('Saving progress and quitting...')}")
            save_jobs(jobs)
            return False

    return True


def list_pending_jobs(jobs: list[dict], pending: list[dict]):
    """Print a summary table of pending jobs."""
    print_header()
    print(bold(f"  {len(pending)} pending jobs (out of {len(jobs)} total)\n"))
    print(f"  {'#':>3}  {'Company':<20} {'Role':<35} {'Match':<6} {'Country'}")
    print(f"  {'─' * 3}  {'─' * 20} {'─' * 35} {'─' * 6} {'─' * 10}")
    for job in pending:
        num  = str(job.get('Nº', '')).rjust(3)
        comp = job.get('Empresa', '')[:19].ljust(20)
        role = job.get('Cargo', '')[:34].ljust(35)
        match = job.get('Match', '')
        country = job.get('País', '')
        match_str = green(match.ljust(6)) if match == "Alto" else yellow(match.ljust(6))
        print(f"  {gray(num)}  {comp} {role} {match_str} {gray(country)}")
    print()


def main():
    parser = argparse.ArgumentParser(
        description="LinkedIn Job Application Automation — Caio Ogata"
    )
    parser.add_argument("--job",      type=str, help="Process single job by number (e.g. --job 1)")
    parser.add_argument("--category", type=str, help="Filter by category (e.g. 'Design Engineer')")
    parser.add_argument("--country",  type=str, help="Filter by country (EUA, Brasil, Global)")
    parser.add_argument("--match",    type=str, help="Filter by match level (Alto, Médio)")
    parser.add_argument("--limit",    type=int, help="Max jobs to process this session")
    parser.add_argument("--batch",    action="store_true", help="Batch mode: auto-approve all")
    parser.add_argument("--list",     action="store_true", help="List pending jobs and exit")
    parser.add_argument("--api-key",  type=str, help="Anthropic API key (or set ANTHROPIC_API_KEY env)")
    args = parser.parse_args()

    # Check API key
    api_key = args.api_key or os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(f"\n{red('❌ ANTHROPIC_API_KEY not set.')}")
        print(f"Run: {cyan('export ANTHROPIC_API_KEY=your-key-here')}")
        print(f"Or:  {cyan('python3 main.py --api-key sk-ant-...')}")
        sys.exit(1)

    print_header()
    print(f"  Loading jobs from CSV...")

    # Load jobs
    jobs = load_jobs()
    pending = get_pending_jobs(jobs)

    # Apply filters
    if args.job:
        pending = [j for j in pending if str(j.get("Nº", "")) == str(args.job)]
    if args.category:
        pending = [j for j in pending if args.category.lower() in j.get("Categoria", "").lower()]
    if args.country:
        pending = [j for j in pending if args.country.lower() in j.get("País", "").lower()]
    if args.match:
        pending = [j for j in pending if args.match.lower() in j.get("Match", "").lower()]
    if args.limit:
        pending = pending[:args.limit]

    # List mode
    if args.list:
        list_pending_jobs(jobs, pending)
        return

    if not pending:
        print(f"  {green('✅ No pending jobs matching your filters.')}")
        print(f"  {gray('All jobs have been processed or filtered out.')}")
        return

    total = len(pending)
    print(f"  {green(f'{total} pending jobs')} to process")
    if args.batch:
        print(f"  {yellow('BATCH MODE:')} Cover letters will be auto-saved (no review pauses)")
    print(f"\n  {dim('API key detected. Ready.')}")
    print(f"\n  Press Enter to start, or Ctrl+C to cancel...")
    input()

    # Initialize session logger
    logger = SessionLogger()

    # Process jobs
    for i, job in enumerate(pending, start=1):
        continue_processing = process_job(
            job=job,
            jobs=jobs,
            logger=logger,
            index=i,
            total=total,
            batch_mode=args.batch,
            api_key=api_key,
        )
        if not continue_processing:
            break

    # Session summary
    print()
    print(bold(cyan("═" * 62)))
    print(f"  {bold('SESSION COMPLETE')}")
    print(f"  {logger.summary()}")
    print(f"  Cover letters saved to: {dim('scripts/linkedin-apply/output/cover-letters/')}")
    print(f"  Session log saved to:   {dim('scripts/linkedin-apply/output/logs/')}")
    print(bold(cyan("═" * 62)))
    print()


if __name__ == "__main__":
    main()
