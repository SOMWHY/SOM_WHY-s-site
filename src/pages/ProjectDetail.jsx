import React, { memo, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Github, ExternalLink } from "lucide-react"
import { useTranslation } from "react-i18next"
import { getProject, loadProjectBody, localized } from "../utils/content"
import useLocaleStore from "../store/localeStore"
import MarkdownView from "../components/blog/MarkdownView"

const ProjectDetail = memo(function ProjectDetail() {
  const { slug } = useParams()
  const { t } = useTranslation("works")
  const { locale } = useLocaleStore()

  const [body, setBody] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const project = getProject(slug)

  useEffect(() => {
    if (!slug) return

    let cancelled = false
    setIsLoading(true)

    loadProjectBody(slug, locale)
      .then((content) => {
        if (cancelled) return
        setBody(content ?? "")
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Failed to load project body:", error)
        if (cancelled) return
        setBody("")
        setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug, locale])

  if (!project) {
    return (
      <div className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
        <p
          className="font-mono text-[10px] tracking-[0.3em] uppercase"
          style={{ color: "var(--muted)" }}
        >
          {t("notFound")}
        </p>
        <Link
          to="/works"
          className="inline-flex items-center gap-2 mt-6 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t("backToList")}
        </Link>
      </div>
    )
  }

  const title = localized(project, "title", locale)
  const summary = localized(project, "summary", locale)

  return (
    <article className="w-full max-w-4xl px-6 md:px-0 relative z-10 py-12 pb-32">
      <Link
        to="/works"
        className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("backToList")}
      </Link>

      <header className="mt-10 mb-10">
        <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-4">
          {project.period}
        </p>
        <h1 className="font-mono text-3xl md:text-5xl text-zinc-800 dark:text-white uppercase">
          {title}
        </h1>
        <p className="mt-5 text-sm md:text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {summary}
        </p>
      </header>

      {/* 元信息条 */}
      <dl className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6 border-y border-zinc-200 dark:border-zinc-800">
        <div>
          <dt className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-2">
            {t("role")}
          </dt>
          <dd className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            {project.role}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-2">
            {t("period")}
          </dt>
          <dd className="font-mono text-[11px] text-zinc-700 dark:text-zinc-300">
            {project.period}
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500 mb-2">
            {t("stack")}
          </dt>
          <dd className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3 mt-8">
        {project.repo ? (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 dark:text-zinc-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
          >
            <Github className="w-4 h-4" />
            {t("viewRepo")}
          </a>
        ) : null}
        {project.demo ? (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-600 dark:text-zinc-300 hover:border-cyan-500 hover:text-cyan-500 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t("liveDemo")}
          </a>
        ) : null}
      </div>

      <div className="mt-14">
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
      </div>

      <Link
        to="/works"
        className="inline-flex items-center gap-2 mt-16 font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 hover:text-cyan-500 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("backToList")}
      </Link>
    </article>
  )
})

ProjectDetail.displayName = "ProjectDetail"

export default ProjectDetail
