import * as fs from 'fs';
import { LangiumDocuments, URI, UriUtils, getDocument } from 'langium';
import * as path from 'path';
import * as ast from '../../parser/gen/ast.js';

export function resolveImportUri(imp: ast.ModelImport): URI | undefined {
    if (imp.path === undefined || imp.path.length === 0) {
        return undefined;
    }
    const dirUri = UriUtils.dirname(getDocument(imp).uri);
    let grammarPath = imp.path;
    if (!grammarPath.endsWith('.aom')) {
        grammarPath += '.aom';
    }
    return UriUtils.resolvePath(dirUri, grammarPath);
}

export function getFilesWithExtension(directory: string, extension: string): string[] {
    const files: string[] = [];

    function traverseDirectory(currentPath: string): void {
        const entries = fs.readdirSync(currentPath);

        entries.forEach((entry) => {
            const entryPath = path.join(currentPath, entry);
            const stat = fs.statSync(entryPath);

            if (stat.isDirectory()) {
                traverseDirectory(entryPath);
            } else if (stat.isFile() && entry.endsWith(extension) && entry != 'main') {
                files.push(entryPath);
            }
        });
    }

    traverseDirectory(directory);

    return files;
}

export function resolveImportUris(imp: ast.ModelImport): URI[] | undefined {
    if (imp.path === undefined || imp.path.length === 0) {
        return undefined;
    }
    const fileExtension = '.aom';
    const dirUri = UriUtils.dirname(getDocument(imp).uri);
    const aomFiles = getFilesWithExtension(imp.path, fileExtension);
    return aomFiles.map((file) => UriUtils.resolvePath(dirUri, file));
}

export function resolveLocalImportUris(now: URI, path: string): URI[] | undefined {
    if (path === undefined) {
        return undefined;
    }
    const fileExtension = '.aom';
    const aomFiles = getFilesWithExtension(path, fileExtension);
    return aomFiles.map((file) => UriUtils.resolvePath(now, file));
}

export function resolveImport(documents: LangiumDocuments, imp: ast.ModelImport): ast.Model | undefined {
    const resolvedUri = resolveImportUri(imp);
    try {
        if (resolvedUri) {
            const resolvedDocument = documents.getOrCreateDocument(resolvedUri);
            const node = resolvedDocument.parseResult.value;
            if (ast.isModel(node)) {
                return node;
            }
        }
    } catch {
        // NOOP
    }
    return undefined;
}

export function resolveTransitiveImports(documents: LangiumDocuments, grammar: ast.Model): ast.Model[]
export function resolveTransitiveImports(documents: LangiumDocuments, importNode: ast.ModelImport): ast.Model[]
export function resolveTransitiveImports(documents: LangiumDocuments, grammarOrImport: ast.Model | ast.ModelImport): ast.Model[] {
    if (ast.isModelImport(grammarOrImport)) {
        const resolvedGrammar = resolveImport(documents, grammarOrImport);
        if (resolvedGrammar) {
            const transitiveGrammars = resolveTransitiveImportsInternal(documents, resolvedGrammar);
            transitiveGrammars.push(resolvedGrammar);
            return transitiveGrammars;
        }
        return [];
    } else {
        return resolveTransitiveImportsInternal(documents, grammarOrImport);
    }
}

function resolveTransitiveImportsInternal(documents: LangiumDocuments, grammar: ast.Model, initialGrammar = grammar, visited: Set<URI> = new Set(), grammars: Set<ast.Model> = new Set()): ast.Model[] {
    const doc = getDocument(grammar);
    if (initialGrammar !== grammar) {
        grammars.add(grammar);
    }
    if (!visited.has(doc.uri)) {
        visited.add(doc.uri);
        for (const imp of grammar.imports) {
            const importedGrammar = resolveImport(documents, imp);
            if (importedGrammar) {
                resolveTransitiveImportsInternal(documents, importedGrammar, initialGrammar, visited, grammars);
            }
        }
    }
    return Array.from(grammars);
}