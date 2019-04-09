//#########################
//## A R I T E M E T I C A 
//#########################
function Aritmetica (x, y, z,linea) {
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
        let ValIzq = this.Izq.Ejecutar();
        let ValDer = this.Der.Ejecutar();
        if(ValIzq==null || ValDer ==null){            
            AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
            return null;
        }
        switch(this.Op){
            case '+':return ValIzq+ValDer;
            case '-':return ValIzq-ValDer;
            case '*':return ValIzq*ValDer;
            case '/':return ValIzq/ValDer;
            case '%':return ValIzq%ValDer;
        }
        AgregarError("No se puede realizar la operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
        return null;
    };
}
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
            AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
            return null;
        }
        switch(this.Op){
            case '<':return ValIzq<ValDer;
            case '>':return ValIzq>ValDer;
            case '<=':return ValIzq<=ValDer;
            case '>=':return ValIzq>=ValDer;
            case '==':return ValIzq==ValDer;
            case '!=':return ValIzq!=ValDer;
        }
        AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
        return null;
    };
}
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
        return this.Valor;
    };
}
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
        return this.Valor;
    };
}
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
        if(Valor!=null){
            Valor.RecuperarErrores(ErroresPadre);
        }
    };
    this.Ejecutar = function(EntornoPadre){        
        let ValValor = this.Valor.Ejecutar(EntornoPadre);        
        if(ValValor==null){            
            AgregarError("No se pudo recuperar el valor a imprimir");
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
    this.Ejecutar = function(){
        return this.Valor;
    };
    /*if(!EntornoPadre.FuncionExiste((String)this.valor)){
        AgregarError("La funcion No existe");
    }
    Funcion f = EntornoPadre.getFuncion((String)this.valor);        
    if(f.Parametros.size()!=Valores.size()){
        AgregarError("No concuerda la cantidad de parametros con la cantidad de valores");
        return null;
    }
    //Recuperar entorno global y enviarselo al local
    Entorno Local = new Entorno(EntornoPadre.getEntornoGlobal());
    for(int i = 0;i<f.Parametros.size();i++){
        Local.agregar((String)f.Parametros.get(i));
        Object Variable = Valores.get(i).ejecutar(EntornoPadre);
        Valores.get(i).RecuperarErrores(Errores);
        if(Variable==null){
            Local.setValor((String)f.Parametros.get(i), Variable);
        }else if(Variable instanceof LinkedList){                
            Local.setArreglo((String)f.Parametros.get(i), (LinkedList)Variable);                
        }else if(Variable instanceof Objeto){
            Local.setObjeto((String)f.Parametros.get(i), (Objeto)Variable);
        }else{
            Local.setValor((String)f.Parametros.get(i), Variable);
        }
    }
    Local.NivelDetener = 0;
    Local.NivelRetornar = 1;
    int NivelDetenerActual = Local.NivelDetener;
    int NivelRetornarActual = Local.NivelRetornar;        
    for(NodoArbol ins:f.Instrucciones){
        if(ins instanceof Instruccion){                
            ((Instruccion)ins).ejecutar(Local);
        }else if(ins instanceof Expresion){
            ((Expresion)ins).ejecutar(Local);
        }
        ins.RecuperarErrores(Errores);
        if(Local.NivelDetener<0){
            AgregarError("Se coloco detener y no se encuentra dentro de una instruccion selecciona");
            Local.RecuperarErrores(Errores);
            return null;
        }
        if(Local.NivelRetornar<0){
            AgregarError("Se coloco retornar y dio un error al hacer retorno");
            Local.RecuperarErrores(Errores);
            return null;
        }
        if(NivelDetenerActual != Local.NivelDetener){
            Local.RecuperarErrores(Errores);
            return null;
        }
        if(NivelRetornarActual!=Local.NivelRetornar){
            Local.RecuperarErrores(Errores);
            return Local.ValorRetorno;//El valor de retorno se almacena en esta variable global
        }
    }
    Local.RecuperarErrores(Errores);
    return null;*/
}
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
    this.Ejecutar = function(){
        return this.Valor;
    };
}
function SaltoCondicionalVerdadero(x,y,linea) {
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
    this.Ejecutar = function(){
        //:'v
    };
}
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
        //:'v
    };
}
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
        //:'v
    };
}
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
        //:'v        
    };
}
function Asignacion(x,y,linea) {
    this.Linea = linea;
    this.Identificador=x;
    this.Valor = y;
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
        let ValValor = Valor.Ejecutar(EntornoPadre);
        EntornoPadre.setValor(this.Identificador, this.Val);        
    };
}
function Instrucciones(lista,inst,linea) {
    this.Linea = linea;
    this.Lista = [];
    if(linea==undefined){
        this.Lista = [lista]//Si linea viene undefined es porque vienen los parametros(inst, linea)
    }else{        
        Lista = lista.Lista;//Si viene inst correcto se agrega a la lista que ya llevamos        
        Valor.push(inst);        
    }
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Instrucciones',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        for(let i=0;i<this.Lista.length;i++){
            this.Lista[i].RecuperarErrores;
        }
    };
    this.Ejecutar = function(){        
        for(let i=0;i<this.Lista.length;i++){
            this.Lista[i].Ejecutar();
        }
    };
}
function BloqueInstrucciones(x,linea) {
    this.Linea = linea;
    this.Instrucciones = (x==null)? []:x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'BloqueInstrucciones',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        if(Instrucciones!=null){
            Instrucciones.Ejecutar(ErroresPadre);
        }
    };
    this.Ejecutar = function(){
        this.Instrucciones.Ejecutar(EntornoPadre);
    };
}

//#########################################################
//## CLASES PARA EL FUNCIONAMIENTO GENERAL DEL CODIGO 3D ##
//#########################################################
function Entorno(){
    this.Nodos = [];
    this.TablaPadre = null;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Entorno',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        if(Instrucciones!=null){
            for(let i =0;i<Nodos.length;i++){
                Nodos[i].RecuperarErrores();
            }
        }
    };
    this.AgregarTemporal = function(Identificador,Valor){
        let Nodo = new Simbolo(Identificador,Valor,'temporal');
        Nodos.push(Nodo);
    }
    this.AgregarMetodo = function(Identificador,Inst){
        let Nodo = new Simbolo(Identificador,Inst,'metodo');
        Nodos.push(Nodo);
    }
    this.ExisteTemporal=function(temporal){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == temporal&&Nodos[i].TipoSimbolo=='temporal'){
                return true;
            }
        }
        return false;
    }
    this.ExisteMetodo=function(Identificador){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == Identificador&&Nodos[i].TipoSimbolo=='metodo'){
                return true;
            }
        }
        return false;
    }
    this.getValor = function(temporal){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == temporal&&Nodos[i].TipoSimbolo=='temporal'){
                return Nodos[i].getValor();
            }
        }
        return undefined;
    }
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
    }
    this.setMetodo = function(Identificador,Valor){
        for(let i =0;i<Nodos.length;i++){
            if(Nodos[i].Identificador == Identificador&&Nodos[i].TipoSimbolo=='metodo'){
                return Nodos[i].setValor(Valor);
            }
        }
    }
}

function Simbolo(Id,Val,tipo){
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
        this.Errores.Agregar('semantico',descripcion,'Temporal',this.linea);
    };
    this.RecuperarErrores= function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores); 
    };
    
}
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