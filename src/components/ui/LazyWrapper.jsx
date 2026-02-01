import React, { Suspense } from "react"

const LazyWrapper = ({ children }) => (
  <Suspense fallback={null}>{children}</Suspense>
)

export default LazyWrapper
