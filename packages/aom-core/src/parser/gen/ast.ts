/******************************************************************************
 * This file was generated by langium-cli 2.1.0.
 * DO NOT EDIT MANUALLY!
 ******************************************************************************/

/* eslint-disable */
import type { AstNode, ReferenceInfo, TypeMetaData } from 'langium';
import { AbstractAstReflection } from 'langium';

export const AomTerminals = {
    WS: /\s+/,
    FLOAT: /-?[0-9]+\.[0-9]*/,
    INT: /-?[0-9]+/,
    BOOL: /(true|false)/,
    STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/,
    ID: /[_a-zA-Z][\w-_]*/,
    ML_COMMENT: /\/\*[\s\S]*?\*\//,
    SL_COMMENT: /\/\/[^\n\r]*/,
};

export type AppBlock = CompBlock | PolicyBlock | Property | WorkflowBlock;

export const AppBlock = 'AppBlock';

export function isAppBlock(item: unknown): item is AppBlock {
    return reflection.isInstance(item, AppBlock);
}

export type Block = AppDefBlock | CompBlock | CompDefBlock | SecretDefBlock;

export const Block = 'Block';

export function isBlock(item: unknown): item is Block {
    return reflection.isInstance(item, Block);
}

export type Expr = BlockExpr | ListExpr | Literal | QualifiedName;

export const Expr = 'Expr';

export function isExpr(item: unknown): item is Expr {
    return reflection.isInstance(item, Expr);
}

export type Literal = LiteralBool | LiteralFloat | LiteralInt | LiteralString;

export const Literal = 'Literal';

export function isLiteral(item: unknown): item is Literal {
    return reflection.isInstance(item, Literal);
}

export interface AppDefBlock extends AstNode {
    readonly $container: Model;
    readonly $type: 'AppDefBlock';
    appBlocks: Array<AppBlock>
    name: string
}

export const AppDefBlock = 'AppDefBlock';

export function isAppDefBlock(item: unknown): item is AppDefBlock {
    return reflection.isInstance(item, AppDefBlock);
}

export interface BlockExpr extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'BlockExpr';
    props: Array<Property>
}

export const BlockExpr = 'BlockExpr';

export function isBlockExpr(item: unknown): item is BlockExpr {
    return reflection.isInstance(item, BlockExpr);
}

export interface CompBlock extends AstNode {
    readonly $container: AppDefBlock | Model;
    readonly $type: 'CompBlock';
    name: string
    props: Array<Property>
}

export const CompBlock = 'CompBlock';

export function isCompBlock(item: unknown): item is CompBlock {
    return reflection.isInstance(item, CompBlock);
}

export interface CompDefBlock extends AstNode {
    readonly $container: Model;
    readonly $type: 'CompDefBlock';
    name: string
    props: Array<Property>
}

export const CompDefBlock = 'CompDefBlock';

export function isCompDefBlock(item: unknown): item is CompDefBlock {
    return reflection.isInstance(item, CompDefBlock);
}

export interface ListExpr extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'ListExpr';
    items: Array<Expr>
}

export const ListExpr = 'ListExpr';

export function isListExpr(item: unknown): item is ListExpr {
    return reflection.isInstance(item, ListExpr);
}

export interface LiteralBool extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'LiteralBool';
    value: boolean
}

export const LiteralBool = 'LiteralBool';

export function isLiteralBool(item: unknown): item is LiteralBool {
    return reflection.isInstance(item, LiteralBool);
}

export interface LiteralFloat extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'LiteralFloat';
    value: number
}

export const LiteralFloat = 'LiteralFloat';

export function isLiteralFloat(item: unknown): item is LiteralFloat {
    return reflection.isInstance(item, LiteralFloat);
}

export interface LiteralInt extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'LiteralInt';
    value: number
}

export const LiteralInt = 'LiteralInt';

export function isLiteralInt(item: unknown): item is LiteralInt {
    return reflection.isInstance(item, LiteralInt);
}

export interface LiteralString extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'LiteralString';
    value: string
}

export const LiteralString = 'LiteralString';

export function isLiteralString(item: unknown): item is LiteralString {
    return reflection.isInstance(item, LiteralString);
}

export interface Model extends AstNode {
    readonly $type: 'Model';
    blocks: Array<Block>
    imports: Array<ModelImport>
}

export const Model = 'Model';

export function isModel(item: unknown): item is Model {
    return reflection.isInstance(item, Model);
}

export interface ModelImport extends AstNode {
    readonly $container: Model;
    readonly $type: 'ModelImport';
    path: string
}

export const ModelImport = 'ModelImport';

export function isModelImport(item: unknown): item is ModelImport {
    return reflection.isInstance(item, ModelImport);
}

export interface PolicyBlock extends AstNode {
    readonly $container: AppDefBlock;
    readonly $type: 'PolicyBlock';
    name: string
    props: Array<Property>
}

export const PolicyBlock = 'PolicyBlock';

export function isPolicyBlock(item: unknown): item is PolicyBlock {
    return reflection.isInstance(item, PolicyBlock);
}

export interface Property extends AstNode {
    readonly $container: AppDefBlock | BlockExpr | CompBlock | CompDefBlock | PolicyBlock | SecretDefBlock | WorkflowBlock;
    readonly $type: 'Property';
    name: string
    value: Expr
}

export const Property = 'Property';

export function isProperty(item: unknown): item is Property {
    return reflection.isInstance(item, Property);
}

export interface QualifiedName extends AstNode {
    readonly $container: ListExpr | Property;
    readonly $type: 'QualifiedName';
    names: Array<string>
}

export const QualifiedName = 'QualifiedName';

export function isQualifiedName(item: unknown): item is QualifiedName {
    return reflection.isInstance(item, QualifiedName);
}

export interface SecretDefBlock extends AstNode {
    readonly $container: Model;
    readonly $type: 'SecretDefBlock';
    name: string
    props: Array<Property>
}

export const SecretDefBlock = 'SecretDefBlock';

export function isSecretDefBlock(item: unknown): item is SecretDefBlock {
    return reflection.isInstance(item, SecretDefBlock);
}

export interface WorkflowBlock extends AstNode {
    readonly $container: AppDefBlock;
    readonly $type: 'WorkflowBlock';
    name: string
    props: Array<Property>
}

export const WorkflowBlock = 'WorkflowBlock';

export function isWorkflowBlock(item: unknown): item is WorkflowBlock {
    return reflection.isInstance(item, WorkflowBlock);
}

export type AomAstType = {
    AppBlock: AppBlock
    AppDefBlock: AppDefBlock
    Block: Block
    BlockExpr: BlockExpr
    CompBlock: CompBlock
    CompDefBlock: CompDefBlock
    Expr: Expr
    ListExpr: ListExpr
    Literal: Literal
    LiteralBool: LiteralBool
    LiteralFloat: LiteralFloat
    LiteralInt: LiteralInt
    LiteralString: LiteralString
    Model: Model
    ModelImport: ModelImport
    PolicyBlock: PolicyBlock
    Property: Property
    QualifiedName: QualifiedName
    SecretDefBlock: SecretDefBlock
    WorkflowBlock: WorkflowBlock
}

export class AomAstReflection extends AbstractAstReflection {

    getAllTypes(): string[] {
        return ['AppBlock', 'AppDefBlock', 'Block', 'BlockExpr', 'CompBlock', 'CompDefBlock', 'Expr', 'ListExpr', 'Literal', 'LiteralBool', 'LiteralFloat', 'LiteralInt', 'LiteralString', 'Model', 'ModelImport', 'PolicyBlock', 'Property', 'QualifiedName', 'SecretDefBlock', 'WorkflowBlock'];
    }

    protected override computeIsSubtype(subtype: string, supertype: string): boolean {
        switch (subtype) {
            case AppDefBlock:
            case CompDefBlock:
            case SecretDefBlock: {
                return this.isSubtype(Block, supertype);
            }
            case BlockExpr:
            case ListExpr:
            case Literal:
            case QualifiedName: {
                return this.isSubtype(Expr, supertype);
            }
            case CompBlock: {
                return this.isSubtype(AppBlock, supertype) || this.isSubtype(Block, supertype);
            }
            case LiteralBool:
            case LiteralFloat:
            case LiteralInt:
            case LiteralString: {
                return this.isSubtype(Literal, supertype);
            }
            case PolicyBlock:
            case Property:
            case WorkflowBlock: {
                return this.isSubtype(AppBlock, supertype);
            }
            default: {
                return false;
            }
        }
    }

    getReferenceType(refInfo: ReferenceInfo): string {
        const referenceId = `${refInfo.container.$type}:${refInfo.property}`;
        switch (referenceId) {
            default: {
                throw new Error(`${referenceId} is not a valid reference id.`);
            }
        }
    }

    getTypeMetaData(type: string): TypeMetaData {
        switch (type) {
            case 'AppDefBlock': {
                return {
                    name: 'AppDefBlock',
                    mandatory: [
                        { name: 'appBlocks', type: 'array' }
                    ]
                };
            }
            case 'BlockExpr': {
                return {
                    name: 'BlockExpr',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            case 'CompBlock': {
                return {
                    name: 'CompBlock',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            case 'CompDefBlock': {
                return {
                    name: 'CompDefBlock',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            case 'ListExpr': {
                return {
                    name: 'ListExpr',
                    mandatory: [
                        { name: 'items', type: 'array' }
                    ]
                };
            }
            case 'LiteralBool': {
                return {
                    name: 'LiteralBool',
                    mandatory: [
                        { name: 'value', type: 'boolean' }
                    ]
                };
            }
            case 'Model': {
                return {
                    name: 'Model',
                    mandatory: [
                        { name: 'blocks', type: 'array' },
                        { name: 'imports', type: 'array' }
                    ]
                };
            }
            case 'PolicyBlock': {
                return {
                    name: 'PolicyBlock',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            case 'QualifiedName': {
                return {
                    name: 'QualifiedName',
                    mandatory: [
                        { name: 'names', type: 'array' }
                    ]
                };
            }
            case 'SecretDefBlock': {
                return {
                    name: 'SecretDefBlock',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            case 'WorkflowBlock': {
                return {
                    name: 'WorkflowBlock',
                    mandatory: [
                        { name: 'props', type: 'array' }
                    ]
                };
            }
            default: {
                return {
                    name: type,
                    mandatory: []
                };
            }
        }
    }
}

export const reflection = new AomAstReflection();
