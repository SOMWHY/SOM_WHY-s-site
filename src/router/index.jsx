import { createBrowserRouter } from "react-router-dom"
import React, { lazy } from "react"
import Layout from "../components/layout/Layout"
import { LazyWrapper } from "../components"

// 使用 React.lazy 懒加载页面组件
const Home = lazy(() => import("../pages/Home"))
const Works = lazy(() => import("../pages/Works"))
const About = lazy(() => import("../pages/About"))
const Contact = lazy(() => import("../pages/Contact"))
const Links = lazy(() => import("../pages/Links"))
const Photos = lazy(() => import("../pages/Photos"))
const NotFound = lazy(() => import("../pages/NotFound"))

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <Home />
          </LazyWrapper>
        ),
      },
      {
        path: "works",
        element: (
          <LazyWrapper>
            <Works />
          </LazyWrapper>
        ),
      },
      {
        path: "about",
        element: (
          <LazyWrapper>
            <About />
          </LazyWrapper>
        ),
      },
      {
        path: "contact",
        element: (
          <LazyWrapper>
            <Contact />
          </LazyWrapper>
        ),
      },
      {
        path: "links",
        element: (
          <LazyWrapper>
            <Links />
          </LazyWrapper>
        ),
      },
      {
        path: "photos",
        element: (
          <LazyWrapper>
            <Photos />
          </LazyWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <LazyWrapper>
            <NotFound />
          </LazyWrapper>
        ),
      },
    ],
  },
])

export default router
