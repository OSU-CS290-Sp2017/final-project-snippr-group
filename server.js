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
    var args = database.get({}, (e, r) => res.render('snipMany', r));
})

app.get('/single/:id', function(req, res, next){
    res.status(200);

    database.getById(req.params.id, function(snip){
        console.log(snip);
        res.render('snipSingle', snip);
    });
})

//Search for a snip. Body should be formatted as a mongoDB search object
app.get('/api/search', function(req, res) {
  var search = req.body;
  var snips = database.get(search, (e, r) => res.render('snipMany', snips));
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

app.get('/search', function(req, res){
    res.status(200);
    res.render('snipSearch');
})

//Add a snip to the database.
app.post('/api/snip', function(req, res) {
  var snip = req.body;
  database.put(snip);
  res.sendStatus(200);
})

//Update a snip
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

//Close the connection to mongodb when the server is terminated
process.on('SIGINT', () => {
  if(database.mongoDB)
  {
    console.log("closing database connection")
    database.mongoDB.close();
  }
  process.exit();
})
