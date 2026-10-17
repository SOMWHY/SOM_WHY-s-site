import React, { memo } from "react"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import javascript from "highlight.js/lib/languages/javascript"
import typescript from "highlight.js/lib/languages/typescript"
import xml from "highlight.js/lib/languages/xml"
import css from "highlight.js/lib/languages/css"
import json from "highlight.js/lib/languages/json"
import bash from "highlight.js/lib/languages/bash"
import python from "highlight.js/lib/languages/python"
import diff from "highlight.js/lib/languages/diff"
import markdown from "highlight.js/lib/languages/markdown"
import "../../styles/markdown.css"

// 插件数组提到组件外，避免每次渲染都生成新数组导致 react-markdown 重复初始化
const REMARK_PLUGINS = [remarkGfm]

/**
 * 只注册真正会用到的语言。
 * rehype-highlight 默认引入 highlight.js 的全部语言（约 300 KB），
 * 这里按需注册后该 chunk 体积可降一个数量级。
 */
const HIGHLIGHT_LANGUAGES = {
  javascript,
  typescript,
  xml, // html / jsx 也走 xml 语法
  css,
  json,
  bash,
  python,
  diff,
  markdown,
}

const REHYPE_PLUGINS = [[rehypeHighlight, { languages: HIGHLIGHT_LANGUAGES }]]

/**
 * 正文渲染。只被懒加载的 PostDetail / ProjectDetail 引用，
 * 因此 react-markdown 及其插件不会进入首屏 chunk。
 */
const MarkdownView = memo(function MarkdownView({ content }) {
  return (
    <div className="markdown-body">
      <Markdown remarkPlugins={REMARK_PLUGINS} rehypePlugins={REHYPE_PLUGINS}>
        {content}
      </Markdown>
    </div>
  )
})

MarkdownView.displayName = "MarkdownView"

export default MarkdownView
