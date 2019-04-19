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
        for(let i = 0;i <this.Instrucciones.length;i++){
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
        /*for(let i = 0; i <Modificadores.length;i++){
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
        }*/        
        this.BloqueInstrucciones.Ejecutar(EntornoPadre);
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
        let ValCondicion = this.Valor.Ejecutar(EntornoPadre);
        let ValIterador = this.Valor.Ejecutar(EntornoPadre);
        if(ValCondicion.TipoDato == 'booleano'){
            for(let i = 0;i<ValCondicion.ListaVerdaderos.length;i++){
                ValCondicion.Texto += '\n'+ValCondicion.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValCondicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValCondicion.Temporal = NuevoTemporalValCondicion;
            ValCondicion.Texto+= '\n'+NuevoTemporalValCondicion+' = 1;';
            let NuevaEtiquetaSalidaValCondicion = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValCondicion.Texto+= '\ngoto '+NuevaEtiquetaSalidaValCondicion+';';
            for(let i = 0;i<ValCondicion.ListaFalsos.length;i++){
                ValCondicion.Texto += '\n'+ValCondicion.ListaFalsos[i]+':';
            }            
            ValCondicion.Texto+= '\n'+NuevoTemporalValCondicion+' = 0;';      
            ValCondicion.Texto+= '\n'+NuevaEtiquetaSalidaValCondicion+':';
        }

        if(ValIterador.TipoDato == 'booleano'){
            for(let i = 0;i<ValIterador.ListaVerdaderos.length;i++){
                ValIterador.Texto += '\n'+ValIterador.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValIterador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValIterador.Temporal = NuevoTemporalValIterador;
            ValIterador.Texto+= '\n'+NuevoTemporalValIterador+' = 1;';
            let NuevaEtiquetaSalidaValIterador = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValIterador.Texto+= '\ngoto '+NuevaEtiquetaSalidaValIterador+';';
            for(let i = 0;i<ValIterador.ListaFalsos.length;i++){
                ValIterador.Texto += '\n'+ValIterador.ListaFalsos[i]+':';
            }            
            ValIterador.Texto+= '\n'+NuevoTemporalValIterador+' = 0;';
            ValIterador.Texto+= '\n'+NuevaEtiquetaSalidaValIterador+':';
        }
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
        
        /*Si alguno en la lista de etiquetes el boleano esta es el patron*/
        /*if(ValValor.TipoDato == 'booleano'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalValValor;
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 1;';
            let NuevaEtiquetaSalidaValValor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaValValor+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaValValor+':';
        }
        */
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(ValValor.TipoDato == 'booleano'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalValValor;
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 1;';
            let NuevaEtiquetaSalidaValValor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaValValor+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaValValor+':';
        }
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        
        /*
        if(ValValor.TipoDato == 'booleano'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalValValor;
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 1;';
            let NuevaEtiquetaSalidaValValor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaValValor+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaValValor+':';
        }*/
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
        for(let i =0;i<this.ListaSubDeclaraciones.length;i++){
            this.ListaSubDeclaraciones[i].Ejecutar(EntornoPadre);
        }
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(ValValor.TipoDato == 'booleano'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalValValor;
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 1;';
            let NuevaEtiquetaSalidaValValor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaValValor+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaValValor+':';
        }
        alert(ValValor.Texto);
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        let TipoTemporal = this.Tipo.TipoDato[this.Tipo.TipoDato.length-1];
        if(ValValor.TipoDato=='valor'){
            this.AgregarError('No se puede hacer un casteo de '+ValValor.TipoDato+' a '+TipoTemporal);
            return;
        }
        //Aqui tengo que hacer el desvergue para comprobar que sean del mismo tipo
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(ValValor.Tipo=='objeto'){
            this.Agregar('No se pudo castear de un objeto '+ValValor.TipoDato+' a un '+this.Tipo.TipoDato);
            return;
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();                
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValValor.Texto;        
        if(this.Tipo.TipoDato=='decimal'){
            ValRetorno.TipoDato = 'decimal';
            if(ValValor.TipoDato == 'decimal'){
                ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato =='entero'){
                ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato == 'caracter'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            }else if(ValValor.TipoDato == 'cadena'){
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
            }
        }else if(this.Tipo.TipoDato=='entero'){                
            ValRetorno.TipoDato = 'entero';
            if(ValValor.TipoDato == 'decimal'){
                let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
            }else if(ValValor.TipoDato =='entero'){
                ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato == 'caracter'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            }else if(ValValor.TipoDato == 'cadena'){
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
                return;
            }
        }else if(this.Tipo.TipoDato=='caracter'){                
            ValRetorno.TipoDato = 'caracter';
            if(ValValor.TipoDato == 'decimal'){
                let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaErrorMenor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaErrorMayor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaErrorMenor+';';
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 255) goto '+EtiquetaErrorMayor+';';
                ValRetorno.Texto += '\ngoto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\n'+EtiquetaErrorMenor+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 0;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
                ValRetorno.Texto += '\n'+EtiquetaErrorMayor+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 255;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
                ValRetorno.Texto += '\n'+EtiquetaSalida+':';
            }else if(ValValor.TipoDato =='entero'){
                ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaErrorMenor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaErrorMayor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValRetorno.Texto += '\n'+EtiquetaRetorno+':'
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaErrorMenor+';';
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 255) goto '+EtiquetaErrorMayor+';';
                ValRetorno.Texto += '\ngoto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\n'+EtiquetaErrorMenor+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 0;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
                ValRetorno.Texto += '\n'+EtiquetaErrorMayor+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 255;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
                ValRetorno.Texto += '\n'+EtiquetaSalida+':';
            }else if(ValValor.TipoDato == 'caracter'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            }else if(ValValor.TipoDato == 'cadena'){
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
                return;
            }
        }else if(this.Tipo.TipoDato=='cadena'){
            if(this.Tipo.TipoDato=='entero'){                
            }else if(this.Tipo.TipoDato=='decimal'){
            }else if(this.Tipo.TipoDato=='caracter'){                    
            }else if(this.Tipo.TipoDato=='cadena'){                    
            }else{    
            }
        }else{
            this.Agregar('No se pudo realizar la conversion de '+ValValor.TipoDato +' a '+this.Tipo.TipoDato);
        }
        return ValRetorno;        
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'decimal';
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValValor.Texto;
        if(ValValor.TipoDato == 'decimal'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato =='entero'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato == 'caracter'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'){

        }else{
            this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
        }
        return ValRetorno;
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'entero';
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValValor.Texto;
        if(ValValor.TipoDato == 'decimal'){
            let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
        }else if(ValValor.TipoDato =='entero'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato == 'caracter'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'){
            
        }else{
            this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
            return;
        }
        return ValRetorno;
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'caracter';
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValValor.Texto;
        if(ValValor.TipoDato == 'decimal'){
            let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaErrorMenor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaErrorMayor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaErrorMenor+';';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 255) goto '+EtiquetaErrorMayor+';';
            ValRetorno.Texto += '\ngoto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\n'+EtiquetaErrorMenor+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 0;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
            ValRetorno.Texto += '\n'+EtiquetaErrorMayor+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 255;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
            ValRetorno.Texto += '\n'+EtiquetaSalida+':';
        }else if(ValValor.TipoDato =='entero'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaErrorMenor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaErrorMayor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaErrorMenor+';';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 255) goto '+EtiquetaErrorMayor+';';
            ValRetorno.Texto += '\ngoto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\n'+EtiquetaErrorMenor+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 0;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
            ValRetorno.Texto += '\n'+EtiquetaErrorMayor+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal +' = 255;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';';
            ValRetorno.Texto += '\n'+EtiquetaSalida+':';
        }else if(ValValor.TipoDato == 'caracter'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'){
            
        }else{
            this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
            return;
        }
        return ValRetorno;
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
        let ValBase = this.Base.Ejecutar(EntornoPadre);
        let ValExpo = this.Exponente.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE
        if(ValBase ==null||ValExpo ==null||ValBase == undefined||ValExpo == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValBase.Tipo != 'valor' || ValExpo.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la potencia');
            return;
        }
        if(ValBase.TipoDato == 'entero'&& ValExpo.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'decimal'&& ValExpo.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'decimal'&& ValExpo.TipoDato=='caracter'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'caracter'&& ValExpo.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'decimal'&& ValExpo.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'entero'&& ValExpo.TipoDato=='caracter'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'caracter'&& ValExpo.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'entero'&& ValExpo.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValBase.TipoDato == 'caracter'&& ValExpo.TipoDato=='caracter'){TipoResultante = 'decimal';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }        
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();        
        let NuevoTemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let NuevaEtiquetaCiclo = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let NuevaEtiquetaPositivo = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let NuevaEtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValBase.Texto + ValExpo.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = 1;';
        ValRetorno.Texto += '\n'+NuevoTemporalContador+' = 1;';
        ValRetorno.Texto += '\nif('+ValExpo.Temporal+' > 0) goto '+NuevaEtiquetaPositivo+';';
        ValRetorno.Texto += '\nif('+ValExpo.Temporal+' == 0) goto '+NuevaEtiquetaSalida+';';
        ValRetorno.Texto += '\n'+NuevoTemporalContador+' = 0-1;';
        ValRetorno.Texto += '\n'+NuevaEtiquetaPositivo+':';
        ValRetorno.Texto += '\n'+NuevoTemporalContador+' = '+ValExpo.Temporal+' * '+NuevoTemporalContador+';'; 
        ValRetorno.Texto += '\n'+NuevoTemporalContador+' = 1 + '+NuevoTemporalContador+';'; 
        ValRetorno.Texto += '\n'+NuevaEtiquetaCiclo+':';
        ValRetorno.Texto += '\n'+NuevoTemporal +' = '+NuevoTemporal+' * '+ValBase.Temporal+';';
        ValRetorno.Texto += '\n'+NuevoTemporalContador +' = '+NuevoTemporalContador +' - 1;';
        ValRetorno.Texto += '\nif ('+NuevoTemporalContador+' != 0) goto '+NuevaEtiquetaCiclo+';';
        ValRetorno.Texto += '\nif('+ValExpo.Temporal+' >0) goto '+NuevaEtiquetaSalida+';';
        ValRetorno.Texto += '\n'+NuevoTemporal +' = 0 - '+NuevoTemporal +';';
        ValRetorno.Texto += '\n'+NuevaEtiquetaSalida+':';
        return ValRetorno;
    };
    this.type = function(){
        return 'potencia';
    };
}
//##################
//## UNARIO MENOS ## 
//##################
function UnarioMenos_CAAS(x,linea) {
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(ValValor == null || ValValor == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValValor.Tipo != 'valor' || ValValor.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar unario negativo ');
            return;
        }
        if(ValValor.TipoDato != 'entero'&&ValValor!='decimal'){
            this.AgregarError('Solo se puede usar el unario - para datos tipo entero o decimal');
            return;
        }        
        let ValRetorno = ValValor;
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        ValRetorno.Texto += '\n'+NuevoTemporal+' = 0 - '+ValRetorno.Temporal+';';
        ValRetorno.Temporal = NuevoTemporal;
        return ValRetorno;
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(ValValor == null || ValValor == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValValor.Tipo != 'valor' || ValValor.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar unario positivo ');
            return;
        }
        if(ValValor.TipoDato != 'entero'&&ValValor!='decimal'){
            this.AgregarError('Solo se puede usar el unario + para datos tipo entero o decimal');
            return;
        }        
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = ValValor;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = 0 + '+ValRetorno.Temporal+';';
        ValRetorno.Temporal = NuevoTemporal;
        return ValRetorno;
    };
    this.type = function(){
        return 'unariomas';
    };
}
//##########
//## SUMA ## 
//##########
function Suma_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Suma (+)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE
        if(ValIzq ==null||ValDer ==null||ValIzq == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la suma');
            return;
        }
        if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'decimal';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';}
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='entero'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='caracter'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='decimal'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='booleano'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'booleano'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        if(ValIzq.TipoDato == 'booleano'){
            for(let i = 0;i<ValIzq.ListaVerdaderos.length;i++){
                ValIzq.Texto += '\n'+ValIzq.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalIzq = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValIzq.Temporal = NuevoTemporalIzq;
            ValIzq.Texto+= '\n'+NuevoTemporalIzq+' = 1;';
            let NuevaEtiquetaSalidaIzq = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValIzq.Texto+= '\ngoto '+NuevaEtiquetaSalidaIzq+';';
            for(let i = 0;i<ValIzq.ListaFalsos.length;i++){
                ValIzq.Texto += '\n'+ValIzq.ListaFalsos[i]+':';
            }            
            ValIzq.Texto+= '\n'+NuevoTemporalIzq+' = 0;';      
            ValIzq.Texto+= '\n'+NuevaEtiquetaSalidaIzq+':';
        }
        if(ValDer.TipoDato == 'booleano'){
            for(let i = 0;i<ValDer.ListaVerdaderos.length;i++){
                ValDer.Texto += '\n'+ValDer.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalDer = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValDer.Temporal = NuevoTemporalDer;
            ValDer.Texto+= '\n'+NuevoTemporalDer+' = 1;';
            let NuevaEtiquetaSalidaDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValDer.Texto+= '\ngoto '+NuevaEtiquetaSalidaDer+';';
            for(let i = 0;i<ValDer.ListaFalsos.length;i++){
                ValDer.Texto += '\n'+ValDer.ListaFalsos[i]+':';
            }            
            ValDer.Texto+= '\n'+NuevoTemporalDer+' = 0;';      
            ValDer.Texto+= '\n'+NuevaEtiquetaSalidaDer+':';
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' + '+ValDer.Temporal+';';        
        return ValRetorno;
    };
    this.type = function(){
        return 'suma';
    };
}
//###########
//## RESTA ## 
//###########
function Resta_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Resta (-)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){        
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE        
        if(ValIzq ==null||ValDer ==null||ValIzq == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la resta');
            return;
        }
             if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'decimal';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' - '+ValDer.Temporal+';';        
        return ValRetorno;
    };
    this.type = function(){
        return 'resta';
    };
}
//####################
//## MULTIPLICACION ## 
//####################
function Multiplicacion_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Multiplicacion (*)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE
        if(ValIzq ==null||ValDer ==null||ValIzq == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la multiplicacion');
            return;
        }
             if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'decimal';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';}        
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }        
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' * '+ValDer.Temporal+';';
        return ValRetorno;
    };
    this.type = function(){
        return 'multiplicacion';
    };
}
//##############
//## DIVISION ## 
//##############
function Division_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Division (/)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE   
        if(ValIzq ==null||ValDer ==null||ValIzq == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la suma');
            return;
        }
             if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'decimal';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' / '+ValDer.Temporal+';';
        return ValRetorno;
    };
    this.type = function(){
        return 'division';
    };
}
//############
//## MODULO ## 
//############
function Modulo_CAAS(x,y,z,linea) {
    this.Linea = linea;
    this.Izq = x;
    this.Der = y;
    this.Tipo = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Mod (%)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE        
        if(ValIzq ==null||ValDer ==null||ValIzq == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la suma');
            return;
        }
             if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'decimal';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);*/}
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'entero';/*ValIzq.Valor= String.fromCharCode(ValIzq.Valor);ValDer.Valor= String.fromCharCode(ValDer.Valor);*/}
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'entero';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' % '+ValDer.Temporal+';';
        return ValRetorno;
    };
    this.type = function(){
        return 'modulo';
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
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        //OBTENCION DEL TIPO RESULTANTE        
        if(ValIzq ==null||ValDer ==null||ValIzq  == undefined||ValDer == undefined){
            this.AgregarError('No se pudo obtener el valor de uno de los operandos');
            return;
        }
        if(ValIzq.Tipo != 'valor' || ValDer.Tipo != 'valor'){
            this.AgregarError('Uno de los valores no es un valor simple no se puede realizar la suma');
            return;
        }
        if(this.Tipo=='>='||this.Tipo=='>'||this.Tipo=='<='||this.Tipo=='<'){
                if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else{
                this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
                return;
            }
        }else{
            if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='decimal'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='entero'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='caracter'){TipoResultante = 'booleano';}
            else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='cadena'){
                TipoResultante = 'booleano';
                //aqui es donde debo descomponer los string y obtener la suba del ascii de toda la cadena
            }
            else if(ValIzq.TipoDato == 'booleano'&& ValDer.TipoDato=='booleano'){TipoResultante = 'booleano';}
            else{
                this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
                return;
            }
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];        
        let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        ValRetorno.ListaVerdaderos.push(NuevaEtiquetaVerdadera);
        ValRetorno.ListaFalsos.push(NuevaEtiquetaFalsa);
        ValRetorno.Texto+= '\nif('+ValIzq.Temporal+ ' '+this.Tipo +' '+ValDer.Temporal+') goto '+NuevaEtiquetaVerdadera+';';
        ValRetorno.Texto+= '\ngoto '+NuevaEtiquetaFalsa+';';
        return ValRetorno;
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
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let MismoTipoDato = false;
        if(Der.Tipo=='objeto'){
            let TipoTemporal = this.Der.Identificador[Der.Identificador.length-1];
            if(ValIzq.TipoDato == TipoTemporal){
                MismoTipoDato = true;
            }
        }else{
            if(ValIzq.TipoDato == Der.TipoDato){
                MismoTipoDato =true;
            }
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'booleano';
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = '';
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];        
        let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        ValRetorno.ListaVerdaderos.push(NuevaEtiquetaVerdadera);
        ValRetorno.ListaFalsos.push(NuevaEtiquetaFalsa);
        if(MismoTipoDato){
            ValRetorno.Texto+= '\nif(1==1) goto '+NuevaEtiquetaVerdadera+';';
        }else{
            ValRetorno.Texto+= '\nif(1==0) goto '+NuevaEtiquetaVerdadera+';';
        }
        ValRetorno.Texto+= '\ngoto '+NuevaEtiquetaFalsa+';';
        return ValRetorno;
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
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq.TipoDato !='booleano'||ValDer.TipoDato!='booleano'){
            this.AgregarError('Para poder realizar el and (&&) los operandos deben ser de tipo booleano');
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'booleano';
        ValRetorno.Tipo = 'valor';
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];
        ValRetorno.Texto = ValIzq.Texto;        
        for(let i = 0;i<ValIzq.ListaVerdaderos.length;i++){
            ValRetorno.Texto+='\n'+ValIzq.ListaVerdaderos[i]+':';
        }
        ValRetorno.Texto += ValDer.Texto;
        //Agrego los falsos de ambos a la lista
        for(let i = 0;i<ValIzq.ListaFalsos.length;i++){
            ValRetorno.ListaFalsos.push(ValIzq.ListaFalsos[i]);
        }
        for(let i = 0;i<ValDer.ListaFalsos.length;i++){
            ValRetorno.ListaFalsos.push(ValDer.ListaFalsos[i]);
        }
        //Agrego los verdaderos de la derecha a la lista
        for(let i = 0;i<ValDer.ListaVerdaderos.length;i++){
            ValRetorno.ListaVerdaderos.push(ValDer.ListaVerdaderos[i]);
        }
        return ValRetorno;
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
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq.TipoDato !='booleano'||ValDer.TipoDato!='booleano'){
            this.AgregarError('Para poder realizar el or (||) los operandos deben ser de tipo booleano');
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'booleano';
        ValRetorno.Tipo = 'valor';
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];
        ValRetorno.Texto = ValIzq.Texto;
        for(let i = 0;i<ValIzq.ListaFalsos.length;i++){
            ValRetorno.Texto+='\n'+ValIzq.ListaFalsos[i]+':';
        }
        ValRetorno.Texto += ValDer.Texto;
        //Agrego los falsos de ambos a la lista
        for(let i = 0;i<ValIzq.ListaVerdaderos.length;i++){
            ValRetorno.ListaVerdaderos.push(ValIzq.ListaVerdaderos[i]);
        }
        for(let i = 0;i<ValDer.ListaVerdaderos.length;i++){
            ValRetorno.ListaVerdaderos.push(ValDer.ListaVerdaderos[i]);
        }
        //Agrego los verdaderos de la derecha a la lista
        for(let i = 0;i<ValDer.ListaFalsos.length;i++){
            ValRetorno.ListaFalsos.push(ValDer.ListaFalsos[i]);
        }        
        return ValRetorno;
    };
    this.type = function(){
        return 'or';
    };
}
//#########
//## XOR ## 
//#########
function Xor_CAAS(x,y,linea) {
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
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq.TipoDato !='booleano'||ValDer.TipoDato!='booleano'){
            this.AgregarError('Para poder realizar el xor (^) los operandos deben ser de tipo booleano');
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'booleano';
        ValRetorno.Tipo = 'valor';
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];

        ValRetorno.Texto = ValIzq.Texto;
        for(let i = 0;i<ValIzq.ListaFalsos.length;i++){
            ValRetorno.Texto+='\n'+ValIzq.ListaFalsos[i]+':';
        }
        ValRetorno.Texto += ValDer.Texto;
        for(let i = 0;i<ValIzq.ListaVerdaderos.length;i++){
            ValRetorno.Texto+='\n'+ValIzq.ListaVerdaderos[i]+':';
        }
        //ya puse los falsos y verdaderos de IZQUIERDA
        let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        let NuevoTextoDer = ValDer.Texto;
        for(let i = 0;i<ValDer.ListaVerdaderos.length;i++){
            NuevoTextoDer = NuevoTextoDer.replace(ValDer.ListaVerdaderos[i],NuevaEtiquetaVerdadera);
        }
        let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
        for(let i = 0;i<ValDer.ListaFalsos.length;i++){
            NuevoTextoDer = NuevoTextoDer.replace(ValDer.ListaFalsos[i],NuevaEtiquetaFalsa);
        }
        ValRetorno.Texto += NuevoTextoDer;
        for(let i = 0;i<ValDer.ListaVerdaderos.length;i++){
            ValRetorno.ListaVerdaderos.push(ValDer.ListaVerdaderos[i]);
        }
        //Agrego los verdaderos de la derecha a la lista
        for(let i = 0;i<ValDer.ListaFalsos.length;i++){
            ValRetorno.ListaFalsos.push(ValDer.ListaFalsos[i]);
        }
        ValRetorno.ListaVerdaderos.push(NuevaEtiquetaFalsa);
        ValRetorno.ListaFalsos.push(NuevaEtiquetaVerdadera);
        return ValRetorno;
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
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Negacion(!)',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        alert(ValValor);
        alert(ValValor.Texto);
        alert(ValValor.Temporal);
        if(ValValor.TipoDato !='booleano'){
            this.AgregarError('Para poder realizar el not (!) si el operando no es booleano');
            return;
        }        
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'booleano';
        ValRetorno.Tipo = 'valor';
        ValRetorno.ListaVerdaderos = [];
        ValRetorno.ListaFalsos = [];
        ValRetorno.Texto = ValValor.Texto;        
        for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
            ValRetorno.ListaFalsos.push(ValValor.ListaVerdaderos[i]);
        }
        for(let i = 0;i<ValValor.ListaFalsos.length;i++){
            ValRetorno.ListaVerdaderos.push(ValValor.ListaFalsos[i]);
        }        
        return ValRetorno;
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
        let ValCondicion = this.Condicion.Ejecutar(EntornoPadre);
        let ValVerdadero = this.ValorVerdadero.Ejecutar(EntornoPadre);
        let ValFalso = this.ValorFalso.Ejecutar(EntornoPadre);
        let TipoResultante = null;
        if(ValVerdadero.TipoDato == 'decimal'&& ValFalso.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValVerdadero.TipoDato == 'entero'&& ValFalso.TipoDato=='entero'){TipoResultante = 'entero';}
        else if(ValVerdadero.TipoDato == 'caracter'&& ValFalso.TipoDato=='caracter'){TipoResultante = 'caracter';}
        else if(ValVerdadero.TipoDato == 'cadena'&& ValFalso.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else if(ValVerdadero.TipoDato == 'booleano'&& ValFalso.TipoDato=='booleano'){TipoResultante = 'booleano';}
        else if(ValVerdadero.TipoDato == 'entero'&& ValFalso.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValVerdadero.TipoDato == 'decimal'&& ValFalso.TipoDato=='entero'){TipoResultante = 'decimal';}
        else if(ValVerdadero.TipoDato == 'decimal'&& ValFalso.TipoDato=='caracter'){TipoResultante = 'decimal';}
        else if(ValVerdadero.TipoDato == 'caracter'&& ValFalso.TipoDato=='decimal'){TipoResultante = 'decimal';}
        else if(ValVerdadero.TipoDato == 'entero'&& ValFalso.TipoDato=='caracter'){TipoResultante = 'entero';}
        else if(ValVerdadero.TipoDato == 'caracter'&& ValFalso.TipoDato=='entero'){TipoResultante = 'entero';}
        else if(ValVerdadero.TipoDato == 'decimal'&& ValFalso.TipoDato=='cadena'){this.AgregarError('No puede ir un decimal y una cadena como valores de retorno en el operador ternario');return;}
        else if(ValVerdadero.TipoDato == 'cadena'&& ValFalso.TipoDato=='decimal'){this.AgregarError('No puede ir un decimal y una cadena como valores de retorno en el operador ternario');return;}
        else if(ValVerdadero.TipoDato == 'cadena'&& ValFalso.TipoDato=='entero'){this.AgregarError('No puede ir un entero y una cadena como valores de retorno en el operador ternario');return;}
        else if(ValVerdadero.TipoDato == 'entero'&& ValFalso.TipoDato=='cadena'){this.AgregarError('No puede ir un entero y una cadena como valores de retorno en el operador ternario');return;}
        else if(ValVerdadero.TipoDato == 'caracter'&& ValFalso.TipoDato=='cadena'){this.AgregarError('No puede ir un caracter y una cadena como valores de retorno en el operador ternario');return;}
        else if(ValVerdadero.TipoDato == 'cadena'&& ValFalso.TipoDato=='caracter'){this.AgregarError('No puede ir un caracter y una cadena como valores de retorno en el operador ternario');return;}
        //Tengo que ver cuando los dos son objetos
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        if(ValVerdadero.TipoDato == 'booleano'){
            for(let i = 0;i<ValVerdadero.ListaVerdaderos.length;i++){
                ValVerdadero.Texto += '\n'+ValVerdadero.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValVerdadero = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValVerdadero.Temporal = NuevoTemporalValVerdadero;
            ValVerdadero.Texto+= '\n'+NuevoTemporalValVerdadero+' = 1;';
            let NuevaEtiquetaSalidaValVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValVerdadero.Texto+= '\ngoto '+NuevaEtiquetaSalidaValVerdadero+';';
            for(let i = 0;i<ValVerdadero.ListaFalsos.length;i++){
                ValVerdadero.Texto += '\n'+ValVerdadero.ListaFalsos[i]+':';
            }            
            ValVerdadero.Texto+= '\n'+NuevoTemporalValVerdadero+' = 0;';
            ValVerdadero.Texto+= '\n'+NuevaEtiquetaSalidaValVerdadero+':';
        }
        if(ValFalso.TipoDato == 'booleano'){
            for(let i = 0;i<ValFalso.ListaVerdaderos.length;i++){
                ValFalso.Texto += '\n'+ValFalso.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValFalso = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValFalso.Temporal = NuevoTemporalValFalso;
            ValFalso.Texto+= '\n'+NuevoTemporalValFalso+' = 1;';
            let NuevaEtiquetaSalidaValFalso = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValFalso.Texto+= '\ngoto '+NuevaEtiquetaSalidaValFalso+';';
            for(let i = 0;i<ValFalso.ListaFalsos.length;i++){
                ValFalso.Texto += '\n'+ValFalso.ListaFalsos[i]+':';
            }            
            ValFalso.Texto+= '\n'+NuevoTemporalValFalso+' = 0;';
            ValFalso.Texto+= '\n'+NuevaEtiquetaSalidaValFalso+':';
        }
        let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;
        ValRetorno.Temporal = NuevoTemporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValVerdadero.Texto + ValFalso.Texto;
        //Me falta ver cuando en ternario puede regresar objetos o arreglos    
        if(ValCondicion.TipoDato == 'booleano'){
            for(let i = 0;i<ValCondicion.ListaVerdaderos.length;i++){
                ValCondicion.Texto += '\n'+ValCondicion.ListaVerdaderos[i]+':';
            }            
            ValCondicion.Texto+= '\n'+ValRetorno.Temporal+' = '+ValVerdadero.Temporal+';';
            let NuevaEtiquetaSalidaValCondicion = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValCondicion.Texto+= '\ngoto '+NuevaEtiquetaSalidaValCondicion+';';
            for(let i = 0;i<ValCondicion.ListaFalsos.length;i++){
                ValCondicion.Texto += '\n'+ValCondicion.ListaFalsos[i]+':';
            }            
            ValCondicion.Texto+= '\n'+ValRetorno.Temporal+' = '+ValFalso.Temporal+';';
            ValCondicion.Texto+= '\n'+NuevaEtiquetaSalidaValCondicion+':';
        }else{
            this.AgregarError('La condicion del ternario debe retornar un valor de tipo booleano');
            return;
        }
        ValRetorno.Texto += ValCondicion.Texto;
        if(TipoResultante=='booleano'){
            ValRetorno.ListaVerdaderos = [];
            ValRetorno.ListaFalsos = [];
            let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.ListaVerdaderos.push(NuevaEtiquetaVerdadera);
            ValRetorno.ListaFalsos.push(NuevaEtiquetaFalsa);
            ValRetorno.Texto+= '\nif('+ValRetorno.Temporal+ ' == 1) goto '+NuevaEtiquetaVerdadera+';';
            ValRetorno.Texto+= '\ngoto '+NuevaEtiquetaFalsa+';';
            return ValRetorno;
        }
        return ValRetorno;
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
        let ValRetorno = new Object();
        ValRetorno.TipoDato = this.Tipo;
        ValRetorno.Texto = '';
        if(this.Tipo=='booleano'){
            let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Temporal = NuevoTemporal;
            ValRetorno.ListaVerdaderos = [];
            ValRetorno.ListaFalsos = [];
            let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.ListaVerdaderos.push(NuevaEtiquetaVerdadera);
            ValRetorno.ListaFalsos.push(NuevaEtiquetaFalsa);
            if(this.Valor==1){
                ValRetorno.Texto+= '\nif(1==1) goto '+NuevaEtiquetaVerdadera+';';
            }else{
                ValRetorno.Texto+= '\nif(1==0) goto '+NuevaEtiquetaVerdadera+';';
            }
            ValRetorno.Texto+= '\ngoto '+NuevaEtiquetaFalsa+';';
            
        }if(this.Tipo=='nulo'){
            ValRetorno.Temporal = this.Valor;
            ValRetorno.Texto = '';
        }else{
            ValRetorno.Temporal = this.Valor;
            ValRetorno.Texto = '';
        }
        ValRetorno.Tipo = 'valor';        
        return ValRetorno;
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
        //Si alguno de los valores es un valor booleano
        /*if(ValValor.TipoDato == 'booleano'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalValValor;
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 1;';
            let NuevaEtiquetaSalidaValValor = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaValValor+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalValValor+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaValValor+':';
        }*/
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
    //int  = 0
    //double = 1
    //cadena = 2
    //char = 3
    //booleano = 4
    //void = 5
    //Objeto = 5;
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
        if(error){
            return;
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
    this.TemporalesVerdaderos = [];
    this.TemporalesFalsos = [];
    this.TemporalRespuesta = [];
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