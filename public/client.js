var styleSelect = function() {return document.getElementById('styleSelect-menu');};

var cacheStyles = {};

function loadStyle(styleName){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log('loaded', styleName);
            cacheStyles[styleName] = this.responseText;
            document.getElementById('highlight-style').innerHTML = this.responseText;
        }
    }

    xhttp.open('GET', './highlight/styles/' + styleName + ".css", true);
    xhttp.send();
}

function loadEvent(){
    var style = styleSelect().value;
    console.log('loading', style);
    getStyle(style);
}

function getStyle(styleName){
    if(Object.keys(cacheStyles).indexOf(styleName) === -1){
        console.log('retrieving', styleName);
        loadStyle(styleName);
    }
    else{
        console.log('from cache', styleName);
        document.getElementById('highlight-style').innerHTML = cacheStyles[styleName];
    }
}

loadEvent();
styleSelect().onchange = loadEvent;