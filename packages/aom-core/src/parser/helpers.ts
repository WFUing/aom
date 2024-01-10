import path from 'path'
import { URI } from 'vscode-uri'
import { ast } from '.'
import { DiagnosticError } from '../errors'
import { FileSystemProvider } from '../runtime'
import { createAomServices } from '../services'
import { setRootFolder } from '../services/cli-util'
import { getFilesWithExtension } from '../services/reference/internal-grammar-util'
import { Result } from '../utils'

export type ParseResult<T> = Result<T, DiagnosticError>

export async function parse(opts: {
  file: URI
  fileSystemProvider: () => FileSystemProvider
  opts: {
    workingDir: string
    file: string
  }
  check?: boolean
}): Promise<Result<ast.Model, DiagnosticError>> {
  const { check = true } = opts

  const services = createAomServices({
    fileSystemProvider: opts.fileSystemProvider,
  })

  await setRootFolder(opts.opts?.file, services.shared, opts.opts?.workingDir)

  const fileExtension = '.aom';
  const aomFiles = getFilesWithExtension(opts.opts.workingDir, fileExtension);
  const uris = aomFiles.map((f) => {
    const file = path.resolve(opts.opts.workingDir, f)
    return URI.file(file)
  });

  const document = services.shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(opts.opts.workingDir, 'main.aom')))

  const ast1 = document.parseResult.value as ast.Model

  uris.map(uri => {
    const d = services.shared.workspace.LangiumDocuments.getOrCreateDocument(uri)
    const ast2 = d.parseResult.value as ast.Model
    ast1.blocks.push(...ast2.blocks)
  })

  console.log(document)

  await services.shared.workspace.DocumentBuilder.build([document], {
    validation: check ? true : false,
  })

  const errors = (document.diagnostics ?? []).filter((e) => e.severity === 1)

  if (errors.length == 0) {
    return {
      ok: true,
      value: document.parseResult.value as ast.Model,
    }
  }

  return {
    ok: false,
    error: new DiagnosticError(errors, document.textDocument),
  }
}
