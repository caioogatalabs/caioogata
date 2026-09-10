"""
fetcher.py — Fetch job descriptions from LinkedIn.

Strategy:
1. Extract job ID from LinkedIn URL
2. Use LinkedIn's public guest job API endpoint (no auth required)
3. Parse HTML with BeautifulSoup to extract job description
4. If blocked/failed, fall back to manual paste
"""

import re
import time
import random
import requests
from bs4 import BeautifulSoup


# LinkedIn guest API endpoint (public, no auth needed)
LINKEDIN_GUEST_API = "https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/{job_id}"

# Realistic browser headers to avoid bot detection
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
}


def extract_job_id(url: str) -> str | None:
    """Extract LinkedIn job ID from URL.

    Supports formats:
    - https://www.linkedin.com/jobs/view/job-title-at-company-4359716582
    - https://www.linkedin.com/jobs/view/4359716582
    - https://linkedin.com/jobs/view/4359716582/
    """
    # Try to find a long numeric ID at the end of the URL
    match = re.search(r"(\d{8,})", url)
    return match.group(1) if match else None


def fetch_job_description(url: str, verbose: bool = True) -> dict:
    """
    Fetch job description from a LinkedIn URL.

    Returns:
        dict with keys:
            - success (bool)
            - title (str)
            - company (str)
            - location (str)
            - description (str)
            - error (str, if failed)
    """
    result = {
        "success": False,
        "title": "",
        "company": "",
        "location": "",
        "description": "",
        "error": "",
    }

    # Extract job ID
    job_id = extract_job_id(url)
    if not job_id:
        result["error"] = f"Could not extract job ID from URL: {url}"
        return result

    if verbose:
        print(f"  📡 Fetching job ID: {job_id}")

    # Small random delay to be polite
    time.sleep(random.uniform(1.0, 2.5))

    try:
        api_url = LINKEDIN_GUEST_API.format(job_id=job_id)
        response = requests.get(api_url, headers=HEADERS, timeout=15)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")

            # Extract job title
            title_tag = soup.find("h2", class_=re.compile(r"top-card-layout__title|title"))
            if not title_tag:
                title_tag = soup.find("h1")
            result["title"] = title_tag.get_text(strip=True) if title_tag else ""

            # Extract company
            company_tag = soup.find("a", class_=re.compile(r"topcard__org-name-link|company"))
            if not company_tag:
                company_tag = soup.find(class_=re.compile(r"topcard__flavor--black-link"))
            result["company"] = company_tag.get_text(strip=True) if company_tag else ""

            # Extract location
            location_tag = soup.find(class_=re.compile(r"topcard__flavor--bullet|location"))
            result["location"] = location_tag.get_text(strip=True) if location_tag else ""

            # Extract job description
            desc_tag = soup.find("div", class_=re.compile(r"description__text|show-more-less-html"))
            if desc_tag:
                # Get clean text, preserving some structure
                description = desc_tag.get_text(separator="\n", strip=True)
                result["description"] = description
                result["success"] = True
            else:
                # Try alternative: get all text from the page body
                body = soup.find("body")
                if body:
                    text = body.get_text(separator="\n", strip=True)
                    # Filter out very short lines (navigation etc)
                    lines = [l for l in text.split("\n") if len(l.strip()) > 20]
                    if len(lines) > 5:
                        result["description"] = "\n".join(lines[:100])  # Limit to first 100 lines
                        result["success"] = True
                    else:
                        result["error"] = "Page loaded but no job description found (possibly gated)"
                else:
                    result["error"] = "Empty page response"

        elif response.status_code == 429:
            result["error"] = "Rate limited (429) — too many requests. Wait a few minutes."
        elif response.status_code == 404:
            result["error"] = "Job not found (404) — may have been removed or expired"
        elif response.status_code in (401, 403):
            result["error"] = f"Access denied ({response.status_code}) — LinkedIn requires login for this job"
        else:
            result["error"] = f"HTTP {response.status_code}: {response.reason}"

    except requests.Timeout:
        result["error"] = "Request timed out after 15 seconds"
    except requests.ConnectionError as e:
        result["error"] = f"Connection error: {str(e)}"
    except Exception as e:
        result["error"] = f"Unexpected error: {str(e)}"

    return result


def get_jd_interactive(url: str, job_info: dict) -> str:
    """
    Try auto-fetch first. If it fails, prompt user to paste the JD manually.

    Returns the job description text.
    """
    print(f"\n  🔗 URL: {url}")

    fetch_result = fetch_job_description(url, verbose=True)

    if fetch_result["success"] and len(fetch_result["description"]) > 200:
        print(f"  ✅ JD fetched successfully ({len(fetch_result['description'])} chars)")
        return fetch_result["description"]
    else:
        print(f"  ⚠️  Auto-fetch failed: {fetch_result['error']}")
        print(f"\n  LinkedIn requires manual copy for this job.")
        print(f"  👉 Open this URL in your browser: {url}")
        print(f"  👉 Copy the full job description text")
        print(f"  👉 Paste it below (press Enter twice when done):\n")

        lines = []
        empty_count = 0
        while True:
            line = input()
            if line == "":
                empty_count += 1
                if empty_count >= 2:
                    break
            else:
                empty_count = 0
                lines.append(line)

        jd_text = "\n".join(lines).strip()
        if jd_text:
            return jd_text
        else:
            # Use keywords from CSV as fallback
            keywords = job_info.get("Keywords_JD", "")
            return f"""
Job Title: {job_info.get('Cargo', 'N/A')}
Company: {job_info.get('Empresa', 'N/A')}
Location: {job_info.get('Local', 'N/A')}
Type: {job_info.get('Tipo', 'N/A')} | {job_info.get('Seniority', 'N/A')}
Keywords: {keywords}

[Full job description not available. Cover letter generated from keywords only.]
"""
