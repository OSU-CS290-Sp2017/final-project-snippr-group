/*
* Functionality to search for snips based on criteria.
* NOTE: The introduction of mongoDB makes this code DEPRECATED.
*/
/*
* Get snips from the specified locations.
* parts is an array of objects that take the following shapes:
* {path: ["comments", "*"], select: "content", query: "bep"} Go to "comments", iterate over each value in comments. Search for query in content
* {path: [], select:"description", query: "bep"} Look for query in "description1"
* {path: ["code"], select: "code", query: "bep"} Go to "code" look for query in "code"
* {path: ["code"], select: "*", query: "bep"} Go to "code", look for query in each value in "code"
* Pretty sure Haskell would make this a lot easier but then again maybe I just don't know what the hell I'm doing :^)
*
*/

exports = function searchSnips(parts, snips) {
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
