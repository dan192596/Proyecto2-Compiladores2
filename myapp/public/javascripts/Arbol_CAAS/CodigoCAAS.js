//######################
//## BLOQUE PRINCIPAL ## 
//######################
function BloquePrincipal_CAAS(x,linea){
    this.Linea = linea;
    this.Instrucciones = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Hilo principal',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        for(let i = 0;i <Instrucciones.length;i++){
            this.Instrucciones[i].RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let Texto = '';
        Texto += 'P = 0;'
        Texto += '\nH = 0;'
        let Ambito = [];
        for(let i = 0;i <this.Instrucciones.length;i++){
            if(this.Instrucciones[i].type()=='declaracion_clase'){
                this.Instrucciones[i].PrimeraPasada(EntornoPadre,Ambito);
            }
        }
        for(let i = 0;i <this.Instrucciones.length;i++){
            Texto += this.Instrucciones[i].Ejecutar(EntornoPadre,Ambito);
        }
        Texto += '\ncall main;'
        Texto += '\ncall main_main;'
        consola_201404268.setValue(Texto);
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
//##########################
//## DECLARACION DE CLASE ## 
//##########################
function DeclaracionClase_CAAS(x,y,z,i,extiende,linea){
    this.Linea = linea;
    this.Modificadores = x;
    this.Nombre = y;
    this.Hereda = z;
    this.BloqueInstrucciones = i;
    this.Extiende = extiende;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Declaracion de clase',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre,Ambito){
            Ambito.push(this.Nombre);
            this.BloqueInstrucciones.Ejecutar(EntornoPadre,Ambito,true);
            return this.BloqueInstrucciones.Ejecutar(EntornoPadre,Ambito,false);
    };
    this.PrimeraPasada=function(EntornoPadre,Ambito){
        let Visibilidad = '';
        let static = false;
        let abstract = false;
        let final = false;
        let Size = this.BloqueInstrucciones.getSize();        
        for(let i = 0; i <this.Modificadores.length;i++){
            switch(this.Modificadores[i]){
                case 'public':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'public'; 
                    break;
                case 'protected':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'protected'; 
                    break;
                case 'private':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'private'; 
                    break;
                case 'static':if(static){this.AgregarError('Modificador static ya utilizado en declaracion');}static = true;break;
                case 'final':if(final){this.AgregarError('Modificador final ya utilizado en declaracion');}final = true;break;
                case 'abstract':if(abstract){this.AgregarError('Modificador abstract ya utilizado en declaracion');}abstract = true;break;
                default:
                    this.AgregarError('Modificador no permitido para declaracion de una clase');
            }
        }
        if(Visibilidad==''){
            Visibilidad = 'public';
        }
        EntornoPadre.AgregarSimbolo(this.Nombre,'clase',null,Size,null,Array.from(Ambito),Visibilidad,static,final,abstract,this.Extiende,0,this.BloqueInstrucciones.getParametros());
    }
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
    this.Ejecutar = function(EntornoPadre,Ambito,PrimeraPasada){
        let PosicionRelativaStack = 0;
        let Texto = '';
        let TextoDeclaracionesClase = '';        
        let ValValorTemporal;
//DECLARO TODAS LAS VARIABLES DE LA CLASE
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_variable'){
                ValValorTemporal = this.Instrucciones[i].Ejecutar(EntornoPadre,PosicionRelativaStack,Ambito,PrimeraPasada);
                PosicionRelativaStack = ValValorTemporal.PosicionRelativaStack;
                TextoDeclaracionesClase += ValValorTemporal.Texto;
            }
        }
//TRADUCCION DE LA DECLARACION DE LA CLASE A 3D
        let NombreAmbito = '';
        for(let i = 0;i<Ambito.length;i++){
            if(i == 0){
                NombreAmbito += Ambito[i];
            }else{
                NombreAmbito += '_'+Ambito[i];
            }
        }
        TextoDeclaracionesClase = TextoDeclaracionesClase.replace(/\n/g,"\n\t");
        TextoDeclaracionesClase = '\nproc '+NombreAmbito+' begin '+TextoDeclaracionesClase+ '\nend';
        Texto += '\n//Declaracion de la clase '+NombreAmbito;
        Texto += TextoDeclaracionesClase;
//RECONOCER LOS METODOS
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_variable'){
                /** Ignoro las declaraciones porque ya las hice antes */
            }else if(this.Instrucciones[i].type()=='declaracion_metodo'){
                if(PrimeraPasada){
                    this.Instrucciones[i].Ejecutar(EntornoPadre,PosicionRelativaStack,Ambito,PrimeraPasada);
                }else{                    
                    Texto += this.Instrucciones[i].Ejecutar(EntornoPadre,PosicionRelativaStack,Ambito,PrimeraPasada);
                }
            }else{
                if(PrimeraPasada){
                    this.Instrucciones[i].Ejecutar(EntornoPadre);
                }else{
                    Texto+= this.Instrucciones[i].Ejecutar(EntornoPadre);
                }
            }
        }
        return Texto;
    };
    this.getSize = function(){
        let contador = 0;
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_variable'){
                contador += this.Instrucciones[i].getSize();
            }
        }
        return contador;
    }
    this.getParametros=function(){
        let Parametros = [];
        Parametros.push([]);
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_constructor'){
                if(this.Instrucciones[i].Parametros.length!=0){
                    Parametros.push(this.Instrucciones[i].Parametros);
                }                
            }
        }
        return Parametros;
    }
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
    this.Ejecutar = function(EntornoPadre,PosicionRelativaStack, Ambito){        
        let Texto = '';
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_variable'){
                ValValorTemporal = this.Instrucciones[i].Ejecutar(EntornoPadre,PosicionRelativaStack,Ambito);
                PosicionRelativaStack = ValValorTemporal.PosicionRelativaStack;
                Texto += ValValorTemporal.Texto;
            }else if(this.Instrucciones[i].type()=='llamadafuncion'){
                ValValorTemporal = this.Instrucciones[i].Ejecutar(EntornoPadre);
                Texto += ValValorTemporal.Texto;
            }else{
                Texto += this.Instrucciones[i].Ejecutar(EntornoPadre);
            }
        }
        return Texto;
    };
    this.getSize = function(){
        let contador = 0;
        for(let i = 0; i <this.Instrucciones.length; i ++){
            if(this.Instrucciones[i].type()=='declaracion_variable'){
                contador += this.Instrucciones[i].getSize();
            }
        }
        return contador;
    }
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
        let Texto = "";
        let ValValor = this.Valor.Ejecutar(EntornoPadre);        
        if(ValValor.Tipo == 'valor'){
            Texto += ValValor.Texto;
            if(ValValor.TipoDato == 'decimal'){
                Texto += '\nprint("%d",'+ValValor.Temporal+');'
            }else if(ValValor.TipoDato =='entero'){
                Texto += '\nprint("%e",'+ValValor.Temporal+');'
            }else if(ValValor.TipoDato == 'caracter'){
                Texto += '\nprint("%c",'+ValValor.Temporal+');'
            }else if(ValValor.TipoDato =='booleano'){
                let EtiquetaVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaFalso = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                Texto += '\nif('+ValValor.Temporal +' == 1) goto '+EtiquetaVerdadero+';'
                Texto += '\ngoto '+EtiquetaFalso+';';
                Texto += '\n'+EtiquetaVerdadero+':';
                Texto += '\nprint("%c",116);//t';
                Texto += '\nprint("%c",114);//r';
                Texto += '\nprint("%c",117);//u';
                Texto += '\nprint("%c",101);//e';
                Texto +=  '\ngoto '+EtiquetaSalida+';';
                Texto += '\n'+EtiquetaFalso+':';
                Texto += '\nprint("%c",102);//f';
                Texto += '\nprint("%c",97);//a';
                Texto += '\nprint("%c",108);//l';
                Texto += '\nprint("%c",115);//s';
                Texto += '\nprint("%c",101);//e';
                Texto += '\n'+EtiquetaSalida+':';
            }else if(ValValor.TipoDato == 'cadena'){
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaEntero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaDecimal = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
                Texto += '\n'+TemporalValor+' = 0;';
                Texto += '\n'+EtiquetaRetorno+':';
                Texto += '\n'+TemporalValor+' = Heap['+TemporalPosicion+'];'
                Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                Texto += '\nif('+TemporalValor+' == 0) goto '+EtiquetaSalida+';';
                Texto += '\nif('+TemporalValor+' == -1) goto '+EtiquetaEntero+';';
                Texto += '\nif('+TemporalValor+' == -2) goto '+EtiquetaDecimal+';';
                Texto += '\nprint("%c",'+TemporalValor+');'
                Texto += '\ngoto '+EtiquetaRetorno+';';
                Texto += '\n'+EtiquetaEntero+':';
                Texto += '\n'+TemporalValor+' = Heap['+TemporalPosicion+'];'
                Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                Texto += '\nprint("%e",'+TemporalValor+');'                
                Texto += '\ngoto '+EtiquetaRetorno+';';
                Texto += '\n'+EtiquetaDecimal+':';
                Texto += '\n'+TemporalValor+' = Heap['+TemporalPosicion+'];'
                Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                Texto += '\nprint("%d",'+TemporalValor+');';
                Texto += '\ngoto '+EtiquetaRetorno+';';
                Texto += '\n'+EtiquetaSalida+':';
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
                return '';
            }
        }else{
            Texto += '\nprint("%c",91);//[';
            Texto += '\nprint("%c",79);//O';
            Texto += '\nprint("%c",98);//b';
            Texto += '\nprint("%c",106);//j';
            Texto += '\nprint("%c",101);//e';
            Texto += '\nprint("%c",99);//c';
            Texto += '\nprint("%c",116);//t';
            Texto += '\nprint("%c",93);//]';
        }
        return Texto;
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
    this.Parametros = x;
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
        let Ambito = EntornoPadre.getAmbito();
        let Simbolo =null;
        if(this.Variable.length==1){
            Simbolo = EntornoPadre.getSimboloVariable(Ambito,this.Variable[0]);
        }else{
            
        }
        if(Simbolo==null){
            this.AgregarError('No se encontro la variable '+this.Variable);
            return;
        }
        if(ValValor.TipoDato=='booleano'&&ValValor.Tipo=='valor'){
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporal;
            ValValor.Texto+= '\n'+NuevoTemporal+' = 1;';
            let NuevaEtiquetaSalidaDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaDer+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporal+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaDer+':';
        }
        let Texto = '';
        Texto += ValValor.Texto;
        let TemporalPosicionStack = 't'+EntornoPadre.Temporales.getNuevoTemporal();        
        Texto += '\n'+TemporalPosicionStack+' = P + '+Simbolo.getPosicion()+';';
        Texto += '\nStack['+TemporalPosicionStack+'] = '+ValValor.Temporal+';';
        return Texto;
    };
    this.type = function(){
        return 'asignacion_variable';
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
    this.Ejecutar = function(EntornoPadre,PosicionRelativaStack,Ambito,PrimeraPasada){
        let Visibilidad = '';
        let static = false;
        let abstract = false;
        let final = false;        
        for(let i = 0; i <this.Modificadores.length;i++){
            switch(this.Modificadores[i]){
                case 'public':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'public'; 
                    break;
                case 'protected':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'protected'; 
                    break;
                case 'private':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'private'; 
                    break;
                case 'static':if(static){this.AgregarError('Modificador static ya utilizado en declaracion');}static = true;break;
                case 'final':if(final){this.AgregarError('Modificador final ya utilizado en declaracion');}final = true;break;
                default:
                    this.AgregarError('Modificador '+this.Modificadores[i]+ ' no permitido para declaracion de un campo');
            }
        }
        if(Visibilidad==''){
            Visibilidad = 'public';
        }
        let Texto = '';
        let SubTexto = '';
        for(let i =0;i<this.ListaSubDeclaraciones.length;i++){
            SubTexto = this.ListaSubDeclaraciones[i].Ejecutar(EntornoPadre,this.Tipo,Visibilidad,static,final,abstract,PosicionRelativaStack,Ambito,PrimeraPasada);
            if(SubTexto!=undefined){
                Texto+=SubTexto;
            }
            PosicionRelativaStack++;
        }
        let ValRetorno = new Object();
        ValRetorno.PosicionRelativaStack = PosicionRelativaStack;
        ValRetorno.Texto = Texto;
        consola_201404268.setValue(Texto);
        return ValRetorno;
    };
    this.getSize = function(){
        return this.ListaSubDeclaraciones.length;
    }
    this.type = function(){
        return 'declaracion_variable';
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
    this.Ejecutar = function(EntornoPadre,TipoDato,Visibilidad,static,final,abstract,PosicionRelativaStack,Ambito,PrimeraPasada){
        
        if(PrimeraPasada==undefined){
            if(this.Dimensiones == 0){
                EntornoPadre.AgregarSimbolo(this.Identificador,'variable',TipoDato,1,PosicionRelativaStack,Array.from(Ambito),Visibilidad,static,final,abstract,false,0,null);
            }else{//Debo inicializar el arreglo con 0 elementos en heap, en un rato lo hago :v
                EntornoPadre.AgregarSimbolo(this.Identificador,'arreglo',TipoDato,1,PosicionRelativaStack,Array.from(Ambito),Visibilidad,static,final,abstract,false,this.Dimensiones,null);
            }
            if(this.Valor!=undefined){
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
                let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValValor.Texto += '\n'+NuevoTemporalValValor+' = P + '+PosicionRelativaStack+';'
                ValValor.Texto += '\nStack['+NuevoTemporalValValor+'] = '+ValValor.Temporal+';'
                return ValValor.Texto;
            }
        }else if(PrimeraPasada){
            if(this.Dimensiones == 0){
                EntornoPadre.AgregarSimbolo(this.Identificador,'variable',TipoDato,1,PosicionRelativaStack,Array.from(Ambito),Visibilidad,static,final,abstract,false,0,null);
            }else{//Debo inicializar el arreglo con 0 elementos en heap, en un rato lo hago :v
                EntornoPadre.AgregarSimbolo(this.Identificador,'arreglo',TipoDato,1,PosicionRelativaStack,Array.from(Ambito),Visibilidad,static,final,abstract,false,this.Dimensiones,null);
            }
        }else{
            if(this.Valor!=undefined){
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
                let NuevoTemporalValValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValValor.Texto += '\n'+NuevoTemporalValValor+' = P + '+PosicionRelativaStack+';'
                ValValor.Texto += '\nStack['+NuevoTemporalValValor+'] = '+ValValor.Temporal+';'
                return ValValor.Texto;
            }
        }
        return '';
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
    this.Ejecutar = function(EntornoPadre,PosicionRelativaStack,Ambito,PrimeraPasada){
//OBTENER VALOR DE LOS MODIFICADORES
        let Visibilidad = '';
        let static = false;
        let abstract = false;
        let final = false;
        let Size = this.Instrucciones.getSize();
        Size = Size + this.Parametros.length;
        for(let i = 0; i <this.Modificadores.length;i++){
            switch(this.Modificadores[i]){
                case 'public':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'public'; 
                    break;
                case 'protected':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'protected'; 
                    break;
                case 'private':
                    if(Visibilidad!=''){this.AgregarError('La clase ya posee una visibilidad');} 
                    Visibilidad = 'private'; 
                    break;
                case 'static':if(static){this.AgregarError('Modificador static ya utilizado en declaracion');}static = true;break;
                case 'final':if(final){this.AgregarError('Modificador final ya utilizado en declaracion');}final = true;break;
                case 'abstract':if(abstract){this.AgregarError('Modificador abstract ya utilizado en declaracion');}abstract = true;break;
                default:
                    this.AgregarError('Modificador no permitido para declaracion de una clase');
            }
        }
        if(Visibilidad==''){
            Visibilidad = 'public';
        }
        PosicionRelativaStack = 0;//Reiniciando el contador 
//AGREGAR EL METODO A LA TABLA DE SIMBOLOS
        if(PrimeraPasada){
            if(this.Dimensiones>0){
                //Inicializar en heap el tamaño del arreglo
            }else{
                EntornoPadre.AgregarSimbolo(this.Identificador,'metodo',this.Tipo,Size,null,Array.from(Ambito),Visibilidad,static,final,abstract,false,this.Dimensiones,this.Parametros);
            }
            return;
        }
// DECLARACION DE LOS PARAMETROS
        Ambito.push(this.Identificador);//Aqui aumento el ambito con este metodo debido aque ejecutare lo que esta dentro
        EntornoPadre.setAmbito(Array.from(Ambito));        
        for(let i = 0;i <this.Parametros.length;i++){
            let finalParametro = false;
            for(let j = 0; j <this.Parametros[j].Modificadores.length;j++){
                switch(this.Modificadores[j]){
                    case 'final':if(finalParametro){this.AgregarError('Modificador final ya utilizado en declaracion');}finalParametro = true;break;
                    default:
                        this.AgregarError('Modificador '+this.Parametros[i].Modificadores[j]+ ' no permitido para declaracion de un parametro');
                }
            }
            if(this.Parametros[i].CantidadDimensiones>0){
                EntornoPadre.AgregarSimbolo(this.Parametros[i].Identificador,'arreglo',this.Parametros[i].Tipo,1,PosicionRelativaStack,Array.from(Ambito),'public',false,finalParametro,false,false,0,null);
                PosicionRelativaStack++;
            }else{
                EntornoPadre.AgregarSimbolo(this.Parametros[i].Identificador,'variable',this.Parametros[i].Tipo,1,PosicionRelativaStack,Array.from(Ambito),'public',false,finalParametro,false,false,0,null);
                PosicionRelativaStack++;
            }
        }
//OBTENCION DEL CODIGO 3D DE LAS INSTRUCCIONES DENTRO DEL METODO
        let Texto = '';
        Texto = this.Instrucciones.Ejecutar(EntornoPadre,PosicionRelativaStack, Ambito);
        Texto = Texto.replace(/\n/g,"\n\t");
        Ambito.pop();//Aqui disminuyo el ambito con este metodo debido aque ejecutare lo que esta dentro
//DECLARAR EL METODO EN CODIGO 3D
        let NombreClase = '';
        for(let i = 0;i<Ambito.length;i++){
            if(i==0){
                NombreClase += Ambito[i];
            }else{
                NombreClase += '_'+Ambito[i];
            }
        }
        Texto = '\nproc '+NombreClase+'_'+this.Identificador+' begin '+Texto+ '\nend';
        Texto = '\n//Declaracion del metodo '+this.Identificador+Texto;
        return Texto;
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
        if(this.Tipo.TipoDato=='decimal'&&ValValor.Tipo=='valor'){
            ValRetorno.TipoDato = 'decimal';
            if(ValValor.TipoDato == 'decimal'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato =='entero'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato == 'caracter'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            }else if(ValValor.TipoDato == 'cadena'){
                let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();            
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalValor+' = 0;';
                ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 57) goto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 48) goto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - 48;'//Para obtener el valor numerico
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' + '+ValRetorno.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' * 10;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';'
                ValRetorno.Texto += '\n'+EtiquetaSalida+':';
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' / 10;';
                ValRetorno.Temporal = TemporalValor;
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
            }
        }else if(this.Tipo.TipoDato=='entero'&&ValValor.Tipo=='valor'){                
            ValRetorno.TipoDato = 'entero';
            if(ValValor.TipoDato == 'decimal'){
                let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
            }else if(ValValor.TipoDato =='entero'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
            }else if(ValValor.TipoDato == 'caracter'){
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            }else if(ValValor.TipoDato == 'cadena'){
                let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();            
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalValor+' = 0;';
                ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 57) goto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 48) goto '+EtiquetaSalida+';';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - 48;'//Para obtener el valor numerico
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' + '+ValRetorno.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' * 10;';
                ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';'
                ValRetorno.Texto += '\n'+EtiquetaSalida+':';
                ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' / 10;';
                ValRetorno.Temporal = TemporalValor;
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
                return;
            }
        }else if(this.Tipo.TipoDato=='caracter'&&ValValor.Tipo=='valor'){                
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
                let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
                ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
                ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
                ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
                ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaRetorno+';';
            }else{
                this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
                return;
            }
        }else if(this.Tipo.TipoDato=='cadena'&&ValValor.Tipo=='valor'){
            ValRetorno.TipoDato = 'cadena';
            ValRetorno.Temporal = ValValor.Temporal;
            if(ValValor.TipoDato == 'decimal'){                
                let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValRetorno.Texto += '\n'+TemporalContador +' = H;';
                ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = 0-2;';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nH = '+TemporalContador+';'
                ValRetorno.Temporal = TemporalApuntador;
            }else if(ValValor.TipoDato =='entero'){                
                let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValRetorno.Texto += '\n'+TemporalContador +' = H;';
                ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = 0-1;';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nH = '+TemporalContador+';'
                ValRetorno.Temporal = TemporalApuntador;
            }else if(ValValor.TipoDato == 'caracter'){                
                let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();            
                ValRetorno.Texto += '\n'+TemporalContador +' = H;'
                ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValRetorno.Texto += '\nH = '+TemporalContador+';'
                ValRetorno.Temporal = TemporalApuntador;
            }else if(ValValor.TipoDato == 'cadena'){
                let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValValor.Temporal+';';
                ValRetorno.Temporal = NuevoTemporal;
            }else if(ValValor.TipoDato == 'booleano'){
                //######## Obteniendo si es verdadero o falso ###################
                for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                    ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
                }
                let NuevoTemporalDer = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValValor.Temporal = NuevoTemporalDer;
                ValValor.Texto+= '\n'+NuevoTemporalDer+' = 1;';
                let NuevaEtiquetaSalidaDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaDer+';';
                for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                    ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
                }            
                ValValor.Texto+= '\n'+NuevoTemporalDer+' = 0;';      
                ValValor.Texto+= '\n'+NuevaEtiquetaSalidaDer+':';
                //#########################################################
                let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValValor.Texto += '\n'+TemporalContador +' = H;';
                ValValor.Texto += '\n'+TemporalApuntador +' = H;';
                let EtiquetaVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValValor.Texto += '\nif('+ValValor.Temporal+' == 1) goto '+EtiquetaVerdadero;
                ValValor.Texto += '\nHeap['+TemporalContador    +'] = 102;';//102 es el ascii de 'f'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] =  97;';//97  es el ascii de 'a'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 108;';//114 es el ascii de 'l'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 115;';//114 es el ascii de 's'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\ngoto '+EtiquetaSalida+';'
                ValValor.Texto += '\n'+EtiquetaVerdadero+':'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 116;';//116 es el ascii de 't'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 114;';//114 es el ascii de 'r'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 117;';//117 es el ascii de 'u'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
                ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
                ValValor.Texto += '\n'+EtiquetaSalida+':'
                ValValor.Texto += '\nH = '+TemporalContador+';'
                ValValor.Temporal = TemporalApuntador;
                ValRetorno.Texto = ValValor.Texto;
                ValRetorno.Temporal = ValValor.Temporal;
            }else{
                this.AgregarError('No se puede hacer conversion a tipo cadena desde uno de tipo '+ValValor.TipoDato);
                return;
            }
        }else{
            this.Agregar('No se pudo realizar la conversion de '+ValValor.TipoDato +' a '+this.Tipo.TipoDato);
            return;
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
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        let ValRetorno = new Object();
        ValRetorno.TipoDato = 'cadena';
        ValRetorno.Temporal = ValValor.Temporal;
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValValor.Texto;
        if(ValValor.TipoDato == 'decimal'&&ValValor.Tipo=='valor'){
            TipoResultante = 'cadena';
            ValRetorno.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Texto += '\n'+TemporalContador +' = H;';
            ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = 0-2;';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nH = '+TemporalContador+';'
            ValRetorno.Temporal = TemporalApuntador;
        }else if(ValValor.TipoDato =='entero'&&ValValor.Tipo=='valor'){
            TipoResultante = 'cadena';
            ValRetorno.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Texto += '\n'+TemporalContador +' = H;';
            ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = 0-1;';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nH = '+TemporalContador+';'
            ValRetorno.Temporal = TemporalApuntador;
        }else if(ValValor.TipoDato == 'caracter'&&ValValor.Tipo=='valor'){
            TipoResultante = 'cadena';
            ValRetorno.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();            
            ValRetorno.Texto += '\n'+TemporalContador +' = H;'
            ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ValRetorno.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nH = '+TemporalContador+';'
            ValRetorno.Temporal = TemporalApuntador;
        }else if(ValValor.TipoDato == 'cadena'&&ValValor.Tipo=='valor'){
            let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValValor.Temporal+';';
            ValRetorno.Temporal = NuevoTemporal;
        }else if(ValValor.TipoDato == 'booleano'&&ValValor.Tipo == 'valor'){
            //######## Obteniendo si es verdadero o falso ###################
            for(let i = 0;i<ValValor.ListaVerdaderos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalDer = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Temporal = NuevoTemporalDer;
            ValValor.Texto+= '\n'+NuevoTemporalDer+' = 1;';
            let NuevaEtiquetaSalidaDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto+= '\ngoto '+NuevaEtiquetaSalidaDer+';';
            for(let i = 0;i<ValValor.ListaFalsos.length;i++){
                ValValor.Texto += '\n'+ValValor.ListaFalsos[i]+':';
            }            
            ValValor.Texto+= '\n'+NuevoTemporalDer+' = 0;';      
            ValValor.Texto+= '\n'+NuevaEtiquetaSalidaDer+':';
            //#########################################################
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValValor.Texto += '\n'+TemporalContador +' = H;';
            ValValor.Texto += '\n'+TemporalApuntador +' = H;';
            TipoResultante = 'cadena';
            let EtiquetaVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValValor.Texto += '\nif('+ValValor.Temporal+' == 1) goto '+EtiquetaVerdadero;
            ValValor.Texto += '\nHeap['+TemporalContador    +'] = 102;';//102 es el ascii de 'f'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] =  97;';//97  es el ascii de 'a'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 108;';//114 es el ascii de 'l'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 115;';//114 es el ascii de 's'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\ngoto '+EtiquetaSalida+';'
            ValValor.Texto += '\n'+EtiquetaVerdadero+':'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 116;';//116 es el ascii de 't'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 114;';//114 es el ascii de 'r'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 117;';//117 es el ascii de 'u'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValValor.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValValor.Texto += '\n'+EtiquetaSalida+':'
            ValValor.Texto += '\nH = '+TemporalContador+';'
            ValValor.Temporal = TemporalApuntador;
            ValRetorno.Texto = ValValor.Texto;
            ValRetorno.Temporal = ValValor.Temporal;
        }else{
            this.AgregarError('No se puede hacer conversion a tipo cadena desde uno de tipo '+ValValor.TipoDato);
            return;
        }
        return ValRetorno;
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
        if(ValValor.TipoDato == 'decimal'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato =='entero'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato == 'caracter'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'&&ValValor.Tipo=='valor'){
            let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();            
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalValor+' = 0;';
            ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 57) goto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 48) goto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - 48;'//Para obtener el valor numerico
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' + '+ValRetorno.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' * 10;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';'
            ValRetorno.Texto += '\n'+EtiquetaSalida+':';
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' / 10;';
            ValRetorno.Temporal = TemporalValor;
        }else{
            this.AgregarError('No se puede hacer conversion a tipo decimal desde uno de tipo '+ValValor.TipoDato);
            return;
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
        if(ValValor.TipoDato == 'decimal'&&ValValor.Tipo=='valor'){
            let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();                        
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalAuxiliar+' = '+ValRetorno.Temporal+' % 1;';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - '+TemporalAuxiliar+';';
        }else if(ValValor.TipoDato =='entero'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto = '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';'
        }else if(ValValor.TipoDato == 'caracter'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'&&ValValor.Tipo=='valor'){            
            let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalValor = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();            
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalValor+' = 0;';
            ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' > 57) goto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 48) goto '+EtiquetaSalida+';';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValRetorno.Temporal+' - 48;'//Para obtener el valor numerico
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' + '+ValRetorno.Temporal+';';
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' * 10;';
            ValRetorno.Texto += '\ngoto '+EtiquetaRetorno+';'
            ValRetorno.Texto += '\n'+EtiquetaSalida+':';
            ValRetorno.Texto += '\n'+TemporalValor+' = '+TemporalValor+' / 10;';
            ValRetorno.Temporal = TemporalValor;
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
        if(ValValor.TipoDato == 'decimal'&&ValValor.Tipo=='valor'){
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
        }else if(ValValor.TipoDato =='entero'&&ValValor.Tipo=='valor'){
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
        }else if(ValValor.TipoDato == 'caracter'&&ValValor.Tipo=='valor'){
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = '+ValValor.Temporal+';';
        }else if(ValValor.TipoDato == 'cadena'&&ValValor.Tipo=='valor'){
            let TemporalPosicion = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let EtiquetaRetorno = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+ValValor.Temporal;
            ValRetorno.Texto += '\n'+EtiquetaRetorno+':';
            ValRetorno.Texto += '\n'+ValRetorno.Temporal+' = Heap['+TemporalPosicion+'];'
            ValRetorno.Texto += '\n'+TemporalPosicion+' = '+TemporalPosicion +'+ 1;'
            ValRetorno.Texto += '\nif('+ValRetorno.Temporal+' < 0) goto '+EtiquetaRetorno+';';
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
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='entero'){
            TipoResultante = 'cadena';
            ValDer.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValDer.Texto += '\n'+TemporalContador +' = H;';
            ValDer.Texto += '\n'+TemporalApuntador +' = H;';
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 0-1;';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ValDer.Temporal+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nH = '+TemporalContador+';'
            ValDer.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'entero'&& ValDer.TipoDato=='cadena'){
            TipoResultante = 'cadena';
            ValIzq.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();            
            ValIzq.Texto += '\n'+TemporalContador +' = H;'
            ValIzq.Texto += '\n'+TemporalApuntador +' = H;';
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 0-1;';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ValIzq.Temporal+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nH = '+TemporalContador+';'
            ValIzq.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='caracter'){
            TipoResultante = 'cadena';
            ValDer.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();            
            ValDer.Texto += '\n'+TemporalContador +' = H;'
            ValDer.Texto += '\n'+TemporalApuntador +' = H;';
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ValDer.Temporal+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nH = '+TemporalContador+';'
            ValDer.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'caracter'&& ValDer.TipoDato=='cadena'){
            TipoResultante = 'cadena';
            ValIzq.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();            
            ValIzq.Texto += '\n'+TemporalContador +' = H;'
            ValIzq.Texto += '\n'+TemporalApuntador +' = H;';
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ValIzq.Temporal+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nH = '+TemporalContador+';'
            ValIzq.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='decimal'){
            TipoResultante = 'cadena';
            ValDer.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValDer.Texto += '\n'+TemporalContador +' = H;';
            ValDer.Texto += '\n'+TemporalApuntador +' = H;';
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 0-2;';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ValDer.Temporal+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nH = '+TemporalContador+';'
            ValDer.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'decimal'&& ValDer.TipoDato=='cadena'){
            TipoResultante = 'cadena';
            ValIzq.TipoDato =='cadena';
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValIzq.Texto += '\n'+TemporalContador +' = H;';
            ValIzq.Texto += '\n'+TemporalApuntador +' = H;';
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 0-2;';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ValIzq.Temporal+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nH = '+TemporalContador+';'
            ValIzq.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='booleano'){
            //######## Obteniendo si es verdadero o falso ###################
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
            //#########################################################
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValDer.Texto += '\n'+TemporalContador +' = H;';
            ValDer.Texto += '\n'+TemporalApuntador +' = H;';
            TipoResultante = 'cadena';
            ValDer.TipoDato =='cadena';
            let EtiquetaVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaSalida = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValDer.Texto += '\nif('+ValDer.Temporal+' == 1) goto '+EtiquetaVerdadero+';';
            ValDer.Texto += '\nHeap['+TemporalContador    +'] = 102;';//102 es el ascii de 'f'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] =  97;';//97  es el ascii de 'a'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 108;';//114 es el ascii de 'l'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 115;';//114 es el ascii de 's'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\ngoto '+EtiquetaSalida+';'
            ValDer.Texto += '\n'+EtiquetaVerdadero+':'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 116;';//116 es el ascii de 't'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 114;';//114 es el ascii de 'r'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 117;';//117 es el ascii de 'u'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValDer.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValDer.Texto += '\n'+EtiquetaSalida+':'
            ValDer.Texto += '\nH = '+TemporalContador+';'
            ValDer.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'booleano'&& ValDer.TipoDato=='cadena'){
            //######## Obteniendo si es verdadero o falso ###################
            for(let i = 0;i<ValIzq.ListaVerdaderos.length;i++){
                ValIzq.Texto += '\n'+ValIzq.ListaVerdaderos[i]+':';
            }
            let NuevoTemporalDer = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValIzq.Temporal = NuevoTemporalDer;
            ValIzq.Texto+= '\n'+NuevoTemporalDer+' = 1;';
            let NuevaEtiquetaSalidaDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValIzq.Texto+= '\ngoto '+NuevaEtiquetaSalidaDer+';';
            for(let i = 0;i<ValIzq.ListaFalsos.length;i++){
                ValIzq.Texto += '\n'+ValIzq.ListaFalsos[i]+':';
            }            
            ValIzq.Texto+= '\n'+NuevoTemporalDer+' = 0;';      
            ValIzq.Texto+= '\n'+NuevaEtiquetaSalidaDer+':';
            //#########################################################
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValIzq.Texto += '\n'+TemporalContador +' = H;';
            ValIzq.Texto += '\n'+TemporalApuntador +' = H;';
            TipoResultante = 'cadena';
            ValIzq.TipoDato =='cadena';
            let EtiquetaVerdadero = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValIzq.Texto += '\nif('+ValIzq.Temporal+' == 1) goto '+EtiquetaVerdadero+';';
            ValIzq.Texto += '\nHeap['+TemporalContador    +'] = 102;';//102 es el ascii de 'f'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] =  97;';//97  es el ascii de 'a'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 108;';//114 es el ascii de 'l'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 115;';//114 es el ascii de 's'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\ngoto '+EtiquetaSalida+';'
            ValIzq.Texto += '\n'+EtiquetaVerdadero+':'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 116;';//116 es el ascii de 't'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 114;';//114 es el ascii de 'r'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 117;';//117 es el ascii de 'u'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = 101;';//101 es el ascii de 'e'
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValIzq.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValIzq.Texto += '\n'+EtiquetaSalida+':'
            ValIzq.Texto += '\nH = '+TemporalContador+';'
            ValIzq.Temporal = TemporalApuntador;
        }
        else if(ValIzq.TipoDato == 'cadena'&& ValDer.TipoDato=='cadena'){TipoResultante = 'cadena';}
        else{
            this.AgregarError('No se pudo obtener el tipo de dato resultante entre los operandos');
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = TipoResultante;        
        ValRetorno.Tipo = 'valor';
        ValRetorno.Texto = ValIzq.Texto + ValDer.Texto;
        if(TipoResultante == 'cadena'){
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalAuxiliar = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalPosCadena = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let EtiquetaRetornoIzq = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let EtiquetaRetornoDer = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.Texto += '\n'+TemporalContador +' = H;';
            ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';
            ValRetorno.Texto += '\n'+TemporalPosCadena +' = '+ValIzq.Temporal+';';
            ValRetorno.Texto += '\n'+EtiquetaRetornoIzq+':';
            ValRetorno.Texto += '\n'+TemporalAuxiliar+' = Heap['+TemporalPosCadena+'];';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+TemporalAuxiliar+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;';
            ValRetorno.Texto += '\n'+TemporalPosCadena +' = '+TemporalPosCadena+'+ 1;';            
            ValRetorno.Texto += '\nif('+TemporalAuxiliar+'!= 0) goto '+EtiquetaRetornoIzq+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'- 1;';//Para que sobre escriba el \0
            ValRetorno.Texto += '\nH = '+TemporalContador+';';
            ValRetorno.Texto += '\n'+TemporalPosCadena +' = '+ValDer.Temporal+';';
            ValRetorno.Texto += '\n'+EtiquetaRetornoDer+':';
            ValRetorno.Texto += '\n'+TemporalAuxiliar+' = Heap['+TemporalPosCadena+'];';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+TemporalAuxiliar+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;';
            ValRetorno.Texto += '\n'+TemporalPosCadena +' = '+TemporalPosCadena+'+ 1;';            
            ValRetorno.Texto += '\nif('+TemporalAuxiliar+'!= 0) goto '+EtiquetaRetornoDer+';';
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nH = '+TemporalContador+';'
            ValRetorno.Temporal = TemporalApuntador;
        }else{
            let NuevoTemporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Temporal = NuevoTemporal;
            ValRetorno.Texto += '\n'+NuevoTemporal+' = '+ValIzq.Temporal+ ' + '+ValDer.Temporal+';';
        }
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
            
        }else if(this.Tipo=='nulo'){
            ValRetorno.Temporal = this.Valor;
            ValRetorno.Texto = '';
        }else if(this.Tipo == 'cadena'){
            this.Valor = this.Valor.substring(1,this.Valor.length-1);            
            let TemporalContador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            let TemporalApuntador = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Texto += '\n'+TemporalContador +' = H;'
            ValRetorno.Texto += '\n'+TemporalApuntador +' = H;';            
            for(let i = 0;i<this.Valor.length;i++){
                ValRetorno.Texto += '\nHeap['+(TemporalContador)+'] = '+this.Valor.charCodeAt(i)+';';
                ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            }
            ValRetorno.Texto += '\nHeap['+TemporalContador+'] = '+ '\0'.charCodeAt(0)+';';
            ValRetorno.Texto += '\n'+TemporalContador +' = '+TemporalContador+'+ 1;'
            ValRetorno.Texto += '\nH = '+TemporalContador+';'
            ValRetorno.Temporal = TemporalApuntador;
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
        let Ambito = EntornoPadre.getAmbito();
        let Simbolo =null;
        if(this.Nombre.length==1){
            Simbolo = EntornoPadre.getSimboloVariable(Ambito,this.Nombre[0]);
        }else{
            
        }
        if(Simbolo==null){
            this.AgregarError('No se encontro la variable '+this.Nombre);
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = Simbolo.getTipoDato().TipoDato;
        ValRetorno.Tipo = Simbolo.getTipoDato().Tipo;
        let TemporalValorStack = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        let TemporalPosicionStack = 't'+EntornoPadre.Temporales.getNuevoTemporal();
        ValRetorno.Texto = '';
        ValRetorno.Texto += '\n'+TemporalPosicionStack+' = P + '+Simbolo.getPosicion()+';';
        ValRetorno.Texto += '\n'+TemporalValorStack + ' = Stack['+TemporalPosicionStack+'];';        
        if(ValRetorno.TipoDato=='booleano'&&ValRetorno.Tipo=='valor'){
            ValRetorno.Temporal = TemporalValorStack;
            ValRetorno.ListaVerdaderos = [];
            ValRetorno.ListaFalsos = [];
            let NuevaEtiquetaVerdadera = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            let NuevaEtiquetaFalsa = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
            ValRetorno.ListaVerdaderos.push(NuevaEtiquetaVerdadera);
            ValRetorno.ListaFalsos.push(NuevaEtiquetaFalsa);
            ValRetorno.Texto+= '\nif('+TemporalValorStack+'==1) goto '+NuevaEtiquetaVerdadera+';';
            ValRetorno.Texto+= '\ngoto '+NuevaEtiquetaFalsa+';';
        }else if(ValRetorno.TipoDato=='nulo'&&ValRetorno.Tipo=='valor'){
            ValRetorno.Temporal = TemporalValorStack;
        }else if(ValRetorno.TipoDato == 'cadena'&&ValRetorno.Tipo=='valor'){
            ValRetorno.Temporal = TemporalValorStack;
        }else if(ValRetorno.Tipo=='valor'){
            ValRetorno.Temporal = TemporalValorStack;
        }
        return ValRetorno;
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
        let Simbolo =null;
        for(let i=0;i<this.Parametros.length;i++){
            ValDimensiones.push(this.Parametros[i].Ejecutar(EntornoPadre));
        }
        if(this.Nombre.length==1){//Se busca en la misma clase
            Simbolo = EntornoPadre.getMetodo(EntornoPadre.Ambito, this.Nombre,ValDimensiones);
        }else{
            
        }
        if(Simbolo ==undefined||Simbolo==null){
            this.AgregarError('No se encontro el metodo '+this.Nombre)
            return;
        }
        let ValRetorno = new Object();
        ValRetorno.TipoDato = Simbolo.getTipoDato().TipoDato;
        ValRetorno.Tipo = Simbolo.getTipoDato().Tipo;
        ValRetorno.Texto = '';
        for(let i = 0; i <ValDimensiones.length;i++){
            if(ValDimensiones[i].TipoDato == 'booleano'){
                for(let j = 0;j<ValDimensiones[i].ListaVerdaderos.length;j++){
                    ValDimensiones[i].Texto += '\n'+ValDimensiones[i].ListaVerdaderos[j]+':';
                }
                let NuevoTemporalValDimensiones = 't'+EntornoPadre.Temporales.getNuevoTemporal();
                ValDimensiones[i].Temporal = NuevoTemporalValDimensiones;
                ValDimensiones[i].Texto+= '\n'+NuevoTemporalValDimensiones+' = 1;';
                let NuevaEtiquetaSalidaValDimensiones = 'L'+EntornoPadre.Etiquetas.getNuevaEtiqueta();
                ValDimensiones[i].Texto+= '\ngoto '+NuevaEtiquetaSalidaValDimensiones+';';
                for(let j = 0;j<ValDimensiones[i].ListaFalsos.length;j++){
                    ValDimensiones[i].Texto += '\n'+ValDimensiones[i].ListaFalsos[j]+':';
                }            
                ValDimensiones[i].Texto+= '\n'+NuevoTemporalValDimensiones+' = 0;';      
                ValDimensiones[i].Texto+= '\n'+NuevaEtiquetaSalidaValDimensiones+':';
            }
            ValRetorno.Texto += ValDimensiones[i].Texto;
        }
        ValRetorno.Temporal = 't'+EntornoPadre.Temporales.getNuevoTemporal();        
        for(let i = 0; i <ValDimensiones.length;i++){            
            TemporalPosicionStack = 't'+EntornoPadre.Temporales.getNuevoTemporal();
            ValRetorno.Texto += '\n'+TemporalPosicionStack+' = P + '+Simbolo.getSize()+';';
            ValRetorno.Texto += '\n'+TemporalPosicionStack+' = '+TemporalPosicionStack+' + '+i+';';
            ValRetorno.Texto += '\nStack['+TemporalPosicionStack+'] = '+ValDimensiones[i].Temporal+';';
        }
        ValRetorno.Texto += '\nP = P + '+Simbolo.getSize()+';';
        ValRetorno.Texto += '\ncall '+Simbolo.getAmbito_Texto()+'_'+Simbolo.getIdentificador()+';';
        ValRetorno.Texto += '\nP = P - '+Simbolo.getSize()+';';
        //Tengo que agregar el return
        return ValRetorno;
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


//#####################################################
//## MANEJO DE TODO LO NECESARIO PARA PODER TRADUCIR ##
//#####################################################

function Simbolo_CAAS(id,Tipo,TipoDato,Size,Posicion,Ambito,Acceso,Estatico,final,abstract,Extiende,Dimensiones,Parametros){
    this.Identificador = id;
    this.Tipo = Tipo;
    this.TipoDato= TipoDato;
    this.Size = Size;
    this.Posicion = Posicion;
    this.Ambito = Ambito;
    this.Acceso = Acceso;
    this.Estatico = Estatico;
    this.Final = final;
    this.Abstract = abstract;
    this.Extiende = Extiende;    
    this.Dimensiones = Dimensiones;
    this.Parametros = Parametros;
    this.getIdentificador = function(){
        if(this.Identificador==null||this.Identificador==undefined){
            return 'null';
        }
        return this.Identificador;
    }
    this.getTipo = function(){
        if(this.Tipo==null||this.Tipo==undefined){
            return 'null';
        }
        return this.Tipo;
    }
    this.getTipoDato = function(){
        if(this.TipoDato==null||this.TipoDato==undefined){
            return 'null';
        }
        return this.TipoDato;
    }
    this.getTipoDato_Texto = function(){
        if(this.TipoDato==null||this.TipoDato==undefined){
            return 'null';
        }
        return this.TipoDato.Tipo + '_'+this.TipoDato.TipoDato;
    }
    this.getSize= function(){
        if(this.Size==null||this.Size==undefined){
            return 'null';
        }
        return this.Size;
    }
    this.getPosicion = function(){
        if(this.Posicion==null||this.Posicion==undefined){
            return 'null';
        }
        return this.Posicion;
    }
    this.getAmbito_Texto = function(){
        let Texto = '';
        if(this.Ambito==null||this.Ambito==undefined){
            return 'null';
        }
        for(let i = 0;i<Ambito.length;i++){
            if(i==0){
                Texto += Ambito[i];
            }else{
                Texto += '_'+Ambito[i];
            }
        }
        return Texto;
    }
    this.getAmbito = function(){
        if(this.Ambito==null||this.Ambito==undefined){
            return undefined;
        }        
        return this.Ambito;
    }
    this.getAcceso = function(){
        if(this.Acceso==null||this.Acceso==undefined){
            return 'null';
        }
        return this.Acceso;
    }
    this.getEstatico = function(){
        if(this.Estatico==null||this.Estatico==undefined){
            return 'null';
        }
        return this.Estatico;
    }
    this.getFinal = function(){
        if(this.Final==null||this.Final==undefined){
            return 'null';
        }
        return this.Final;
    }
    this.getAbstract = function(){
        if(this.Abstract==null||this.Abstract==undefined){
            return 'null';
        }
        return this.Abstract;
    }
    this.getExtiende = function(){
        if(this.Extiende==null||this.Extiende==undefined){
            return 'null';
        }
        return this.Extiende;
    }
    this.getDimensiones = function(){
        if(this.Dimensiones==null||this.Dimensiones==undefined){
            return 'null';
        }
        return this.Dimensiones;
    }
    this.getParametros = function(){
        if(this.Parametros==null||this.Parametros==undefined){
            return 'null';
        }
        return this.Parametros
    }
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Simbolo',-1);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
    };
}

function Entorno_CAAS(){
    this.Ambito = [];
    this.Nodos = [];
    this.Etiquetas = new Manejador_Etiquetas();
    this.Temporales = new Manejador_Temporales();
    this.AgregarSimbolo = function(id,Tipo,TipoDato,Size,Posicion,Ambito,Acceso,Estatico,final,abstract,Extiende,Dimensiones,Parametros){        
        let simbolo = new Simbolo_CAAS(id,Tipo,TipoDato,Size,Posicion,Ambito,Acceso,Estatico,final,abstract,Extiende,Dimensiones,Parametros);
        this.Nodos.push(simbolo);
    }
    this.VerTabla = function(){
        for(let i = 0;i<this.Nodos.length;i++){
            alert('Id:'+ this.Nodos[i].getIdentificador()+', Tipo:'+ this.Nodos[i].getTipo()+', TipoDato:'+ this.Nodos[i].getTipoDato_Texto()+', Size:'+ this.Nodos[i].getSize()+', Posicion:'+ this.Nodos[i].getPosicion()+' Ambito: '+this.Nodos[i].getAmbito_Texto());
        }
    }
    this.getSimboloVariable = function(Ambito,Identificador){
        for(let i = 0;i<this.Nodos.length&&Ambito.length>0;i++){
            if(this.Nodos[i].getTipo() =='variable'){
                if(Ambito.length == this.Nodos[i].getAmbito().length){
                    let MismoAmbito = true;
                    for(let j = 0;j<Ambito.length&&MismoAmbito;j++){
                        if(Ambito[j] != this.Nodos[i].getAmbito()[j]){
                            MismoAmbito = false;
                        }
                    }
                    if(MismoAmbito){
                        if(this.Nodos[i].getIdentificador()==Identificador){
                            return this.Nodos[i];
                        }          
                    }
                }
            }
            if((i+1)==this.Nodos.length){
                Ambito.pop();
                i=-1;
            }
        }
        return null;
    }
    this.getMetodo = function(Ambito,Identificador,ParametrosBuscados){
        for(let i = 0;i<this.Nodos.length&&Ambito.length>0;i++){
            if(this.Nodos[i].getTipo() =='metodo'){
                if(Ambito.length == this.Nodos[i].getAmbito().length){
                    let MismoAmbito = true;
                    for(let j = 0;j<Ambito.length&&MismoAmbito;j++){
                        if(Ambito[j] != this.Nodos[i].getAmbito()[j]){
                            MismoAmbito = false;
                        }
                    }
                    if(MismoAmbito){
                        if(this.Nodos[i].getIdentificador()==Identificador){
                            let ParametrosMetodo = this.Nodos[i].getParametros();
                            let MismosParametros = true;
                            if(ParametrosBuscados.length == ParametrosMetodo.length){
                                for(let j = 0; j <ParametrosBuscados.length&&MismosParametros;j++){
                                    if(ParametrosBuscados[j].Tipo != ParametrosMetodo[j].Tipo.Tipo || ParametrosBuscados[j].TipoDato != ParametrosMetodo[j].Tipo.TipoDato){
                                        MismosParametros = false;
                                    }
                                }                                
                                if(MismosParametros){
                                    return this.Nodos[i];
                                }
                            }
                        }          
                    }
                }
            }
            if((i+1)==this.Nodos.length){
                Ambito.pop();
                i=-1;
            }
        }
    }
    this.setAmbito = function(Ambito){
        this.Ambito = Ambito;
    }
    this.getAmbito = function(){
        return this.Ambito;
    }
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


///CALCULO DE LA POSICION EN UN ARREGLO

/*
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
    */


    /// LO QUE QUITE DE ENTORNO

    /*this.TablaPadre = entornopadre;
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
    };*/