var mongoControl = require('mongodb');
var exData = require('./exampleData.json');
var mongoClient = mongoControl.MongoClient;

// Connection URL
var mongoHost = process.env.MONGO_HOST
var mongoPort = process.env.MONGO_PORT||27017
var mongoUser = process.env.MONGO_USER
var mongoPassword = process.env.MONGO_PASSWORD
var mongoDBName = process.env.MONGO_DB

var connectionComplete = false;
var mongoDB;
var url = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;

// ----- helping functions -----

var snipCount = 0;
// sets the ID for the snip so that it may be referenced by URL
function initSnip(snip){
    snip['id'] = snipCount;
    snipCount++;

    snip['react'] = { 'like':0, 'funny':0, 'cool':0, 'wat':0 };

    console.log('Snip', snipCount-1, 'ID set');
}

// ----- building exports -----

// Below are the interface in order to access the database. Implementation is based on whether or not the database can be accessed.
// See the MongoClient.connect call to see implementations.

// Get snips based on mongodb critera
exports.get = (criteria, callback) => {
      callback(exData, undefined);
    };

// Add snip to database
exports.put = (snip) => {
      initSnip(snip);
      exData.push(snip);
    };

//Update a snip on database.
exports.update = (part, content, snipId) => {
      exports.get({id:snipId}, (v, e) => {
        v.forEach( function (s) {
          if(s.id == snipId) {
              console.log('found');

              if(part === 'comment')
                  s.comments.unshift({'content': content})
              else if(part === 'react')
                  s.react[content]++;
          }
        })
      })
    };

// Use connect method to connect to the server
exports.init = () => mongoClient.connect(url, function(err, db) {
  if(err) {
    console.log("Error connecting to database:")
    console.log(err);
    console.log("Using fallback methods...");
    exData.forEach(initSnip);
  }

  else
  {
    console.log("Connected successfully to database");
    mongoDB = db;
    exports.get = (criteria, callback) => {
      mongoDB.find(criteria).toArray(callback);
    }
    exports.put = (snip) => {
      initSnip(snip);
      mongoDB.collection("snips").insert(snip, (err, r) => { if(err) console.log(err) } )
    }
    exports.update = (part, content, snipId) => {
      mongoDB.collection("snips").updateOne({"id": snipId}, {$set: {part:content}}, (err,r) => { if(err) console.log(err) } )
    }
  }
});