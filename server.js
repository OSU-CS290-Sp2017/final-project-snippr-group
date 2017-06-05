// ----- global state / libraries -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

var snipCount = 0;
var styles = 0;

// ----- startup computations -----

function loadStyles(){
    var stylesList = [];
    var groupsList = [];
    var filesList = fs.readdirSync('./public/highlight/styles');

    //only css files allowed
    filesList = filesList.filter((x) => {return x.indexOf('.css') >= 0});

    for(var i = 0; i < filesList.length; i++){
        var val = filesList[i].split('.')[0];
        var nested = false;
        var name = val.replace('-', ' ');

        var contained = [];
        var title = name.split(' ')[0];
        var j = i;
        while(filesList[j].split('-')[0] === title){
            var subName = filesList[j].replace('-', ' ').split('.')[0];
            contained.push({'name': subName, 'val': filesList[j].split('.')[0]});
            nested = contained.length > 1;
            j++;
        }

        if(nested){
            stylesList.push({'name':title, 'val':contained.reverse(), 'nested':true});
            i = j;
        }
        else
            stylesList.push({'name':name, 'val':val, 'nested':false});
    }

    console.log('loaded', filesList.length, 'styles,', stylesList.length, 'unique styles');

    return stylesList;
}

function setSnipID(snip){
    snip['id'] = snipCount;
    snipCount++;
    console.log('Snip', snipCount-1, 'ID set');
}

for(var i = 0; i < exData.length; i++){
    setSnipID(exData[i]);
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

app.use(expr.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
    res.status(404);
    console.log('could not GET', req.url, '\n');
    res.send();
})

// ----- starting server -----

app.listen(port, function(){
    console.log('Server started on', port);
});