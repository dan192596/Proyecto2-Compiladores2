var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.use(express.static('./myapp/public'));//Direccion de archivos estaticos
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

/*const  os = require('os');
const fs = require('fs');
let cpu = os.cpus();

fs.appendFile('mitocode.txt','Prueba uno',function(error){
    if(error){
        console.log('Tiene error');
    }
})

fs.readFile('archivo.txt','utf-8',function(error,data){
    if(error){
        console.log('Error');
    }else{
        console.log(data);
    }
})*/