import type { URI } from 'vscode-uri'
import { ast } from '.'
import { DiagnosticError } from '../errors'
import { FileSystemProvider } from '../runtime'
import { createAomServices } from '../services'
import { Result } from '../utils'

export type ParseResult<T> = Result<T, DiagnosticError>

export async function parse(opts: {
  file: URI
  fileSystemProvider: () => FileSystemProvider
  check?: boolean
}): Promise<Result<ast.Model, DiagnosticError>> {
  const { check = true } = opts

  const services = createAomServices({
    fileSystemProvider: opts.fileSystemProvider,
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
