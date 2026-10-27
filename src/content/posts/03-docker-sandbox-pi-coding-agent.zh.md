---
title: 如何用 Docker Sandbox 为 Pi Coding Agent 搭建隔离环境
date: 2026-09-29
author: SOMWHY
summary: 用 Docker Sandbox 为 Pi Coding Agent 准备隔离的运行环境，限制主机访问、网络和 API key。本文以 Windows 为例，从目录结构、镜像和配置到启动验证完整走一遍。
---

我希望 Pi 能帮我操作项目，但不想让它直接使用主机上的开发环境和凭据。所以我用 Docker Sandbox 给它单独准备运行环境，并限制它能访问的网络和 API key。下面以 Windows 为例，从准备配置到启动 Pi 走一遍。

文中的 provider、域名、扩展、skills 和版本都是占位符。复制后先替换所有 `YOUR_...`，再按需启用扩展和 skills。

## 目录结构

在工作区根目录创建以下文件：

```text
pi/
├── files/
│   └── models.json
├── pi.dockerfile
└── pi.yaml
```

`pi.dockerfile` 定义镜像里的工具、Pi、扩展和 skills；`pi.yaml` 定义网络规则、凭据和 agent context；`files/models.json` 配置模型和 provider。

已有自定义 provider 的话，可以从 Pi 用户目录复制 `models.json` 作为起点。保留原文件，并确保副本里没有明文 API key。

如果 `models.json` 里有明文 API key，先删掉它，并将 `apiKey` 改为环境变量引用，例如：

```json
"apiKey": "$PI_API_KEY"
```

仅在 Windows 主机上直接运行 Pi 时，才用下面的命令设置对应的用户环境变量。变量名必须与 `models.json` 中 `$` 后面的名称一致：

```powershell
setx PI_API_KEY "你的实际 API key"
```

`setx` 只对之后启动的程序生效，执行后重新打开终端。

## 准备 Windows 环境

需要 Windows 11、64 位 Intel/AMD 处理器，并启用 Windows Hypervisor Platform。

若尚未启用，请在以管理员身份运行的 PowerShell 中执行：

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

为当前用户安装 Docker Sandbox：

```powershell
winget install -h Docker.sbx
```

然后登录 Docker：

```powershell
sbx login
```

命令会在浏览器中完成登录。

## 编写 pi.dockerfile

这个镜像基于 Docker 的 `shell-docker` 模板，额外安装 Pi 和所需依赖。将 `YOUR_PI_VERSION` 换成实际版本。扩展和 skills 命令默认注释；替换占位符、确认来源后再启用。

```dockerfile
# syntax=docker/dockerfile:1

# 基础镜像包含 shell sandbox 常用工具。
FROM dhi.io/sbx-templates:shell-docker

# 安装系统依赖；按扩展或项目的原生依赖增删软件包。
USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

# Pi 需要 Node.js 22.19 或更新版本。替换为要固定的 Pi 版本。
ARG PI_VERSION=YOUR_PI_VERSION
RUN node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 19)) { console.error("Pi requires Node.js 22.19 or newer"); process.exit(1); }' \
    && npm install --global --ignore-scripts @earendil-works/pi-coding-agent@${PI_VERSION}

# 创建 Pi、context-mode 和 npm 缓存目录，并交给普通用户。
RUN install -d -o agent -g agent /home/agent/.pi/agent /home/agent/.pi/context-mode/sessions /home/agent/.npm \
    && chown agent:agent /home/agent/.pi \
    && chown -R agent:agent /home/agent/.npm

# 将模型/provider 配置复制到 Pi 用户目录；文件中不要保存 API key。
COPY --chown=agent:agent files/models.json /home/agent/.pi/agent/models.json

# Pi 包安装以普通用户执行。
USER agent

# 按需安装 Pi 扩展：替换包名和版本、审核来源，然后取消注释。
# RUN pi install npm:YOUR_EXTENSION_PACKAGE@YOUR_EXTENSION_VERSION

# 按需安装 agent skills：替换 GitHub owner/repository 并审核来源，
# 然后取消注释。
# RUN npx --yes skills add YOUR_GITHUB_OWNER/YOUR_SKILLS_REPO --global --agent pi --copy --yes

# 某些扩展可能需要写入特定目录；构建失败时先单独排查，
# 不要忽略必需依赖的安装错误。在构建结束前修正 Pi 配置目录所有权。
USER root
RUN chown -R agent:agent /home/agent/.pi

# sandbox 默认以 Pi 为入口，并在工作区中启动。
USER agent
WORKDIR /home/agent/workspace
ENTRYPOINT ["pi"]
CMD []
```

不用的扩展或 skills 命令保持注释。固定版本，升级时再修改并重建验证。若扩展运行时要写文件，确认目标目录可写。

## 编写 pi.yaml

这个文件声明 kit 信息、网络规则、凭据和 agent context。将 `YOUR_NAME`、`YOUR_PROVIDER_SERVICE` 和 `YOUR_PROVIDER_API_HOST` 换成自己的值。新增 provider 时，复制 credential 配置并更新网络 allow list。

```yaml
# 使用 Docker Sandbox Kit schema 3。
# syntax=docker/sandbox-kit:3
schemaVersion: "3"

displayName: Pi
author: "YOUR_NAME"
description: >-
  A Pi coding agent sandbox.

kind: workload
version: "1.0.0"

capabilities:
  - type: com.docker.sandbox/sbx@1

  - type: com.docker.sandbox/network-policy@1
    config:
      runtime:
        allow:
          - pi.dev:443
          - github.com:443
          - deb.debian.org
          - dhi.io
          - YOUR_PROVIDER_API_HOST:443

  - type: com.docker.sandbox/credential@1
    optional: true
    description: API access for your model provider
    config:
      service: YOUR_PROVIDER_SERVICE
      phase: runtime
      apiKey:
        proxyManaged: true
        inject:
          - domain: YOUR_PROVIDER_API_HOST
            header: Authorization
            format: "Bearer %s"

  - type: com.docker.sandbox/agent-context@1
    config:
      filename: AGENTS.md
      content: |
        This is a Pi coding agent sandbox based on the shell-docker template.
        It includes common shell tools, Node.js, and Pi. Install additional
        system packages or compose other kits only when the task requires them.
```

只放行运行所需的域名：软件源、Git 服务、模型 API 和实际使用的工具。遇到重定向或额外 API host 时再补充，不要开放任意出站流量。

`service` 是保存凭据的名称，必须与 `sbx secret set` 使用的名称一致。`domain` 是注入 token 的 API host。按 provider 的认证方式设置 header 和格式。API key 只存进 secret，不要写入配置文件或提交到版本库。

## 配置模型凭据

可以从 `%USERPROFILE%\.pi\agent\models.json` 复制自定义 provider 配置到 `pi/files/models.json`，不要剪切原文件。移除其中的明文密钥，并确认 API 地址与 `pi.yaml` 中的 `YOUR_PROVIDER_API_HOST` 一致。

在 `pi.yaml` 中，将 `YOUR_PROVIDER_SERVICE` 换成自己的 service 标识，然后用完全相同的名称保存凭据：

```powershell
sbx secret set YOUR_PROVIDER_SERVICE
```

按提示保存凭据。不要把 API key 放进命令参数或配置文件。

## 创建并验证 sandbox

在包含 `pi/` 目录的工作区根目录运行：

```powershell
sbx run ./pi --name pi-box
```

首次运行会下载镜像和构建依赖，之后会复用缓存。Pi 启动后运行 `/login`，选择用 API key 的方式登录已配置的 provider；确认模型列表可见，再发一个请求验证连通性。

首次验证可以检查：

- Pi 能启动，并能读取 `models.json`
- 已启用的扩展和 skills 能加载
- 模型列表可见，且至少一次 API 请求成功
- 在工作区外创建一个空文件，让 Pi 尝试删掉它，应该删不掉
- 只允许访问明确加入 allow list 的目标；新增服务时再更新策略

本地验证通过后，可按 Docker Sandbox 的发布流程上传 kit 供其他项目复用。

如果想了解本文未涉及的内容，请参阅 [Docker Sandboxes | Docker Docs](https://docs.docker.com/ai/sandboxes/)。

原文：<https://juejin.cn/post/7690756305615011875>
