import { deflate } from "zlib";
import { runInThisContext } from "vm";

//######################
//## BLOQUE PRINCIPAL ## 
//######################
function BloquePrincipal_CAAS(x,linea){
    this.Linea = linea;
    this.Instrucciones = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Importacion',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        for(let i = 0;i <Instrucciones.length;i++){
            this.Instrucciones[i].RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        for(let i = 0;i <Instrucciones.length;i++){
            this.Instrucciones[i].Ejecutar(EntornoPadre);
        }
    };
    this.type = function(){
        return 'bloque_principal';
    };
}
//#################
//## IMPORTACION ## 
//#################
function Importacion_CAAS(x,linea){
    this.Linea = linea;
    this.Ruta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Importacion',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        Ruta.RecuperarErrores(ErroresPadre);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValRuta = this.Ruta.Ejecutar(EntornoPadre);
        if(!(ValRuta instanceof String)){
            this.AgregarError('Se debe recibir un valor de tipo cadena');
            return;
        }
        //Realizar proceso de importacion
    };
    this.type = function(){
        return 'importacion';
    };
}
//################################
//## BLOQUE INSTRUCCIONES CLASE ## 
//################################
function DeclaracionClase_CAAS(x,y,z,i,linea){
    this.Linea = linea;
    this.Modificadores = x;
    this.Nombre = y;
    this.Hereda = z;
    this.BloqueInstrucciones = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion de clase',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let abstract = false;
        let public = false;
        let protected = false;
        let private = false;
        let static = false;
        let final = false;        
        for(let i = 0; i <Modificadores.length;i++){
            switch(Modificadores[i]){
                case 'public':if(public){this.AgregarError('Modificador public ya utilizado en declaracion');} public = true; break;
                case 'protected':if(protected){this.AgregarError('Modificador protected ya utilizado en declaracion');}protected = true;
                case 'private':if(private){this.AgregarError('Modificador private ya utilizado en declaracion');}private = true;
                case 'static':if(static){this.AgregarError('Modificador static ya utilizado en declaracion');}static = true;
                case 'final':if(final){this.AgregarError('Modificador final ya utilizado en declaracion');}final = true;
                case 'abstract':if(abstract){this.AgregarError('Modificador abstract ya utilizado en declaracion');}abstract = true;
                default:
                    this.AgregarError('Modificador no permitido para declaracion de una clase');
            }
        }
    };
    this.type = function(){
        return 'declaracion_clase';
    };
}
//################################
//## BLOQUE INSTRUCCIONES CLASE ## 
//################################
function BloqueInstruccionesClase_CAAS(x,linea){
    this.Linea = linea;
    this.Instrucciones = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Bloque instrucciones de clase',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        for(let i =0;i<this.Instrucciones.length;i++){
            this.Instrucciones[i].RecuperarErrores(EntornoPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        for(let i = 0; i <this.Instrucciones.length; i ++){
            this.Instrucciones[i].Ejecutar(EntornoPadre);
        }
    };
    this.type = function(){
        return 'bloque_instrucciones_clase';
    };
}
//##########################
//## BLOQUE INSTRUCCIONES ## 
//##########################
function BloqueInstrucciones_CAAS(x,linea){
    this.Linea = linea;
    this.Instrucciones = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Bloque instrucciones',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        for(let i =0;i<this.Instrucciones.length;i++){
            this.Instrucciones[i].RecuperarErrores(EntornoPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        for(let i = 0; i <this.Instrucciones.length; i ++){
            this.Instrucciones[i].Ejecutar(EntornoPadre);
        }
    };
    this.type = function(){
        return 'bloque_instrucciones';
    };
}
//#####################
//## SENTENCIA PRINT ## 
//#####################
function Print_CAAS(x,linea){
    this.Linea = linea; 
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Print',this.linea);

    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        this.Valor.RecuperarErrores(ErroresPadre);
    };
    this.Ejecutar = function(EntornoPadre){
        let cadena = "";
        let ValValor = String(this.Valor.Ejecutar(EntornoPadre));
        for(let i = 0; i<ValValor.length;i++){
            //Aqui debo meter un temporal, pero como todavia no los tengo pos que se le va a hacer guapo
            cadena += '\nprint("%c",'+ValValor.charCodeAt(i)+');'
        }
        return cadena;
    };
    this.type = function(){
        return 'print';
    };
}
//#######################
//## SENTENCIA PRINTLN ## 
//#######################
function Println_CAAS(x,linea){
    this.Linea = linea; 
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Println',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        this.Valor.RecuperarErrores(ErroresPadre);
    };
    this.Ejecutar = function(EntornoPadre){
        let cadena = "";
        let ValValor = String(this.Valor.Ejecutar(EntornoPadre));
        for(let i = 0; i<ValValor.length;i++){
            //Aqui debo meter un temporal, pero como todavia no los tengo pos que se le va a hacer guapo
            cadena += '\nprint("%c",'+ValValor.charCodeAt(i)+');'
            cadena += '\nprint("%c",10);'
        }
        return cadena;
    };
    this.type = function(){
        return 'println';
    };
}
//########################
//## SENTENCIA FOR EACH ## 
//########################
function ForEach_CAAS(x,y,z,linea){
    this.Linea = linea; 
    this.Parametro = x;
    this.Arreglo = y;
    this.BloqueInstrucciones = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'For each',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'for_each';
    };
}
//###################
//## SENTENCIA FOR ## 
//###################
function For_CAAS(x,y,z,i,linea){
    this.Linea = linea; 
    this.Inicio = x;
    this.Condicion = y;
    this.Iterador = z;
    this.BloqueInstrucciones = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'For',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'for';
    };
}
//########################
//## SENTENCIA DO WHILE ## 
//########################
function DoWhile_CAAS(x,y,linea){
    this.Linea = linea; 
    this.Condicion = x;
    this.BloqueInstrucciones = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Do While',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'do_while';
    };
}
//#####################
//## SENTENCIA WHILE ## 
//#####################
function While_CAAS(x,y,linea){
    this.Linea = linea; 
    this.Condicion = x;
    this.BloqueInstrucciones = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'While',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'while';
    };
}
//#########################
//## SENTENCIA TRY CATCH ## 
//#########################
function TryCatch_CAAS(x,y,z,i,linea){
    this.Linea = linea; 
    this.BloqueIntento = x;
    this.TipoError = y;
    this.IdentificadorError = z;
    this.BloqueCaptura = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Try catch',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'try_catch';
    };
}
//#########################
//## SENTENCIA TRY CATCH ## 
//#########################
function TryCatch_CAAS(x,y,z,i,linea){
    this.Linea = linea; 
    this.BloqueIntento = x;
    this.TipoError = y;
    this.IdentificadorError = z;
    this.BloqueCaptura = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Try catch',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'try_catch';
    };
}
//#####################
//## SENTENCIA THROW ## 
//#####################
function Throw_CAAS(x,y,linea){
    this.Linea = linea; 
    this.Valor = x;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Throw',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'throw';
    };
}
//######################
//## SENTENCIA SWITCH ## 
//######################
function Switch_CAAS(x,y,linea){
    this.Linea = linea; 
    this.Valor = x;
    this.BloqueCasos = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Switch',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'switch';
    };
}
//##############################
//## CASO DENTRO DE UN SWITCH ## 
//##############################
function CasosInstruccion_CAAS(x,y,linea){
    this.Linea = linea; 
    this.ListaEtiquetas = x;
    this.Instrucciones = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'caso',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        //Tengo que revisar que exista 0 o 1 defecto
    };
    this.type = function(){
        return 'caso';
    };
}
//##################
//## SENTENCIA IF ## 
//##################
function If_CAAS(x,y,z,linea) {
    this.Linea = linea; 
    this.Condicion = x;
    this.Instrucciones = y;
    this.Sino = z;   
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'If',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'if';
    };
}
//###########
//## BREAK ## 
//###########
function Break_CAAS(linea) {
    this.Linea = linea;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Break',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'break';
    };
}
//##############
//## CONTINUE ## 
//##############
function Continue_CAAS(linea) {
    this.Linea = linea;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Continue',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'continue';
    };
}
//############
//## RETURN ## 
//############
function Return_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor =x;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Instruccion de transferencia return',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'return';
    };
}
//####################################
//## ASIGNACION DE VARIABLE ARREGLO ## 
//####################################
function AsignacionVariableArreglo_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Variable =x;
    this.Valor = y;
    this.Dimensiones = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Asignacion variable tipo arreglo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'asignacion_variable_arreglo';
    };
}
//############################
//## ASIGNACION DE VARIABLE ## 
//############################
function AsignacionVariable_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Variable =x;
    this.Valor = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Asignacion variable',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'asignacion_variable';
    };
}
//#############################
//## DECLARACION DE VARIABLE ## 
//#############################
function DeclaracionVariable_CAAS(x,y,z,linea) {
    this.Linea = linea;    
    this.Modificadores = x;
    this.Tipo = y;
    this.ListaSubDeclaraciones = z;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion variable',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'declaracion_variable';
    };
}
//###############################
//## DECLARACION DE LINKEDLIST ## 
//###############################
function DeclaracionLinkedList_CAAS(x,y,z,valor,linea) {
    this.Linea = linea;    
    this.Modificadores = x;
    this.Tipo = y;
    this.Identificador = z;
    this.Valor = valor;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion linkedlist',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'declaracion_linkedlist';
    };
}
//##############################
//## SUB DECLARACION VARIABLE ## 
//##############################
function SubDeclaracionVariable_CAAS(x,y,z,linea) {
    this.Linea = linea;    
    this.Identificador = x;
    this.Dimensiones = y;
    this.Valor = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Sub declaracion variable',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre,tipo){
        
    };
    this.type = function(){
        return 'sub_declaracion_variable';
    };
}
//###########################
//## DECLARACION DE METODO ## 
//###########################
function DeclaracionMetodo_CAAS(x,y,z,d,p,i,linea) {
    this.Linea = linea;
    this.Modificadores = x;
    this.Tipo = y;
    this.Identificador = z;
    this.Dimensiones = d;
    this.Parametros = p;
    this.Instrucciones = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion Metodo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'declaracion_metodo';
    };
}
//################################
//## DECLARACION DE CONSTRUCTOR ## 
//################################
function DeclaracionConstructor_CAAS(x,y,z,i,linea) {
    this.Linea = linea;
    this.Modificadores = x;
    this.Identificador = y;
    this.Parametros = z;
    this.Instrucciones = i;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion constructor',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'declaracion_constructor';
    };
}
//#############################
//## CASTEO EXPLICITO OBJETO ## 
//#############################
function CasteoExplicitoVariable_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Tipo = x;
    this.Valor = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Casteo explicito a objeto',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'casteo_explicito_objeto';
    };
}
//################################
//## CASTEO EXPLICITO PRIMITIVO ## 
//################################
function CasteoExplicitoBasico_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Tipo = x;
    this.Valor = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Casteo explicito tipo primitivo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'casteo_explicito_basico';
    };
}
//############
//## TO STR ## 
//############
function ToStr_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'to str',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'to_str';
    };
}
//###############
//## TO DOUBLE ## 
//###############
function ToDouble_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'to double',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'to_double';
    };
}
//############
//## TO INT ## 
//############
function ToInt_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'to int',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'to_int';
    };
}
//#############
//## TO CHAR ## 
//#############
function ToChar_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'to char',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'to_char';
    };
}
//################
//## NEW OBJETO ## 
//################
function NuevoObjeto_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Nombre = x;
    this.Parametros = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'new Objeto',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'new_objeto';
    };
}
//######################
//## NEW ARREGLO TIPO ## 
//######################
function NuevoArregloTipo_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Nombre = x;
    this.Dimension = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'new arreglo de tipo basico',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'new_arreglo_tipo';
    };
}
//########################
//## NEW ARREGLO OBJETO ## 
//########################
function NuevoArregloObjeto_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Nombre = x;
    this.Dimension = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'new arreglo objeto',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'new_arreglo_objeto';
    };
}
//####################
//## NEW LINKEDLIST ## 
//####################
function NuevoLinkedList_CAAS(linea) {
    this.Linea = linea;
    this.Ruta = x;
    this.Contenido = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'new Linkedlist',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'new_linkedlist';
    };
}
//###########
//## GRAPH ## 
//###########
function Graph_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Ruta = x;
    this.Contenido = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Graph',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'graph';
    };
}
//################
//## READ_FILE ## 
//################
function ReadFile_CAAS(x,linea) {
    this.Linea = linea;
    this.Ruta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Read_File',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'read_file';
    };
}
//################
//## WRITE_FILE ## 
//################
function WriteFile_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Ruta = x;
    this.Contenido = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Write_File',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'write_file';
    };
}
//##############
//## POTENCIA ## 
//##############
function Potencia_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Base = x;
    this.Exponente = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Potencia',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'potencia';
    };
}
//##################
//## UNARIO MENOS ## 
//##################
function UnarioMas_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'UNARIO -',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'unariomenos';
    };
}
//################
//## UNARIO MAS ## 
//################
function UnarioMas_CAAS(x,linea) {
    this.Linea = linea;
    this.Valor = x;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'UNARIO +',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'unariomas';
    };
}
//################
//## ARITMETICA ## 
//################
function Aritmetica_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Aritmetica(+,-,*,/,%)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'aritmetica';
    };
}
//################
//## RELACIONAL ## 
//################
function Relacional_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Relacional(<,<=,>,>=,!=,==)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'relacional';
    };
}
//################
//## INSTANCEOF ## //Creo que aqui deberia hacer otro isntanceof para arreglos para facilitar un poco todo
//################
function Instanceof_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Instanceof(instanceof)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'instanceof';
    };
}

//########
//## AND ## 
//########
function And_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'And(&&)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'and';
    };
}
//########
//## OR ## 
//########
function Or_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Or(||)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'or';
    };
}
//#########
//## XOR ## 
//#########
function Not_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Xor(^)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'xor';
    };
}

//##############
//## NEGACION ## 
//##############
function Not_CAAS(x,linea) {
    this.Linea = linea;
    this.valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Negacion(!)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'negacion';
    };
}
//##########################################
//## INCREMENTO O DECREMENTO MODO PREFIJO ## 
//##########################################
function IncDecPostfijo_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Tipo = x;
    this.Nombre = y;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Incremento o decremento postfijo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'incdecpostfijo';
    };
}
//##########################################
//## INCREMENTO O DECREMENTO MODO PREFIJO ## 
//##########################################
function IncDecPrefijo_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Tipo = x;
    this.Nombre = y;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Incremento o decremento prefijo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'incdecprefijo';
    };
}
//##############
//## TERNARIO ## 
//##############
function Ternario_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Condicion = x;    
    this.ValorVerdadero = y;
    this.ValorFalso = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Ternario',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'ternario';
    };
}
//###########
//## Valor ## 
//###########
function Valor_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Tipo = x;    
    this.Valor = y;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Valor simple',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){        
        return this.Valor;
    };
    this.type = function(){
        return 'valor';
    };
}
//##############
//## VARIABLE ## 
//##############
function Variable_CAAS(x,linea) {
    this.Linea = linea;
    this.Nombre = x;    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Acceso a valor de una variable',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        //Revisar si la variable existe y retornar el nombre
        //Revisar la cantidad de parametros que tienen que correspondan a los de la funcion y revisar si existe el nombre
    };
    this.type = function(){
        return 'variable';
    };
}
//########################
//## LLAMADA DE FUNCION ##  
//########################
function LlamadaFuncion_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Nombre = x;
    this.Parametros = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Llamada a funcion',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);        
        for(let i =0;i<this.Parametros.length;i++){
            this.Parametros[i].RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let ValDimensiones = [];
        for(let i=0;i<this.Parametros.length;i++){
            ValDimensiones.push(this.Parametros[i].Ejecutar(EntornoPadre));
        }
        //Revisar la cantidad de parametros que tienen que correspondan a los de la funcion y revisar si existe el nombre
    };
    this.type = function(){
        return 'llamadafuncion';
    };
}
//###########################
//## VARIABLE TIPO ARREGLO ##  //Es cuando se accede a una variable de tipo arreglo
//###########################
function VariableArreglo_CAAS(x,y,linea) {
    this.Linea = linea;
    this.Nombre = x;
    this.Dimensiones = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Acceso a Variable tipo Arreglo',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);        
        for(let i =0;i<this.Dimensiones.length;i++){
            this.Dimensiones[i].RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let ValDimensiones = [];
        for(let i=0;i<this.Dimensiones.length;i++){
            ValDimensiones.push(this.Dimensiones[i].Ejecutar(EntornoPadre));
        }
        //Revisar que las dimensiones sean numericas y que el nombre de la variable exista
    };
    this.type = function(){
        return 'variablearreglo';
    };
}

//######################
//## LISTA DE VALORES ##
//######################
function ListaValores_CAAS(x,linea) {
    this.Linea = linea;
    this.Lista = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Lista de valores',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);        
        if(this.Lista!=null){
            for(let i =0;i<this.Lista.length;i++){
                this.Lista[i].RecuperarErrores(ErroresPadre);
            }
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let Valores = [];
        for(let i=0;i<this.Lista.length;i++){
            Valores.push(this.Lista[i].Ejecutar(EntornoPadre));
        }
    };
    this.type = function(){
        return 'listavalores';
    };
}

//#####################################################
//## MANEJO DE TODO LO NECESARIO PARA PODER TRADUCIR ##
//#####################################################

function Simbolo_CAAS(id,TipoSimbolo,TipoDato){
    //TIPOS DE SIMBOLOS(Tipo)
    //variables
    //arreglos
    //funciones
    //Tipo de dato guardado
    //int
    //double
    //cadena
    //char
    //booleano
    //void
    //identificador
    this.Identificador = id;
    this.Valor = undefined;
    this.ListaValores = undefined;
    this.TipoDato = TipoDato;
    this.Dimensiones =[];
    this.Funcion = undefined;
    this.Tipo = TipoSimbolo;
    this.setFuncion = function(funcion){
        this.Funcion = funcion;
    }
    this.setValor=function(valor){
        this.Valor = valor;
    }
    this.setArreglo=function(lista,dimensiones){
        this.ListaValores = lista;
        this.Dimension = dimensiones;
        this.TipoDato = tipovalores;
    }
    this.setValorArreglo = function(valor, indices){
        //Debo ver de que tipo es el valor y si es el mismo que el arreglo
        let posicion = 0;
        let tamdimension = 0;
        let error = false;
        //VIENDOLO COMO VECTOR DE COLUMNAS CONSECUTIVAS
        //Formula usada es:
        //arr[a][b]=a+b*tam1
        //arr[a][b][c]=a+b*tam1+c*tam1*tam2
        //arr[a][b][c][d]=a+b*tam1+c*tam1*tam2+d*tam1*tam2*tam3
        if(indices.length!=this.Dimensiones.length){
            error=true;
            this.AgregarError('Esta tratando de ingresar a un indice que no existe');
        }        
        for(let i = 0;(i<indices.length)&&!error;i++){
            if(indices[i]>(this.Dimensiones[i]-1)){
                error = true;  
                break;              
            }
            if(i = 0){
                posicion = indices[i];
                tamdimension = this.Dimension[i];
            }else{
                posicion = posicion + indices[i]*tamdimension;
                tamdimension = tamdimension * this.Dimension[i];
            }
        }
        this.ListaValores[posicion]=valor;
    }
    this.getValor= function(){
        return this.Valor;
    }
    this.getValorArreglo=function(indices){
        let posicion = 0;
        let tamdimension = 0;
        let error = false;
        //VIENDOLO COMO VECTOR DE COLUMNAS CONSECUTIVAS
        //Formula usada es:
        //arr[a][b]=a+b*tam1
        //arr[a][b][c]=a+b*tam1+c*tam1*tam2
        //arr[a][b][c][d]=a+b*tam1+c*tam1*tam2+d*tam1*tam2*tam3
        if(indices.length!=this.Dimensiones.length){
            error=true;
            this.AgregarError('Esta tratando de ingresar a un indice que no existe');
        }
        for(let i = 0;(i<indices.length)&&!error;i++){
            if(indices[i]>(this.Dimensiones[i]-1)){
                error = true;  
                break;              
            }
            if(i = 0){
                posicion = indices[i];
                tamdimension = this.Dimension[i];
            }else{
                posicion = posicion + indices[i]*tamdimension;
                tamdimension = tamdimension * this.Dimension[i];
            }
        }
        return this.ListaValores[posicion];
    }
    this.getArreglo = function(){
        return this.ListaValores;
    }
    this.getFuncion = function(){
        return this.Funcion;        
    }
    this.getIdentificador = function(){
        return this.Identificador;
    }
    this.getSize = function(){
        if(this.Tipo = 'arreglo'){
            return this.ListaValores.length;
        }else{
            return 1;
        }
    }
    this.getTipoSimbolo = function(){
        return this.Tipo;
    }
    this.getTipoDato = function(){
        return this.TipoDato;
    }
    this.isValorInicializado=function(){
        return this.Valor ==undefined&&this.ListaValores==undefined&&this.Funcion == undefined;
    }
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Simbolo',-1);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
}

function Entorno_CAAS(entornopadre){
    this.Nodos = [];
    this.Etiquetas = new Manejador_Etiquetas();
    this.Temporales = new Manejador_Temporales();
    this.Heap = new Heap_CAAS();
    this.Stack = new Stack_CAAS();
    this.TablaPadre = entornopadre;
    this.NivelDetener = 0;
    this.NivelRetornar = 0;
    this.ValorRetorno = null;
    this.Inicializar=function(){
        if(this.TablaPadre ==null){
            this.NivelDetener =0;
            this.NivelRetornar = 0;
        }else{
            this.NivelDetener = this.TablaPadre.NivelDetener;
            this.NivelRetornar = this.TablaPadre.NivelRetornar;
        }
    }
    this.getEntornoGlobal=function(){
        if(this.TablaPadre!=null){
            return this.TablaPadre.getEntornoGlobal();
        }
        return this;
    }
    this.AgregarVariable = function(Identificador,TipoDato){
        let simbolo = new Simbolo_CAAS(Identificador,'variable',TipoDato);
        this.Nodos.push(simbolo);
    }
    this.AgregarArreglo = function(Identificador,TipoDato){
        let simbolo = new Simbolo_CAAS(Identificador,'arreglo',TipoDato);
        this.Nodos.push(simbolo);
    }
    this.AgregarFuncion = function(Identificador,TipoDato,Funcion){
        let simbolo = new Simbolo_CAAS(Identificador,'funcion',TipoDato);
        simbolo.setFuncion(Funcion);
        this.Nodos.push(simbolo);
    }
    this.VariableExiste=function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='variable'){
                return true;
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.VariableExiste(Identificador);
        }
        return false;
    }
    this.FuncionExiste = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='funcion'){
                return true;
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.FuncionExiste(Identificador);
        }
        return false;
    }
    this.ArregloExiste = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='arreglo'){
                return true;
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.ArregloExiste(Identificador);
        }
        return false;
    }
    this.SimboloExiste = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&(this.Nodos[i].getTipoSimbolo()=='arreglo'||this.Nodos[i].getTipoSimbolo()=='variable')){
                return true;
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.SimboloExiste(Identificador);
        }
        return false;
    }
    this.SimboloExisteEntorno=function(){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&(this.Nodos[i].getTipoSimbolo()=='arreglo'||this.Nodos[i].getTipoSimbolo()=='variable')){
                return true;
            }
        }
    }
    this.getValorVariable=function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='variable'){
                return this.Nodos[i].getValor();
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.getValorVariable(Identificador);
        }
        return undefined;
    }
    this.getValorArreglo=function(Identificador,Indices){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='arreglo'){
                return this.Nodos[i].getValorArreglo(Indices);
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.getValorArreglo(Identificador,Indices);
        }
        return undefined;
    }
    this.getArreglo = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='arreglo'){
                return this.Nodos[i].getArreglo();
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.getArreglo(Identificador);
        }
        return undefined;
    }
    this.getFuncion = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='funcion'){
                return this.Nodos[i].getFuncion();
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.getFuncion(Identificador);
        }
        return undefined;
    }
    this.setValor = function(Identificador,valor){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='variable'){
                this.Nodos[i].setValor(valor);
                return;
            }
        }
        if(this.TablaPadre!=null){
            this.TablaPadre.setValor(Identificador,valor);
            return;
        }
        return;
    }
    this.setValorArreglo = function(Identificador,Indices, Valor){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='arreglo'){
                this.Nodos[i].setValorArreglo(Valor,Indices);
                return;
            }
        }
        if(this.TablaPadre!=null){
            this.TablaPadre.setValorArreglo(Identificador,Indices,Valor);
            return;
        }
        return;
    }
    this.setArreglo = function(Identificador, ListaValores,Dimensiones){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&this.Nodos[i].getTipoSimbolo()=='arreglo'){
                this.Nodos[i].setArreglo(Valor);
                return;
            }
        }
        if(this.TablaPadre!=null){
            this.TablaPadre.setArreglo(Identificador,Valor);
            return;
        }
        return;
    }
    this.getSizeSimbolo=function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&(this.Nodos[i].getTipoSimbolo()=='variable'||this.Nodos[i].getTipoSimbolo()=='arreglo')){
                return this.Nodos[i].getSize();
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.getSizeSimbolo(Identificador);
        }
    }
    this.SimboloInicializado = function(Identificador){
        for(let i =0;i<this.Nodos.length;i++){
            if(this.Nodos[i].getIdentificador()==Identificador&&(this.Nodos[i].getTipoSimbolo()=='variable'||this.Nodos[i].getTipoSimbolo()=='arreglo')){
                return this.Nodos[i].isValorInicializado();
            }
        }
        if(this.TablaPadre!=null){
            return this.TablaPadre.SimboloInicializado(Identificador);
        }
    }
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Entorno',-1);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
}

function Manejador_Temporales(){
    this.Numero = 0;
    this.getNuevoTemporal = function(){
        this.Numero++;
        return this.Numero;
    }
}

function Manejador_Etiquetas(){
    this.Numero = 0;
    this.getNuevaEtiqueta = function(){
        this.Numero++;
        return this.Numero;
    }
}

function Heap_CAAS(){
    this.puntero = 0;
    this.getPosicionActual=function(){
        return this.puntero;
    }
    this.ReservarEspacio = function(tam){
        this.puntero +=tam;
    }
}

function Stack_CAAS(){
    this.puntero = 0;
    this.getPosicionActual= function(){
        return this.puntero;
    }
    this.AumentarStack = function(tam){
        this.puntero = this.puntero+tam;
    }
    this.DesminuirStack = function(tam){
        this.puntero = this.puntero-tam;
    }
}