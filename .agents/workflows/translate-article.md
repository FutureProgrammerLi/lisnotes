---
description: How to translate technical articles and format them for the learning record
---

Follow these steps to translate articles (e.g., from the Prompt Engineering Guide) into Chinese and format them consistently.

## 1. 文章结构 (Article Structure)

Every translated post should follow this layout:

1.  **一级标题 (H1 Title)**: `Translated Title (English Original Title)`
2.  **正文翻译 (Body Translation)**: Professional, fluent technical Chinese. Use standard industry terms.
3.  **技术参数 (Technical Specs)**: Use `text` code blocks for model settings or lists for configurations.
4.  **核心总结 (Summary/Conclusion)**: Place this at the **very bottom** of the content.
5.  **原文链接 (Reference)**: Use a horizontal rule `---` followed by a blockquote `> 原文链接: [Title](URL)`.

## 2. 翻译原则 (Translation Principles)

- **术语规范**: Do not translate core technical terms that are commonly used in English (e.g., Prompt, LLM, Zero-shot). Put the English term in parentheses after the Chinese translation for the first occurrence.
- **自然流畅**: Avoid "Translationese" (翻译腔). Rephrase sentences to sound like they were written by a native Chinese developer.
- **重点突出**: Use bold text (`**term**`) for key concepts and definitions.

## 3. 总结原则 (Summarization Principles)

The summary at the end should be:
- **Concise**: 3-5 bullet points maximum.
- **Point-extracting**: Focus on *what* the article taught and *why* it matters.
- **Actionable**: If it's a guide, what should the reader do next?

## 4. 示例代码 (Template Example)

```markdown
# 标题翻译 (Original Title)

这里是流利的中文正文翻译...

## 子标题

- **重点概念**: 详细描述。

```text
Model: gpt-3.5-turbo
Settings: Default
```

## 💡 核心总结 (Core Summary)

- **要点 1**: 核心内容提取。
- **要点 2**: 核心内容提取。

---
> 原文链接: [Original Title](https://example.com)
```
