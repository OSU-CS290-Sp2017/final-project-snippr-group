var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');

var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

app.engine('handlebars', exhbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.get('/', function(req, res){
    res.status(200);
    var args = exData;
    res.render('snipMany', args);
});

app.use(expr.static(path.join(__dirname, 'public')));

app.listen(port, function(){
    console.log('Server started on', port);
});