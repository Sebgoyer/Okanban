const tagsModule = {
    makeTagInDOM(tag) {
        const template = document.getElementById('template-tag');
        const newTag = document.importNode(template.content, true);
        newTag.querySelector('.tag--name').textContent = tag.name;
        newTag.querySelector('.tag').style.background = tag.color;
        const cardElement = document.querySelector(`[card-id='${tag.card_has_tag.card_id}']`);
       
        cardElement.querySelector('.tags').appendChild(newTag);
    }
};

module.exports = tagsModule;