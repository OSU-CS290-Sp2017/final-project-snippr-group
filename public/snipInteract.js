function getAllReact(){
    var toReturn = [];

    var reactContainers = document.getElementsByClassName('react-buttons');
    for(var i = 0; i < reactContainers.length; i++){
        toReturn.push(
            {
                'id': reactContainers[i].parentElement.id,
                'actions':
                {
                    'like': reactContainers[i].querySelector('#button-like'),
                    'funny': reactContainers[i].querySelector('#button-funny'),
                    'cool': reactContainers[i].querySelector('#button-cool'),
                    'wat': reactContainers[i].querySelector('#button-wat')
                }            
            }
        );
    }

    return toReturn;
}

function postUpdate(id, item){
    var post = new XMLHttpRequest();

    post.open('POST', '/api/update');
    post.setRequestHeader('Content-Type', 'application/json');

    post.send(JSON.stringify({ 'id': id, 'item': item }));
}

function initReact(reactObject){
    Object.keys(reactObject.actions).forEach( function(k) {
        reactObject.actions[k].onclick = function(){
            postUpdate(reactObject.id, k);
        };
    });
}

getAllReact().forEach(initReact);