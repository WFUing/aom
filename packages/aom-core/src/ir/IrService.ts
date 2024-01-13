import { types } from '.';
import { AppError, InternalError } from '../errors';

export function makeIrService(spec: types.Spec) {
    return new ApiService({ spec })
}

export class ApiService {
    /**
     * IrService maintains symtab resolves from Ir Spec
     * and provides useful methods to handle with ir
     */
    private symtab: Map<string, types.Block> = new Map()
    private appDefs: Map<string, types.AppDefBlock> = new Map()
    private compDefs: Map<string, types.CompDefBlock> = new Map()
    private secretDef: Map<string, types.SecretDefBlock> = new Map()
    private comps: Map<string, types.CompBlock> = new Map()

    constructor(private ctx: { spec: types.Spec }) {
        // construct blocks
        for (const block of ctx.spec.blocks) {
            this.symtab.set(block.name, block)
            if (block.kind === "appDef_block") {
                this.appDefs.set(block.name, block)
            } else if (block.kind === "compDef_block") {
                this.compDefs.set(block.name, block)
            } else if (block.kind === "secretDef_block") {
                this.secretDef.set(block.name, block)
            } else if (block.kind === "comp_block") {
                this.comps.set(block.name, block)
            }
        }
    }

    getApiStyle(): types.VelaApiStyle[] {
        const apis: Array<types.VelaApiStyle> = new Array()
        for (const appDef of this.appDefs.values()) {
            const api = new types.VelaApiStyle()
            const appRec: Record<string, any> = this.convertToValue(appDef) as Record<string, unknown>[]
            api.apiVersion = appRec.apiVersion
            api.kind = 'Application'
            api.metadata['name'] = appRec.name
            api.metadata['namespace'] = appRec.namespace == undefined ? 'default' : appRec.namespace
            if (appRec.components) {
                api.spec['components'] = appRec.components
            }
            if (appRec.policies.length > 0) {
                api.spec['policies'] = appRec.policies
            }
            if (appRec.workflow.length > 0) {
                let obj1: Record<string, unknown> = {}
                obj1["steps"] = appRec.workflow
                api.spec['workflow'] = obj1
            }
            apis.push(api)
        }
        return apis
    }

    getBlockByName(name: string) {
        return this.symtab.get(name)
    }

    convertToValue(value: types.Value | types.Block): unknown {
        // atomic value
        if (types.isAtomicValue(value)) {
            return value.value
        }

        if (value.kind === 'v_ref') {
            const block = this.symtab.get(value.id)
            if (!block) {
                throw new AppError(`no such reference=${value.id}`)
            }

            if (block.kind === 'appDef_block' || block.kind === 'compDef_block'
                || block.kind === 'secretDef_block' || block.kind === 'comp_block' || block.kind === "provider_block") {
                return this.convertToValue(block) as Record<string, unknown>
            } else {
                throw new AppError(
                    `type mismatch, require vm_block or cont_block or image_block`
                )
            }
        }

        if (value.kind === 'v_list') {
            return value.items.map((i) => this.convertToValue(i))
        }

        if (value.kind === 'v_object') {
            let obj: Record<string, unknown> = {}
            for (const prop of value.props) {
                obj[prop.key] = this.convertToValue(prop.value)
            }
            return obj
        }

        if (value.kind === 'compDef_block' || value.kind === 'secretDef_block' || value.kind === "provider_block") {
            let obj: Record<string, unknown> = {}
            if (value.name) {
                obj['name'] = value.name
            }
            for (const prop of value.props) {
                obj[`${prop.key}`] = this.convertToValue(prop.value)
            }
            return obj as Record<string, unknown>
        }

        if (value.kind === 'comp_block') {
            let obj: Record<string, unknown> = {}
            obj['name'] = value.name
            let datas: Record<string, unknown>[] = []
            let resources: Record<string, unknown>[] = []
            for (const compBlock of value.compBlocks) {
                if ('key' in compBlock)
                    obj[`${compBlock.key}`] = this.convertToValue(compBlock.value)
                else {
                    if (compBlock.kind === "data_block") {
                        let obj1: Record<string, unknown> = {}
                        obj1['type'] = compBlock.type
                        obj1['id'] = compBlock.id
                        for (const prop of compBlock.props) {
                            const obj2 = this.convertToValue(prop.value) as Record<string, unknown>
                            // if (prop.hasEqu != undefined && !types.isAtomicValue(prop.value))
                            //     obj2['hasEqu'] = prop.hasEqu
                            obj1[`${prop.key}`] = obj2
                        }
                        datas.push(obj1)
                    } else if (compBlock.kind === "resource_block") {
                        let obj1: Record<string, unknown> = {}
                        obj1['type'] = compBlock.type
                        obj1['id'] = compBlock.id
                        let provisioners: Record<string, unknown> = {}
                        for (const prop of compBlock.props) {
                            if (prop.key === 'provisioner') {
                                const obj2 = this.convertToValue(prop.value) as Record<string, unknown>
                                let nam = obj2['name'] as string
                                delete obj2['name']
                                provisioners[nam] = obj2
                            } else {
                                const obj2 = this.convertToValue(prop.value) as Record<string, unknown>
                                // if (prop.hasEqu != undefined && !types.isAtomicValue(prop.value))
                                //     obj2['hasEqu'] = prop.hasEqu
                                obj1[`${prop.key}`] = obj2
                            }
                        }
                        obj1['provisioner'] = provisioners
                        resources.push(obj1)
                    }
                }
            }
            obj["datas"] = datas
            obj['resources'] = resources
            return obj as Record<string, unknown>
        }

        if (value.kind === 'appDef_block') {
            let obj: Record<string, unknown> = {}
            if (value.name) {
                obj['name'] = value.name
            }
            let components: Record<string, unknown>[] = []
            let policies: Record<string, unknown>[] = []
            let workflow: Record<string, unknown>[] = []
            for (const appBlock of value.appBlocks) {
                if ('kind' in appBlock) {
                    if (appBlock.kind === 'comp_block') {
                        let obj1 = this.convertToValue(appBlock) as Record<string, unknown>
                        components.push(obj1)
                    } else if (appBlock.kind === 'policy_block') {
                        let obj1: Record<string, unknown> = {}
                        obj1['name'] = appBlock.name
                        for (const prop of appBlock.props) {
                            obj1[`${prop.key}`] = this.convertToValue(prop.value)
                        }
                        policies.push(obj1)
                    } else if (appBlock.kind === 'workflow_block') {
                        let obj1: Record<string, unknown> = {}
                        obj1['name'] = appBlock.name
                        for (const prop of appBlock.props) {
                            obj1[`${prop.key}`] = this.convertToValue(prop.value)
                        }
                        workflow.push(obj1)
                    }
                } else if (appBlock.key === 'components' && appBlock.value.kind === 'v_list') {
                    for (const item of appBlock.value.items) {
                        let obj1 = this.convertToValue(item) as Record<string, unknown>
                        components.push(obj1)
                    }
                } else {
                    obj[`${appBlock.key}`] = this.convertToValue(appBlock.value)
                }
            }
            obj['components'] = components
            obj['policies'] = policies
            obj['workflow'] = workflow
            return obj as Record<string, unknown>
        }

        const chk: never = value
        throw new InternalError(`unknown value kind=${JSON.stringify(chk)}`)
    }
}
