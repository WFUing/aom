# OAM

## Quick Start

**安装依赖**

```sh
pnpm install
```

**langium:generate**
```sh
pnpm run langium:generate
```

**build**

```sh
pnpm run dev
```

顺序：

- aom-core
- aom-cli
- aom

**compile**

```sh
node packages/aom/bin/aom.cjs compile docs/demos/first-vela-app.aom
```

## Simple Intro

## dev 

### @aom/cli

**用途**

- 提供命令行工具
- 组合 `@aom/core` 提供的语言服务，实现功能

**运行环境**

- NodeJs

### vscode-aom

**用途**

- 组合 `@aom/core` 提供的语言服务，实现 Language Server
- 提供 VSCode 插件

