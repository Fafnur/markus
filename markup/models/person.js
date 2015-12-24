function Person(id, name, isActive, image) {
    this.id = id;
    this.name = name;
    this.isActive = isActive;
    this.image = image;
}

module.exports.persons = [
    new Person(1, 'Ivan',  true,  'images/persons/person1.jpg'),
    new Person(2, 'Max',   false, 'images/persons/person2.jpg'),
    new Person(3, 'Igor',  true,  'images/persons/person3.jpg'),
    new Person(4, 'Semen', false, 'images/persons/person4.jpg')
];