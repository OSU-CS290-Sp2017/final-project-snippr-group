var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

function loadStyles(){
    var stylesList = fs.readdirSync('./public/highlight/styles');

    for(var i = 0; i < stylesList.length; i++){
        stylesList[i] = stylesList[i].split('.')[0];
    }

    fs.writeFileSync('./public/highlight/styleNames.txt', stylesList.join('\n'));

    return stylesList;
}

var header = hbs.render('views/partials/header.handlebars', loadStyles());
header
.catch(function (err) {console.log("ERROR PRECOMPILING HEADER", err)})
.then(function (val) {fs.writeFileSync('./views/partials/headerPre.handlebars', val)});

// ----- Setting up Express routing -----

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('*', function(req, res, next){
    console.log('GETTING', req.url);
    next();
});

app.get('/', function(req, res){
    res.status(200);
    var args = exData;
    res.render('snipMany', args);
});

app.use(expr.static(path.join(__dirname, 'public')));

// ----- starting server -----

loadStyles();
app.listen(port, function(){
    console.log('Server started on', port);
});