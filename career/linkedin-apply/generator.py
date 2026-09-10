"""
generator.py — Cover letter generation via Claude API.

Uses claude-3-5-haiku-20241022 by default (fast + cheap).
Switch to claude-3-5-sonnet-20241022 for higher quality.
"""

import anthropic
from profile import FULL_PROFILE, PERSONAL_INFO, VOICE_GUIDELINES


MODEL = "claude-3-5-haiku-20241022"   # Fast, cheap. Change to sonnet for premium quality.
MAX_TOKENS = 1200

# Keywords that signal a cover letter is required/recommended
COVER_LETTER_SIGNALS = [
    "cover letter", "covering letter", "letter of motivation",
    "motivation letter", "letter of intent", "motivational letter",
    "tell us why", "why do you want", "carta de apresentação",
    "carta de motivação",
]


def jd_requires_cover_letter(jd_text: str) -> bool:
    """Return True if the job description mentions a cover letter requirement."""
    text_lower = jd_text.lower()
    return any(signal in text_lower for signal in COVER_LETTER_SIGNALS)


COVER_LETTER_SYSTEM_PROMPT = f"""
You are a professional cover letter writer helping Caio Ogata apply for design roles.

Here is Caio's full professional profile:

{FULL_PROFILE}

Your task:
Write a personalized cover letter for the job description provided by the user.

STRICT RULES:
1. Language: English only
2. Length: 3–4 paragraphs, 250–350 words total
3. Format: Plain text, no markdown, no bullet points, no headers
4. Tone: Follow Caio's voice guidelines exactly — clear, direct, honest, human
5. Personalization: Reference specific details from the job description (company name, role, tech stack, team context)
6. Never use: "passionate", "rockstar", "ninja", "game-changing", "revolutionary", "disruptive", "cutting-edge", "leverage", "synergy"
7. Always use: active voice, concrete examples from Caio's experience, specific numbers when relevant

STRUCTURE:
- Opening: Hook with the specific role and why it aligns with Caio's trajectory (no generic openers)
- Body 1: Relevant experience that directly maps to the job requirements
- Body 2: Specific achievement or project that demonstrates the match
- Closing: Clear intent, CTA, availability (remote/relocation open)

Do NOT include:
- "Dear Hiring Manager" or any salutation
- Caio's contact info (it goes in the form separately)
- A signature line

Start directly with the first paragraph.
"""


def generate_cover_letter(
    job_title: str,
    company: str,
    location: str,
    job_description: str,
    api_key: str | None = None,
) -> dict:
    """
    Generate a personalized cover letter for a job.

    Args:
        job_title: The job title
        company: Company name
        location: Job location
        job_description: Full JD text
        api_key: Anthropic API key (uses env var ANTHROPIC_API_KEY if None)

    Returns:
        dict with keys:
            - success (bool)
            - cover_letter (str)
            - error (str, if failed)
    """
    result = {"success": False, "cover_letter": "", "error": ""}

    try:
        client = anthropic.Anthropic(api_key=api_key)  # Uses ANTHROPIC_API_KEY env var if None

        user_message = f"""
Job Title: {job_title}
Company: {company}
Location: {location}

--- JOB DESCRIPTION ---
{job_description}
--- END JOB DESCRIPTION ---

Please write a cover letter for Caio to apply to this role.
"""

        message = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=COVER_LETTER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )

        cover_letter = message.content[0].text.strip()
        result["success"] = True
        result["cover_letter"] = cover_letter

    except anthropic.AuthenticationError:
        result["error"] = (
            "Invalid API key. Set ANTHROPIC_API_KEY environment variable.\n"
            "Run: export ANTHROPIC_API_KEY='your-key-here'"
        )
    except anthropic.RateLimitError:
        result["error"] = "Rate limit hit. Wait a moment and try again."
    except anthropic.APIConnectionError:
        result["error"] = "Connection error. Check your internet connection."
    except Exception as e:
        result["error"] = f"Unexpected error: {str(e)}"

    return result


def regenerate_with_feedback(
    original_letter: str,
    feedback: str,
    job_title: str,
    company: str,
    job_description: str,
    api_key: str | None = None,
) -> dict:
    """Regenerate a cover letter incorporating user feedback."""
    result = {"success": False, "cover_letter": "", "error": ""}

    try:
        client = anthropic.Anthropic(api_key=api_key)

        user_message = f"""
Job Title: {job_title}
Company: {company}

--- ORIGINAL JOB DESCRIPTION ---
{job_description}
--- END JOB DESCRIPTION ---

--- ORIGINAL COVER LETTER ---
{original_letter}
--- END ORIGINAL COVER LETTER ---

--- USER FEEDBACK ---
{feedback}
--- END FEEDBACK ---

Please rewrite the cover letter incorporating the feedback above.
Keep what worked, fix what the user requested.
"""

        message = client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=COVER_LETTER_SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_message}],
        )

        cover_letter = message.content[0].text.strip()
        result["success"] = True
        result["cover_letter"] = cover_letter

    except Exception as e:
        result["error"] = f"Error: {str(e)}"

    return result
