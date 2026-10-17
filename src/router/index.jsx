import { createBrowserRouter } from "react-router-dom"
import React, { lazy } from "react"
import Layout from "../components/layout/Layout"
import LazyWrapper from "../components/ui/LazyWrapper"

// 使用 React.lazy 懒加载页面组件
const Home = lazy(() => import("../pages/Home"))
const Works = lazy(() => import("../pages/Works"))
const ProjectDetail = lazy(() => import("../pages/ProjectDetail"))
const About = lazy(() => import("../pages/About"))
const Blog = lazy(() => import("../pages/Blog"))
const PostDetail = lazy(() => import("../pages/PostDetail"))
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
        path: "works/:slug",
        element: (
          <LazyWrapper>
            <ProjectDetail />
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
        path: "blog",
        element: (
          <LazyWrapper>
            <Blog />
          </LazyWrapper>
        ),
      },
      {
        path: "blog/:slug",
        element: (
          <LazyWrapper>
            <PostDetail />
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
