const utils = require('./utils');
const cardsModule = require('./cardsModule');
const listsModule = require('./listsModule');

const app = {
    init() {
        cardsModule.init();
        listsModule.init();
        app.addListenerToActions();
    },

    addListenerToActions() {
        const closeModalButtons = document.querySelectorAll('.close');
        for (let button of closeModalButtons) {
            button.addEventListener('click', utils.hideModals);
        }
    },
};

document.addEventListener('DOMContentLoaded', app.init);