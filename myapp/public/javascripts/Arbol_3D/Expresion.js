function Aritmetica (x, y, z,linea) {
    this.Linea = linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'aritmetica',this.linea);
    };
    this.Ejecutar = function(){
        let ValIzq = this.Izq.Ejecutar();
        let ValDer = this.Der.Ejecutar();
        if(Op1==undefined || Op2 ==undefined){            
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
        return 0;
    };
}
function Relacional (x, y, z,linea) {
    this.Linea = linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z; 
}
function Numero(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Caracter(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Temporal(x,linea) {
    this.Linea = linea;
    this.Valor = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Limpiar(x,y,linea) {
    this.Linea = linea;
    this.Inicio = x; 
    this.Tam=y;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Imprimir(x,y,linea) {
    this.Linea = linea;
    this.CharTerminal = x; 
    this.Valor = y;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function LLamadaMetodo(x,linea) {
    this.Linea = linea;
    this.Identificador = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function DeclaracionMetodo(x,y,linea) {
    this.Linea = linea;
    this.Identificador = x;
    this.Instrucciones = y;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function SaltoCondicionalVerdadero(x,y,linea) {
    this.Linea = linea;
    this.Relacional=x;this.Salto = y;
}
function SaltoCondicionalFalso(x,y,linea) {
    this.Linea = linea;
    this.Relacional=x;
    this.Salto = y;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function SaltoIncondicional(x,linea) {
    this.Linea = linea;
    this.Etiqueta = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Salto(x,linea) {
    this.Linea = linea;
    this.Etiqueta = x;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Asignacion(x,y,linea) {
    this.Linea = linea;
    this.Identificador=x;
    this.Valor = y;
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function Instrucciones(lista,inst,linea) {
    this.Linea = linea;
    this.Lista = ListaInstrucciones(lista, inst); 
    this.Ejecutar = function(){
        return this.Valor;
    }
}
function BloqueInstrucciones(x,linea) {
    this.Linea = linea;
    this.Instrucciones = (x==null)? []:x
    this.Ejecutar = function(){
        return this.Valor;
    }
}

//#########################################################
//## CLASES PARA EL FUNCIONAMIENTO GENERAL DEL CODIGO 3D ##
//#########################################################

function ListaInstrucciones (lista, inst) {
    var Valor = []; //Valor donde se almacenara la lista de valores
    if (inst === undefined) {//Si inst viene undefined es porque es la primera instruccion
        Valor = [ lista ]; //Se ingre el valor en la lista de valores
    } else {
        Valor = lista.Lista;//Si viene inst correcto se agrega a la lista que ya llevamos
        Valor.push(inst);
    }    
    return Valor;
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
    }
    this.getDescripcion = function() {
        return this.descripcion;
    }    
    this.getFila = function() {
        return this.fila;
    }
    this.getClase = function() {
        return this.clase;
    }    
    this.getArchivo = function(){
        if(archivo==null)
            return "";
        return archivo;
    }
}

function Errores3D(){
    this.Tabla = [];
    this.EnviarArchivo = function(archivo){
        for (var i = 0; i < this.Tabla.length; i+=1)
            if(this.Tabla[i].archivo==null)
                this.Tabla[i].archivo = archivo;
    }
    this.Agregar=function(Tipo, Descripcion, Clase, Fila){
        if(Descripcion==undefined&&Clase==undefined&&Fila==undefined){
            Tabla.push(er);//Cuando viene el error completo
        }else{
            let NuevoError = new Error3D(Tipo, Descripcion, Clase, Fila);
            Tabla.push(NuevoError);//Cuando quiero construir el error
        }
    }
    this.AgregarErrores= function(ListaErrores){        
        for(var i=0;i<ListaErrores.getCantidadErrores();i++){
            Tabla.push(ListaErrores.getError(i));
        }            
    }
    this.getCantidadErrores= function(){
        return this.Tabla.length;
    }
    this.getError=function(i){
        return this.Tabla[i];
    }
    this.MostrarError = function(){
        //Aqui tengo que generar el reporte de errores
    }
}