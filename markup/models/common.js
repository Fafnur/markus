module.exports.asset = function (param) { return '/' + param; };

module.exports.mainMenu = [
    {
        title: 'Home',
        route:  'homepage'
    },
    {
        title: 'Persons',
        route:  'person_list'
    },
    {
        title: 'Person single',
        route:  'person_show'
    },
    {
        title: 'Contacts',
        route:  '#contacts'
    }
];