/******************************************************************************
 * Copyright 2022 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import yaml from 'js-yaml';
import { DocumentState, EmptyFileSystem, startLanguageServer } from 'langium';
import {
  BrowserMessageReader,
  BrowserMessageWriter,
  Diagnostic,
  NotificationType,
  createConnection,
} from 'vscode-languageserver/browser.js';
import { createAomServices } from './aom-module.js';
import { convertFromAst } from './convertFromAst.js';
import { Model } from './generated/ast.js';

declare var self: DedicatedWorkerGlobalScope

/* browser specific setup code */
const messageReader = new BrowserMessageReader(self)
const messageWriter = new BrowserMessageWriter(self)

const connection = createConnection(messageReader, messageWriter)

// Inject the shared services and language-specific services
const { shared, Aom } = createAomServices({
  connection: connection as any,
  ...EmptyFileSystem,
})

// Start the language server with the shared services
startLanguageServer(shared)

// Send a notification with the serialized AST after every document change
type DocumentChange = { uri: string, content: string, diagnostics: Diagnostic[] };
const documentChangeNotification = new NotificationType<DocumentChange>('browser/DocumentChange');
const jsonSerializer = Aom.serializer.JsonSerializer;
shared.workspace.DocumentBuilder.onBuildPhase(DocumentState.Validated, async (documents: any) => {
  for (const document of documents) {
    const module = document.parseResult.value as Model;

    const irSpec = await convertFromAst({ main: module })

    const json = yaml.dump(irSpec);

    (module as unknown as { $blocks: Record<string, unknown> }).$blocks = yaml.load(json) as Record<string, unknown>;

    connection.sendNotification(documentChangeNotification, {
      uri: document.uri.toString(),
      content: jsonSerializer.serialize(module, { sourceText: true, textRegions: true }),
      diagnostics: document.diagnostics ?? []
    });
  }
});
