//#######################
//## A R I T M E T I C A 
//#######################
function Aritmetica(x, y, z,Linea) {
    this.Linea = Linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'aritmetica',this.Linea);
    };
    this.RecuperarErrores = function(ErroresPadre){
        ErroresPadre.AgregarErrores(this.Errores);

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
    this.type = function(){
        return 'aritmetica';
    };
}
//#####################
// R E L A C I O N A L
//#####################
function Relacional (x, y, z,Linea) {
    this.Linea = Linea;
    this.Izq = x; 
    this.Der = y; 
    this.Op = z; 
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Relacional',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {        
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValIzq = this.Izq.Ejecutar(EntornoPadre);
        let ValDer = this.Der.Ejecutar(EntornoPadre);
        if(ValIzq==null || ValDer ==null){            
            this.AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
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
        this.AgregarError("No se puede realizar operacion "+this.Op+" entre "+ValIzq+" y "+ValDer);
        return null;
    };
    this.type = function(){
        return 'relacional';
    };
}
//#############
//N U M E R O
//#############
function Numero(x,Linea) {
    this.Linea = Linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Numero',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {   
        ErroresPadre.AgregarErrores(this.Errores);     
    };
    this.Ejecutar = function(EntornoPadre){
        return this.Valor;
    };
    this.type = function(){
        return 'numero';
    };
}
//##################
// C A R A C T E R 
//##################
function Caracter(x,Linea) {
    this.Linea = Linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Caracter',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        return this.Valor;
    };
    this.type = function(){
        return 'caracter';
    };
}
//#################
// T E M P O R A L
//#################
function Temporal(x,Linea) {
    this.Linea = Linea;
    this.Valor = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Temporal',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let Contador = EntornoPadre.getContador();
        if(this.Valor!='H'&&this.Valor!='h'&&this.Valor!='P'&&this.Valor!='p'){
            return EntornoPadre.Temporales.GetValorTemporal(this.Valor+'_'+Contador);//Valor guarda el nombre del temporal t(n)
        }else{
            return EntornoPadre.Temporales.GetValorTemporal(this.Valor);//Valor guarda el nombre del temporal t(n)
        }
        
    };
    this.type = function(){
        return 'temporal';
    };
}
//################
// L I M P I A R
//################
function Limpiar(x,y,Linea) {
    this.Linea = Linea;
    this.Inicio = x; 
    this.Tam=y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Limpiar',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let I = this.Inicio.Ejecutar(EntornoPadre);
        let T = this.Tam.Ejecutar(EntornoPadre);
        EntornoPadre.Stack.Limpiar(I,T);
    };
    this.type = function(){
        return 'limpiar';
    };
}
//##################
// I M P R I M I R
//##################
function Imprimir(x,y,Linea) {
    this.Linea = Linea;
    this.CharTerminal = x; 
    this.Valor = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Imprimir',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
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
    this.type = function(){
        return 'imprimir';
    };
}
//############################
// L L A M A D A M E T O D O
//############################
function LLamadaMetodo(x,Linea) {
    this.Linea = Linea;
    this.Identificador = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'LLamadaMetodo',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let Instrucciones = EntornoPadre.Instrucciones;
        Instrucciones.EjecutarMetodo(EntornoPadre,this.Identificador);
        //Instrucciones.RecuperarErrores(this.Errores);
    };
    this.type = function(){
        return 'llamadametodo';
    };
}
//####################################
// D E C L A R A C I O N M E T O D O
//####################################
function DeclaracionMetodo(x,y,Linea) {
    this.Linea = Linea;
    this.Identificador = x;
    this.Instrucciones = new Instrucciones(y,-1);    
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'DeclaracionMetodo',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        //HACER COMPROBACION PARA VER SI YA EXISTE EL METODO
        /*if(EntornoPadre.ExisteMetodo(this.Identificador)){
            this.AgregarError("Ya se declaro una funcion con este nombre: "+Identificador);
            return;
        }
        EntornoPadre.AgregarMetodo(this.Identificador,this);*/
    };
    this.type = function(){
        return 'declaracionmetodo';
    };
}
//###################################################
// S A L T O C O N D I C I O N A L V E R D A D E R O
//###################################################
function SaltoCondicionalVerdadero(x,y,Linea){
    this.Linea = Linea;
    this.Relacional=x;
    this.Salto = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoCondicionalVerdadero',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){        
        let ValRelacional = this.Relacional.Ejecutar(EntornoPadre);
        if(!(typeof(ValRelacional) == 'boolean')){
            this.AgregarError('Se esperaba un valor booleano')
            return false;
        }
        if(ValRelacional){
            return true;
        }else{
            return false;
        }
    };
    this.type = function(){
        return 'saltocondicionalverdadero';
    };
}
//############################################
// S A L T O C O N D I C I O N A L F A L S O
//############################################
function SaltoCondicionalFalso(x,y,Linea) {
    this.Linea = Linea;
    this.Relacional=x;
    this.Salto = y;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoCondicionalFalso',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let ValRelacional = Relacional.Ejecutar(EntornoPadre);
        if(!(ValRelacional instanceof Boolean)){
            this.AgregarError('Se esperaba un valor booleano')
            return false;
        }
        if(ValRelacional){
            return false;
        }else{
            return true;
        }
    };
    this.type = function(){
        return 'saltocondicionalfalso';
    };
}
//#######################################
// S A L T O   I N C O N D I C I O N A L
//#######################################
function SaltoIncondicional(x,Linea) {
    this.Linea = Linea;
    this.Etiqueta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'SaltoIncondicional',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        
    };
    this.type = function(){
        return 'saltoincondicional';
    };
}
//############
// S A L T O
//############
function Salto(x,Linea) {
    this.Linea = Linea;
    this.Etiqueta = x;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Salto',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(){
        //Etiqueta a donde llega Solo me sirve para guardar la info, no ejeucto nada aca
    };
    this.type = function(){
        return 'salto';
    };
}
//#####################
// A S I G N A C I O N
//#####################
function Asignacion(x,y,tipo,Linea) {
    this.Linea = Linea;
    this.Identificador=x;
    this.Valor = y
    this.Tipo = tipo;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Asignacion',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.Ejecutar = function(EntornoPadre){
        let Contador = EntornoPadre.getContador();
        let ValValor = this.Valor.Ejecutar(EntornoPadre);
        if(this.Tipo =='temporal'){//Asignar un valor a un temporal, numero, expresion o otro temporal
            if(this.Identificador!='H'&&this.Identificador!='h'&&this.Identificador!='P'&&this.Identificador!='p'){
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador+'_'+Contador, ValValor);
            }else{
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValValor);
            }            
            return;
        }else if(this.Tipo=='temporal_heap'){//asignacion de a un temporal un valor del heap
            if(this.Identificador!='H'&&this.Identificador!='h'&&this.Identificador!='P'&&this.Identificador!='p'){
                let ValorRecuperadoStack = EntornoPadre.Heap.getValor(ValValor);
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador+'_'+Contador, ValorRecuperadoStack);
            }else{
                let ValorRecuperadoStack = EntornoPadre.Heap.getValor(ValValor);
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValorRecuperadoStack);
            }            
        }else if(this.Tipo=='temporal_stack'){//Asignacion de un temporal un valor del stack
            if(this.Identificador!='H'&&this.Identificador!='h'&&this.Identificador!='P'&&this.Identificador!='p'){
                let ValorRecuperadoStack = EntornoPadre.Stack.getValor(ValValor);
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador+'_'+Contador, ValorRecuperadoStack);
            }else{
                let ValorRecuperadoStack = EntornoPadre.Stack.getValor(ValValor);
                EntornoPadre.Temporales.SetValorTemporal(this.Identificador, ValorRecuperadoStack);
            }
        }else if(this.Tipo=='heap'){//Asignacion de un espacio en heap de un temporal, o un valor 
            let ValIdentificador = this.Identificador.Ejecutar(EntornoPadre);
            EntornoPadre.Heap.SetValor(ValIdentificador,ValValor);
        }else if(this.Tipo=='stack'){//Asignacion de un espacio en stack de un temopral o un valor
            let ValIdentificador = this.Identificador.Ejecutar(EntornoPadre);
            EntornoPadre.Stack.SetValor(ValIdentificador,ValValor);
        }
    };
    this.type = function(){
        return 'asignacion';
    };
}
//############################
// I N S T R U C C I O N E S
//############################
function Instrucciones(lista,Linea) {
    this.Linea = Linea;
    this.Lista = lista;
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Instrucciones',this.Linea);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        
    };
    this.Ejecutar = function(EntornoPadre){
        let EtiquetaEncontrada = true;
        let EtiquetaBuscada = '';
        let ListaSaltos = {};
        for(let i=0;i<this.Lista.length;i++){
            if(this.Lista[i].type()=='salto'){
                ListaSaltos[this.Lista[i].Etiqueta]=i;
            }
        }
        for(let i=0;i<this.Lista.length;i++){
            if((this.Lista[i].type()=='saltocondicionalverdadero'||this.Lista[i].type()=='saltocondicionalfalso')&&EtiquetaEncontrada){
                if(this.Lista[i].Ejecutar(EntornoPadre)){//Retorna true si hara el  salto y false si no
                    EtiquetaBuscada = this.Lista[i].Salto.Etiqueta;
                    EtiquetaEncontrada = false;
                    i = ListaSaltos[EtiquetaBuscada]-1;//Paravolver a recorrerlo desde el principio
                }
            }else if(this.Lista[i].type()=='saltoincondicional'&&EtiquetaEncontrada){
                EtiquetaBuscada = this.Lista[i].Etiqueta;
                EtiquetaEncontrada = false;
                i = ListaSaltos[EtiquetaBuscada]-1;
            }else if(this.Lista[i].type()=='salto'&&!EtiquetaEncontrada){
                if(this.Lista[i].Etiqueta==EtiquetaBuscada){
                    EtiquetaEncontrada = true;
                    EtiquetaBuscada = '';
                }
            }else if(EtiquetaEncontrada){
                this.Lista[i].Ejecutar(EntornoPadre);
            }
        }
    };
    this.EjecutarMetodo = function(EntornoPadre,Identificador){ 
        let Contador = EntornoPadre.getContador();       
        for(let i=0;i<this.Lista.length;i++){
            if(this.Lista[i].type()=='declaracionmetodo'){
                if(this.Lista[i].Identificador==Identificador){
                    Contador++;
                    EntornoPadre.setContador(Contador);
                    let Inst = this.Lista[i].Instrucciones;
                    Inst.Ejecutar(EntornoPadre,Contador);
                    Contador--;
                    EntornoPadre.setContador(Contador);
                    break;
                }
            }            
        }
    };
    this.type = function(){
        return 'instrucciones';
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
            Tam = (this.m.length-Inicio);//Menos uno porque length siempre tiene uno mas que el indice maximo del arreglo
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
    this.Lista = {};
    this.Errores = new Errores3D();
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Manejo temporales',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Errores);
    };
    this.SetValorTemporal=function(temporal,valor){
        this.Lista[temporal] = valor;
    }
    this.GetValorTemporal=function(temporal){
        if(this.Lista[temporal]==undefined){
            return null;
        }
        return this.Lista[temporal];
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
function Entorno3D(Inst){
    this.Instrucciones = Inst;//Es una copia de todas las instrucciones que vienen en el hilo principal del codigo
    this.Temporales = new ListaTemporal3D();
    this.Stack = new Memoria3D();
    this.Heap = new Memoria3D();
    this.Errores = new Errores3D();
    this.Contador = 0;
    this.getContador = function(){
        return this.Contador;
    }
    this.setContador = function(contador){
        this.Contador = contador;
    }
    this.AgregarError = function(descripcion){
        this.Errores.Agregar('semantico',descripcion,'Entorno',-1);
    };
    this.RecuperarErrores= function(ErroresPadre) {
        ErroresPadre.AgregarErrores(this.Error);
    };
    this.VerTablaTexto = function(){
        Texto = '';
        Texto +='\n###############################################################################################################';
        Texto +='\n######################################## REPORTE TABLA DE SIMBOLOS 3D ########################################';
        Texto +='\n##############################################################################################################';
        Texto +='\n';
        let CantidadTemporales = 0;
        for(let temporal in this.Temporales.Lista){
            Texto += '\n'+temporal+' = '+this.Temporales.Lista[temporal]+';';
            CantidadTemporales++;
        }
        Texto+='\n';
        for(let i = 0;i<this.Stack.m.length;i++){
            Texto += '\nStack['+i+'] = '+this.Stack.m[i]+';';
        }
        Texto+='\n';
        for(let i = 0;i<this.Heap.m.length;i++){
            Texto += '\nHeap['+i+'] = '+this.Heap.m[i]+';';
        }
        alert('Posee '+CantidadTemporales+' temporales, '+this.Stack.m.length+' casillas ocupadas en stack y '+this.Heap.m.length+' casillas ocupadas en Heap');
        return Texto;
    }
    this.VerTablaTextoResumen = function(){
        Texto = '';        
        let CantidadTemporales = 0;
        for(let temporal in this.Temporales.Lista){
            Texto += '\n'+temporal+' = '+this.Temporales.Lista[temporal]+';';
            CantidadTemporales++;
        }
        Texto+='\n';
        for(let i = 0;i<this.Stack.m.length;i++){
            Texto += '\nStack['+i+'] = '+this.Stack.m[i]+';';
        }
        Texto+='\n';
        for(let i = 0;i<this.Heap.m.length;i++){
            Texto += '\nHeap['+i+'] = '+this.Heap.m[i]+';';
        }
        alert('Posee '+CantidadTemporales+' temporales, '+this.Stack.m.length+' casillas ocupadas en stack y '+this.Heap.m.length+' casillas ocupadas en Heap');
        alert(Texto);
    }
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
        this.Tabla = this.Tabla.concat(ListaErrores.Tabla);
    };
    this.getCantidadErrores= function(){
        return this.Tabla.length;
    };
    this.getError=function(i){
        return this.Tabla[i];
    };
    this.MostrarError = function(){
        let Texto = '';
        for(let i = 0;i<this.Tabla.length;i++){
            Texto += '\nFila: '+this.Tabla[i].getFila()+',  Tipo: '+this.Tabla[i].getTipo()+',  Clase: '+this.Tabla[i].getClase()+',  Descripcion: '+this.Tabla[i].getDescripcion();
        }
        alert('Posee '+this.Tabla.length+' errores')
        return Texto;
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