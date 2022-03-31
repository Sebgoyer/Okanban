const List = require('./list');
const Card = require('./card');
const Tag = require('./tag');

List.hasMany(Card, {
    as: 'cards',
    
});

Card.belongsTo(List, {
    as: 'list',
    
    foreignKey: 'list_id'
});

Card.belongsToMany(Tag, {
    as: 'tags',
    through: 'card_has_tag',
    foreignKey: 'card_id',
    otherKey: 'tag_id'
});

Tag.belongsToMany(Card, {
   
    as: 'cards',
    through: 'card_has_tag',
    foreignKey: 'tag_id',
    otherKey: 'card_id'
});

module.exports = { Card, Tag, List };