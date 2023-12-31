/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import type {
  DefaultSharedModuleContext,
  LangiumServices,
  LangiumSharedServices,
  Module,
  PartialLangiumServices,
} from 'langium'
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium'
import { AOMGeneratedModule, AomGeneratedSharedModule } from '../parser'
import { AomFormatter } from './lsp/formatter'
import { AomSemanticTokenProvider } from './semantic-token'
import { AomValidationRegistry, AomValidator } from './validator'

/**
 * Declaration of custom services - add your own service classes here.
 */
export type AomAddedServices = {
  validation: {
    AomValidator: AomValidator
  }
}

/**
 * Union of Langium default services and your custom services - use this as constructor parameter
 * of custom service classes.
 */
export type AomServices = LangiumServices & AomAddedServices

/**
 * Dependency injection module that overrides Langium default services and contributes the
 * declared custom services. The Langium defaults can be partially specified to override only
 * selected services, while the custom services must be fully specified.
 */
export const AomModule: Module<
  AomServices,
  PartialLangiumServices & AomAddedServices
> = {
  lsp: {
    SemanticTokenProvider: (s) => new AomSemanticTokenProvider(s),
    Formatter: () => new AomFormatter(),
  },
  validation: {
    ValidationRegistry: (s) => new AomValidationRegistry(s),
    AomValidator: () => new AomValidator(),
  },
}

/**
 * Create the full set of services required by Langium.
 *
 * First inject the shared services by merging two modules:
 *  - Langium default shared services
 *  - Services generated by langium-cli
 *
 * Then inject the language-specific services by merging three modules:
 *  - Langium default language-specific services
 *  - Services generated by langium-cli
 *  - Services specified in this file
 *
 * @param context Optional module context with the LSP connection
 * @returns An object wrapping the shared services and the language-specific services
 */
export function createAomServices(context: DefaultSharedModuleContext): {
  shared: LangiumSharedServices
  Aom: AomServices
} {
  const shared = inject(
    createDefaultSharedModule(context),
    AomGeneratedSharedModule,
  )
  const Aom = inject(
    createDefaultModule({ shared }),
    AOMGeneratedModule,
    AomModule
  )
  shared.ServiceRegistry.register(Aom)
  return { shared, Aom }
}
