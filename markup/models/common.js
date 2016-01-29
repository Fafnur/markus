module.exports.asset = function (param) { return '/' + param; };
module.exports.path  = function (param) {
    if(ctlsMap.hasOwnProperty(key)) {
        var ctrl = ctlsMap[key];
        var route = ctrl.ctrl + '_' + ctrl.alias;
        if(route == param) {
            return ctrl.alias + '.html';
        }
    }
    return 'index.html';
};

module.exports.mainMenu = {
    item1: {
        title: 'Home',
        route:  'index.html'
    },
    item2: {
        title: 'Persons',
        route:  'person_list'
    },
    item3: {
        title: 'Person single',
        route:  'person_show'
    },
    item4: {
        title: 'Contacts',
        route:  '#contacts'
    }
};