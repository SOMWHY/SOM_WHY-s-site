import React, { memo, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getPost, loadPostBody, localized } from "../utils/content"
import useLocaleStore from "../store/localeStore"
import MarkdownView from "../components/blog/MarkdownView"

const PostDetail = memo(function PostDetail() {
  const { slug } = useParams()
  const { t } = useTranslation("blog")
  const { locale } = useLocaleStore()

  const [body, setBody] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const post = getPost(slug)

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    setIsLoading(true)

    loadPostBody(slug, locale)
      .then((content) => {
        if (cancelled) return
        setBody(content ?? "")
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Failed to load post body:", error)
        if (cancelled) return
        setBody("")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug, locale])

  if (!post) {
    return (
      <div className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          {t("notFound")}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("backToList")}
        </Link>
      </div>
    )
  }

  const title = localized(post, "title", locale)

  return (
    <article className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("backToList")}
      </Link>

      <header className="mt-10 mb-12">
        <h1 className="font-mono text-3xl md:text-5xl text-zinc-800 dark:text-white leading-tight">
          {title}
        </h1>
        <p className="mt-6 font-mono text-[9px] tracking-[0.25em] uppercase text-zinc-500">
          {post.author} · {t("writtenOn")} {post.date} · {post.readingMinutes}{" "}
          {t("minutes")}
        </p>
      </header>

      {isLoading ? (
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          {t("loading")}
        </p>
      ) : body ? (
        <MarkdownView content={body} />
      ) : null}

      <Link
        to="/blog"
        className="inline-flex items-center gap-2 mt-16 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("backToList")}
      </Link>
    </article>
  )
})

PostDetail.displayName = "PostDetail"

export default PostDetail
