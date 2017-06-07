var form = {
    'form': document.getElementById('snip-create'),
    'title': document.getElementById('create-title'),
    'author': document.getElementById('create-author'),
    'code': document.getElementById('create-code'),
    'description': document.getElementById('create-description'),
    'language': document.getElementById('create-language'),
    'submit': document.getElementById('create-submit')
};

function getSubmission(){
    var snip = {
        'title': form.title.value,
        'author': form.author.value,
        'code': {
            'language': form.language.value,
            'code': form.code.value
        },
        'description': form.description.value,
        'comments': []
    }

    return snip;
}

function submitToServer(snip){
    var post = new XMLHttpRequest();

    post.open('POST', '/api/snip', true);
    post.setRequestHeader('Content-Type', 'application/json');

    post.onreadystatechange = function(){
        var params = window.location.search;
        var dest = '/' + params;

        window.setTimeout(function(){
            window.location.href = dest;
        }, 100);
    };
    
    post.send(JSON.stringify(snip));
}

form.submit.onclick = function(){ submitToServer(getSubmission()); };