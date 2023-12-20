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

按照依赖关系 build，在下面的目录下依次运行

- aom-core
- aom-cli
- aom
- monaco-aom

```sh
pnpm run dev
```

**compile**

```sh
node packages/aom/bin/aom.cjs compile docs/demos/first-vela-app.aom
```

**monaco-aom**

在 monaco-aom 目录下

```sh
pnpm run build:web
pnpm run serve
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
