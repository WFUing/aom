grammar AOM

entry Model:
    imports+=ModelImport*
    blocks+=Block*;

ModelImport:
    'import' path=STRING ';'?;

Block:
    AppDefBlock | CompDefBlock | SecretDefBlock | CompBlock | ProviderBlock;

// Application Definition
AppDefBlock:
    'AppDef' name=ID '{'
        appBlocks+=AppBlock* 
    '}';

AppBlock:
    Property | CompBlock | PolicyBlock | WorkflowBlock;

CompBlock:
    'Component' name=ID '{'
        compBlocks+=CompCompBlock*
    '}';

CompCompBlock:
    Property | DataBlock | ResourceBlock;

ProviderBlock:
    'provider' name=ID '{'
        props+=Property* 
    '}';

DataBlock:
    'data' type=ID id=ID '{'
        props+=Property* 
    '}';

ResourceBlock:
    'resource' type=ID id=ID '{'
        props+=Property* 
    '}';

PolicyBlock:
    'Policy' name=ID '{'
        props+=Property* 
    '}';

WorkflowBlock:
    'Workflow' name=ID '{'
        props+=Property* 
    '}';

// Component Definition
CompDefBlock:
    'CompDef' name=ID '{'
        props+=Property* 
    '}';

// Secret Definition
SecretDefBlock:
    'SecretDef' name=ID '{'
        props+=Property* 
    '}';

// Property
Property:
    ('#' comment=ID)?
    name=ID equ='='? value=Expr;

Expr:
    QualifiedName | Literal | ListExpr | BlockExpr | Fn;

BlockExpr:
    '{' (props+=Property)* '}';

ListExpr:
    '[' (items+=Expr (',' items+=Expr)* ','?)? ']';

QualifiedName:
    names+=ID ('.' names+=ID)*;

Fn:
    'fn'  '(' name=ID (',' params+=Expr)* ')';

Literal:
    LiteralString | LiteralInt | LiteralFloat | LiteralBool;

LiteralString:
    value=STRING;

LiteralInt:
    value=INT;

LiteralBool:
    value=BOOL;

LiteralFloat:
    value=FLOAT;

hidden terminal WS: /\s+/;
terminal FLOAT returns number: /-?[0-9]+\.[0-9]*/;
terminal INT returns number: /-?[0-9]+/;
terminal BOOL returns boolean: 'true' | 'false';
terminal STRING returns string: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal ID: /[_a-zA-Z][\w-_]*/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
