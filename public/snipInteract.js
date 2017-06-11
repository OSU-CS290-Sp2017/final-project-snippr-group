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
                    'like': 
                    {
                        'element': snips[i].querySelector('#button-like'),
                        'used': false,
                        'count': snips[i].querySelector('#like-count')
                    },
                    'funny': 
                    {
                        'element': snips[i].querySelector('#button-funny'),
                        'used': false,
                        'count': snips[i].querySelector('#funny-count')
                    },
                    'cool': 
                    {
                        'element': snips[i].querySelector('#button-cool'),
                        'used': false,
                        'count': snips[i].querySelector('#cool-count')
                    },
                    'wat': 
                    {
                        'element':snips[i].querySelector('#button-wat'),
                        'used': false,
                        'count': snips[i].querySelector('#wat-count')
                    }
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

function setClientComment(elem, item){
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = commentTemplate;
    var comment = tempDiv.childNodes[0];
    comment.querySelector('.comment-content').appendChild(document.createTextNode(item));

    elem.insertBefore(comment, elem.firstChild);
}

function incrementCount(elem){
    elem.count.innerHTML = parseInt(elem.count.innerHTML) + 1;
}

function initReact(reactObject){
    Object.keys(reactObject.actions).forEach( function(key) {
        reactObject.actions[key].element.onclick = function(){
            if(reactObject.actions[key].used) { return; }
            postUpdate(reactObject.id, 'react.'+key, parseInt(reactObject.actions[key].count.innerHTML)+1);
            incrementCount(reactObject.actions[key]);
            reactObject.actions[key].used = true;
        };
    });

    reactObject.comment.submit.onclick = function() {
        if(reactObject.comment.input.value !== ''){
            postUpdate(reactObject.id, 'comment', reactObject.comment.input.value);
            setClientComment(reactObject.comment.container, reactObject.comment.input.value);
            incrementCount(reactObject.comment);
        }
    };
}

getAllReact().forEach(initReact);