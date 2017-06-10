// ----- global values / libraries / requires -----

var expr = require('express');
var exhbs = require('express-handlebars')
var path = require('path');
var fs = require('fs');
var styles = require('./loadStyles.js');
var search = require('./search.js');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient

var hbs = exhbs.create({defaultLayout: 'main'});
var exData = require('./exampleData.json');
var port = process.env.PORT || 3000;
var app = expr();

var snipCount = 0;

// Connection URL
var mongoHost = process.env.MONGO_HOST
var mongoPort = process.env.MONGO_PORT||27017
var mongoUser = process.env.MONGO_USER
var mongoPassword = process.env.MONGO_PASSWORD
var mongoDBName = process.env.MONGO_DB

var mongoDB;
var url = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;

//Below are the interface in order to access the database. Implementation is based on whether or not the database can be accessed.
//See the MongoClient.connect call to see implementations.

/*
* Get snips based on mongodb critera
*/
var getSnips;

/*
* Add snip to database
*/
var putNewSnip;

/*
* Update a snip on database.
*/
var updateSnip


// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  if(err) {
    console.log("Error connecting to database:")
    console.log(err);
    console.log("Using fallback methods...");
    getSnips = (criteria, callback) => {
      callback(exData, undefined);
    }
    putNewSnip = (snip) => {
      initSnip(snip);
      exData.push(snip);
    }
    updateSnip = (part, content, snipId) => {
      getSnips((v, e) => {
        v.forEach( function (s) {
          if(s.id == data.id) {
              console.log('found');

              if(data.item === 'comment')
                  s.comments.unshift({'content': data.content});
              else if(data.item === 'react')
                  s.react[data.content]++;
          }
        })
      })
    }

  }

  else
  {
    console.log("Connected successfully to database");
    mongoDB = db;
    getSnips = (criteria, callback) => {
      mongoDB.find(criteria).toArray(callback);
    }
    putNewSnip = (snip) => {
      initSnip(snip);
      mongoDB.collection("snips").insert(snip, (err, r) => { if(err) console.log(err) } );
    }
    updateSnip = (part, content, snipId) => {
      mongoDB.collection("snips").updateOne({"id": snipId}, {$set: {part:content}}, (err,r) => { if(err) console.log(err) } )
    }
  }
});

function fits(s1, s2) {
  return s1.toLowerCase().includes(s2.toLowerCase());
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

//getSnips().forEach(initSnip);


// for(var i = 0; i < getSnips().length; i++){
//     initSnip(getSnips()[i]);
// }

var header = hbs.render('views/partials/header.handlebars', styles.load('./public/highlight/styles'));

header
.catch(function (err) { console.log("ERROR PRECOMPILING HEADER", err) })
.then(function (val) { fs.writeFileSync('./views/partials/headerPre.handlebars', val) });

// ----- Setting up Express routing -----
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.get('*', function(req, res, next) {
    console.log('GETTING', req.url);
    next();
});

app.get('/', function(req, res) {
    res.status(200);
    var args = getSnips({});
    res.render('snipMany', args);
});

app.get('/single/[0-9]+', function(req, res, next) {
    res.status(200);
    var idx = parseInt(req.url.match('[0-9]+')[0]);

    if(isNaN(idx) || idx < 0 || idx >= snipCount) {
        console.log('Snip DNE:', idx);
        next();
    }
    else {
        res.render('snipSingle', getSnips()[idx]);
    }
});

app.get('/api/search', function(req, res) {
  var search = req.body;
  var snips = getSnips(search);
  res.render('snipMany', snips);//search(parts, snips));
});

app.get('/create', function(req, res) {
  res.status(200);
  res.render('snipCreate');
});

app.post('/api/snip', function(req, res) {
  var snip = req.body;
  putNewSnip(snip);
  res.sendStatus(200);
});

app.post('/api/update', function(req, res, next) {
    var data = req.body;
    getSnips({id: data.id}).toArray(function(err, found) {
       if(err) {
         res.status(500).send("Error updating: " + err)
       }
       else if(found.length < 1) {
         //Could not find snip
         next();
       }
       else {
         var snip = found[0];
         if(data.item === 'comment') {
             snip.comments.unshift({'content': data.content});
         }
         else if(data.item === 'react') {
             snip.react[data.content]++;
         }
         putSnip(snip);
         res.sendStatus(200);

       }
    });
    // getSnips().forEach( function (s){
    //     if(s.id == data.id){
    //         console.log('found');
    //
    //         if(data.item === 'comment')
    //             s.comments.unshift({'content': data.content});
    //         else if(data.item === 'react')
    //             s.react[data.content]++;
    //     }
    // });

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
