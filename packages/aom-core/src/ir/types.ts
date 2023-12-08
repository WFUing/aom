import { z } from 'zod';

export const AOM_VERSION = '1.0'

export class ApiStyle {
  public apiVersion: string
  public kind: string
  public metadata: Record<string, any>
  public spec: Record<string, any>

  constructor() {
    this.apiVersion = ""
    this.kind = ""
    this.metadata = {}
    this.spec = {}
  }
}

/**Spec */
export type Spec = {
  blocks: Block[]
}

/**Value */
export type Value =
  | AtomicValue
  | { kind: 'v_list'; items: Value[] }
  | {
    kind: 'v_object'
    props: {
      key: string
      value: Value
    }[]
  }
  | { kind: 'v_ref'; id: string }

export type AtomicValue =
  | { kind: 'v_string'; value: string }
  | { kind: 'v_int'; value: number }
  | { kind: 'v_bool'; value: boolean }
  | { kind: 'v_float'; value: number }
  | { kind: 'v_any'; value: unknown }

export function isAtomicValue(v: { kind: string }): v is AtomicValue {
  if (v.kind.startsWith('v_') && 'value' in v) {
    return true
  }
  return false
}

/**Property */
export type Property = { key: string; value: Value }

/**Block */
export type Block =
  | AppDefBlock
  | CompDefBlock
  | SecretDefBlock

export type AppDefBlock = { kind: 'appDef_block'; name: string; appBlocks: AppBlock[] }
export type CompDefBlock = { kind: 'compDef_block'; name: string; props: Property[] }
export type SecretDefBlock = { kind: 'secretDef_block'; name: string; props: Property[] }

export type AppBlock =
  | Property
  | CompBlock
  | PolicyBlock
  | WorkflowBlock

export type CompBlock = { kind: 'comp_block'; name: string; props: Property[] }

export type PolicyBlock = { kind: 'policy_block'; name: string; props: Property[] }

export type WorkflowBlock = { kind: 'workflow_block'; name: string; props: Property[] }

export function validateValue(o: unknown): Value {
  return ValueSchema.parse(o)
}

const ValueSchema: z.ZodType<Value> = z.union([
  z.object({
    kind: z.literal('v_int'),
    value: z.number(),
  }),
  z.object({
    kind: z.literal('v_bool'),
    value: z.boolean(),
  }),
  z.object({
    kind: z.literal('v_string'),
    value: z.string(),
  }),
  z.object({
    kind: z.literal('v_list'),
    items: z.array(z.lazy(() => ValueSchema)),
  }),
  z.object({
    kind: z.literal('v_object'),
    props: z.array(
      z.object({
        key: z.string(),
        value: z.lazy(() => ValueSchema),
      })
    ),
  }),
  z.object({
    kind: z.literal('v_ref'),
    id: z.string(),
  }),
])

export function validateBlock(o: unknown): Block {
  return BlockSchema.parse(o)
}

const BlockSchema: z.ZodType<Block> = z.union([
  z.object({
    kind: z.literal('appDef_block'),
    name: z.string(),
    appBlocks: z.array(z.lazy(() => AppBlockSchema)),
  }),
  z.object({
    kind: z.literal('compDef_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
      })
    ),
  }),
  z.object({
    kind: z.literal('secretDef_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
      })
    ),
  })
])

const AppBlockSchema: z.ZodType<AppBlock> = z.union([
  z.object({
    kind: z.literal('comp_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
      })
    ),
  }),
  z.object({
    kind: z.literal('policy_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
      })
    ),
  }),
  z.object({
    kind: z.literal('workflow_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
      })
    ),
  }),
  z.object({
    key: z.string(),
    value: ValueSchema,
  })
])

