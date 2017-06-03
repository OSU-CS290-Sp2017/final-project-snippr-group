var styleSelect = function() {return document.getElementById('styleSelect-menu');};

function loadStyle(styleName){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            console.log('loaded', styleName);
            document.getElementById('highlight-style').innerHTML = this.responseText;
        }
    }

    xhttp.open('GET', './highlight/styles/' + styleName + ".css", true);
    xhttp.send();
}

function loadEvent(){
    var style = styleSelect().value;
    console.log('loading', style);
    loadStyle(style);
}

loadEvent();
styleSelect().onchange = loadEvent;