/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { services } from '@aom/core'
import { startLanguageServer } from 'langium'
import { NodeFileSystem } from 'langium/node'
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node'

// Create a connection to the client
const connection = createConnection(ProposedFeatures.all)

// Inject the shared services and language-specific services
const { shared } = services.createAomServices({
  connection: connection as any,
  ...NodeFileSystem,
})

// Start the language server with the shared services
startLanguageServer(shared)
