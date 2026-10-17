import React, { memo } from "react"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { localized } from "../../utils/content"

/**
 * 文章卡片：标题、摘要，以及「作者 · 写于日期 · 预计阅读时长」元信息行。
 * 与项目卡片一样用拉伸链接实现整卡可点击，避免 <a> 嵌套。
 */
const PostCard = memo(function PostCard({ post, locale, labels }) {
  const title = localized(post, "title", locale)
  const summary = localized(post, "summary", locale)

  return (
    <div className="link-card relative flex flex-col gap-4 p-6 hover:bg-zinc-900/30 rounded-lg transition-all">
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ borderRadius: "0.5rem" }}
      >
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="7"
          ry="7"
          fill="none"
          className="ring-border"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "var(--ring-border)", transition: "color 0.3s ease" }}
        />
      </svg>

      {/* 拉伸链接必须压在内容（z-10）之上，否则点击命中的是文字元素而不是这里 */}
      <Link
        to={`/blog/${post.slug}`}
        className="absolute inset-0 z-20 rounded-lg"
        aria-label={title}
      />

      <h2 className="relative z-10 font-medium text-2xl text-zinc-800 dark:text-white transition-colors">
        {title}
      </h2>

      <p className="relative z-10 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {summary}
      </p>

      <div className="relative z-10 mt-auto pt-2 flex items-center justify-between gap-4">
        <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500">
          {post.author} · {labels.writtenOn} {post.date} · {post.readingMinutes}{" "}
          {labels.minutes}
        </p>
        <ArrowUpRight className="shrink-0 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
      </div>
    </div>
  )
})

PostCard.displayName = "PostCard"

export default PostCard
