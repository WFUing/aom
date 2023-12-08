import * as vscode from 'vscode'
import {
  LanguageClient,
  LanguageClientOptions,
} from 'vscode-languageclient/browser'

// This function is called when the extension is activated.
export function activate(context: vscode.ExtensionContext): void {
  // only enable in browser
  console.log(`starting aom browser extension`)

  const client = startLanguageClient(context)

  context.subscriptions.push(client)
}

function startLanguageClient(context: vscode.ExtensionContext): LanguageClient {
  console.log(`start lsp worker, extension uri: ${context.extensionUri}`)

  const serverModule = vscode.Uri.joinPath(
    context.extensionUri,
    'out/language-server/server.browser.js'
  )

  const worker = new Worker(serverModule.toString(true))

  const fileSystemWatcher = vscode.workspace.createFileSystemWatcher('**/*.aom')
  context.subscriptions.push(fileSystemWatcher)

  // Options to control the language client
  const clientOptions: LanguageClientOptions = {
    // to support virtual fs scheme in browser
    documentSelector: [{ scheme: '*', language: 'aom' }],
    synchronize: {
      // Notify the server about file changes to files contained in the workspace
      fileEvents: fileSystemWatcher,
    },
    outputChannelName: 'aom',
  }

  // Create the language client and start the client.
  const client = new LanguageClient('aom', 'aom', clientOptions, worker)

  // Start the client. This will also launch the server
  client.start()
  return client
}
