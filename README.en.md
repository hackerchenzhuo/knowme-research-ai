<p align="right"><sub>English · <a href="./README.zh-CN.md">简体中文</a></sub></p>

<p align="center"><img src="./assets/radar.png" width="72" height="72" alt="Paper Radar logo"></p>

<h1 align="center">KnowMe Paper Radar</h1>

<p align="center">A reading list for your research, with a trail back to the papers behind it.</p>

<p align="center">
  <a href="https://arxiv.org/pdf/2611.23702"><img src="https://img.shields.io/badge/Paper-PDF-b31b1b.svg" alt="Read the paper (PDF)"></a>
  <a href="https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/"><img src="https://img.shields.io/badge/Website-KnowMe-287DB1.svg" alt="Project website"></a>
  <a href="https://github.com/hackerchenzhuo/knowme-research-ai/stargazers"><img src="https://img.shields.io/github/stars/hackerchenzhuo/knowme-research-ai?style=social" alt="GitHub stars"></a>
  <a href="https://hackerchenzhuo.github.io/knowme-research-ai/en/#research-atlas"><img src="https://img.shields.io/badge/Atlas-Explore-267F70.svg" alt="Explore the research atlas"></a>
  <a href="https://chromewebstore.google.com/detail/aneomkhamcijmfmeeegocbknklflilof?hl=en"><img src="https://img.shields.io/badge/Chrome-Install-3976A5.svg" alt="Install for Chrome"></a>
  <a href="./CLI.md"><img src="https://img.shields.io/badge/CLI-Guide-6C757D.svg" alt="Read the CLI guide"></a>
</p>

<a href="https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/"><img src="./assets/radar-reading-english-20261121.gif" width="100%" alt="English reading preview: scroll three cached public papers, expand the score evidence, and follow the public atlas to an original arXiv source."></a>

An English-interface preview with three public cached papers: scroll the subscription list, inspect the score breakdown, then follow *When Agents Slow Down* through the separate public atlas to its arXiv abstract. [Try the atlas](https://hackerchenzhuo.github.io/knowme-research-ai/en/#research-atlas)

## <img src="./assets/radar-mark-method.svg" alt="" height="19"> How paper selection works

A search for *agent memory* can turn up papers that mention memory in passing and papers that introduce a memory mechanism. Paper Radar starts with the topics you choose, their priorities, a date window and any terms you want to exclude. It ranks matching papers using their titles and abstracts, publication age, and available evidence about the authors’ earlier work and institutional affiliations.

The base score accounts for matched topics, recency and catalogue evidence. The personal score also reflects the authors’ fit to your reading profile ($\Delta_a$), the institution’s activity in that area ($G$) and any adjustment you set ($\Delta_m$).

$$
s(p,u,t) = s_{\mathrm{base}}(p,u,t) + \Delta_a(p,u,t) + G(p,u,t) + \Delta_m(p,u)
$$

Expand the score to inspect the papers and affiliations behind each term. Switching profiles reuses the same local library. Daily ranking needs no model API key.

## <img src="./assets/radar-mark-guide.svg" alt="" height="19"> Try the browser extension

1. [Install Paper Radar](https://chromewebstore.google.com/detail/aneomkhamcijmfmeeegocbknklflilof?hl=en) and select a few topics or enter your own search terms.
2. Choose a date window and refresh from arXiv. Open a result’s score breakdown to inspect the matching evidence.
3. Save a paper or switch profiles and search the cache again. Duplicate versions are grouped under the same paper identifier.

<details>
<summary>View an example paper card</summary>

<p><img src="./assets/radar-rrsi-en.png" width="88%" alt="Example Paper Radar card for RRSI showing the paper version, topic matches, and an expandable scoring section."></p>

This earlier interface capture shows the paper’s first submission date, version, and evidence controls. [Browser guide](https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/#guide)

</details>

## Local CLI

Research agents can use the command-line interface to rank a local collection and read the results as JSON Lines. Each paper record carries an arXiv identifier and version, its scores, and the source evidence. The first line describes the ranking run.

Download the [CLI toolkit](https://hackerchenzhuo.github.io/knowme-research-ai/assets/knowme-cli-1.2.7.zip). With Node.js 22.13 or newer, run the included three-paper example from the extracted directory.

```sh
node scripts/rank-research-papers.mjs \
  --input examples/frozen-papers.json --profile examples/profile.json \
  --from 2026-09-01 --to 2026-09-30 \
  --exclude survey --limit 20 --format jsonl > ranked.jsonl
```

The [full CLI guide](./CLI.md) covers installation, input formats, profile settings, and reading the output in another research tool.

## <img src="./assets/radar-mark-results.svg" alt="" height="19"> Research

The study follows 174,640 acquired records. Across 58,094 papers matched to sixteen language-model research directions, 64.5% matched through the abstract alone. On fifty expert-judged retrieval tasks, supplying abstracts to the same frozen reranker raised normalized discounted cumulative gain at rank 10 from 0.412 to 0.598. These experiments explain why the tool caches abstracts alongside titles. [Evaluation and system figures](https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/#research-evidence)

[**KnowMe Paper Radar: Lightweight Discovery of Promising Papers in the Age of Autoresearch**](https://arxiv.org/abs/2611.23702)  
Zhuo Chen, Jian Wang, Jinjie Gu, and Lijun Wu. 2026.

<details>
<summary>Cite the paper</summary>

```bibtex
@misc{chen2026knowme,
  title         = {{KnowMe Paper Radar}: Lightweight Discovery of Promising Papers in the Age of Autoresearch},
  author        = {Zhuo Chen and Jian Wang and Jinjie Gu and Lijun Wu},
  year          = {2026},
  eprint        = {2611.23702},
  archivePrefix = {arXiv},
  primaryClass  = {cs.AI},
  url           = {https://arxiv.org/abs/2611.23702}
}
```

</details>

[Report an issue](https://github.com/hackerchenzhuo/knowme-research-ai/issues)

---

## Related tool

**KnowMe AI Translate** translates selected text and preserves Markdown and preferred terminology. [Chrome Web Store](https://chromewebstore.google.com/detail/ggbnigoglmfkdfmjggiifmfoinncblgm?hl=en)
