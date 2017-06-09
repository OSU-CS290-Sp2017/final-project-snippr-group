var styleSelect =  document.getElementById('styleSelect-menu');

var cacheStyles = {};

// ----- helping functions -----

function loadStyle(styleName){
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function(){
        if(this.readyState == 4 && this.status == 200){
            cacheStyles[styleName] = this.responseText;
            document.getElementById('highlight-style').innerHTML = this.responseText;
        }
    }

    xhttp.open('GET', '/highlight/styles/' + styleName + ".css", true);
    xhttp.send();
}

function getStyle(styleName){
    if (history.pushState) {
        var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?style=' + styleName;
        window.history.pushState({path:newurl},'',newurl);
    }

    if(Object.keys(cacheStyles).indexOf(styleName) === -1){
        console.log('retrieving', styleName);
        loadStyle(styleName);
    }
    else{
        console.log('from cache', styleName);
        document.getElementById('highlight-style').innerHTML = cacheStyles[styleName];
    }
}



// ----- event functions -----

function loadEvent(){
    var style = styleSelect.value;
    getStyle(style);
}

function setKeepQuery(elem){
    elem.onclick = (function (e){
        e.preventDefault();
        var params = window.location.search;
        var dest = elem.getAttribute('href') + params;

        window.setTimeout(function(){
            window.location.href = dest;
        }, 100);
    });
    console.log('set keep query');
}

function initStyle(){
    if(window.location.search){
        var query = window.location.search;
        var styleStart = query.indexOf('style');
        styleStart = query.indexOf('=', styleStart) + 1;
        var styleEnd = query.indexOf('&', styleStart);

        var style = query.slice(styleStart, styleEnd === -1 ? undefined : styleEnd);

        if(style === ""){
            styleSelect.value = "obsidian";
        }
        else{
            styleSelect.value = style;
        }
    }
    else{
        styleSelect.value = "obsidian";
    }
}

// ----- script start -----

document.querySelectorAll('[href]').forEach(setKeepQuery);

initStyle();
loadEvent();
styleSelect.onchange = loadEvent;
