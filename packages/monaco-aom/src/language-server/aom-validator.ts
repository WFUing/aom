/******************************************************************************
 * Copyright 2021 TypeFox GmbH
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { ValidationChecks, ValidationRegistry } from 'langium'
import type { AomServices } from './aom-module.js'
import * as ast from './generated/ast.js'

export class AomValidationRegistry extends ValidationRegistry {
  constructor(services: AomServices) {
    super(services)
    const validator = services.validation.AomValidator
    const checks: ValidationChecks<ast.AomAstType> = {}
    this.register(checks, validator)
  }
}

export class AomValidator { }
