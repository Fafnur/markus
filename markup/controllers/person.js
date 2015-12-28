exports.preson = {
    list: {
        name: 'persons',
        template: 'person/list.html.twig',
        models: ['Person']
    },
    show: {
        name: 'person-show',
        template: 'person/show.html.twig',
        models: ['Person']
    }
};