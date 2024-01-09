
import { DefaultScopeProvider, EMPTY_SCOPE, MapScope, ReferenceInfo, Scope, getContainerOfType } from 'langium';
import { LangiumServices } from 'langium/lib/services';
import { LangiumDocuments } from 'langium/lib/workspace/documents';
import * as ast from '../../parser/gen/ast'; // 假设这是你的AST
import { resolveImportUris } from './internal-grammar-util';

export class AomScopeProvider extends DefaultScopeProvider {

    protected readonly langiumDocuments: LangiumDocuments;

    constructor(services: LangiumServices) {
        super(services);
        this.langiumDocuments = services.shared.workspace.LangiumDocuments;
    }

    protected override getGlobalScope(referenceType: string, context: ReferenceInfo): Scope {
        const model = getContainerOfType(context.container, ast.isModel);
        if (!model) {
            return EMPTY_SCOPE;
        }
        const importedUris = new Set<string>();
        importedUris.add('./');
        this.gatherImports(model, importedUris);
        let importedElements = this.indexManager.allElements(referenceType, importedUris);
        return new MapScope(importedElements);
    }

    private gatherImports(grammar: ast.Model, importedUris: Set<string>): void {

        for (const imp0rt of grammar.imports) {
            const uris = resolveImportUris(imp0rt);
            if (uris != undefined) {
                for (const uri of uris) {
                    if (uri && !importedUris.has(uri.toString())) {
                        importedUris.add(uri.toString());
                        if (this.langiumDocuments.hasDocument(uri)) {
                            const importedDocument = this.langiumDocuments.getOrCreateDocument(uri);
                            const rootNode = importedDocument.parseResult.value;
                            if (ast.isModel(rootNode)) {
                                this.gatherImports(rootNode, importedUris);
                            }
                        }
                    }
                }
            }
        }
    }


}
