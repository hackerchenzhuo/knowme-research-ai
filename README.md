<p align="right"><sub>简体中文 | <a href="./README.en.md">English</a></sub></p>

<img src="assets/knowme.svg" width="40" height="40" alt="知我">

# 知我 · KnowMe

论文选读与翻译工具。本仓库维护官网和使用文档。

[官网](https://hackerchenzhuo.github.io/knowme-research-ai/) · [使用指南](https://hackerchenzhuo.github.io/knowme-research-ai/#guide) · [反馈与建议](https://github.com/hackerchenzhuo/knowme-research-ai/issues)

| 工具 | 用途 | 安装 |
|---|---|---|
| 知我论文雷达 | 按研究方向整理 arXiv 论文，查看证据，安排阅读优先级 | [Chrome 商店](https://chromewebstore.google.com/detail/aneomkhamcijmfmeeegocbknklflilof) |
| AI 翻译 | 划词或快捷唤起翻译，保留 Markdown 结构与个人译法 | [Chrome 商店](https://chromewebstore.google.com/detail/ggbnigoglmfkdfmjggiifmfoinncblgm) |

## 论文雷达

- 选择研究专题，或自定义 arXiv 类目、英文关键词、日期范围和排除项。
- 结合相关性、时效与个人偏好安排选读顺序，展开查看作者与机构线索、评分构成和来源。
- 按论文标识合并重复记录，保留版本信息；检索缓存、收藏与设置保存在所选本地数据源：浏览器存储，或已连接的本地论文库。
- 在 arXiv 和 Google Scholar 页面查看已收录论文的标注，继续查找相关工作。

首次使用可先选 1–3 个专题，执行一次联网更新，再查看证据并收藏。之后可用「仅用缓存」重复筛选已保存的资料；获取新论文时再联网更新。常规检索与排序无需模型 API Key。

## AI 翻译

选中文字或使用快捷键唤起翻译，保留 Markdown 结构，并沿用个人术语与译法。安装后配置自己的模型连接即可使用；模型服务可能计费。

两款工具均可免费安装。更换设备或浏览器前，可先导出需要保留的数据；具体操作见[使用指南](https://hackerchenzhuo.github.io/knowme-research-ai/#guide)。

## 更新

截至 2026-11-18，论文雷达 **1.2.6 已在 Chrome 商店发布**；**1.2.7 已提交审核**，进一步更新机构证据归属、方向上下文与评分说明。独立 CLI 1.2.7 已可从官网下载，具体用法见下方文档。

[更新记录](./CHANGELOG.md) · [论文雷达隐私](https://hackerchenzhuo.github.io/knowme-research-ai/radar-privacy.html) · [AI 翻译隐私](https://hackerchenzhuo.github.io/knowme-research-ai/privacy.html)


## CLI 与研究工具接入

[下载 KnowMe CLI 1.2.7（ZIP，201 KB）](https://hackerchenzhuo.github.io/knowme-research-ai/assets/knowme-cli-1.2.7.zip)。需要 **Node.js 22.13 或更新版本**，无需 npm 安装；Chrome 扩展安装不会安装终端命令。

解压后可用附带的明确合成样例验证排名和 JSONL 输出。此包包含离线排名 CLI 与 JSONL 转 RAG 文档示例；不包含图导出或引用更新命令。环境要求与快速示例见[官网 CLI 说明](https://hackerchenzhuo.github.io/knowme-research-ai/en/radar/#cli)，完整操作见[英文 CLI 文档](README.en.md#local-cli)。

分数用于辅助阅读顺序，应结合来源与缺失证据状态查看。常驻服务复用图的测速不能直接套用于每次新启动的 CLI。
