function getAllReact(){
    var toReturn = [];

    var snips = document.getElementsByClassName('snip');
    for(var i = 0; i < snips.length; i++){
        toReturn.push(
            {
                'id': snips[i].attributes.id.value,
                'comment':
                {
                    'submit': snips[i].querySelector('#comment-submit'),
                    'input': snips[i].querySelector('#comment-input')
                },
                'actions':
                {
                    'like': snips[i].querySelector('#button-like'),
                    'funny': snips[i].querySelector('#button-funny'),
                    'cool': snips[i].querySelector('#button-cool'),
                    'wat': snips[i].querySelector('#button-wat')
                }            
            }
        );
    }

    return toReturn;
}

function postUpdate(id, item, content){
    var post = new XMLHttpRequest();

    post.open('POST', '/api/update');
    post.setRequestHeader('Content-Type', 'application/json');

    post.send(JSON.stringify({ 'id': id, 'item': item, 'content':content }));
}

function setClient(elem, item){
    var countElem = elem.querySelector('a')
    countElem.innerHTML = parseInt(countElem.innerHTML) + 1;
}

function initReact(reactObject){
    Object.keys(reactObject.actions).forEach( function(k) {
        reactObject.actions[k].onclick = function(){
            postUpdate(reactObject.id, k);
            setClient(reactObject.actions[k], k);
        };
    });

    reactObject.comment.submit.onclick = function() {
        if(reactObject.comment.input !== '')
            postUpdate(reactObject.id, 'comment', reactObject.comment.input.value);
    };
}

getAllReact().forEach(initReact);