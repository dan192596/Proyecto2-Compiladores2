/* description: Parses and constructs AST. */

%{
 var temporalCAAS;
%}

/* lexical grammar */
%lex
%options case-insensitive

Numero        [0-9]+
NumeroDecimal [0-9]+"."[0-9]+
Caracter      [\'\‘].[\'\’]
BooleanoV     "true"
BooleanoF     "false"
Cadena        [\"\“\”](.|\n|\s|\t|\r)*[\"\“\”]

Identificador [A-Za-z_][A-Za-z_0-9]*

comentariounilinea "/""/".*(\r|\n|\r\n)
comentariomultilinea \/\*(.|\n|\s|\t|\r)*\*\/

%%

//COMENTARIOS
{comentariounilinea}    {/* Omitir comentario de linea */}
{comentariomultilinea}  {/* Omitir comentario multilinea */}
\s+                     {/* Omitir espacio en blanco */}
\t+                     {/* Omitir espacio en blanco */}
\r+                     {/* Omitir espacio en blanco */}
\n+                     {/* Omitir espacio en blanco */}

//#################################
//## T O K E N S   S I M P L E S ##
//#################################

//Expresiones Aritmeticas
"++"     {return '++';}
"--"     {return '--';}
"+"     {return '+';}
"-"     {return '-';}
"*"     {return '*';}
"/"     {return '/';}
"%"     {return '%';}

//Expresiones relacionales
"!="    {return '!=';}
"=="    {return '==';}
">="    {return '>=';}
">"     {return '>';}
"<="    {return '<=';}
"<"     {return '<';}

//Expresiones logicas
"&&"     {return '&&';}
"||"     {return '||';}
"!"     {return '!';}
"^"     {return '^';}

//Otros
"?"     {return '?';}
":"     {return ':';}
";"     {return ';';}
","     {return 'coma';}
"["     {return '[';}
"]"     {return ']';}
"("     {return '(';}
")"     {return ')';}
"{"     {return 'llaveizq';}
"}"     {return 'llaveder';}
"="     {return '=';}
"."     {return '.';}

//############################################
//## P A L A B R A S   R E S E  R V A D A S ##
//############################################

//Tipos de datos
"int"        {return 'entero'}
"double"     {return 'decimal'}
"char"       {return 'caracter'}
"boolean"    {return 'booleano'}
"string"     {return 'cadena'}
"void"       {return 'void'}
"linkedlist" {return 'linkedlist'}

//Modificadores de clase 
"private" {return 'private'}
"protected" {return 'protected'}
"public" {return 'public'}
"abstract " {return 'abstract'}
"static" {return 'static'}
"final" {return 'final'}

//Instrucciones
"break "    {return 'break '}
"case"      {return 'case'}
"catch"     {return 'catch'}
"class"     {return 'class'}
"continue"  {return 'continue'}
"default"   {return 'default'}
"do"        {return 'do'}
"else"      {return 'else'}
"extends"   {return 'extends'}
"for"       {return 'for'}
"graph"     {return 'graph'}
"if"        {return 'if'}
"import"    {return 'import'}
"instanceof" {return 'instanceof'}
"message"   {return 'message'}
"new"       {return 'new'}
"Object"    {return 'Object'}
"pow"       {return 'pow'}
"println"   {return 'println'}
"print"     {return 'print'}
"return"    {return 'return'}
"read_file" {return 'read_file'}
"str"       {return 'str'}
"super"     {return 'super'}
"switch"    {return 'switch'}
"this"      {return 'this'}
"throw"     {return 'throw'}
"toChar"    {return 'toChar'}
"toDouble"  {return 'toDouble'}
"toInt"     {return 'toInt'}
"try"       {return 'try'}
"while"     {return 'while'}
"write_file" {return 'write_file'}

//###############################################
//## E x p r e s i o n e s   r e g u l a r e s ##
//###############################################

//Valores variables primitivas
{Numero}        {return 'valentero';}
{NumeroDecimal} {return 'valdecimal';}
{Caracter}      {return 'valcaracter';}
{BooleanoV}     {return 'valverdadero';}
{BooleanoF}     {return 'valfalso';}
{Cadena}        {return 'valcadena';}
"null"          {return 'nulo';}

{Identificador} {return 'identificador'}

<<EOF>> {return 'EOF';}
.       {return 'INVALID';}

/lex

%right '='
%right '?' ':'
%left '||'
%left '&&'
%left '^'
%left '!='
%left '=='
%left 'instanceof'
%nonassoc '>' '>='
%nonassoc '<' '<='
%left CONCATCADENAS
%left '+' '-'
%left '*' '/' '%'
%right 'pow'
%right 'new'
%right PROCASTEOEXPLICITO
%right '!'
%right UMENOS
%right UMAS
%right '++'
%right '--'
%right '('
%left ')'
%left '.'
%left '[' 
%left ']'
%left PRECVAR
%left ';'
%left 'EOF'

%start INICIO

%ebnf

%% /* language grammar */
    
INICIO 
    : CONTENIDOARCHIVO EOF {temporalCAAS = new BloquePrincipal_CAAS($1,yylineno); return temporalCAAS;}
    ;
    
CONTENIDOARCHIVO
    : CONTENIDOARCHIVO DECLARACIONCLASE {$$ = $1; $$.push($2); }
    | CONTENIDOARCHIVO IMPORTACION      {$$ = $1; $$.push($2); }
    | DECLARACIONCLASE                  {$$ = []; $$.push($1); }
    | IMPORTACION                       {$$ = []; $$.push($1); }
    ;

IMPORTACION
    : import E ';'  { $$ = new Importacion_CAAS($2,yylineno);}
    ;

// ###################################
// ## M A N E J O   D E   C L A S E ##
// ###################################  

DECLARACIONCLASE
    : MODIFICADORES class identificador BLOQUEINSTRUCCIONESCLASE          { $$ = new DeclaracionClase_CAAS($1,$3,false,$4,yylineno);}
    | MODIFICADORES class identificador extends BLOQUEINSTRUCCIONESCLASE  { $$ = new DeclaracionClase_CAAS($1,$3,true,$5,yylineno);}
    | class identificador BLOQUEINSTRUCCIONESCLASE          { $$ = new DeclaracionClase_CAAS([],$2,false,$3,yylineno);}
    | class identificador extends BLOQUEINSTRUCCIONESCLASE  { $$ = new DeclaracionClase_CAAS([],$2,true,$4,yylineno);}
    ;

BLOQUEINSTRUCCIONESCLASE
    : llaveizq INSTRUCCIONESCLASE llaveder  {$$ = new BloqueInstruccionesClase_CAAS($2,yylineno); }
    | llaveizq llaveder                     {$$ = new BloqueInstruccionesClase_CAAS([],yylineno); }
    ;

INSTRUCCIONESCLASE
    : INSTRUCCIONESCLASE INSTRUCCIONCLASE   {$$ = $1; $$.push($2);}
    | INSTRUCCIONCLASE                      {$$ =[]; $$.push($1); }
    ;

INSTRUCCIONCLASE
    : DECLARACIONVARIABLE ';'   { $$ = $1; }
    | DECLARACIONMETODO         { $$ = $1; }
    | DECLARACIONCLASE          { $$ = $1; }
    | DECLARACIONCONSTRUCTOR    { $$ = $1; }
    ;

BLOQUEINSTRUCCIONES
    : llaveizq INSTRUCCIONES llaveder   {$$ = new BloqueInstrucciones_CAAS($2,yylineno);}
    | llaveizq llaveder                 {$$ = new BloqueInstrucciones_CAAS([],yylineno);}
    ;

INSTRUCCIONES
    : INSTRUCCIONES INSTRUCCION {$$ = $1; $$.push($1);}
    | INSTRUCCION               {$$ = []; $$.push($1);}
    ;

INSTRUCCION
    : DECLARACIONVARIABLE ';'       {$$ = $1;}
    | ASIGNACIONVARIABLE ';'        {$$ = $1;}
    | INSTRUCCIONTRANSFERENCIA ';'  {$$ = $1;}
    | SENTENCIAIF                   {$$ = $1;}
    | SENTENCIASWITCH               {$$ = $1;}
    | SENTENCIATHROW ';'            {$$ = $1;}
    | SENTENCIATRYCATCH             {$$ = $1;}
    | SENTENCIAWHILE                {$$ = $1;}
    | SENTENCIADOWHILE ';'          {$$ = $1;}
    | SENTENCIAFOR                  {$$ = $1;}
    | SENTENCIAFOREACH              {$$ = $1;}
    | SENTENCIAIMPRIMIR ';'         {$$ = $1;}
    | LEERARCHIVO ';'               {$$ = $1;}
    | ESCRIBIRARCHIVO ';'           {$$ = $1;}
    | GRAFICAR ';'                  {$$ = $1;}
    | LLAMADAFUNCION ';'            {$$ = $1;}
    ;

SENTENCIAIMPRIMIR
    : print EXPARENTESIS    { $$ = new Print_CAAS($2,yylineno); }
    | println EXPARENTESIS  { $$ = new Println_CAAS($2,yylineno); }
    ;

SENTENCIAFOREACH
    : for '(' PARAMETRO ':' E ')' BLOQUEINSTRUCCIONES {$$ = new ForEach_CAAS($3,$5, $7,yylineno);}
    ;

SENTENCIAFOR  
    : for '(' INICIOFOR ';' E ';' E ')' BLOQUEINSTRUCCIONES {$$ = new For_CAAS($3,$5,$7,$9,yylineno);}
    ;

INICIOFOR
    : DECLARACIONVARIABLE   {$$ = $1;}
    | ASIGNACIONVARIABLE    {$$ = $1;}
    ;

SENTENCIADOWHILE
    : do BLOQUEINSTRUCCIONES while EXPARENTESIS {$$ = new DoWhile_CAAS($4,$2,yylineno);}
    ;
SENTENCIAWHILE
    : while EXPARENTESIS BLOQUEINSTRUCCIONES    { $$ = new While_CAAS($2,$3,yylineno); }
    ;

SENTENCIATRYCATCH
    : try BLOQUEINSTRUCCIONES catch '(' TIPO identificador ')' BLOQUEINSTRUCCIONES      { $$ = new TryCatch_CAAS($2,$5,$6,$8,yylineno);}
    | try BLOQUEINSTRUCCIONES catch '(' VARIABLE identificador ')' BLOQUEINSTRUCCIONES  { $$ = new TryCatch_CAAS($2,$5.Identificador,$6,$8,yylineno);}
    ;

SENTENCIATHROW
    : throw E   { $$ = Throw_CAAS($2,yylineno);}
    ;

SENTENCIASWITCH
    : switch EXPARENTESIS BLOQUESWITCH  { $$ = new Switch_CAAS($2,$3,yylineno); }
    ;

BLOQUESWITCH
    : llaveizq LISTACASOS LISTAETIQUETAS llaveder   {$$ = $1; temporalCAAS = new CasosInstruccion_CAAS($3,[],yylineno); $$.push(temporalCAAS); }
    | llaveizq LISTACASOS llaveder                  {$$ = $1;}
    | llaveizq LISTAETIQUETAS llaveder              {$$ = []; temporalCAAS = new CasosInstruccion_CAAS($2,[],yylineno); $$.push(temporalCAAS);}
    | llaveizq llaveder                             {$$ = [];}
    ;

LISTACASOS
    : LISTACASOS LISTAETIQUETAS INSTRUCCIONES   {$$ = $1; temporalCAAS = new CasosInstruccion_CAAS($2,$3,yylineno); $$.push(temporalCAAS); }
    | LISTAETIQUETAS INSTRUCCIONES              {$$ = []; temporalCAAS = new CasosInstruccion_CAAS($1,$2,yylineno); $$.push(temporalCAAS); }
    ;

LISTAETIQUETAS 
    : LISTAETIQUETAS case E ':'     { $$ = $1; temporalCAAS = new Object(); temporalCAAS.Tipo = 'caso'; temporalCAAS.Condicion = $3; $$.push(temporalCAAS); }
    | LISTAETIQUETAS default ':'    { $$ = $1; temporalCAAS = new Object(); temporalCAAS.Tipo = 'defecto'; temporalCAAS.Condicion = undefined; $$.push(temporalCAAS);}
    | case E ':'    { $$ = []; temporalCAAS = new Object(); temporalCAAS.Tipo = 'caso'; temporalCAAS.Condicion = $2; $$.push(temporalCAAS); }
    | default ':'   { $$ = []; temporalCAAS = new Object(); temporalCAAS.Tipo = 'defecto'; temporalCAAS.Condicion = undefined; $$.push(temporalCAAS); }
    ;

SENTENCIAIF
    : if EXPARENTESIS BLOQUEINSTRUCCIONES                           { $$ = new If_CAAS($2,$3,null, yylineno); }
    | if EXPARENTESIS BLOQUEINSTRUCCIONES else SENTENCIAIF          { $$ = new If_CAAS($2,$3,$5, yylineno); }
    | if EXPARENTESIS BLOQUEINSTRUCCIONES else BLOQUEINSTRUCCIONES  { $$ = new If_CAAS($2,$3,new If_CAAS(new Valor_CAAS('booleano',true,yylineno),$5,null,yylineno), yylineno); }
    ;

INSTRUCCIONTRANSFERENCIA
    : break     { $$ = new Break_CAAS(yylineno); }
    | continue  { $$ = new Continue_CAAS(yylineno); }
    | return E  { $$ = new Return_CAAS(undefined,yylineno); }
    | return    { $$ = new Return_CAAS(undefined,yylineno); }
    ;

ASIGNACIONVARIABLE   
    : VARIABLE '=' E        {$$ = new AsignacionVariable_CAAS($1.Identificador,$3);}
    | VARIABLEARREGLO '=' E {$$ = new AsignacionVariableArreglo_CAAS($1.Identificador,$1.Dimensiones,$3);}
    ;

DECLARACIONVARIABLE
    : MODIFICADORES TIPO LISTADECLARACIONVARIABLES        {$$ = new DeclaracionVariable_CAAS($1,$2,$3); }
    | MODIFICADORES VARIABLE LISTADECLARACIONVARIABLES    {$$ = new DeclaracionVariable_CAAS($1,$2.Identificador,$3);}
    | TIPO LISTADECLARACIONVARIABLES        {$$ = new DeclaracionVariable_CAAS([],$1,$2); }
    | VARIABLE LISTADECLARACIONVARIABLES    {$$ = new DeclaracionVariable_CAAS([],$1.Identificador,$2);}
    | DECLARACIONVARIABLELINKEDLIST {$$ = $1;}
    ;

DECLARACIONVARIABLELINKEDLIST
    : MODIFICADORES linkedlist menor TIPO mayor identificador '=' E       {$$ = new DeclaracionLinkedList_CAAS($1,$4,$6,$8,yylineno);}
    | MODIFICADORES linkedlist menor TIPO mayor identificador             {$$ = new DeclaracionLinkedList_CAAS($1,$4,$6,undefined,yylineno);}
    | MODIFICADORES linkedlist menor VARIABLE mayor identificador '=' E   {$$ = new DeclaracionLinkedList_CAAS($1,$4.Identificador,$6,$8,yylineno);}
    | MODIFICADORES linkedlist menor VARIABLE mayor identificador         {$$ = new DeclaracionLinkedList_CAAS($1,$4.Identificador,$6,undefined,yylineno);}
    | linkedlist menor TIPO mayor identificador '=' E       {$$ = new DeclaracionLinkedList_CAAS([],$3,$5,$7,yylineno);}
    | linkedlist menor TIPO mayor identificador             {$$ = new DeclaracionLinkedList_CAAS([],$3,$5,undefined,yylineno);}
    | linkedlist menor VARIABLE mayor identificador '=' E   {$$ = new DeclaracionLinkedList_CAAS([],$3.Identificador,$5,$7,yylineno);}
    | linkedlist menor VARIABLE mayor identificador         {$$ = new DeclaracionLinkedList_CAAS([],$3.Identificador,$5,undefined,yylineno);}
    ;

LISTADECLARACIONVARIABLES
    : LISTADECLARACIONVARIABLES coma SUBDECLARACION {$$ = $1; $$.push($3);}
    | SUBDECLARACION {$$ = []; $$.push($1);}
    ;

SUBDECLARACION
    : SUBDECLARACIONVARIABLE '=' E  {$$= new SubDeclaracionVariable_CAAS($1.Identificador,$1.CantidadDimensiones,$3,yylineno);}
    | SUBDECLARACIONVARIABLE        {$$= new SubDeclaracionVariable_CAAS($1.Identificador,$1.CantidadDimensiones,undefined,yylineno);}
    ;

DECLARACIONMETODO
    : MODIFICADORES TIPO RECURSIVIDADARREGLO DECLARADORMETODO     {$$ = new DeclaracionMetodo_CAAS($1,$2, $4.Identificador,$3,$4.Parametros,$4.Instrucciones,yylineno);}
    | MODIFICADORES TIPO DECLARADORMETODO                         {$$ = new DeclaracionMetodo_CAAS($1,$2, $3.Identificador,0 ,$3.Parametros,$3.Instrucciones,yylineno);}
    | MODIFICADORES VARIABLE RECURSIVIDADARREGLO DECLARADORMETODO {$$ = new DeclaracionMetodo_CAAS($1,$2.Identificador, $4.Identificador,$3,$4.Parametros,$4.Instrucciones,yylineno);}
    | MODIFICADORES VARIABLE DECLARADORMETODO                     {$$ = new DeclaracionMetodo_CAAS($1,$2.Identificador, $3.Identificador,0 ,$3.Parametros,$3.Instrucciones,yylineno);}
    | TIPO RECURSIVIDADARREGLO DECLARADORMETODO     {$$ = new DeclaracionMetodo_CAAS([],$1,$3.Identificador,$2,$3.Parametros,$3.Instrucciones,yylineno);}
    | TIPO DECLARADORMETODO                         {$$ = new DeclaracionMetodo_CAAS([],$1,$2.Identificador,0 ,$2.Parametros,$2.Instrucciones,yylineno);}
    | VARIABLE RECURSIVIDADARREGLO DECLARADORMETODO {$$ = new DeclaracionMetodo_CAAS([],$1.Identificador, $3.Identificador,$2,$3.Parametros,$3.Instrucciones,yylineno);}
    | VARIABLE DECLARADORMETODO                     {$$ = new DeclaracionMetodo_CAAS([],$1.Identificador, $2.Identificador,0 ,$2.Parametros,$2.Instrucciones,yylineno);}
    ;

RECURSIVIDADARREGLO
    : RECURSIVIDADARREGLO '[' ']' {$$ = $1+1;}
    | '[' ']'   {$$ = 1;}
    ;

DECLARACIONCONSTRUCTOR
    : MODIFICADORES DECLARADORMETODO {$$ = new DeclaracionConstructor_CAAS($1,$2.Identificador,$2.Parametros,$2.Instrucciones,yylineno);}
    | DECLARADORMETODO {$$ = new DeclaracionConstructor_CAAS([],$1.Identificador,$1.Parametros,$1.Instrucciones,yylineno);}
    ;

DECLARADORMETODO
    : identificador '(' LISTAPARAMETROS ')' BLOQUEINSTRUCCIONES {$$ = new Object(); $$.Identificador = $1; $$.Parametros = $3;$$.Instrucciones = $5; }
    | identificador '(' ')' BLOQUEINSTRUCCIONES                 {$$ = new Object(); $$.Identificador = $1; $$.Parametros = [];$$.Instrucciones = $4; }
    ;    

LISTAPARAMETROS
    : LISTAPARAMETROS coma PARAMETRO    { $$ = $1; $$.push($3); }
    | PARAMETRO                         { $$ = []; $$.push($1); }
    ;


PARAMETRO
    : MODIFICADORES TIPO SUBDECLARACIONVARIABLE       {$$ = new Object(); $$.Modificadores = $1; $$.Tipo = $2; $$.Identificador = $3.Identificador; $$.CantidadDimensiones = $3.CantidadDimensiones;}
    | MODIFICADORES VARIABLE SUBDECLARACIONVARIABLE   {$$ = new Object(); $$.Modificadores = $1; $$.Tipo = $2.Identificador; $$.Identificador = $3.Identificador; $$.CantidadDimensiones = $3.CantidadDimensiones;}
    | TIPO SUBDECLARACIONVARIABLE       {$$ = new Object(); $$.Modificadores = []; $$.Tipo = $1; $$.Identificador = $2.Identificador; $$.CantidadDimensiones = $2.CantidadDimensiones;}
    | VARIABLE SUBDECLARACIONVARIABLE   {$$ = new Object(); $$.Modificadores = []; $$.Tipo = $1.Identificador; $$.Identificador = $2.Identificador; $$.CantidadDimensiones = $2.CantidadDimensiones;}
    ;

SUBDECLARACIONVARIABLE
    : SUBDECLARACIONVARIABLE '[' ']'    {$$ = $1; $$.CantidadDimensiones++;}
    | identificador                     {$$ = new Object(); $$.Identificador = $1;$$.CantidadDimensiones=0; }
    ;

TIPO
    : entero    {$$ = 'entero';}
    | decimal   {$$ = 'decimal';}
    | caracter  {$$ = 'caracter';}
    | booleano  {$$ = 'booleano';}
    | cadena    {$$ = 'cadena';}
    | void      {$$ = 'vacio';}
    ;

MODIFICADORES
    : MODIFICADORES MODIFICADOR {$$ = $1; $$.push($1); }
    | MODIFICADOR   {$$ = []; $$.push($1.tolo);}
    ;

MODIFICADOR
    : abstract  {$$ = yytext.toLowerCase();}
    | static    {$$ = yytext.toLowerCase();}
    | final     {$$ = yytext.toLowerCase();}
    | public    {$$ = yytext.toLowerCase();}
    | protected {$$ = yytext.toLowerCase();}
    | private   {$$ = yytext.toLowerCase();}
    ;     

//###########################
//## E X P R E S I O N E S ##
//###########################
E
    : ARITMETICA        {$$ = $1;}
    | RELACIONAL        {$$ = $1;}
    | LOGICA            {$$ = $1;}
    | UNARIAS           {$$ = $1;}
    | TERNARIO          {$$ = $1;}  
    | VALOR             {$$ = $1;}
    | EXPARENTESIS      {$$ = $1;}
    | LEERARCHIVO       {$$ = $1;}
    | ESCRIBIRARCHIVO   {$$ = $1;} //Creo que esta onda no va aqui porque no retorna nada
    | GRAFICAR          {$$ = $1;}    
    | CREACIONINSTANCIA {$$ = $1;}
    | CASTEOEXPLICITO  %prec PROCASTEOEXPLICITO {$$ = $1;}
    ;

EXPARENTESIS
    : '(' E ')'  {$$ = $2}
    ;

CASTEOEXPLICITO
    : '(' TIPO ')'  E           {$$ = new CasteoExplicitoBasico_CAAS($2, $4); }
    | '(' E ')' E %prec PROCASTEOEXPLICITO {$$ = new CasteoExplicitoVariable_CAAS($2.Identificador, $4); }
    | str EXPARENTESIS          {$$ = new ToStr_CAAS($2,yylineno); }
    | toDouble EXPARENTESIS     {$$ = new ToDouble_CAAS($2,yylineno); }
    | toInt EXPARENTESIS        {$$ = new ToInt_CAAS($2,yylineno); }
    | toChar EXPARENTESIS       {$$ = new ToChar_CAAS($2,yylineno); }
    ;

CREACIONINSTANCIA
    : 'new' VARIABLE '(' LISTAVALORESOPCIONAL ')'   {$$ = new NuevoObjeto_CAAS($2.Identificador,$4,yylineno);}
    | RECURSIVIDADTIPOARREGLOTIPO           {$$ = new NuevoArregloTipo_CAAS($1.Identificador, $1.Dimensiones,yylineno);}
    | 'new' VARIABLEARREGLO                 {$$ = new NuevoArregloObjeto_CAAS($2.Identificador, $2.Dimensiones,yylineno);}
    | 'new' linkedlist menor mayor '(' ')'  {$$ = new NuevoLinkedList_CAAS(yylineno); }
    ;

RECURSIVIDADTIPOARREGLOTIPO
    : RECURSIVIDADTIPOARREGLOTIPO '[' E ']' {$$ = $1; $$.Dimensiones = []; $$.Dimensiones.push($3); }
    | 'new' TIPO '[' E ']'                  {$$ = new Object(); $$.Identificador = []; $$.Identificador.push($2); $$.Dimensiones = []; $$.Dimensiones.push($4);}
    ;

GRAFICAR
    : graph '(' E coma E ')' {$$ = new Graph_CAAS($3,$5,yylineno);}
    ;

LEERARCHIVO
    : read_file EXPARENTESIS {$$ = new ReadFile_CAAS($2,yylineno);}
    ;

ESCRIBIRARCHIVO
    : write_file '(' E coma E ')' {$$ = new WriteFile_CAAS($3,$5,yylineno);}
    ;

ARITMETICA
    : E '+' E   {$$ = new Aritmetica_CAAS($1,$3,'+',yylineno); }
    | E '-' E   {$$ = new Aritmetica_CAAS($1,$3,'-',yylineno); }
    | E '*' E   {$$ = new Aritmetica_CAAS($1,$3,'*',yylineno); }
    | E '/' E   {$$ = new Aritmetica_CAAS($1,$3,'/',yylineno); }
    | E '%' E   {$$ = new Aritmetica_CAAS($1,$3,'%',yylineno); }
    | '-' E %prec UMENOS {$$ = new UnarioMenos_CAAS($2,yylineno);}
    | '+' E %prec UMAS   {$$ = new UnarioMas_CAAS($2,yylineno);}
    | pow '(' E coma E ')' {$$ = new Potencia_CAAS($3,$5); } 
    ;

RELACIONAL
    : E '!=' E  {$$ = new Relacional_CAAS($1,$3,'!=',yylineno); }
    | E '==' E  {$$ = new Relacional_CAAS($1,$3,'==',yylineno); }
    | E '>=' E  {$$ = new Relacional_CAAS($1,$3,'>=',yylineno); }
    | E '>' E   {$$ = new Relacional_CAAS($1,$3,'>',yylineno); }
    | E '<=' E  {$$ = new Relacional_CAAS($1,$3,'<=',yylineno); }
    | E '<' E   {$$ = new Relacional_CAAS($1,$3,'<',yylineno); }
    | E 'instanceof' TIPO       {$$ = new Instanceof_CAAS($1,$3,yylineno);}
    | E 'instanceof' VARIABLE   {$$ = new Instanceof_CAAS($1,$3,yylineno);}
    ;

LOGICA 
    : E '&&' E  {$$ = new And_CAAS($1,$3,yylineno);}
    | E '||' E  {$$ = new Or_CAAS($1,$3,yylineno);}
    | E '^' E   {$$ = new Xor_CAAS($1,$3,yylineno);}
    | '!' E     {$$ = new Not_CAAS($2,yylineno);}
    ;

UNARIAS //Siempre debe caer en alguna variable pero puede ser distintos tipos de variable ej: a++, a.a++ a[0]++, a[0].a++ etc
    : E '++'         {$$ = new IncDecPostfijo_CAAS('++',$1,yylineno); }    
    | E '--'         {$$ = new IncDecPostfijo_CAAS('--',$1,yylineno); }    
    | '++' E         {$$ = new IncDecPrefijo_CAAS('++',$2,yylineno); }    
    | '--' E         {$$ = new IncDecPrefijo_CAAS('--',$2,yylineno); }    
    ;

TERNARIO
    : E '?' E ':' E {$$ = new Ternario_CAAS($1,$3,$5,yylineno); }
    ;

VALOR
    : valentero         {$$ = new Valor_CAAS('cadena',Number(yytext),yylineno);}
    | valdecimal        {$$ = new Valor_CAAS('cadena',Number(yytext),yylineno);}
    | valcaracter       {$$ = new Valor_CAAS('cadena',yytext,yylineno);}
    | valverdadero      {$$ = new Valor_CAAS('booleano',true,yylineno);}
    | valfalso          {$$ = new Valor_CAAS('booleano',false,yylineno);}
    | valcadena         {$$ = new Valor_CAAS('cadena',yytext,yylineno);}
    | nulo              {$$ = new Valor_CAAS('nulo',null,yylineno);}
    | VARIABLE          {$$ = new Variable_CAAS($1.Identificador,yylineno); }
    | LLAMADAFUNCION    {$$ = $1; }
    | ARREGLO           {$$ = $1; }
    ;

LLAMADAFUNCION
    : VARIABLE '(' LISTAVALORESOPCIONAL ')' { $$ = new LlamadaFuncion_CAAS($1.Identificador, $3,yylineno); }
    ;

ARREGLO
    : '[' LISTAVALORESOPCIONAL ']' {$$ = $2; }
    | VARIABLEARREGLO  {$$ = new VariableArreglo_CAAS($1.Identificador, $1.Dimensiones,yylineno);}  
    ;

VARIABLEARREGLO
    : VARIABLEARREGLO '[' E ']'     {$$ = $1; $$.Dimensiones.push($3); }
    | VARIABLE '[' E ']'            {$$ = $1; $$.Dimensiones = []; $$.Dimensiones.push($3); }
    ;

VARIABLE
    : VARIABLE '.' super            {$$ = $1; $$.Identificador.push($1); }
    | VARIABLE '.' identificador    {$$ = $1; $$.Identificador.push($1); }
    | identificador                 {$$ = new Object(); $$.Identificador = []; $$.Identificador.push($1); }
    | super                         {$$ = new Object(); $$.Identificador = []; $$.Identificador.push($1); }
    | this                          {$$ = new Object(); $$.Identificador = []; $$.Identificador.push($1); }
    ;

LISTAVALORESOPCIONAL
    :  {$$ = new ListaValores_CAAS([],yylineno);}
    | LISTAVALORES { $$ = new ListaValores_CAAS($1,yylineno);}
    ;

LISTAVALORES
    : LISTAVALORES coma E   {$$ = $1; $$.push($2); }
    | E                     {$$ = [];$$.push($1); }
    ;