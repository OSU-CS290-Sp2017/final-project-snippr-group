var searchContainer = document.querySelector('.snipSearch');
var searchBySelect = document.querySelector('#search-by');
var searchInput = document.querySelector('#search-input');

var searchOptions = {};

function initSearchOptions(){
    var inputs = document.getElementsByClassName('search-option');

    console.log(inputs.length);
    for(var i = 0; i < inputs.length; i++){
        if(inputs[i].id.indexOf('search-') !== -1){
            //Element is a search input
            var val = inputs[i].id.substring(7);
            console.log('search input found:', val);
            searchOptions[val] = inputs[i];
            inputs[i].style.display = 'none';
            
            var newOption = document.createElement('option');
            newOption.appendChild(document.createTextNode(val));
            searchBySelect.appendChild(newOption);
        }
    }
}

function showSearchOption(){
    var value = searchBySelect.value;
    searchInput.removeChild(searchInput.firstChild);
    searchInput.appendChild(searchOptions[value]);
}

initSearchOptions();
searchBySelect.onchange = function(){};