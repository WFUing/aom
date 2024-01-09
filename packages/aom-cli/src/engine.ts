import { URI, ir, parser } from '@aom/core';
import chalk from 'chalk';
import * as fs from 'fs';
import yaml from 'js-yaml';
import path from 'node:path';
import { NodeFileSystemProvider } from './runtime';
const { spawn } = require('child_process');

export class Engine {
  constructor() { }

  async velaup(opts: { workingDir: string; file: string }) {
    const file = path.resolve(opts.workingDir, opts.file)
    const args = ['up', '-f', file]
    const process = await spawn('vela', args)
    // 处理子进程的输出
    process.stdout.on('data', (data: any) => {
      console.log(`vela stdout: ${data}`);
    });

    // 处理子进程的错误
    process.stderr.on('data', (data: any) => {
      console.error(`vela stderr: ${data}`);
    });

    // 处理子进程的退出事件
    process.on('close', (code: any) => {
      console.log(`vela 子进程退出，退出码 ${code}`);
    });
  }

  async veladelete(opts: { app: string }) {
    const args = ['delete', opts.app]
    const process = spawn('vela', args, { stdio: 'inherit' })
  }

  async compile(opts: { workingDir: string; file: string }) {
    const irSpecRes = await this.handleCompile(opts)

    if (!irSpecRes.ok) {
      const diagErr = irSpecRes.error
      console.error(`failed to compile ${opts.file}`)
      for (const error of diagErr.diags) {
        console.error(
          chalk.red(
            `line ${error.range.start.line}: ${error.message
            } [${diagErr.textDocument.getText(error.range)}]`
          )
        )
      }
      return
    }
  }

  async handleCompile(opts: {
    workingDir: string
    file: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {
    const irSpecRes = await this.getIrSpec(opts);

    if (!irSpecRes.ok) return irSpecRes

    const irSpec = irSpecRes.value

    // console.log(yaml.dump(irSpec))

    fs.writeFile(`./${opts.file}-ir.yaml`, yaml.dump(irSpec), 'utf8', (err) => {
      if (err) {
        console.error('写入文件时发生错误:', err);
      } else {
        console.log('文件写入成功!');
      }
    });

    const irService = ir.makeIrService(irSpec)

    const apis = irService.getApiStyle()

    // console.log(yaml.dump(irService.getApiStyle()))

    for (const api of apis) {

      // 使用 fs.writeFile 写入文件
      fs.writeFile(`./${api.metadata['name']}.yaml`, yaml.dump(api), 'utf8', (err) => {
        if (err) {
          console.error('写入文件时发生错误:', err);
        } else {
          console.log('文件写入成功!');
        }
      });
    }

    return { ok: true, value: irSpec }
  }

  async getIrSpec(opts: {
    workingDir: string
    file: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {
    const file = path.resolve(opts.workingDir, opts.file)
    const fileUri = URI.file(file)

    const parseResult = await parser.parse({
      file: fileUri,
      fileSystemProvider: () => new NodeFileSystemProvider(),
      opts,
    })

    if (!parseResult.ok) {
      return parseResult
    }

    const module = parseResult.value

    const irSpec = await ir.convertFromAst({ main: module })

    return { ok: true, value: irSpec }
  }
}

