// ----- global state / libraries -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');
var style = require('./loadStyles.js');
var bParser = require('body-parser');

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

var snipCount = 0;
var styles = 0;

// ----- startup computations -----

function setSnipID(snip){
    snip['id'] = snipCount;
    snipCount++;
    console.log('Snip', snipCount-1, 'ID set');
}

for(var i = 0; i < exData.length; i++){
    setSnipID(exData[i]);
}

var header = hbs.render('views/partials/header.handlebars', style.load('./public/highlight/styles'));

header
.catch(function (err) {console.log("ERROR PRECOMPILING HEADER", err)})
.then(function (val) {fs.writeFileSync('./views/partials/headerPre.handlebars', val)});

// ----- Setting up Express routing -----

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(bParser.json());

app.get('*', function(req, res, next){
    console.log('GETTING', req.url);
    next();
});

app.get('/', function(req, res){
    res.status(200);
    var args = exData;
    res.render('snipMany', args);
});

app.get('/single/[0-9]+', function(req, res, next){
    res.status(200);
    var idx = parseInt(req.url.match('[0-9]+')[0]);

    if(isNaN(idx) || idx < 0 || idx >= snipCount){
        console.log('Snip DNE:', idx);
        next();
    }
    else{
        res.render('snipSingle', exData[idx]);
    }
});

app.get('/create', function(req, res){
    res.status(200);
    res.render('snipCreate');
});

app.post('/new', function(req, res){
    console.log(req.body);
    res.send('success');
});

app.use(expr.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
    res.status(404);
    console.log('could not GET', req.url, '\n');
    res.send();
});

// ----- starting server -----

app.listen(port, function(){
    console.log('Server started on', port);
});