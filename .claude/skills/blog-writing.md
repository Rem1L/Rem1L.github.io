---
name: rem1l-blog-writing
description: Workflow for writing bilingual blog posts for Rem1L's personal blog (rem1l.github.io). Use when user dictates a blog post in Chinese.
version: 1.0.0
source: local-convention
---

# Rem1L Blog Writing Workflow

## Trigger

User says "我要写一篇blog" or starts dictating content in Chinese.

## Stack

- **Framework**: Astro + AstroPaper theme
- **Bilingual**: EN/ZH toggle via `<En>` / `<Zh>` components
- **Comments**: Giscus (GitHub Discussions)
- **Repo**: `Rem1L/Rem1L.github.io`, branch `main`
- **Posts directory**: `src/data/blog/`
- **Format**: `.mdx` for bilingual posts

## Workflow

### Step 1 — Receive Chinese dictation

Listen to the user's Chinese input. It may be rough, stream-of-consciousness, or structured.

### Step 2 — Generate English version

Translate and rewrite into natural English. Do NOT do a literal translation — adapt tone, idioms, and structure for an English-speaking technical audience. Preserve the author's personality and wit.

### Step 3 — Restructure Chinese version

Light edits only:
- Add headers if the post is long (>400 words)
- Break overly long sentences
- Fix obvious grammar issues
- Keep the author's voice and humor intact
- Do NOT over-polish or make it sound formal

### Step 4 — Produce the MDX file

**Filename**: kebab-case slug based on the English title, e.g. `my-post-title.mdx`

**Frontmatter**:
```yaml
---
title: "English Title"
titleZh: "中文标题"
pubDatetime: YYYY-MM-DDTHH:00:00Z  # use today's date
description: "One-sentence English summary"
descriptionZh: "一句话中文简介"
tags: ["tag1", "tag2"]
---
```

**Body structure**:
```mdx
import En from "@/components/En.astro";
import Zh from "@/components/Zh.astro";

<En>
English content here.
</En>

<Zh>
中文内容在这里。
</Zh>
```

### Step 5 — Deploy

```bash
git add src/data/blog/<slug>.mdx
git commit -m "feat: add post '<English Title>'"
git push origin main
```

GitHub Actions auto-deploys. ~1 min to go live at https://rem1l.github.io

## Content Style

- **English**: Conversational but precise. Technical terms stay in English. Dry humor is welcome.
- **Chinese**: 保留作者语气，不过度润色。技术名词保持英文原文。

## Tags Conventions

Common tags used on this blog:
- `LLM Security`, `IPI`, `Agent`, `Research`
- `PhD Life`, `Opinion`, `AI News`
- `Tools`, `Security`

## Notes

- Posts with `<En>/<Zh>` blocks are the standard — always use `.mdx`
- For posts with images, place them in `public/images/` and reference as `/images/xxx.jpg`
- `PretextWrap` component available for magazine-style image wrapping in MDX
