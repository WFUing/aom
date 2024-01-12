import { Command } from 'commander'
import fs from 'fs'
import path from 'node:path'
import { Engine } from './engine'

export function resolveConfigPath(config?: string) {
  if (config) {
    return config
  }

  const configPath = path.resolve(process.cwd(), 'main.aom')
  if (fs.existsSync(configPath)) {
    return configPath
  }

  return path.resolve(process.cwd(), 'main.yaml')
}

async function handleInit(opts: {}) { }

export async function main() {
  const program = new Command('aom')

  program.showHelpAfterError().showSuggestionAfterError()

  program.description('thing model language')

  const engine = new Engine()

  // console.debug(`working dir = ${process.cwd()}`)

  const handleError = (e: unknown) => {
    console.error(e)
  }

  program
    .command('init')
    .requiredOption('-n, --name [string]', 'project name')
    .requiredOption('-t, --template [string]', 'template name')
    .option('--lang [string]', 'language name', 'javascript')
    .action(async (p) => {
      await handleInit(p).catch((e) => console.error(e))
    })

  program
    .command('compile')
    .argument('<dir>', 'file dir')
    .description('compile aom DSL')
    .action(async (p) => {
      await engine
        .compile({
          workingDir: process.cwd(),
          dir: p,
        })
        .catch(handleError)
    })

  program
    .command('toapi')
    .argument('<dir>', 'file dir')
    .description('convert aom to Kubevela')
    .action(async (p) => {
      await engine
        .toApi({
          workingDir: process.cwd(),
          dir: p,
        })
        .catch(handleError)
    })

  program
    .command('up')
    .option('-f, --file <filename>', '指定文件名')
    .action(async (file) => {

      await engine
        .velaup({
          workingDir: process.cwd(),
          file: file.file,
        })
        .catch(handleError)
    })

  program
    .command('delete')
    .argument('<app>', 'app name')
    .action(async (app) => {

      await engine
        .veladelete({
          app: app
        })
        .catch(handleError)
    })

  await program.parseAsync(process.argv)
}
