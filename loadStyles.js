/*
    This file exports a function that searches through a directory, collecting
    all .css files and grouping them by first word if possible.
*/

var fs = require('fs');

function getName(file){
    file = file.split('.')[0]; //remove extension
    file = file.split('-').join(' '); //turn dashes to spaces
    return file;
}

function getVal(file){
    return file.split('.')[0]; //remove extension
}

function getFirst(file){ //get the first word, for grouping purposes
    return getVal(file).split('-')[0];
}

exports['load'] = function (path){
    var stylesList = [];
    var filesList = fs.readdirSync(path);

    //only css files allowed
    filesList = filesList.filter((x) => {return x.indexOf('.css') >= 0});

    for(var i = 0; i < filesList.length; i++){
        var val = getVal(filesList[i]);
        var nested = false;
        var name = getName(filesList[i]);

        var contained = [];
        var title = getFirst(filesList[i]);
        var j = i;
        while(j < filesList.length && getFirst(filesList[j]) === title) {
            var subVal = getVal(filesList[j]);
            var subName = getName(filesList[j]);
            contained.push({'name': subName, 'val': subVal});
            nested = contained.length > 1;
            j++;
        }

        if(nested){
            stylesList.push({'name':title, 'val':contained.reverse(), 'nested':true});
            i = j-1;
        }
        else
            stylesList.push({'name':name, 'val':val, 'nested':false});
    }

    console.log('loaded', filesList.length, 'styles,', stylesList.length, 'unique styles');
    return stylesList;
};