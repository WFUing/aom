// Monarch syntax highlighting for the aom language.
export default {
    keywords: [
        'AppDef','CompDef','Component','Policy','SecretDef','Workflow','data','import','provider','resource'
    ],
    operators: [
        ',','.',';','='
    ],
    symbols: /,|\.|;|=|\[|\]|\{|\}/,

    tokenizer: {
        initial: [
            { regex: /-?[0-9]+\.[0-9]*/, action: {"token":"number"} },
            { regex: /-?[0-9]+/, action: {"token":"number"} },
            { regex: /(true|false)/, action: {"token":"boolean"} },
            { regex: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/, action: {"token":"string"} },
            { regex: /[_a-zA-Z][\w-_]*/, action: { cases: { '@keywords': {"token":"keyword"}, '@default': {"token":"ID"} }} },
            { include: '@whitespace' },
            { regex: /@symbols/, action: { cases: { '@operators': {"token":"operator"}, '@default': {"token":""} }} },
        ],
        whitespace: [
            { regex: /\s+/, action: {"token":"white"} },
            { regex: /\/\*/, action: {"token":"comment","next":"@comment"} },
            { regex: /\/\/[^\n\r]*/, action: {"token":"comment"} },
        ],
        comment: [
            { regex: /[^/\*]+/, action: {"token":"comment"} },
            { regex: /\*\//, action: {"token":"comment","next":"@pop"} },
            { regex: /[/\*]/, action: {"token":"comment"} },
        ],
    }
};
