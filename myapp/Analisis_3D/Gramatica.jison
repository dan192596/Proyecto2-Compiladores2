/* description: Parses and constructs AST. */

/* lexical grammar */
%lex
%options case-insensitive

Numero        [0-9]+
NumeroDecimal [0-9]+"."[0-9]+
Identificador [A-Za-z_][A-Za-z_0-9]*
charterminalc [\"\“\”\'\‘]\%"c"[\"\“\”\'\’]
charterminale [\"\“\”\'\‘]\%"e"[\"\“\”\'\’]
charterminald [\"\“\”\'\‘]\%"d"[\"\“\”\'\’]

comentariounilinea "/""/".*(\r|\n|\r\n)
comentariomultilinea [/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]

%%

//COMENTARIOS
{comentariounilinea}    {/* Omitir comentario de linea */}
{comentariomultilinea}  {/* Omitir comentario multilinea */}
\s+                     {/* Omitir espacio en blanco */}
\t+                     {/* Omitir espacio en blanco */}
\r+                     {/* Omitir espacio en blanco */}
\n+                     {/* Omitir espacio en blanco */}

//TOKENS SIMPLES DEL LENGUAJE
"+"     {return 'suma';}
"-"     {return 'resta';}
"*"     {return 'multiplicacion';}
"/"     {return 'division';}
"%"     {return 'modulo';}
";"     {return 'puntoycoma';}
","     {return 'coma';}
"!="    {return 'distintoque';}
"=="    {return 'igualigual';}
">="    {return 'mayorigual';}
">"     {return 'mayor';}
"<="    {return 'menorigual';}
"<"     {return 'menor';}
"["     {return 'corizq';}
"]"     {return 'corder';}
"("     {return 'parizq';}
")"     {return 'parder';}
"{"     {return 'llaveizq';}
"}"     {return 'llaveder';}
":"     {return 'dospuntos';}
"="     {return 'igual';}
"P"     {return 'punteroStack';}
"p"     {return 'punteroStack';}
"H"     {return 'punteroHeap';}
"h"     {return 'punteroHeap';}

//PALABRAS RESERVADAS
"var"   {return 'var';}
"begin" {return 'begin';}
"goto"  {return 'goto';}
"stack" {return 'stack';}
"end"   {return 'end';}
"if"    {return 'if';}
"heap"  {return 'heap';}
"call"  {return 'call';}
"then"  {return 'then';}
"proc"  {return 'proc';}
"println"   {return 'print';}
"print"     {return 'print';}
"iffalse"   {return 'iffalse';}
"$$_clean_scope" {return 'cleanscope'}

{NumeroDecimal} {return 'decimal';}
{Numero}        {return 'entero';}
{charterminalc}  {return 'charterminalc'}
{charterminale}  {return 'charterminale'}
{charterminald}  {return 'charterminald'}
t[0-9]+         {return 'temporal';}
L[0-9]+         {return 'etiqueta'}

{Identificador} {return 'identificador'}

<<EOF>> {return 'EOF';}
.       {return 'INVALID';}

/lex

%start INICIO

%% /* language grammar */

INICIO 
    : INSTRUCCIONES EOF {$$ =  $1; return $1; }
    ;

BLOQUEINSTRUCCIONES
    : llaveizq INSTRUCCIONES llaveder { $$ = new Instrucciones($1,yylineno);}
    | llaveizq llaveder { $$ = new Instrucciones([],yylineno); }
    ;

INSTRUCCIONES
    : INSTRUCCIONES INSTRUCCION {$$ = $1; $$.push($2); }
    | INSTRUCCION {$$ = [];$$.push($1); }
    ;

INSTRUCCION
    : ASIGNACION            {$$ = $1;}
    | SALTO                 {$$ = $1;}
    | SALTOINCONDICIONAL    {$$ = $1;}
    | SALTOCONDICIONAL      {$$ = $1;}
    | DECLARACIONMETODO     {$$ = $1;}
    | LLAMADAMETODO         {$$ = $1;}
    | IMPRIMIR              {$$ = $1;}
    | LIMPIAR               {$$ = $1;}
    ;

ASIGNACION
    : temporal igual EXPRESION puntoycoma                   {$$=new Asignacion($1,$3,'temporal',yylineno); }
    | temporal igual HOJA puntoycoma                        {$$=new Asignacion($1,$3,'temporal',yylineno); }
    | temporal igual heap corizq HOJA corder puntoycoma     {$$=new Asignacion($1,$5,'temporal_heap',yylineno); }
    | temporal igual stack corizq HOJA corder puntoycoma    {$$=new Asignacion($1,$5,'temporal_stack',yylineno); }

    | punteroHeap igual EXPRESION puntoycoma                   {$$=new Asignacion($1,$3,'temporal',yylineno); }
    | punteroHeap igual HOJA puntoycoma                        {$$=new Asignacion($1,$3,'temporal',yylineno); }    

    | punteroStack igual EXPRESION puntoycoma                   {$$=new Asignacion($1,$3,'temporal',yylineno); }
    | punteroStack igual HOJA puntoycoma                        {$$=new Asignacion($1,$3,'temporal',yylineno); }

    | heap corizq HOJA corder igual EXPRESION puntoycoma    {$$=new Asignacion($3,$6,'heap',yylineno); }
    | heap corizq HOJA corder igual HOJA puntoycoma         {$$=new Asignacion($3,$6,'heap',yylineno); }
    | stack corizq HOJA corder igual EXPRESION puntoycoma   {$$=new Asignacion($3,$6,'stack',yylineno); }
    | stack corizq HOJA corder igual HOJA puntoycoma        {$$=new Asignacion($3,$6,'stack',yylineno);}
    ;

SALTO
    : etiqueta dospuntos {$$ = new Salto($1,yylineno); }
    ;

SALTOINCONDICIONAL
    : goto etiqueta puntoycoma { $$ = new SaltoIncondicional($2,yylineno); }
    ;

SALTOCONDICIONAL
    : if parizq RELACIONAL parder SALTOINCONDICIONAL      {$$ = new SaltoCondicionalVerdadero($3,$5,yylineno); }
    | iffalse parizq RELACIONAL parder SALTOINCONDICIONAL {$$ = new SaltoCondicionalFalso($3,$5,yylineno); }
    ;

DECLARACIONMETODO
    : proc identificador begin INSTRUCCIONES end { $$ = new DeclaracionMetodo($2,$4,yylineno);}
    | proc identificador begin end { $$ = new DeclaracionMetodo($2,[],yylineno);}
    ;
LLAMADAMETODO
    : call identificador puntoycoma { $$ = new LLamadaMetodo($2,yylineno); }
    ;

IMPRIMIR
    : print parizq charterminalc coma HOJA parder puntoycoma { $$ = new Imprimir('c',$5,yylineno);}
    | print parizq charterminale coma HOJA parder puntoycoma { $$ = new Imprimir('e',$5,yylineno);}
    | print parizq charterminald coma HOJA parder puntoycoma { $$ = new Imprimir('d',$5,yylineno);}
    ;

LIMPIAR
    : cleanscope parizq HOJA coma HOJA parder puntoycoma {$$ = new Limpiar($3,$5,yylineno)}
    ;

EXPRESION 
    : ARITMETICA {$$ = $1;}
    | RELACIONAL {$$ = $1;}
    ;

ARITMETICA
    : HOJA suma HOJA            {$$ = new Aritmetica ($1,$3,'+',yylineno);}
    | HOJA resta HOJA           {$$ = new Aritmetica ($1,$3,'-',yylineno);}
    | HOJA multiplicacion HOJA  {$$ = new Aritmetica ($1,$3,'*',yylineno);}
    | HOJA division HOJA        {$$ = new Aritmetica ($1,$3,'/',yylineno);}
    | HOJA modulo HOJA          {$$ = new Aritmetica ($1,$3,'%',yylineno);}
    ;
RELACIONAL
    : HOJA distintoque HOJA     {$$ = new Relacional ($1,$3,'!=',yylineno);}
    | HOJA igualigual HOJA      {$$ = new Relacional ($1,$3,'==',yylineno);}
    | HOJA mayor HOJA           {$$ = new Relacional ($1,$3,'>',yylineno);}
    | HOJA mayorigual HOJA      {$$ = new Relacional ($1,$3,'>=',yylineno);}
    | HOJA menor HOJA           {$$ = new Relacional ($1,$3,'<',yylineno);}
    | HOJA menorigual HOJA      {$$ = new Relacional ($1,$3,'<=',yylineno);}
    ;

HOJA 
    : entero       {$$ = new Numero(Number(yytext),yylineno);}
    | decimal      {$$ = new Numero(Number(yytext),yylineno);}
    | resta entero       {$$ = new Numero(Number(yytext)*-1,yylineno);}
    | resta decimal      {$$ = new Numero(Number(yytext)*-1,yylineno);}
    | temporal     {$$ = new Temporal(yytext,yylineno);}
    | punteroHeap  {$$ = new Temporal(yytext,yylineno);}
    | punteroStack {$$ = new Temporal(yytext,yylineno);}
    ;
