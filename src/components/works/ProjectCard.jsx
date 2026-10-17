import React, { memo } from "react"
import { Link } from "react-router-dom"
import { Github, ExternalLink, ArrowUpRight } from "lucide-react"
import { localized } from "../../utils/content"

/**
 * 项目卡片
 *
 * 整张卡可点击跳详情，但 HTML 不允许 <a> 嵌套，
 * 因此用一个铺满卡片的 Link 做「拉伸链接」，外链按钮再抬高一层 z-index 叠在它上面。
 */
const ProjectCard = memo(function ProjectCard({ project, index, locale, labels }) {
  const title = localized(project, "title", locale)
  const summary = localized(project, "summary", locale)

  return (
    <div className="link-card relative flex flex-col gap-4 p-6 hover:bg-zinc-900/30 rounded-lg transition-all">
      {/* 卡片描边环：hover 时由 gsap 把 strokeDashoffset 从满值动画到 0 */}
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

      {/* 拉伸链接：覆盖整张卡。
          注意它要压在内容（z-10）之上 —— 同级 z-index 时 DOM 靠后的会盖住它，
          那样点击命中的就是文字元素而非链接，只有卡片空隙处才能跳转。
          外链按钮再抬高一层（z-30）压住它，避免被吃掉点击。 */}
      <Link
        to={`/works/${project.slug}`}
        className="absolute inset-0 z-20 rounded-lg"
        aria-label={title}
      />

      <div className="relative z-10 flex items-center justify-between">
        <p className="font-mono text-[9px] tracking-[0.3em] text-zinc-600 dark:text-zinc-400">
          No. {String(index + 1).padStart(2, "0")} / {project.period}
        </p>
        <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500">
          {labels.role}: {project.role}
        </span>
      </div>

      <h3 className="relative z-10 font-medium text-2xl text-zinc-800 dark:text-white transition-colors">
        {title}
      </h3>

      <p className="relative z-10 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {summary}
      </p>

      {Array.isArray(project.stack) && project.stack.length > 0 ? (
        <ul className="relative z-10 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li
              key={tech}
              className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-1 rounded border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400"
            >
              {tech}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="relative z-10 mt-auto pt-2 flex items-center justify-between">
        <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-zinc-500">
          {labels.readCase}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>

        {/* 抬高一层，压住上面那张铺满卡片的拉伸链接（z-20） */}
        <span className="relative z-30 flex items-center gap-3">
          {project.repo ? (
            <a
              href={project.repo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.viewRepo}
              className="text-zinc-400 hover:text-cyan-500 transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
          ) : null}
          {project.demo ? (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={labels.liveDemo}
              className="text-zinc-400 hover:text-cyan-500 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}
        </span>
      </div>
    </div>
  )
})

ProjectCard.displayName = "ProjectCard"

export default ProjectCard
