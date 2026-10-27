---
title: Building an Isolated Environment for Pi Coding Agent with Docker Sandbox
date: 2026-09-29
author: SOMWHY
summary: A Windows-focused guide to running Pi Coding Agent in Docker Sandbox with isolated tools, network access, and API credentials.
---

I wanted Pi to operate on my projects without giving it direct access to the development environment and credentials on my host. Docker Sandbox gives it a separate runtime, while network and API key access can be restricted. This guide walks through the setup on Windows, from configuration to starting Pi.

The provider, domains, extensions, skills, and versions in this article are placeholders. Replace every `YOUR_...` value before copying the examples, and enable extensions or skills only when needed.

## Directory layout

Create these files at the workspace root:

```text
pi/
├── files/
│   └── models.json
├── pi.dockerfile
└── pi.yaml
```

`pi.dockerfile` defines the tools, Pi installation, extensions, and skills inside the image. `pi.yaml` defines network rules, credentials, and agent context. `files/models.json` configures models and providers.

If you already use a custom provider, copy `models.json` from the Pi user directory as a starting point. Keep the original file intact, and make sure the copy contains no plaintext API key.

If `models.json` contains a plaintext key, remove it and use an environment variable reference instead:

```json
"apiKey": "$PI_API_KEY"
```

Only when running Pi directly on the Windows host should you set the corresponding user environment variable:

```powershell
setx PI_API_KEY "your actual API key"
```

`setx` affects programs started later, so open a new terminal after running it.

## Prepare Windows

You need Windows 11, a 64-bit Intel or AMD processor, and Windows Hypervisor Platform enabled.

If it is not enabled, run this in an elevated PowerShell:

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName HypervisorPlatform -All
```

Install Docker Sandbox for the current user:

```powershell
winget install -h Docker.sbx
```

Then sign in to Docker:

```powershell
sbx login
```

The command completes the sign-in flow in a browser.

## Write pi.dockerfile

The image is based on Docker's `shell-docker` template and adds Pi and its dependencies. Replace `YOUR_PI_VERSION` with the version you want to pin. Extension and skills commands are commented out by default; replace placeholders, review their sources, and enable them deliberately.

```dockerfile
# syntax=docker/dockerfile:1

FROM dhi.io/sbx-templates:shell-docker

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends g++ \
    && rm -rf /var/lib/apt/lists/*

ARG PI_VERSION=YOUR_PI_VERSION
RUN node -e 'const [major, minor] = process.versions.node.split(".").map(Number); if (major < 22 || (major === 22 && minor < 19)) { console.error("Pi requires Node.js 22.19 or newer"); process.exit(1); }' \
    && npm install --global --ignore-scripts @earendil-works/pi-coding-agent@${PI_VERSION}

RUN install -d -o agent -g agent /home/agent/.pi/agent /home/agent/.pi/context-mode/sessions /home/agent/.npm \
    && chown agent:agent /home/agent/.pi \
    && chown -R agent:agent /home/agent/.npm

COPY --chown=agent:agent files/models.json /home/agent/.pi/agent/models.json

USER agent

# RUN pi install npm:YOUR_EXTENSION_PACKAGE@YOUR_EXTENSION_VERSION
# RUN npx --yes skills add YOUR_GITHUB_OWNER/YOUR_SKILLS_REPO --global --agent pi --copy --yes

USER root
RUN chown -R agent:agent /home/agent/.pi

USER agent
WORKDIR /home/agent/workspace
ENTRYPOINT ["pi"]
CMD []
```

Keep unused extension and skills commands commented out. Pin versions and rebuild to verify upgrades. If an extension writes at runtime, confirm that its target directory is writable.

## Write pi.yaml

This file declares kit metadata, network rules, credentials, and agent context. Replace `YOUR_NAME`, `YOUR_PROVIDER_SERVICE`, and `YOUR_PROVIDER_API_HOST`. When adding a provider, copy the credential capability and update the allow list.

```yaml
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

Allow only the domains required at runtime: package sources, Git hosting, the model API, and the tools you actually use. Add redirected or secondary API hosts only when they are observed; do not allow unrestricted outbound traffic.

The `service` value is the credential name and must match the name used with `sbx secret set`. The `domain` value is the model API host where the token is injected. Configure the header and format for the provider's authentication scheme. Store the API key in a secret, never in this file or in the repository.

## Configure model credentials

Copy a custom provider configuration from `%USERPROFILE%\.pi\agent\models.json` to `pi/files/models.json`; do not move the original. Remove plaintext secrets and confirm that the API address matches `YOUR_PROVIDER_API_HOST` in `pi.yaml`.

Replace `YOUR_PROVIDER_SERVICE` with the service identifier from `pi.yaml`, then save the credential using exactly the same name:

```powershell
sbx secret set YOUR_PROVIDER_SERVICE
```

Follow the prompt to save the credential. Never put the API key in a command argument or configuration file.

## Create and verify the sandbox

Run this from the workspace root containing the `pi/` directory:

```powershell
sbx run ./pi --name pi-box
```

The first run downloads the image and build dependencies; later runs reuse the cache. Once Pi starts, run `/login`, choose API-key authentication for the configured provider, confirm that the model list is available, and make one request to verify connectivity.

The first verification should confirm:

- Pi starts and can read `models.json`
- Enabled extensions and skills load
- Models are visible and at least one API request succeeds
- A file created outside the workspace cannot be deleted by Pi
- Only explicitly allowed destinations are reachable; add new services to the policy only when needed

After local verification, publish the kit using Docker Sandbox's kit publishing workflow.

For topics outside this article, see [Docker Sandboxes | Docker Docs](https://docs.docker.com/ai/sandboxes/).

Original article: <https://juejin.cn/post/7690756305615011875>
