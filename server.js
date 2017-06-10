// ----- global values / libraries / requires -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');
var styles = require('./loadStyles.js');
var search = require('./search.js');
var bodyParser = require('body-parser');
var database = require('./mongoDB.js');

var hbs = exhbs.create({defaultLayout: 'main'})
var port = process.env.PORT || 3000;
var app = expr();

// ----- helping functions -----

//shorten long description and comment chains
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

// ----- startup computations -----

app.use(bodyParser.json());

database.init();

var header = hbs.render('./views/precompile/stylesList.handlebars', styles.load('./node_modules/highlight.js/styles'));

header
.catch(function (err) { console.log("ERROR PRECOMPILING HEADER", err) })
.then(function (val) { fs.writeFileSync('./views/partials/stylesList.handlebars', val) })

// ----- Setting up Express routing -----

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('*', function(req, res, next){
    console.log('GET', req.url);
    next();
})

app.get('/', function(req, res) {
    res.status(200);
    var args = database.get({}, (r, e) => res.render('snipMany', r));
})

app.get('/single/:id', function(req, res, next){
    res.status(200);
    var idx = parseInt(req.params.id);

    if(isNaN(idx) || idx < 0) {
        console.log('Snip DNE:', idx);
        next();
    }
    else {
        database.get({id: idx}, function(arr, errs){
            res.render('snipSingle', arr[0]);
        });
    }
})

app.get('/api/search', function(req, res) {
  var search = req.body;
  var snips = database.get(search);
  res.render('snipMany', snips);//search(parts, snips));
});

app.get('/create', function(req, res){
  res.status(200);
  res.render('snipCreate');
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
    })
})

app.get('/create', function(req, res) {
  res.status(200);
  res.render('snipCreate');
})

app.post('/api/snip', function(req, res) {
  var snip = req.body;
  database.put(snip);
  res.sendStatus(200);
})

app.post('/api/update', function(req, res, next) {
    var data = req.body;
    database.update(data.item, data.content, data.id);
})

app.use(expr.static(path.join(__dirname, 'public')));

app.get('*', function(req, res){
    res.status(404);
    console.log('could not GET', req.url);
    res.send();
})

//----- starting server -----
app.listen(port, function(){
    console.log('Server started on port', port);
});
