

import { types } from '.';
import { ast } from '../parser';

export async function convertFromAst(opts: {
  main: ast.Model
}): Promise<types.Spec> {
  return new AstToIrConverter(opts).convert()
}

class AstToIrConverter {

  constructor(private ctx: { main: ast.Model }) { }

  convert(): types.Spec {

    const { main } = this.ctx

    const blocks = []

    for (const block of main.blocks) {
      const irBlock = this.handleBlock(block)
      if (irBlock) {
        blocks.push(irBlock)
      }
    }

    return {
      blocks: blocks
    }
  }

  handleBlock(block: ast.Block): types.Block | undefined {
    if (block.$type === 'AppDefBlock') {
      return {
        kind: 'appDef_block',
        name: block.name,
        appBlocks: this.handleAppBlockList(block.appBlocks),
      }
    }

    if (block.$type === 'CompDefBlock') {
      return {
        kind: 'compDef_block',
        name: block.name,
        props: this.handlePropList(block.props),
      }
    }

    if (block.$type === 'SecretDefBlock') {
      return {
        kind: 'secretDef_block',
        name: block.name,
        props: this.handlePropList(block.props),
      }
    }

    if (block.$type === "CompBlock") {
      return {
        kind: 'comp_block',
        name: block.name,
        compBlocks: this.handleCompCompBlock(block.compBlocks)
      }
    }

    if (block.$type === "ProviderBlock") {
      return {
        kind: "provider_block",
        name: block.name,
        props: this.handlePropList(block.props)
      }
    }

    const blk: never = block
    throw new Error(`unknown block type=${(blk as any).$type}`)
  }

  handleAppBlockList(appBlocks: ast.AppBlock[]): types.AppBlock[] {
    return appBlocks.map((appBlock) => {
      switch (appBlock.$type) {
        case 'Property':
          return {
            key: appBlock.name,
            value: this.handleExpr(appBlock.value),
            hasEqu: appBlock.equ !== undefined
          }
        case 'CompBlock':
          return {
            kind: 'comp_block',
            name: appBlock.name,
            compBlocks: this.handleCompCompBlock(appBlock.compBlocks)
          }
        case 'PolicyBlock':
          return {
            kind: 'policy_block',
            name: appBlock.name,
            props: this.handlePropList(appBlock.props)
          }
        case 'WorkflowBlock':
          return {
            kind: 'workflow_block',
            name: appBlock.name,
            props: this.handlePropList(appBlock.props)
          }
      }
    })
  }

  handleCompCompBlock(compBlocks: ast.CompCompBlock[]): types.CompCompBlock[] {
    return compBlocks.map((compBlock) => {
      switch (compBlock.$type) {
        case 'Property':
          return {
            key: compBlock.name,
            value: this.handleExpr(compBlock.value),
            hasEqu: compBlock.equ !== undefined
          }
        case "DataBlock":
          return {
            kind: "data_block",
            type: compBlock.type,
            id: compBlock.id,
            props: this.handlePropList(compBlock.props)
          }
        case "ResourceBlock":
          return {
            kind: "resource_block",
            type: compBlock.type,
            id: compBlock.id,
            props: this.handlePropList(compBlock.props)
          }
      }
    })
  }

  handlePropList(props: ast.Property[]): types.Property[] {
    return props.map((p) => {
      return { key: p.name, value: this.handleExpr(p.value), hasEqu: p.equ !== undefined }
    })
  }

  handleExpr(expr: ast.Expr): types.Value {
    if (expr.$type === 'LiteralString') {
      return { kind: 'v_string', value: expr.value }
    }

    if (expr.$type === 'LiteralInt') {
      return { kind: 'v_int', value: expr.value }
    }

    if (expr.$type === 'LiteralFloat') {
      return { kind: 'v_float', value: expr.value }
    }

    if (expr.$type === 'LiteralBool') {
      return { kind: 'v_bool', value: expr.value }
    }

    if (expr.$type === 'BlockExpr') {
      return { kind: 'v_object', props: this.handlePropList(expr.props) }
    }

    if (expr.$type === 'ListExpr') {
      return {
        kind: 'v_list',
        items: expr.items.map((i) => this.handleExpr(i)),
      }
    }

    if (expr.$type === 'QualifiedName') {
      // TODO: resolve symbol
      return { kind: 'v_ref', id: expr.names.join('.') }
    }

    const v: never = expr
    throw new Error(`unknown expr: ${v}`)
  }
}

