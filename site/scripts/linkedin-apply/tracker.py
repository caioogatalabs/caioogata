"""
tracker.py — CSV tracking and logging for job applications.

Reads and writes docs/job-search-2026.csv.
Saves cover letters to output/cover-letters/
Saves session log to output/logs/
"""

import csv
import os
import json
from datetime import datetime
from pathlib import Path


# Paths relative to the project root (portolio-v1/)
PROJECT_ROOT = Path(__file__).parent.parent.parent  # scripts/linkedin-apply/ → portolio-v1/
CSV_PATH = PROJECT_ROOT / "docs" / "job-search-2026.csv"
COVER_LETTERS_DIR = Path(__file__).parent / "output" / "cover-letters"
LOGS_DIR = Path(__file__).parent / "output" / "logs"

# Application status values
STATUS_PENDING = "Mapeado"       # Original status (not yet applied)
STATUS_APPLIED = "Candidatado"   # Successfully applied
STATUS_SKIPPED = "Pulado"        # Skipped this session
STATUS_ERROR = "Erro"            # Error during application


def load_jobs(csv_path: Path = CSV_PATH) -> list[dict]:
    """Load all jobs from the CSV file."""
    jobs = []
    with open(csv_path, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            jobs.append(dict(row))
    return jobs


def save_jobs(jobs: list[dict], csv_path: Path = CSV_PATH) -> None:
    """Save all jobs back to the CSV file."""
    if not jobs:
        return
    fieldnames = list(jobs[0].keys())
    with open(csv_path, "w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(jobs)


def get_pending_jobs(jobs: list[dict]) -> list[dict]:
    """Return jobs that haven't been applied to yet (Etapa == 'Mapeado' and no application date)."""
    return [
        job for job in jobs
        if job.get("Etapa", "").strip() in (STATUS_PENDING, "Pesquisar", "")
        and not job.get("Data_Candidatura", "").strip()
        and job.get("URL", "").strip()  # Must have a URL
    ]


def mark_applied(
    jobs: list[dict],
    job_number: str,
    cover_letter: str,
    notes: str = "",
) -> list[dict]:
    """Mark a job as applied in the jobs list."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    for job in jobs:
        if str(job.get("Nº", "")).strip() == str(job_number).strip():
            job["Data_Candidatura"] = now
            job["Etapa"] = STATUS_APPLIED
            job["Notas_Processo"] = notes or "Cover letter generated & applied via script"
            # Store first 200 chars of cover letter as reference
            job["Resposta"] = f"[Pendente] Cover letter: {cover_letter[:200]}..."
            break
    return jobs


def mark_skipped(jobs: list[dict], job_number: str, reason: str = "") -> list[dict]:
    """Mark a job as skipped."""
    now = datetime.now().strftime("%Y-%m-%d %H:%M")
    for job in jobs:
        if str(job.get("Nº", "")).strip() == str(job_number).strip():
            job["Etapa"] = STATUS_SKIPPED
            job["Notas_Processo"] = reason or f"Skipped on {now}"
            break
    return jobs


def save_cover_letter(job: dict, cover_letter: str) -> Path:
    """Save cover letter to a file. Returns the file path."""
    COVER_LETTERS_DIR.mkdir(parents=True, exist_ok=True)

    # Create filename: 001-stripe-design-engineer.txt
    job_num = str(job.get("Nº", "000")).zfill(3)
    company = job.get("Empresa", "unknown").lower().replace(" ", "-").replace("/", "-")
    cargo = job.get("Cargo", "role").lower().replace(" ", "-").replace("/", "-")[:30]
    filename = f"{job_num}-{company}-{cargo}.txt"

    filepath = COVER_LETTERS_DIR / filename

    content = f"""JOB: {job.get('Cargo', '')} @ {job.get('Empresa', '')}
LOCATION: {job.get('Local', '')} | {job.get('País', '')}
URL: {job.get('URL', '')}
DATE: {datetime.now().strftime('%Y-%m-%d %H:%M')}
MATCH: {job.get('Match', '')} | SENIORITY: {job.get('Seniority', '')}
KEYWORDS: {job.get('Keywords_JD', '')}

--- COVER LETTER ---

{cover_letter}
"""

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath


class SessionLogger:
    """Tracks the current application session."""

    def __init__(self):
        LOGS_DIR.mkdir(parents=True, exist_ok=True)
        self.session_start = datetime.now()
        self.log_file = LOGS_DIR / f"session-{self.session_start.strftime('%Y%m%d-%H%M%S')}.json"
        self.events = []
        self.stats = {
            "applied": 0,
            "skipped": 0,
            "errors": 0,
            "start_time": self.session_start.isoformat(),
        }

    def log_applied(self, job: dict, cover_letter_path: str):
        self.stats["applied"] += 1
        self.events.append({
            "time": datetime.now().isoformat(),
            "action": "applied",
            "job_num": job.get("Nº"),
            "company": job.get("Empresa"),
            "title": job.get("Cargo"),
            "cover_letter_file": str(cover_letter_path),
        })
        self._save()

    def log_skipped(self, job: dict, reason: str = ""):
        self.stats["skipped"] += 1
        self.events.append({
            "time": datetime.now().isoformat(),
            "action": "skipped",
            "job_num": job.get("Nº"),
            "company": job.get("Empresa"),
            "title": job.get("Cargo"),
            "reason": reason,
        })
        self._save()

    def log_error(self, job: dict, error: str):
        self.stats["errors"] += 1
        self.events.append({
            "time": datetime.now().isoformat(),
            "action": "error",
            "job_num": job.get("Nº"),
            "company": job.get("Empresa"),
            "title": job.get("Cargo"),
            "error": error,
        })
        self._save()

    def _save(self):
        self.stats["end_time"] = datetime.now().isoformat()
        data = {"stats": self.stats, "events": self.events}
        with open(self.log_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def summary(self) -> str:
        duration = datetime.now() - self.session_start
        mins = int(duration.total_seconds() / 60)
        return (
            f"Session complete: "
            f"{self.stats['applied']} applied · "
            f"{self.stats['skipped']} skipped · "
            f"{self.stats['errors']} errors · "
            f"{mins} minutes"
        )
