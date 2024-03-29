/******************************************************************************
 * This file was generated by langium-cli 2.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

import type { LangiumGeneratedServices, LangiumGeneratedSharedServices, LangiumSharedServices, LangiumServices, LanguageMetaData, Module } from 'langium';
import { AomAstReflection } from './ast.js';
import { AOMGrammar } from './grammar.js';

export const AOMLanguageMetaData = {
    languageId: 'aom',
    fileExtensions: ['.aom'],
    caseInsensitive: true
} as const satisfies LanguageMetaData;

export const AomGeneratedSharedModule: Module<LangiumSharedServices, LangiumGeneratedSharedServices> = {
    AstReflection: () => new AomAstReflection()
};

export const AOMGeneratedModule: Module<LangiumServices, LangiumGeneratedServices> = {
    Grammar: () => AOMGrammar(),
    LanguageMetaData: () => AOMLanguageMetaData,
    parser: {}
};
