grammar AOM

entry Model:
    blocks+=Block*;

Block:
    AppDefBlock | CompDefBlock | SecretDefBlock;

// Application Definition
AppDefBlock:
    'AppDef' name=ID '{'
        appBlocks+=AppBlock* 
    '}';

AppBlock:
    Property | CompBlock | PolicyBlock | WorkflowBlock;

CompBlock:
    'Component' name=ID '{'
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
    name=ID '=' value=Expr;

Expr:
    QualifiedName | Literal | ListExpr | BlockExpr;

BlockExpr:
    '{' (props+=Property)* '}';

ListExpr:
    '[' (items+=Expr (',' items+=Expr)* ','?)? ']';

QualifiedName:
    names+=ID ('.' names+=ID)*;

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
