var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//INICIO CREACION DE GRAMATICA 3D
//Lo realiza una vez que inicia el servidor, si hago el comando
//nodemon start, nodemon estara reiniciandose constantemente porque estoy reescribiendo el archivo
//public/javascripts/Gramatica3D.js
var Parser = require('jison').Parser;
const fs = require('fs');

var grammar = fs.readFileSync("Analisis_3D/Gramatica.jison", "utf8");
var parser = new Parser(grammar);
var parserSource = parser.generate();
if(fs.readFileSync("public/javascripts/Arbol_3D/Gramatica3D.js", "utf8")!=parserSource){
  fs.writeFileSync('public/javascripts/Arbol_3D/Gramatica3D.js',parserSource,function(error){
    if(error){
        console.log('Error al escribir public/javascripts/Arbol_3D/Gramatica3D.js');
    }        
  });
}

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
