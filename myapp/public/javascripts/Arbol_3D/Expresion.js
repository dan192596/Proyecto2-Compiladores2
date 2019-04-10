//#######################
//## A R I T M E T I C A 
//#######################
function Aritmetica(x, y, z,linea) {
    this.Linea = linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'aritmetica',this.linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);
        if(Izq!=null){
            Izq.RecuperarErrores(ErroresPadre);
        }
        if(Der!=null){
            Der.RecuperarErrores(ErroresPadre);
        }

    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq==null || ValDer ==null){            
            this.AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
            return null;
        }
        switch(this.Op){
            case '+':return ValIzq+ValDer;
            case '-':return ValIzq-ValDer;
            case '*':return ValIzq*ValDer;
            case '/':return ValIzq/ValDer;
            case '%':return ValIzq%ValDer;
        }
        this.AgregarError("No se puede realizar la operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
        return null;
    };
}
//#####################
// R E L A C I O N A L
//#####################
function Relacional (x, y, z,linea) {
    this.Linea = linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z; 
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Relacional',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {        
        ErroresPadre.AgregarErrores(this.Errores);
        if(Izq!=null)
            Izq.RecuperarErrores(ErroresPadre);  
        if(Der!=null)
            Der.RecuperarErrores(ErroresPadre);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq==null || ValDer ==null){            
            this.AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
            return null;
        }
        switch(this.Op){
            case '<':alert(ValIzq<ValDer);return ValIzq<ValDer;
            case '>':alert(ValIzq>ValDer);return ValIzq>ValDer;
            case '<=':alert(ValIzq<=ValDer);return ValIzq<=ValDer;
            case '>=':alert(ValIzq>=ValDer);return ValIzq>=ValDer;
            case '==':alert(ValIzq==ValDer);return ValIzq==ValDer;
            case '!=':alert(ValIzq!=ValDer);return ValIzq!=ValDer;
        }
        this.AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
        return null;
    };
}
//#############
//N U M E R O
//#############
function Numero(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Numero',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {   
        ErroresPadre.AgregarErrores(this.Errores);     
    };
    this.Ejecutar = function(EntornoPadre){
        return this.Valor;
    };
}
//##################
// C A R A C T E R 
//##################
function Caracter(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Caracter',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        return this.Valor;
    };
}
//#################
// T E M P O R A L
//#################
function Temporal(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Temporal',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        return EntornoPadre.Temporales.GetValorTemporal(this.Valor);//Valor guarda el nombre del temporal t(n)
    };
}
//################
// L I M P I A R
//################
function Limpiar(x,y,linea) {
    this.Linea = linea;
    this.Inicio = x; 
    this.Tam=y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Limpiar',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        EntornoPadre.Stack.Limpiar(this.Inicio,this.Tam);
    };
}
//##################
// I M P R I M I R
//##################
function Imprimir(x,y,linea) {
    this.Linea = linea;
    this.CharTerminal = x; 
    this.Valor = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Imprimir',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
        if(this.Valor!=null){
            this.Valor.RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){        
        let ValValor = this.Valor.Ejecutar(EntornoPadre);        
        if(ValValor==null){            
            this.AgregarError("No se pudo recuperar el valor a imprimir");
            return null;
        }
        let texto = consola_201404268.getValue('\n');        
        switch(this.CharTerminal){
            case 'c':texto+=String.fromCharCode(ValValor);break;
            case 'e':texto+=parseInt(ValValor);break;
            case 'd':texto+=parseFloat(ValValor);break;
        }
        consola_201404268.setValue(texto);
        return null;
    };
}
//############################
// L L A M A D A M E T O D O
//############################
function LLamadaMetodo(x,linea) {
    this.Linea = linea;
    this.Identificador = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'LLamadaMetodo',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        if(!EntornoPadre.ExisteMetodo(Identificador)){
            AgregarError("El metodo no existe");
        }
        let f = EntornoPadre.getMetodo(Identificador);
        let inst = f.Instrucciones;//Voy a traer las instrucciones porque el ejecutar de la funcion es para meterlo al entorno
        f.Errorres = new Errores3D();
        f.Instrucciones.Ejecutar(EntornoPadre);//Ejecuto el bloque de instrucciones
        f.RecuperarErrores(this.Errores);
    };
}
//####################################
// D E C L A R A C I O N M E T O D O
//####################################
function DeclaracionMetodo(x,y,linea) {
    this.Linea = linea;
    this.Identificador = x;
    this.Instrucciones = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'DeclaracionMetodo',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
        if(this.Instrucciones!=null){
            this.Instrucciones[i].RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        if(EntornoPadre.ExisteMetodo(this.Identificador)){
            this.AgregarError("Ya se declaro una funcion con este nombre: "+Identificador);
            return;
        }
        EntornoPadre.AgregarMetodo(this.Identificador,this);
    };
}
//###################################################
// S A L T O C O N D I C I O N A L V E R D A D E R O
//###################################################
function SaltoCondicionalVerdadero(x,y,linea){
    this.Linea = linea;
    this.Relacional=x;
    this.Salto = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoCondicionalVerdadero',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
        if(this.Relacional!=null){
            Relacional.RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let ValRelacional = Relacional.Ejecutar(EntornoPadre);
        if(!(ValRelacional instanceof Boolean)){
            this.AgregarError('Se esperaba un valor booleano')
            return;
        }
        if(ValRelacional){
            //Me voy a la etiqueta
        }else{
            //Sigo de largo
        }
    };
}
//############################################
// S A L T O C O N D I C I O N A L F A L S O
//############################################
function SaltoCondicionalFalso(x,y,linea) {
    this.Linea = linea;
    this.Relacional=x;
    this.Salto = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoCondicionalFalso',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
        if(this.Relacional!=null){
            Relacional.RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(){
        let ValRelacional = Relacional.Ejecutar(EntornoPadre);
        if(!(ValRelacional instanceof Boolean)){
            this.AgregarError('Se esperaba un valor booleano')
            return;
        }
        if(ValRelacional){
            //Sigo de largo
        }else{
            //Me voy a la etiqueta
        }
    };
}
//#######################################
// S A L T O   I N C O N D I C I O N A L
//#######################################
function SaltoIncondicional(x,linea) {
    this.Linea = linea;
    this.Etiqueta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoIncondicional',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(){
        //salto alv
    };
}
//############
// S A L T O
//############
function Salto(x,linea) {
    this.Linea = linea;
    this.Etiqueta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Salto',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(){
        //Etiqueta a donde llega, tengo que ver como hago esto
    };
}
//#####################
// A S I G N A C I O N
//#####################
function Asignacion(x,y,tipo,linea) {
    this.Linea = linea;
    this.Identificador=x;
    this.Valor = y
    this.Tipo = tipo;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Asignacion',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
        if(this.Valor!=null){
            Valor.RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(this.Tipo =='temporal'){
            EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValValor);
            return;
        }else if(this.Tipo=='temporal_heap'){
            //Recuperar el valor de heap
            EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValValor);
        }else if(this.Tipo=='temporal_stack'){
            let ValorRecuperadoStack = EntornoPadre.Stack.getValor(ValValor);
            EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValorRecuperadoStack);
        }else if(this.Tipo=='heap'){
            
        }else if(this.Tipo=='stack'){
            let ValIdentificador = this.Identificador.Ejecutar(EntornoPadre);
            EntornoPadre.Stack.SetValor(ValIdentificador,ValValor);
        }
    };
}
//############################
// I N S T R U C C I O N E S
//############################
function Instrucciones(lista,linea) {
    this.Linea = linea;
    this.Lista = lista;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Instrucciones',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        for(let i=0;i<this.Lista.length;i++){
            this.Lista[i].RecuperarErrores;
        }
    };
    this.Ejecutar = function(EntornoPadre){
        for(let i=0;i<this.Lista.length;i++){
            this.Lista[i].Ejecutar(EntornoPadre);
        }
    };
}

//#########################################################
//## CLASES PARA EL FUNCIONAMIENTO GENERAL DEL CODIGO 3D ##
//#########################################################

// #########################################
// M E M O R I A   S T A C K   Y   H E A P 
//##########################################
function Memoria3D(){
    this.m = [];
    this.puntero = 0;//Almacena la posicion del espacio vacio
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Memoria',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };    
    this.Limpiar=function(Inicio, Tam){
        if((Inicio+Tam)>=this.m.length){//Es porque se esta trando de borrar y ya no es parte de lo que esta en la pila
            if(Inicio>=this.m.length){
                return;
            }
            Tam = ((this.m.length-Inicio)-1);//Menos uno porque length siempre tiene uno mas que el indice maximo del arreglo
        }
        for(let i =0;i<Tam;i++){
            this.m.pop();
        }
    }
    this.SetValor=function(posicion, Valor){
        let Tam=0;
        if(posicion>=this.m.length){
            Tam = (posicion-(this.m.length-1)); 
        }
        for(let i =0;i<Tam;i++){
            this.m.push(null);
        }
        this.m[posicion]=Valor;
    }
    this.getValor = function(posicion){
        if(posicion>=this.m.length){
            return null;
        }
        return this.m[posicion];
    }
}
//### T e m p o r a l ####
function ListaTemporal3D(){
    this.Lista = [];
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Manejo temporales',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.SetValorTemporal=function(temporal,valor){
        for(let i =0;i<this.Lista.length;i++){
            if(this.Lista[i].toString()==temporal.toLowerCase()){
                this.Lista[i].Valor = valor;
                return;
            }
        }        
        let temporalnuevo = new Temporal3D(temporal,valor);
        this.Lista.push(temporalnuevo);
    }
    this.GetValorTemporal=function(temporal){
        for(let i =0;i<this.Lista.length;i++){
            if(this.Lista[i].toString()==temporal.toLowerCase()){
                return this.Lista[i].Valor;
            }
        }
        return null;
    }
}
function Temporal3D(nombre,Val){    
    this.Nombre=nombre;
    this.Valor=Val;
    this.toString=function(){
        return this.Nombre.toLowerCase();
    }
}

//###############
// E N T O R N O 
//###############
function Entorno3D(){
    this.Instrucciones = [];
    this.Temporales = new ListaTemporal3D();
    this.Stack = new Memoria3D();
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Entorno',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(Error);
        if(Instrucciones!=null){
            for(let i =0;i<Instrucciones.length;i++){
                this.Instrucciones[i].RecuperarErrores();
            }
        }
    };
}
/*function Entorno(){
    this.Nodos = [];
    this.TablaPadre = null;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Entorno',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(Error);
        if(Instrucciones!=null){
            for(let i =0;i<Nodos.length;i++){
                Nodos[i].RecuperarErrores();
            }
        }
    };
    this.AgregarTemporal = function(Identificador,Valor){
        let Nodo = new Simbolo(Identificador,Valor,'temporal');
        Nodos.push(Nodo);
    };
    this.AgregarMetodo = function(Identificador,Inst){
        let Nodo = new Simbolo(Identificador,Inst,'metodo');
        Nodos.push(Nodo);
    };
    this.ExisteTemporal=function(temporal){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == temporal&&Nodos[i].TipoSimbolo=='temporal'){
                return true;
            }
        }
        return false;
    };
    this.ExisteMetodo=function(Identificador){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == Identificador&&Nodos[i].TipoSimbolo=='metodo'){
                return true;
            }
        }
        return false;
    };
    this.getValor = function(temporal){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == temporal&&Nodos[i].TipoSimbolo=='temporal'){
                return Nodos[i].getValor();
            }
        }
        return undefined;
    };
    this.getMetodo=function(Identificador){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == Identificador&&Nodos[i].TipoSimbolo=='metodo'){
                return Nodos[i].getValor();
            }
        }
        return undefined;
    };
    this.setValor=function(temporal, Valor){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == temporal&&Nodos[i].TipoSimbolo=='temporal'){
                return Nodos[i].setValor(Valor);
            }
        }
    };
    this.setMetodo = function(Identificador,Valor){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == Identificador&&Nodos[i].TipoSimbolo=='metodo'){
                return Nodos[i].setValor(Valor);
            }
        }
    };
}*/
//##############
//S I M B O L O 
//##############
/*function Simbolo(Id,Val,tipo){
    this.Identificador =Id;
    this.Valor = Val;
    //this.Funcion = null;
    this.TipoSimbolo =tipo;
    this.setValor = function(Val){
        this.Valor = Val;
    }
    this.getValor = function(){
        return this.Valor;
    }
    this.getTipoSimbolo  = function(){
        return this.TipoSimbolo;
    }
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Temporal',-1);
    };
    this.RecuperarErrores= function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores); 
    };
    
}*/
//#######################
//## MANEJO DE ERRORES ##
//#######################
function Error3D(tipo,descripcion, clase, fila){
    this.tipo = tipo;
    this.descripcion = descripcion;
    this.clase = clase;
    this.fila = fila;
    this.archivo = null;
    this.getTipo = function() {
        return this.tipo;
    };
    this.getDescripcion = function() {
        return this.descripcion;
    };   
    this.getFila = function() {
        return this.fila;
    };
    this.getClase = function() {
        return this.clase;
    };   
    this.getArchivo = function(){
        if(archivo==null)
            return "";
        return archivo;
    };
}

function Errores3D(){
    this.Tabla = [];
    this.EnviarArchivo = function(archivo){
        for (var i = 0; i < this.Tabla.length; i+=1)
            if(this.Tabla[i].archivo==null)
                this.Tabla[i].archivo = archivo;
    };
    this.Agregar=function(Tipo, Descripcion, Clase, Fila){
        if(Descripcion==undefined&&Clase==undefined&&Fila==undefined){
            this.Tabla.push(er);//Cuando viene el error completo
        }else{
            let NuevoError = new Error3D(Tipo, Descripcion, Clase, Fila);
            this.Tabla.push(NuevoError);//Cuando quiero construir el error
        }
    };
    this.AgregarErrores= function(ListaErrores){        
        for(var i=0;i<ListaErrores.getCantidadErrores();i++){
            this.abla.push(ListaErrores.getError(i));
        }            
    };
    this.getCantidadErrores= function(){
        return this.Tabla.length;
    };
    this.getError=function(i){
        return this.Tabla[i];
    };
    this.MostrarError = function(){
        //Aqui tengo que generar el reporte de errores
    };
}