import { z } from 'zod';

export const AOM_VERSION = '1.0'

/**KUBEVELA API */
export class VelaApiStyle {
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

/**TF API */
export class TFApiStyle {
  public components: Map<string, any>
  constructor() {
    this.components = new Map()
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
      hasEqu: boolean
    }[]
  }
  | { kind: 'v_ref'; id: string }
  | { kind: 'v_fun'; name: string; params: Value[] }

export type AtomicValue =
  | { kind: 'v_string'; value: string }
  | { kind: 'v_int'; value: number }
  | { kind: 'v_bool'; value: boolean }
  | { kind: 'v_float'; value: number }
  | { kind: 'v_any'; value: unknown }

export function isAtomicValue(v: { kind: string }): v is AtomicValue {
  if ((v.kind.startsWith('v_') && 'value' in v) || v.kind === "v_fun") {
    return true
  }
  return false
}

/**Property */
export type Property = { key: string; value: Value, hasEqu: boolean }

/**Block */
export type Block =
  | AppDefBlock
  | CompDefBlock
  | SecretDefBlock
  | CompBlock
  | ProviderBlock

export type AppDefBlock = { kind: 'appDef_block'; name: string; appBlocks: AppBlock[] }
export type CompDefBlock = { kind: 'compDef_block'; name: string; props: Property[] }
export type SecretDefBlock = { kind: 'secretDef_block'; name: string; props: Property[] }

export type AppBlock =
  | Property
  | CompBlock
  | PolicyBlock
  | WorkflowBlock

export type ProviderBlock = { kind: 'provider_block'; name: string; props: Property[] }

export type PolicyBlock = { kind: 'policy_block'; name: string; props: Property[] }

export type WorkflowBlock = { kind: 'workflow_block'; name: string; props: Property[] }

export type CompBlock = { kind: 'comp_block'; name: string; compBlocks: CompCompBlock[] }

export type CompCompBlock =
  | Property
  | DataBlock
  | ResourceBlock

export type DataBlock = { kind: 'data_block'; type: string; id: string; props: Property[] }

export type ResourceBlock = { kind: 'resource_block'; type: string; id: string; props: Property[] }

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
        hasEqu: z.boolean()
      })
    ),
    hasEqu: z.boolean()
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
    kind: z.literal('provider_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
        hasEqu: z.boolean()
      })
    ),
  }),
  z.object({
    kind: z.literal('compDef_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
        hasEqu: z.boolean()
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
        hasEqu: z.boolean()
      })
    ),
  }),
  z.object({
    kind: z.literal('comp_block'),
    name: z.string(),
    compBlocks: z.array(z.lazy(() => CompCompBlockSchema)),
  }),
])

const CompCompBlockSchema: z.ZodType<CompCompBlock> = z.union([
  z.object({
    kind: z.literal('data_block'),
    type: z.string(),
    id: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
        hasEqu: z.boolean()
      })
    ),
  }),
  z.object({
    kind: z.literal('resource_block'),
    type: z.string(),
    id: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
        hasEqu: z.boolean()
      })
    ),
  }),
  z.object({
    key: z.string(),
    value: ValueSchema,
    hasEqu: z.boolean()
  })
])

const AppBlockSchema: z.ZodType<AppBlock> = z.union([
  z.object({
    kind: z.literal('comp_block'),
    name: z.string(),
    compBlocks: z.array(z.lazy(() => CompCompBlockSchema)),
  }),
  z.object({
    kind: z.literal('policy_block'),
    name: z.string(),
    props: z.array(
      z.object({
        key: z.string(),
        value: ValueSchema,
        hasEqu: z.boolean()
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
        hasEqu: z.boolean()
      })
    ),
  }),
  z.object({
    key: z.string(),
    value: ValueSchema,
    hasEqu: z.boolean()
  })
])

