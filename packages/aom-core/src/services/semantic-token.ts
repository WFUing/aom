import {
  AbstractSemanticTokenProvider,
  AstNode,
  SemanticTokenAcceptor,
} from 'langium'
import { ast } from '../parser'

export class AomSemanticTokenProvider extends AbstractSemanticTokenProvider {
  protected highlightElement(
    node: AstNode,
    acceptor: SemanticTokenAcceptor
  ): void | 'prune' | undefined {
    if (ast.isBlock(node)) {
      if ('name' in node) {
        acceptor({
          node,
          property: 'name',
          type: 'class',
        })
      }

      if (ast.isProperty(node)) {
        acceptor({
          node,
          property: 'name',
          type: 'property',
        })
        return
      }

      if (ast.isQualifiedName(node)) {
        acceptor({
          node,
          property: 'names',
          type: 'variable',
        })
        return
      }
    }
  }
}
