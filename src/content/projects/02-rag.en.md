---
title: RAG
title_zh: RAG 知识助手
summary: "A document Q&A and knowledge management app built on retrieval-augmented generation: upload PDF or Markdown, ask in natural language, and get streamed answers with citations."
summary_zh: "基于检索增强生成（RAG）的文档问答与知识管理应用：上传 PDF / Markdown，用自然语言提问，AI 基于检索片段流式作答并附来源引用。"
role: Solo developer
period: "2026.10"
stack:
  - TypeScript
  - Next.js 16
  - React 19
  - Tailwind CSS
  - Vercel AI SDK
  - Neon Postgres
  - pgvector
  - Drizzle ORM
repo: https://github.com/SOMWHY/RAG-
demo: https://rag-iota-six.vercel.app
cover: null
---

<!-- 事实核查：summary / 功能列表 / 已知限制均取自仓库 README；demo 取自仓库 homepage；
     period 取自 created_at（2026-10-16）。GitHub API 的 language 字段为 TypeScript。 -->

Upload a PDF or Markdown file and the system parses it page by page, splits it while preserving page attribution, embeds the chunks into pgvector, then answers questions against those passages — streaming the answer **and** the source citations down a single connection.

## Retrieval and Q&A

- Document upload for PDF and Markdown, drag and drop included; 4 MB per file, aligned to the Vercel request body limit
- Page-aware PDF parsing, so a citation can point back to a specific page number
- Paragraph-aware chunking (1800 characters, 240 overlap) that keeps page attribution
- Batch embedding into pgvector at 1536 dimensions, retrieved by cosine similarity over an HNSW index with a similarity threshold
- Streamed answers where sources ride along as message metadata — no second request to fetch them
- Deleting a document cascades to its chunks and statistics, and is not recoverable

## Knowledge views

- **Structured summaries** — core points, key data, conclusions and tags, validated against a Zod schema
- **Mind maps** — the model emits flat nodes, the front end renders a collapsible SVG topic tree with zoom and pan
- **Chunk browsing** — lists the original text per chunk with page numbers, closing the loop with citations from chat

## Conversations and access

- Persistent history across refreshes, with multiple conversations you can switch between and delete
- Scoped questions: type `@` to pick documents, and retrieval is restricted to them — hitting nothing returns nothing rather than falling back to the whole corpus
- GitHub OAuth only: no registration form, no passwords. Any GitHub account can sign in
- Forced authentication everywhere except `/login` — pages 302, APIs return 401
- Per-user isolation for documents, conversations and messages; accessing someone else's resource returns 404 rather than revealing existence

## Stack

Next.js 16 on the App Router with React 19 and TypeScript, Tailwind CSS v4 with `@tailwindcss/typography`, `ai@7` together with `@ai-sdk/react` and `@ai-sdk/openai`, Neon Postgres with pgvector through Drizzle ORM, Zod 4, and `pdf-parse` v2 plus `mammoth` for parsing. Deployed on Vercel, MIT licensed.

## Known limitations

Quoting the README directly: GitHub OAuth is the only login method; deletion is irreversible and leaves citations inside past conversations untouched; `.docx` parsing exists but the upload UI accepts only PDF and Markdown; uploads run synchronously, so very large documents should move to background jobs with polling; summaries and mind maps only take the first 24 chunks as context.

## Links

- Source: <https://github.com/SOMWHY/RAG->
- Live: <https://rag-iota-six.vercel.app>

## Timeline

- **2026.10** — repository created on GitHub (2026-10-16).
