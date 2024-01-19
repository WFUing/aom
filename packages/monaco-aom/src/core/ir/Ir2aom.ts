export function convertToAOM(block: Record<string, any>): string {
    if (block['kind'] === 'comp_block') {
        // console.log(compBlocks)
        let cc = []
        for (let comp of block['compBlocks']) {
            cc.push(`${convertToAOM(comp)}`)
        }
        return `Component ${block['name']} {
${cc.join('\n')}
}`
    }

    if (block['kind'] === 'provider_block') {
        let cc = []
        for (let comp of block['props']) {
            cc.push(`${convertToAOM(comp)}`)
        }
        return `provider ${block['name']} {
${cc.join('\n')}
}`
    }

    if (block['kind'] === 'data_block') {
        let cc = []
        for (let comp of block['props']) {
            cc.push(`${convertToAOM(comp)}`)
        }
        return `data ${block['type']} ${block['id']} {
${cc.join('\n')}
}`
    }

    if (block['kind'] === 'resource_block') {
        let cc = []
        for (let comp of block['props']) {
            cc.push(`${convertToAOM(comp)}`)
        }
        return `resource ${block['type']} ${block['id']} {
${cc.join('\n')}
}`
    }

    if (block['kind'] === 'v_list') {
        let cc = []
        for (let item of block['items']) {
            cc.push(`${convertToAOM(item)}`)
        }
        return `[ ${cc.join(', ')} ]`
    }

    if (block['kind'] === 'v_object') {
        let cc = []
        for (let item of block['props']) {
            cc.push(`${convertToAOM(item)}`)
        }
        return `{
${cc.join('\n')}
}`
    }

    if (block['kind'] === 'v_ref') {
        return `${block['id']}`
    }

    if (block['kind'] === 'v_fun') {
        let cc = []
        for (let item of block['params']) {
            cc.push(`${convertToAOM(item)}`)
        }
        if (cc.length > 0)
            return `fn("${block['name']}", ${cc.join(', ')})`
        else
            return `fn("${block['name']}")`
    }

    if (block['kind'] === 'v_int' || block['kind'] === 'v_bool' ||
        block['kind'] === 'v_float' || block['kind'] === 'v_any') {
        return `${block['value']}`
    }

    if (block['kind'] === 'v_string') {
        return `"${block['value'].replace(/"/g, '\\"')}"`
    }

    if (!('kind' in block)) {
        if (block['hasEqu']) {
            return `${block['key']} = ${convertToAOM(block['value'])}`
        } else {
            return `${block['key']} ${convertToAOM(block['value'])}`
        }
    }
    return ""
}
