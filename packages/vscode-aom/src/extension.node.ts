import * as path from 'path'
import * as vscode from 'vscode'
import type {
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node'
import { LanguageClient, TransportKind } from 'vscode-languageclient/node'

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
  console.log(`starting aom nodejs extension`)
  const client = startLanguageClient(context)
  context.subscriptions.push(client)
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  const serverModule = context.asAbsolutePath(
    path.join('out', 'language-server/server.node.js')
  )
  // The debug options for the server
  // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] }
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  const serverOptions: ServerOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions,
    },
  }

  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.ft')
  context.subscriptions.push(fileSystemWatcher)

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'aom' }],
    synchronize: {
      // Notify the server about file changes to files contained in the workspace
      fileEvents: fileSystemWatcher,
    },
  }

  // Create the language client and start the client.
  const client = new LanguageClient(
    'aom',
    'Aom',
    serverOptions,
    clientOptions
  )

  // Start the client. This will also launch the server
  client.start()
  return client
}
