#!/usr/bin/env python3
"""
Render a commercial PROPOSAL to PDF using the V2 design system (COLab).

Pipeline:  proposal.json + institutional.json + proposal.html.j2  ->  HTML  ->  Chromium (Playwright)  ->  PDF
Page size: 1200×1697px (A4 ratio) to match the Figma model 1:1.
Typography: Epilogue + JetBrains Mono (V2 standard — Fabio XM was replaced).

Pricing (recorrente_mensal) — configurable via proposal meta, with defaults:
    meta.hourly_rate      (default 120)    R$/h
    meta.tax_pct          (default 0.20)   tax on top of (service + diluted setup)
    meta.dilution_months  (default 12)     months to amortize one-time setup into the monthly fee
Setup items flagged `exempt_if_with_website` render as "incluído" (delivered with the site, not billed).

Usage:  python render.py <proposal.json> <output.pdf>
Deps:   pip install jinja2 playwright  &&  playwright install chromium
"""
import json
import sys
from pathlib import Path

from jinja2 import Environment, FileSystemLoader, select_autoescape

HERE = Path(__file__).resolve().parent


def brl(v):
    """Format a number as Brazilian Real: 1680 -> 'R$ 1.680,00'."""
    s = f"{v:,.2f}"                       # 1,680.00
    s = s.replace(",", "X").replace(".", ",").replace("X", ".")
    return f"R$ {s}"


def num(v):
    """Hours display: 4 -> '4', 0.5 -> '0.5', falsy -> ''."""
    if not v:
        return ""
    return str(int(v)) if float(v) == int(v) else str(v)


def compute_pricing(p):
    """Annotate items with _setup/_monthly/_value (+ muted flags) and build p['pricing']."""
    meta = p.get("meta", {})
    rate = meta.get("hourly_rate", 120)
    tax_pct = meta.get("tax_pct", 0.20)
    dilution = meta.get("dilution_months", 12)
    recurring = p.get("product_model") == "recorrente_mensal"

    setup_billed = 0.0
    monthly_total = 0.0
    for cat in p.get("categories", []):
        for it in cat.get("items", []):
            s = it.get("setup_hours") or 0
            m = it.get("monthly_hours") or 0
            h = it.get("hours") or 0
            it["_setup"] = num(s) or "—"
            it["_monthly"] = num(m) or "—"
            it["_setup_muted"] = not s
            it["_monthly_muted"] = not m
            # Valor per item
            if it.get("exempt_if_with_website"):
                it["_value"] = "incluído"
                it["_value_muted"] = True
            elif s:
                it["_value"] = brl(s * rate); it["_value_muted"] = False; setup_billed += s * rate
            elif m:
                it["_value"] = brl(m * rate); it["_value_muted"] = False; monthly_total += m * rate
            elif h:
                it["_value"] = brl(h * rate); it["_value_muted"] = False; monthly_total += h * rate
            else:
                it["_value"] = "—"; it["_value_muted"] = True

    if not meta.get("include_hours"):
        return  # no hours table → skip pricing block entirely

    setup_diluted = setup_billed / dilution if (recurring and dilution) else 0
    base = monthly_total + setup_diluted
    tax = base * tax_pct
    total = base + tax

    terms = (
        f"Termos de pagamento — Contrato com período mínimo de {dilution} meses "
        f"(mínimo para execução do trabalho). O setup ({brl(setup_billed)}) é diluído em "
        f"{dilution} parcelas na mensalidade. Mensalidade de {brl(total)}/mês "
        f"— serviço + setup diluído + {int(tax_pct*100)}% de impostos — cobrada mensalmente."
    )
    p["pricing"] = {
        "service": brl(monthly_total),
        "setup_diluted": brl(setup_diluted) if setup_diluted else None,
        "dilution_months": dilution,
        "tax_pct": f"{int(tax_pct*100)}%",
        "tax": brl(tax),
        "total": f"{brl(total)}/mês",
        "terms": terms,
    }


def render_html(proposal_path: Path) -> Path:
    p = json.loads(proposal_path.read_text(encoding="utf-8"))
    inst = json.loads((HERE / "institutional.json").read_text(encoding="utf-8"))
    logo_svg = (HERE / inst["logo"]).read_text(encoding="utf-8")
    compute_pricing(p)

    env = Environment(loader=FileSystemLoader(str(HERE)),
                      autoescape=select_autoescape(["html", "xml"]),
                      trim_blocks=True, lstrip_blocks=True)
    html = env.get_template("proposal.html.j2").render(p=p, inst=inst, logo_svg=logo_svg)
    out = HERE / ".rendered.html"
    out.write_text(html, encoding="utf-8")
    return out


def footer_template(proposal, inst):
    meta = proposal.get("meta", {})
    site = inst["links"]["site"]
    right = f"{meta.get('date','')} · v{meta.get('version','')} · "
    return (
        '<div style="width:100%;font-family:Arial,monospace;font-size:13px;color:#717173;'
        'padding:8px 62px 0;display:flex;justify-content:space-between;border-top:2px solid #FAEA4D;">'
        f'<span style="color:#0C0D0F;font-weight:700">{site}</span>'
        f'<span>{right}<span class="pageNumber"></span>/<span class="totalPages"></span></span></div>'
    )


def html_to_pdf(html_path: Path, pdf_path: Path, footer: str):
    from playwright.sync_api import sync_playwright
    with sync_playwright() as pw:
        browser = pw.chromium.launch()
        page = browser.new_page()
        page.goto(html_path.as_uri(), wait_until="networkidle")
        page.emulate_media(media="print")
        page.pdf(path=str(pdf_path), width="1200px", height="1697px",
                 print_background=True, display_header_footer=True,
                 header_template="<span></span>", footer_template=footer,
                 margin={"top": "72px", "bottom": "84px", "left": "62px", "right": "62px"})
        browser.close()


def main():
    if len(sys.argv) != 3:
        print("usage: python render.py <proposal.json> <output.pdf>")
        sys.exit(1)
    proposal_path, pdf_path = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
    p = json.loads(proposal_path.read_text(encoding="utf-8"))
    inst = json.loads((HERE / "institutional.json").read_text(encoding="utf-8"))
    html = render_html(proposal_path)
    html_to_pdf(html, pdf_path, footer_template(p, inst))
    print(f"✓ {pdf_path}")


if __name__ == "__main__":
    main()
