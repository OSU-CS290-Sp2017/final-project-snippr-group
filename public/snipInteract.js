var commentTemplate = "<article class=\"comment\"><div class=\"comment-content\"></div></article>";

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
                    'input': snips[i].querySelector('#comment-input'),
                    'container': snips[i].querySelector('.comments'),
                    'count': snips[i].querySelector('#comment-count')
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

function setClientReact(elem, item){
    var reactCount = elem.querySelector('#' + item + '-count');
    reactCount.innerHTML = parseInt(reactCount.innerHTML) + 1;
}

function setClientComment(elem, item){
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = commentTemplate;
    var comment = tempDiv.childNodes[0];
    comment.querySelector('.comment-content').appendChild(document.createTextNode(item));

    elem.insertBefore(comment, elem.firstChild);
}

function incrementCount(elem, item){
    var count = elem.querySelector('#' + item + '-count');
    count.innerHTML = parseInt(count.innerHTML) + 1;
}

function initReact(reactObject){
    Object.keys(reactObject.actions).forEach( function(key) {
        reactObject.actions[key].onclick = function(){
            postUpdate(reactObject.id, 'react.'+key, parseInt(reactObject.actions[key].querySelector('#'+key+'-count').innerHTML)+1);
            incrementCount(reactObject.actions[key], key);
        };
    });

    reactObject.comment.submit.onclick = function() {
        if(reactObject.comment.input.value !== ''){
            postUpdate(reactObject.id, 'comment', reactObject.comment.input.value);
            setClientComment(reactObject.comment.container, reactObject.comment.input.value);
            incrementCount(reactObject.comment.submit, 'comment');
        }
    };
}

getAllReact().forEach(initReact);