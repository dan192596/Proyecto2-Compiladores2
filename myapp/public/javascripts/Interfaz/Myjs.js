var NumeroTab = 1;
var PestañaActual ='Tab1';
var ListaEditor = [];
var consola_201404268;
var errores_201404268;
//Codigo para Abrir el archivo
function ManejadorArchivosSeleccionados(evt) {
    var files = evt.target.files;    
    for (var i = 0, f; f = files[i]; i++) {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                Texto = e.target.result.replace(/\n/g,'\\n');
                Texto = Texto.replace(/\r/g,'\\r');
                $('#tab-list').append($('<li class="nav-link active"><a href="#' + theFile.name.split('.')[0].replace(/\s/g,'') + '"onclick = "setTabSeleccionado(\''+ theFile.name.split('.')[0].replace(/\s/g,'')+'\')" role="tab" data-toggle="tab">' + theFile.name.split('.')[0] + '<button class="close" type="button" onclick = "EliminarEditor(\''+ theFile.name.split('.')[0].replace(/\s/g,'')+'\')" title="Cerrar esta pestaña">×</button></a></li>'));
                $('#tab-content').append($('<div class="tab-pane fade in active" id="' + theFile.name.split('.')[0].replace(/\s/g,'') + '"><div id = "' +  theFile.name.split('.')[0].replace(/\s/g,'') + '"></div><script>var editor = CodeMirror(document.getElementById("' +  theFile.name.split('.')[0].replace(/\s/g,'') + '"),{mode: "text/x-java",theme: "base16-dark",lineNumbers: true,value:""});editor.setValue("'+Texto+'");AgregarEditor("' +  theFile.name.split('.')[0].replace(/\s/g,'') + '",editor);</script></div>'));
            };
          })(f);
        reader.readAsText(f);
    }
  }
document.getElementById('AbrirArchivo').addEventListener('change', ManejadorArchivosSeleccionados, false);
//Codigo para guardar o descargar un archivo
function EliminarEditor(nombre){    
    for(let i = 0;i<ListaEditor.length;i++){
        if(ListaEditor[i]['nombre']==nombre){
            let removed = ListaEditor.splice(i,1);            
        }
    }
}
function AgregarEditor(nombre,editor){    
    let elemento = {'nombre':nombre,'editor':editor};
    ListaEditor.unshift(elemento);    
}
function setTabSeleccionado(Pestaña){
    PestañaActual = Pestaña;
}
function Guardar(){    
    var editor=null; 
    for(let i = 0;i<ListaEditor.length;i++){
        if(ListaEditor[i]['nombre']==PestañaActual){
            editor = ListaEditor[i]['editor'];
            break;
        }
    }
    if(editor ==null){
        alert('No encontrado');
        return;
    }
    var texto = editor.getValue('\n');
    var file = new Blob([texto], {type: 'text/plain'});
    var a = document.createElement("a"),
    url = URL.createObjectURL(file);
    a.href = url;
    a.download = PestañaActual+'.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);  
    }, 0);
}

document.getElementById('btn-guardar').addEventListener('click', Guardar, false);

//Codigo para generar el editor de codigo
var editor = CodeMirror(document.getElementById("codeeditor"),{
    mode: "text/x-java",
    theme: "base16-dark",
    lineNumbers: true
  });

//Codigo para que salga el text area de consola
var editor = CodeMirror(document.getElementById("console"),{
    mode: "text/x-java",
    theme: "3024-night",
    lineNumbers: false
  });

$(document).ready(function () {
    //Realizar la traduccion
    $('#btn-compilar').click(function () {
        var editor=null; 
        for(let i = 0;i<ListaEditor.length;i++){
            if(ListaEditor[i]['nombre']==PestañaActual){
                editor = ListaEditor[i]['editor'];
                break;
            }
        }
        if(editor ==null){
            alert('No encontrado');
            return;
        }
        var texto = editor.getValue('\n');
        try {
            var respuesta = parser.parse(String(texto));
            respuesta.Ejecutar();
        } catch (error) {
            alert('Ocurrio un error '+error);
        }        
    });
    //INICIALIZAR EL PRIMER CODEMIRROR
    //Lo realizo aca porque si no manda a llamar la funcion AgregarEditor y esta existe hasta leer el documento
    var editor = CodeMirror(document.getElementById("Tab1"),{
        mode: "text/x-java",
        theme: "base16-dark",
        lineNumbers: true
      });
      AgregarEditor('Tab1',editor);
      //INICIALIZAR CONSOLA
        consola_201404268 = CodeMirror(document.getElementById("consola"),{
        mode: "text/x-java",
        theme: "3024-night",
        lineNumbers: false
        });
        consola_201404268.setSize("1110","200");
      //INICIALIZAR ERRORES
          errores_201404268 = CodeMirror(document.getElementById("errores"),{
            mode: "text/x-java",
            theme: "3024-night",
            lineNumbers: false
          });
          errores_201404268.setSize("1110","200");
    //################################
    //## MANEJO DE ACCIONES DE MENU ##
    //################################
    $('#btn-crear').click(function () {
        var NombreArchivo = prompt("Ingrese El nombre del archivo (Sin espacios)", "");        
        if (NombreArchivo == null || NombreArchivo == "") {
            alert('No se pudo crear la pestaña');
        } else {
            $('#tab-list').append($('<li class="nav-link active"><a href="#' + NombreArchivo.replace(/\s/g,'') + '" onclick = "setTabSeleccionado(\''+NombreArchivo.replace(/\s/g,'')+'\')"role="tab" data-toggle="tab">' + NombreArchivo + '<button class="close" type="button"onclick = "EliminarEditor(\''+NombreArchivo.replace(/\s/g,'')+'\')" title="Cerrar esta pestaña">×</button></a></li>'));
            $('#tab-content').append($('<div class="tab-pane fade in active" id="' + NombreArchivo.replace(/\s/g,'') + '"><div id = "' + NombreArchivo.replace(/\s/g,'') + '"></div><script>var editor = CodeMirror(document.getElementById("' + NombreArchivo.replace(/\s/g,'') + '"),{mode: "text/x-java",theme: "base16-dark",lineNumbers: true,value:""});AgregarEditor("' + NombreArchivo.replace(/\s/g,'') + '",editor);</script></div>'));
        }
    });
    //########################
    //## MANEJO DE PESTAÑAS ##
    //########################    
    //Presionar el boton para crear una nueva tab
    $('#btn-add-tab').click(function () {
        NumeroTab++;
        $('#tab-list').append($('<li class="nav-link active"><a href="#tab' + NumeroTab + '" onclick = "setTabSeleccionado(\'Tab'+NumeroTab+'\')" role="tab" data-toggle="tab">Tab ' + NumeroTab + '<button class="close" type="button" onclick = "EliminarEditor(\'Tab'+NumeroTab+'\')" title="Cerrar esta pestaña">×</button></a></li>'));
        $('#tab-content').append($('<div class="tab-pane fade in active" id="tab' + NumeroTab + '"><div id = "Tab' + NumeroTab + '"></div><script>var editor = CodeMirror(document.getElementById("Tab' + NumeroTab + '"),{mode: "text/x-java",theme: "base16-dark",lineNumbers: true});AgregarEditor("Tab' + NumeroTab + '",editor);</script></div>'));
    });
    //Presionar el boton para cerrar el tab
    $('#tab-list').on('click','.close',function(){        
        var NumeroTab = $(this).parents('a').attr('href');
        $(this).parents('li').remove();
        $(NumeroTab).remove();
        var tabFirst = $('#tab-list a:first');
        tabFirst.tab('show');
        setTabSeleccionado('Tab1')
    });
    var tabFirst = $('#tab-list a:first');
    tabFirst.tab('show');
    setTabSeleccionado('Tab1');
    var SalidaFirst = $('#salida-list a:last');
    SalidaFirst.tab('show');
    var list = document.getElementById("tab-list");
});