import { URI, ir, parser } from '@aom/core';
import chalk from 'chalk';
import * as fs from 'fs';
import yaml from 'js-yaml';
import path from 'node:path';
import { Provisioner, TerraformGenerator, arg, map } from 'terraform-generator';
import { NodeFileSystemProvider } from './runtime';
const { spawn } = require('child_process');

export class Engine {
  constructor() { }

  async demo() {

    const tfg = new TerraformGenerator({
      required_providers: {
        null: map({
          source: "jsiac.com.cn/hashicorp/null",
          version: "3.2.1"
        }),
        local: map({
          source: "jsiac.com.cn/hashicorp/local",
          version: "2.4.0"
        })
      }
    })

    tfg.variable('test', {
      type: arg('string')
    });

    tfg.variable('test2', {
      type: arg('string')
    }, 'test');

    tfg.data('aws_vpc', 'test', {
      cidr_block: 'test'
    });

    tfg.module('test', {
      source: './test'
    });

    const r = tfg.resource('aws_vpc', 'test', {
      cidr_block: 'test',
      tags: map({
        a: 'a'
      })
    });

    tfg.dataFromResource(r, undefined, ['cidr_block', ['tags', 'tag']]);
    tfg.dataFromResource(r, { name: 'test2' }, ['cidr_block', ['tags', 'tag']]);

    const resource = tfg.resource('innerBlock', 'innerBlock', {
      a: 'a'
    }, [
      new Provisioner('local-exec', {
        command: 'echo hello'
      }),
      new Provisioner('local-exec', {
        command: 'echo world'
      })
    ]);

    const locals = tfg.locals({
      a: 'a',
      b: 123,
      c: r.attr('x')
    });
    tfg.resource('locals', 'locals', {
      a: locals.arg('a')
    });

    tfg.import({
      to: resource,
      id: 'id',
      provider: arg('arg')
    });

    tfg.resource('tags', 'tags', {
      tags: map({
        'a': 'a',
        'b': 'b c d'
      })
    });

    const tfg2 = new TerraformGenerator();
    tfg2.resource('tfg2', 'tfg2', {
      tfg2: 'tfg2'
    });
    // Provider
    tfg.provider('aws', {
      region: 'ap-southeast-1',
      profile: 'test'
    });
    tfg.merge(tfg2);

    tfg.write({ dir: "demo.tf", format: true });

  }

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

  async compile(opts: { workingDir: string; dir: string }) {
    const irSpecRes = await this.handleCompile(opts)

    if (!irSpecRes.ok) {
      const diagErr = irSpecRes.error
      console.error(`failed to compile ${opts.dir}`)
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
    dir: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {
    const dir = path.resolve(opts.workingDir, opts.dir)

    const irSpecRes = await this.getIrSpec({ dir: dir });

    if (!irSpecRes.ok) return irSpecRes

    const irSpec = irSpecRes.value

    // console.log(yaml.dump(irSpec))

    fs.mkdir(`${dir}/generated`, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err.message}`);
      } else {
        console.log(`Directory created successfully`);
      }
    })

    fs.writeFile(`${dir}/generated/${path.basename(dir)}-ir.yaml`, yaml.dump(irSpec), 'utf8', (err) => {
      if (err) {
        console.error('写入文件时发生错误:', err)
      } else {
        console.log('文件写入成功!');
      }
    });

    return { ok: true, value: irSpec }
  }

  async toApi(opts: { workingDir: string; dir: string }) {
    const irSpecRes = await this.handleToApi(opts)

    if (!irSpecRes.ok) {
      const diagErr = irSpecRes.error
      console.error(`failed to compile ${opts.dir}`)
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

  async handleToApi(opts: {
    workingDir: string
    dir: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {
    const dir = path.resolve(opts.workingDir, opts.dir)

    const irSpecRes = await this.getIrSpec({ dir: dir });

    if (!irSpecRes.ok) return irSpecRes

    const irSpec = irSpecRes.value

    // console.log(yaml.dump(irSpec))

    fs.mkdir(`${dir}/generated`, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err.message}`);
      } else {
        console.log(`Directory created successfully`);
      }
    })

    const irService = ir.makeIrService(irSpec)

    const apis = irService.getApiStyle()

    // console.log(yaml.dump(irService.getApiStyle()))

    for (const api of apis) {

      // 使用 fs.writeFile 写入文件
      fs.writeFile(`${dir}/generated/${api.metadata['name']}.yaml`, yaml.dump(api), 'utf8', (err) => {
        if (err) {
          console.error('写入文件时发生错误:', err);
        } else {
          console.log('文件写入成功!');
        }
      });
    }

    return { ok: true, value: irSpec }
  }

  async toTF(opts: { workingDir: string; dir: string }) {
    const irSpecRes = await this.handleToTF(opts)

    if (!irSpecRes.ok) {
      const diagErr = irSpecRes.error
      console.error(`failed to compile ${opts.dir}`)
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

  async handleToTF(opts: {
    workingDir: string
    dir: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {
    const dir = path.resolve(opts.workingDir, opts.dir)

    const irSpecRes = await this.getIrSpec({ dir: dir });

    if (!irSpecRes.ok) return irSpecRes

    const irSpec = irSpecRes.value

    // console.log(yaml.dump(irSpec))

    fs.mkdir(`${dir}/generated`, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err.message}`);
      } else {
        console.log(`Directory created successfully`);
      }
    })

    const irService = ir.makeIrService(irSpec)

    const apis = irService.getApiStyle()

    // console.log(yaml.dump(irService.getApiStyle()))

    for (const api of apis) {

      fs.mkdir(`${dir}/generated/${api.metadata['name']}`, { recursive: true }, (err) => {
        if (err) {
          console.error(`Error creating directory: ${err.message}`);
        } else {
          console.log(`Directory created successfully: ${dir}/generated/${api.metadata['name']}`);
        }
      })

      if ('components' in api.spec) {

        let modules = []

        for (const component of api.spec["components"] as Record<string, unknown>[]) {

          let tfs = []
          let comdir = ""
          if ('source' in component && typeof component['source'] === 'string') {
            modules.push(`module "${component['name']}" {
              source = "${component['source']}"
            }`)
            comdir = path.join(`${dir}/generated/${api.metadata['name']}`, component['source'])
            fs.mkdir(comdir, { recursive: true }, (err) => {
              if (err) {
                console.error(`Error creating directory: ${err.message}`);
              } else {
                console.log(`Directory created successfully`);
              }
            })
          }
          if ('providers' in component) {
            const providers = component['providers'] as Record<string, unknown>[]
            let required_providers = []
            let providerss = []
            for (const provider of providers) {
              required_providers.push(`${provider['name']} = {
                  source = "${provider['source']}"
                  version = "${provider['version']}"
                }`)
              if (Object.keys(provider).length > 3) {
                let keys = []
                for (const key in provider) {
                  if (key != 'source' && key != 'version' && key != 'name'
                    && Object.prototype.hasOwnProperty.call(provider, key)) {
                    const value = provider[key];
                    if (typeof value == "string" && value.startsWith("base64decode("))
                      keys.push(`${key} = ${value}`)
                    else
                      keys.push(`${key} = "${value}"`)
                  }
                }
                providerss.push(`provider "${provider['name']}" {
                  ${keys.join('\n')} 
                }`)
              }
            }

            tfs.push(`terraform {
              required_providers {
                ${required_providers.join('\n')}
              }
            }`)

            tfs.push(`${providerss.join('\n')}`)

          }

          if ('datas' in component) {
            const datas = component['datas'] as Record<string, unknown>[]
            let datass = []
            for (const data of datas) {
              let keys = []
              for (const key in data) {
                if (key != 'type' && key != 'id'
                  && Object.prototype.hasOwnProperty.call(data, key)) {
                  const value = data[key];
                  keys.push(`${key} = "${value}"`)
                }
              }
              datass.push(`data "${data["type"]}" "${data["id"]}" {
                ${keys.join('\n')}
              }`)
            }
            tfs.push(datass.join('\n'))
          }

          if ('resources' in component) {
            const tfg = new TerraformGenerator()
            const resources = component['resources'] as Record<string, unknown>[]
            for (const resource of resources) {
              let type = resource['type'] as string
              let id = resource['id'] as string
              let provisioners = resource['provisioner'] as Record<string, unknown>
              let pros: Provisioner[] = []
              Object.keys(provisioners).forEach(type => {
                let pro = provisioners[type] as Record<string, unknown>
                if (type == "local-exec") {
                  pros.push(new Provisioner(type, { command: pro['command'] as string }))
                }
                else {
                  if (pro['inline']) {
                    for (let com of pro["inline"] as string[])
                      pros.push(new Provisioner("remote-exec", { command: com }))
                  }
                }
              });
              delete resource['provisioner']
              delete resource['type']
              delete resource['id']
              tfg.resource(type, id, resource, pros)
            }
            let result = tfg.generate();
            tfs.push(result.tf)
          }

          // 使用 fs.writeFile 写入文件
          fs.writeFile(`${comdir}/main.tf`, tfs.join('\n'), 'utf8', (err) => {
            if (err) {
              console.error('写入文件时发生错误:', err);
            } else {
              console.log('文件写入成功!');
            }
          });

        }

        fs.writeFile(`${dir}/generated/module.tf`, modules.join('\n'), 'utf8', (err) => {
          if (err) {
            console.error('写入文件时发生错误:', err);
          } else {
            console.log('文件写入成功!');
          }
        });
      }

    }

    return { ok: true, value: irSpec }
  }

  async getIrSpec(opts: {
    dir: string
  }): Promise<parser.ParseResult<ir.types.Spec>> {

    if (!fs.existsSync(`${opts.dir}/main.aom`)) {
      fs.writeFile(`${opts.dir}/main.aom`, "", (err) => {
        if (err) {
          console.error(`Error creating file: ${err.message}`);
        } else {
          console.log(`File created successfully: ${opts.dir}/main.aom`);
        }
      });
    }

    const file = path.resolve(opts.dir, "main.aom")

    const fileUri = URI.file(file)

    const parseResult = await parser.parse({
      file: fileUri,
      fileSystemProvider: () => new NodeFileSystemProvider(),
      filePath: file,
      dir: opts.dir
    })

    if (!parseResult.ok) {
      return parseResult
    }

    const module = parseResult.value

    const irSpec = await ir.convertFromAst({ main: module })

    return { ok: true, value: irSpec }
  }
}

