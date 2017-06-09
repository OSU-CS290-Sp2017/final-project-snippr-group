// ----- global values / libraries / requires -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');
var styles = require('./loadStyles.js');
var search = require('./search.js');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

var snipCount = 0;

// ----- helping functions -----

function fits(s1, s2)
{
  return s1.toLowerCase().includes(s2.toLowerCase());
}
/*
* Get snips. TODO: Get from server.
*/
function getSnips() {
  return exData;
}

/*
* Add snip TODO: Put on server
*/
function putSnip(snip) {
  exData.push(snip);
  initSnip(snip);
}

function shortenSnip(snip){
    var toReturn = JSON.parse(JSON.stringify(snip)) //deep copy
    if(toReturn.description.length > 100){
        toReturn.description =
            toReturn.description
            .substring(0, 140)
            + '...';
    }
    if(toReturn.comments.length > 5){
        toReturn.comments = toReturn.comments.slice(0, 5);
    }
    return toReturn;
}

// sets the ID for the snip so that it may be referenced by URL
function initSnip(snip){
    snip['id'] = snipCount;
    snipCount++;

    snip['react'] = { 'like':0, 'funny':0, 'cool':0, 'wat':0 };

    console.log('Snip', snipCount-1, 'ID set');
}

// ----- startup computations -----

app.use(bodyParser.json());

getSnips().forEach(initSnip);

// for(var i = 0; i < getSnips().length; i++){
//     initSnip(getSnips()[i]);
// }

var header = hbs.render('./views/partials/header.handlebars', styles.load('./node_modules/highlight.js/styles'));

header
.catch(function (err) { console.log("ERROR PRECOMPILING HEADER", err) })
.then(function (val) { fs.writeFileSync('./views/partials/headerPre.handlebars', val) });

// ----- Setting up Express routing -----
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('*', function(req, res, next){
    console.log('GETTING', req.url);
    next();
});

app.get('/', function(req, res){
    res.status(200);
    var args = getSnips().map(shortenSnip);
    res.render('snipMany', args);
});

app.get('/single/:id', function(req, res, next){
    res.status(200);
    var idx = parseInt(req.params.id);

    if(isNaN(idx) || idx < 0 || idx >= snipCount){
        console.log('Snip DNE:', idx);
        next();
    }
    else{
        res.render('snipSingle', getSnips()[idx]);
    }
});

app.get('/create', function(req, res){
  res.status(200);
  res.render('snipCreate');
});

app.get('/search', function(req, res){
    res.status(200);
    res.render('snipSearch');
})

app.get('/style/:fname', function(req, res, next){
    res.status(200);
    fs.readFile('./node_modules/highlight.js/styles/'+req.params.fname, function(err, data){
        if(err){
            console.log(err);
            next();
        }
        else{
            res.write(data);
            res.end();
        }
    });
});

app.get('/api/search', function(req, res){
  var snips = getSnips();
  var parts = req.body;
  res.render('snipMany', search(parts, snips));
});

app.post('/api/snip', function(req, res){
  var snip = req.body;
  putSnip(snip);
  res.sendStatus(200);
});

app.post('/api/update', function(req, res){
    var data = req.body;

    getSnips().forEach( function (s){
        if(s.id == data.id){
            console.log('found');

            if(data.item === 'comment')
                s.comments.unshift({'content': data.content});
            else if(data.item === 'react')
                s.react[data.content]++;
        }
    });

    res.sendStatus(200);
})

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
