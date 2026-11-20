# KnowMe Paper Radar CLI

[Project home](./README.md) · [Browser guide](https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/#guide)

Offline paper ranking and source-linked JSON/JSONL for your own tools.

[Download KnowMe CLI 1.2.7 (.zip, 201 KB)](https://hackerchenzhuo.github.io/knowme-research-ai/assets/knowme-cli-1.2.7.zip)

SHA-256: `938dbcff7ddc508bf8305c30bce24cf5b73760f5b8e87cf4e399eb99bcb00a3c`

**Requirements:** Node.js **22.13.0 or newer**. This package contains precompiled product logic and needs **no npm install**, model key or network connection for ranking. Installing the Chrome extension does not install this separate terminal toolkit.

This download includes the ranking CLI and a JSONL-to-RAG example. **The graph-export CLI and citation-refresh commands are not included in this package.**

### 1. Extract and check

Extract `knowme-cli-1.2.7.zip` with your archive utility, then open a terminal in the extracted `knowme-cli-1.2.7` directory. On macOS/Linux:

```sh
unzip knowme-cli-1.2.7.zip
cd knowme-cli-1.2.7
node --version
node scripts/rank-research-papers.mjs --help
node scripts/rank-research-papers.mjs --list-topics > topics.json
```

Use the actual IDs printed by `--list-topics`, such as `agent-harness`, `rag` and `reasoning`. Priorities range from **1 (highest)** to **4 (lowest)**. Topic terms come from the current product catalogue.

### 2. Run the included synthetic example

The three records in `examples/frozen-papers.json` are explicitly synthetic interface fixtures. Their identifiers are not claims about real arXiv papers.

```sh
node scripts/rank-research-papers.mjs \
  --input examples/frozen-papers.json --profile examples/profile.json \
  --from 2026-09-01 --to 2026-09-30 \
  --exclude survey --limit 20 --format jsonl > ranked.jsonl
```

The example profile is:

```json
{
  "name": "Agent research",
  "topics": {"reasoning": 1, "agent-harness": 2}
}
```

The same JSON input can come from stdin:

```sh
cat examples/frozen-papers.json | node scripts/rank-research-papers.mjs \
  --input - --profile examples/profile.json \
  --from 2026-09-01 --to 2026-09-30 \
  --exclude survey --limit 20 --format jsonl > ranked-stdin.jsonl
```

For a shorter profile, use `--topics` **instead of** `--profile`:

```sh
node scripts/rank-research-papers.mjs \
  --input papers.json --topics rag:1,reasoning:2 \
  --from 2026-10-01 --to 2026-10-31 \
  --exclude survey --limit 20 --format json > ranked.json
```

The last command expects your own `papers.json`.

### 3. Supply real metadata

The input shape is `{"records":[{"paper":{...}}]}`. Each paper should contain a canonical `id`, `title`, `summary` (abstract), `authors` array, valid `published`/`firstSubmittedAt` date, and `categories`. Optional source fields include `version`, `updated`, verified affiliation evidence and metadata verification. The included JSON is a complete shape example; replace its synthetic content with genuine source records for research use.

The date window selects candidates using `firstSubmittedAt`, otherwise `published`, with inclusive UTC endpoints. Personal context uses the **complete supplied bibliography**, including current candidates. Filtering dates does not reconstruct an as-available historical snapshot. Provide only identity/affiliation evidence you actually possess.

`--exclude` is a repeatable case-insensitive literal substring filter over titles and abstracts. All eligible papers are ranked before the output limit is applied. An empty selection is valid and returns a manifest with zero paper records.

| Flag | Meaning |
| --- | --- |
| `--list-topics` | Print valid topic IDs and names. |
| `--topics id:priority,...` | Explicit topic priorities; use this or `--profile`. |
| `--profile FILE.json` | Object with `topics` and optional `name`. |
| `--from`, `--to` | Required inclusive dates in `YYYY-MM-DD` form. |
| `--input FILE.json` / `--input -` | JSON file or stdin. |
| `--database PATH` | Compatible Paper Radar SQLite library, opened read-only; mutually exclusive with `--input`. |
| `--exclude TEXT` | Repeatable literal title/abstract exclusion. |
| `--limit N` | Positive returned-paper limit, default 20. |
| `--format json` / `--format jsonl` | Output format, default JSON. |

With neither `--input` nor `--database`, the original CLI behavior attempts the existing macOS library at `~/Library/Application Support/PaperRadar/paper-radar.sqlite`. This package contains no database. Explicit `--input` is the portable starting point. Ranking does not acquire new papers or load private browser preferences/manual author bonuses.

### 4. Consume the output

Schema: **`knowme-ranked-evidence-v1`**.

- JSON is one object with `manifest` and `papers`.
- JSONL starts with `type: "manifest"`, followed by ranked `type: "paper"` records.
- The manifest records source/profile/code digests, snapshot time, scope, model versions and input/eligible/returned counts.
- Each paper includes its ID/version/rank, title, abstract, authors, source URL, `snapshotId`, score components, matched evidence, missing-evidence states and provenance.
- Scores include `base`, `personalAuthorAdjustment`, `personalInstitutionAdjustment`, `total` and Base `components`. The institution adjustment is the native paper-level aggregate; do not substitute a sum of institution display values.

Check the process exit code before consuming stdout. Ranking errors are structured JSON on stderr and set a nonzero status. Keep stderr for diagnostics and retain the manifest with downstream documents.

Create source-linked retrieval documents without extra dependencies:

```sh
node examples/jsonl-to-rag.mjs \
  ranked.jsonl rag-documents.jsonl selected-ids.json
```

The converter writes `id`, `title`, `text`, `source` and `snapshotId` for each selected paper, plus a separate ID array. It performs no ranking, model call or network request. These records can feed your own retrieval or planning tool. Selection scores do not provide factual training labels or source-reuse permissions.

### 5. Interpret scores and runtime correctly

Scores express a deterministic reading priority under the profile and available records. They are not calibrated probabilities of paper quality, factual correctness or future citations. A neutral contribution can reflect missing evidence. Inspect the abstract, original source, score components and `missing`/`evidence` fields before making a research decision.

A fresh CLI process prepares its own graph/context. The reported 3.03–3.64× retained-graph preparation speedup applies to a **persistent local service with loaded inputs**, not a guarantee for a fresh command. The output limit bounds returned records rather than preparation work.

### 6. Package contents and provenance

- `scripts/rank-research-papers.mjs`: original CLI/profile/ranking functions with a precompiled-module loader.
- `runtime/ranking-core.mjs`: precompiled current product scoring/profile/author/institution logic.
- `runtime/io-core.mjs`: original read-only input path and record normalization, compiled without graph/network refresh entry points.
- `runtime/source-provenance.json`: real original source paths/hashes and the core-bundle hash, emitted through the unchanged output contract.
- `examples/`: synthetic records, a profile, and the JSONL conversion example.
- `MANIFEST.json`: version, file hashes, runtime requirement and distribution scope.

The archive contains no private paper library, browser preferences, credentials, operational directories or remote-agent scripts. It installs no service or background process. Graph export, citation refresh and an MCP server are outside this download.
