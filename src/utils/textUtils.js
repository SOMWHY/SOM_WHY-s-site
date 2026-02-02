export function containsChinese(text) {
  return /[\u4e00-\u9fa5]/.test(text)
}

export function getFontClassName(text, baseClassName) {
  return containsChinese(text) ? `${baseClassName}-zh` : baseClassName
}

export function getGlitchTextClassName(text) {
  return containsChinese(text) ? "glitch-text-zh" : "glitch-text"
}