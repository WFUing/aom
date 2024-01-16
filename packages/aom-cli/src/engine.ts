import { URI, ir, parser } from '@aom/core';
import chalk from 'chalk';
import * as fs from 'fs';
import yaml from 'js-yaml';
import path from 'node:path';
import { Provisioner, Resource, TerraformGenerator } from 'terraform-generator';
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

  async toVelaApi(opts: { workingDir: string; dir: string }) {
    const irSpecRes = await this.handleToVelaApi(opts)

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

  async handleToVelaApi(opts: {
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

    const apis = irService.getVelaApiStyle()

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

    const tfapi = irService.getTFApiStyle()

    fs.mkdir(`${dir}/generated-tf`, { recursive: true }, (err) => {
      if (err) {
        console.error(`Error creating directory: ${err.message}`);
      } else {
        console.log(`Directory created successfully: ${dir}/generated-tf`);
      }
    })

    const module = new TerraformGenerator()

    tfapi.components.forEach(async (component, name) => {
      let com = null
      let comdir = ""
      if ('source' in component && typeof component['source'] === 'string') {
        comdir = path.join(`${dir}/generated-tf`, component['source'])
        fs.mkdir(comdir, { recursive: true }, (err) => {
          if (err) {
            console.error(`Error creating directory: ${err.message}`);
          } else {
            console.log(`Directory created successfully`);
          }
        })
        // if ('depends_on' in component) {
        //   module.module("main", {
        //     "source": component['source'],
        //     "depends_on": component['depends_on']
        //   })
        // } else {
        module.module("main", {
          "source": component['source']
        })
        // }
      }
      if ('required_providers' in component) {
        com = new TerraformGenerator({
          'required_providers': component['required_providers']
        })
      } else {
        com = new TerraformGenerator()
      }
      if ('platforms' in component) {
        const providers = component['platforms'] as Record<string, unknown>[]
        for (const provider of providers) {
          let type = provider["name"] as string
          delete provider["name"]
          com.provider(type, provider)
        }
      }
      if ('datas' in component) {
        const datas = component['datas'] as Record<string, unknown>[]
        for (const data of datas) {
          let type = data["type"] as string
          let id = data["id"] as string
          delete data["type"]
          delete data["id"]
          com.data(type, id, data)
        }
      }

      if ('resources' in component) {
        const res_list: Map<String, Resource> = new Map()
        const resources = component['resources'] as Record<string, unknown>[]
        for (const resource of resources) {
          // console.log(resource)
          if ("depends_on" in resource) {
            let de = resource["depends_on"] as string[]
            let sss = de.map((d) => { return res_list.get(d) })
            // console.log(sss)
            // console.log(res_list)
            resource["depends_on"] = sss
          }
          let type = resource['type'] as string
          let id = resource['id'] as string
          delete resource['type']
          delete resource['id']
          if ("ansible_playbook_dir" in resource) {
            let dir1 = path.resolve(dir, resource["ansible_playbook_dir"] as string)
            let dir2 = path.resolve(comdir, resource["ansible_playbook_dir"] as string)
            await this.copyDirectory(dir1, dir2)
            delete resource['ansible_playbook_dir']
          }
          if ("provisioners" in resource) {
            let provisioners = resource["provisioners"] as Provisioner[]
            delete resource["provisioners"]
            com.resource(type, id, resource, provisioners)
            res_list.set(`${type}.${id}`, new Resource(type, id, resource, provisioners))
          } else {
            com.resource(type, id, resource)
            res_list.set(`${type}.${id}`, new Resource(type, id, resource))
          }
        }
      }

      com.write({ dir: comdir, format: true })
    })

    module.write({ dir: `${dir}/generated-tf`, format: true })
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

  async copyDirectory(srcDir: string, destDir: string) {
    // console.log(srcDir, destDir)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const items = fs.readdirSync(srcDir, { withFileTypes: true });

    for (const item of items) {
      const srcPath = path.join(srcDir, item.name);
      const destPath = path.join(destDir, item.name);

      if (item.isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

