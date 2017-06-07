// ----- global values / libraries / requires -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');
var styles = require('./loadStyles.js');
var bodyParser = require('body-parser');

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

var snipCount = 0;

// ----- helping functions -----

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
}

/*
* Get snips from the specified locations.
* parts is an array of objects that take the following shapes:
* {path: ["comments", "*"], select: "content", query: "bep"} Go to "comments", iterate over each value in comments. Search for query in content
* {path: [], select:"description", query: "bep"} Look for query in "description1"
* {path: ["code"], select: "code", query: "bep"} Go to "code" look for query in "code"
* {path: ["code"], select: "*", query: "bep"} Go to "code", look for query in each value in "code"
* Pretty sure Haskell would make this a lot easier but then again maybe I just don't know what the hell I'm doing :)))
*/
function searchSnips(parts, snips) {
  var qualify = [];
  for(var i = 0; i < snips.length; i++) {
    var snip = snips[i];
    if(fitsAnyPart(parts, snips)) {
      qualify.push(snip);
    }
  }
  return qualify;
}
//Return true if snip fits any part.
function fitsAnyPart(parts, snips) {
  for(var x = 0; x < parts.length; x++) {
    if(fitsPart(parts[x], snip)) {
      return true;
    }
  }
  return false;
}

//Parse part and returns true if snip fits part
function fitsPart(part, snip) {
  var o = snip;
  for(var i = 0; i < part.path.length; i++) {
    if(part.path[i] === "*") {
      //Iterate over each object in o, select.
      return isManyObject(part.select, part.query, o);
    }
    o = o[part.path[i]];
  }
  if(select === "*") {
    return isManyValue(part.query, o)
  }
  return isSelected(part.select, part.query, o);
}

//Returns true if query is in object, for each object[k][key], for k is each value in object.
function isManyObject(key, query, object) {
  for(k in object) {
    if(k[key].contains(query)) {
      return true;
    }
  }
  return false;
}

//Returns true if query is in object, for each object[k], for k is each value in object
function isManyValue(query, object) {
  for(k in object) {
    if(object[k].contains(query)) {
      return true;
    }
  }
  return false;
}
//Returns true if object[key] contains query
function isSelected(key, query, object) {
  return object[key].contains(query);
}

// ----- startup computations -----

function setSnipID(snip){
    snip['id'] = snipCount;
    snipCount++;
    console.log('Snip', snipCount-1, 'ID set');
}

for(var i = 0; i < exData.length; i++){
    setSnipID(exData[i]);
}

var header = hbs.render('views/partials/header.handlebars', styles.load('./public/highlight/styles'));

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

app.get('/api/search', function(req, res){
  var snips = getSnips();
  var parts = req.body;
  res.render('snipMany', searchSnips(parts, snips));
});

app.get('/create', function(req, res){
  res.status(200);
  res.render('snipCreate');
});

app.post('api/snip', function(req, res){
  var snip = req.body
  putSnip(snip);
  res.sendStatus(200);
});

app.use(expr.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get('*', function(req, res){
    res.status(404);
    console.log('could not GET', req.url, '\n');
    res.send();
})

// ----- starting server -----

app.listen(port, function(){
    console.log('Server started on', port);
});
