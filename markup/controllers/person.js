exports.person = {
    list: {
        alias: 'persons',
        template: 'person/list.html.twig',
        models: ['person']
    },
    show: {
        alias: 'person-show',
        template: 'person/show.html.twig',
        models: ['person'],
        isActive: false
    }
};