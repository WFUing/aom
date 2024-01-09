import { } from 'langium'
import type { URI } from 'vscode-uri'
import { ast } from '.'
import { DiagnosticError } from '../errors'
import { FileSystemProvider } from '../runtime'
import { createAomServices } from '../services'
import { setRootFolder } from '../services/cli-util'
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

  services.shared.workspace.LangiumDocuments.all.forEach(d => {
    const model = d.parseResult.value as ast.Model
    console.log(model)
  })

  const document =
    services.shared.workspace.LangiumDocuments.getOrCreateDocument(opts.file)
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
