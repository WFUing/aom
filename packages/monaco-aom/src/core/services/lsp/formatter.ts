import { AbstractFormatter, AstNode, Formatting } from 'langium'
import { ast } from '../../parser'

export class AomFormatter extends AbstractFormatter {
  protected format(node: AstNode): void {
    if (ast.isModel(node)) {
      const formatter = this.getNodeFormatter(node)
      formatter.nodes(...node.blocks).prepend(Formatting.noIndent())
      return
    }

    // expr
    if (ast.isExpr(node)) {
      this.formatExpr(node)
      return
    }
  }

  private formatExpr(node: ast.Expr) {
    if (ast.isListExpr(node)) {
      const formatter = this.getNodeFormatter(node)
      const lbracket = formatter.keyword('[')
      const rbracket = formatter.keyword(']')
      const comma = formatter.keywords(',')

      const shouldMultiLine =
        node.items.some((e) => ast.isBlockExpr(e)) ||
        (node.$cstNode?.length || 0) >= 80
      if (shouldMultiLine) {
        formatter.nodes(...node.items).prepend(Formatting.indent())
        rbracket.prepend(Formatting.newLine())
        comma.prepend(Formatting.noSpace())
      } else {
        // in one line
        formatter.nodes(...node.items).append(Formatting.noSpace())
        lbracket.append(Formatting.noSpace())
        rbracket.prepend(Formatting.noSpace())
        comma.prepend(Formatting.noSpace())
        comma.append(Formatting.oneSpace())
      }
      return
    }
  }
}
