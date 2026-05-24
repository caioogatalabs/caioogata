---
phase: quick
plan: 260422-kby
type: execute
wave: 1
depends_on: []
files_modified:
  - src/content/en.json
autonomous: true
requirements: []
must_haves:
  truths:
    - "Gallery-staggered sections have visual breathing room with asymmetric and partial rows"
    - "Huia videos display at usable size (6-col) in grouped rows instead of tiny 4-col singles"
  artifacts:
    - path: "src/content/en.json"
      provides: "Updated gallery span distributions for 3 projects"
  key_links: []
---

<objective>
Fix gallery-staggered density across 3 projects and Huia video layout in en.json.

Purpose: Current galleries fill every row to 12 columns creating a dense wall of images. Fiddle Digital style calls for breathing room via asymmetric spans and partial rows. Huia videos are each on a separate row at 4-col width (tiny and wasteful).

Output: Updated en.json with redistributed gallery spans.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@src/content/en.json
</context>

<tasks>

<task type="auto">
  <name>Task 1: Redistribute gallery-staggered spans for breathing room and fix Huia video rows</name>
  <files>src/content/en.json</files>
  <action>
Edit the `gallery-staggered` sections in `src/content/en.json` for 3 projects. Keep all existing images/videos — only change the `spans` arrays within each row, and merge video rows where specified.

**azion-website** (gallery-staggered at ~line 703, 4 rows):
- Row 1: `[12]` — keep as-is (hero full width)
- Row 2: `[8, 4]` — change from `[6, 6]` (asymmetric, wider left)
- Row 3: `[4, 4]` — change from `[4, 4, 4]` (partial row, 4 cols empty right). ALSO remove the 3rd image from this row's `images` array and move it to a new Row 4.
- Row 4 (new): `[8]` — single image (the 3rd image removed from old Row 3: `marketplace-hero.webp`), partial row with 4 cols breathing room
- Row 5 (was Row 4): `[4, 8]` — change from `[6, 6]` (asymmetric, wider right)

Final azion-website rows:
```json
[
  { "spans": [12], "images": ["...home-en-hero.webp"] },
  { "spans": [8, 4], "images": ["...home-reliable-zoom.webp", "...home-products-menu-zoom.webp"] },
  { "spans": [4, 4], "images": ["...functions-hero-zoom.webp", "...cache-hero.webp"] },
  { "spans": [8], "images": ["...marketplace-hero.webp"] },
  { "spans": [4, 8], "images": ["...products-strip.webp", "...professional-services-hero.webp"] }
]
```

**azion-brand-system** (gallery-staggered at ~line 1215, 8 rows):
- Row 1: `[12]` — keep (hero)
- Row 2: `[8, 4]` — change from `[6, 6]` (asymmetric)
- Row 3: `[4, 4, 4]` — keep (3 small icons, fine)
- Row 4: `[4, 8]` — change from `[6, 6]` (asymmetric, opposite direction)
- Row 5: `[6, 4]` — change from `[4, 4]` (wider first image, partial row — 2 cols empty)
- Row 6: `[4, 4]` — change from `[4, 4, 4]`. ALSO remove the 3rd image (`Azion-Careers.webp`) and move to new Row 7.
- Row 7 (new): `[8]` — single image (`Azion-Careers.webp`), partial row
- Row 8 (was Row 7): `[6, 4]` — change from `[4, 4]` (wider first, partial row)
- Row 9 (was Row 8): `[4, 4, 4]` — keep (3 illustrations)

Final azion-brand-system rows (9 rows):
```json
[
  { "spans": [12], "images": ["...asset-welcome.webp"] },
  { "spans": [8, 4], "images": ["...edge-computing.webp", "...asset-cybersecurity.webp"] },
  { "spans": [4, 4, 4], "images": ["...build.webp", "...observe.webp", "...orchestrate.webp"] },
  { "spans": [4, 8], "images": ["...asset-101-serveless.webp", "...asset-application-acceleration.webp"] },
  { "spans": [6, 4], "images": ["...asset-serveless.webp", "...asset-zero-trust.webp"] },
  { "spans": [4, 4], "images": ["...asset-ransomware.webp", "...asset-marketplace.webp"] },
  { "spans": [8], "images": ["...asset-open-standards.webp"] },
  { "spans": [6, 4], "images": ["...observe-1.webp", "...illustrations-guides.webp"] },
  { "spans": [4, 4, 4], "images": ["...illustrations-guides-2.webp", "...illustrations-guides-3.webp", "...Azion-Careers.webp"] }
]
```

**huia** (gallery-staggered at ~line 1448, 7 rows — 2 image rows + 5 single-video rows):
- Row 1: `[8, 4]` — change from `[6, 6]` (asymmetric)
- Row 2: `[4, 8]` — change from `[6, 6]` (asymmetric, opposite)
- Rows 3-7 (5 single `[4]` video rows): Merge into 2 rows of 2 + 1 row of 1:
  - New Row 3: `[6, 6]` — videos 1 and 2 (d8_xTUsyQdo, s-3rKGVUQiM)
  - New Row 4: `[6, 6]` — videos 3 and 4 (u-bbxKjiZvk, 1RpIxQtXwYY)
  - New Row 5: `[6]` — video 5 (TnaCQZDCAmo), partial row

Final huia rows (5 rows):
```json
[
  { "spans": [8, 4], "images": ["...huia-bird.webp", "...golden-circle.webp"] },
  { "spans": [4, 8], "images": ["...we-unlock-ideas.webp", "...team-portraits.webp"] },
  { "spans": [6, 6], "images": [{video:d8_xTUsyQdo}, {video:s-3rKGVUQiM}] },
  { "spans": [6, 6], "images": [{video:u-bbxKjiZvk}, {video:1RpIxQtXwYY}] },
  { "spans": [6], "images": [{video:TnaCQZDCAmo}] }
]
```

**Do NOT touch** azion-console-kit (only 1 row, already fine).

Preserve all image paths, video objects, and other JSON structure exactly. Only modify span arrays and row groupings as specified.
  </action>
  <verify>
    <automated>cd /Users/caioogata/Projects/portolio-v1 && node -e "const d=require('./src/content/en.json'); const p=d.projects; const az=p.find(x=>x.slug==='azion-website').sections.find(s=>s.type==='gallery-staggered'); const br=p.find(x=>x.slug==='azion-brand-system').sections.find(s=>s.type==='gallery-staggered'); const hu=p.find(x=>x.slug==='huia').sections.find(s=>s.type==='gallery-staggered'); console.log('azion-website rows:', az.rows.length, 'spans:', az.rows.map(r=>r.spans)); console.log('azion-brand rows:', br.rows.length, 'spans:', br.rows.map(r=>r.spans)); console.log('huia rows:', hu.rows.length, 'spans:', hu.rows.map(r=>r.spans)); const azFull=az.rows.filter(r=>r.spans.reduce((a,b)=>a+b,0)===12).length; const brFull=br.rows.filter(r=>r.spans.reduce((a,b)=>a+b,0)===12).length; console.log('azion-website full rows:', azFull, '/', az.rows.length); console.log('azion-brand full rows:', brFull, '/', br.rows.length); console.log('huia single-video rows:', hu.rows.filter(r=>r.spans.length===1 && r.spans[0]===4).length, '(should be 0)'); if(hu.rows.filter(r=>r.spans.length===1 && r.spans[0]===4).length > 0) throw 'Huia still has tiny single-video rows';"</automated>
  </verify>
  <done>
    - azion-website: 5 rows, at least 2 partial (not filling 12 cols), asymmetric spans present
    - azion-brand-system: 9 rows, at least 3 partial, asymmetric spans present
    - huia: 5 rows, zero single-[4] video rows, videos grouped in pairs at 6-col width
    - All image paths and video objects preserved exactly
    - JSON is valid (no syntax errors)
  </done>
</task>

</tasks>

<verification>
- `pnpm build` completes without errors
- Visual check: project pages show galleries with breathing room (asymmetric layouts, partial rows)
- Huia videos render at reasonable size (half-width instead of one-third)
</verification>

<success_criteria>
Gallery-staggered sections across azion-website, azion-brand-system, and huia have varied span distributions with partial rows creating whitespace, and Huia videos are grouped into usable 6-col pairs.
</success_criteria>

<output>
After completion, create `.planning/quick/260422-kby-fix-gallery-staggered-density-and-huia-v/260422-kby-SUMMARY.md`
</output>
