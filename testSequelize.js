require('dotenv').config();
const { Card, Tag, List } = require('./app/models');

(async _ => {

    const list = await List.findByPk(1, {
        include: {
            association: 'cards',
            include: 'tags'
        }
    });
    console.log(list.toJSON());

})()