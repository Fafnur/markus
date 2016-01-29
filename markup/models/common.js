module.exports.asset = function (param) { return '/' + param; };

module.exports.mainMenu = {
    item1: {
        title: 'Home',
        route:  'homepage'
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