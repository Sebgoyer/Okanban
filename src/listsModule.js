const utils = require('./utils');
const cardsModule = require('./cardsModule');
const tagsModule = require('./tagsModule');
const Sortable = require('sortablejs');

const listsModule = {
    init() {
        listsModule.addListenerToActions();
        listsModule.getListsFromAPI();
    },

    addListenerToActions() {
        const addListButton = document.getElementById('addListButton');
        addListButton.addEventListener('click', listsModule.showAddListModal);

        const addListForm = document.querySelector('#addListModal form');
        addListForm.addEventListener('submit', listsModule.handleAddListForm);
    },

    showAddListModal() {
        const modal = document.getElementById('addListModal');
        modal.classList.add('is-active');
    },

    async handleAddListForm(event) {
        event.preventDefault();

        let data = new FormData(event.target);

        try {
            const response = await fetch(`${utils.base_url}/lists`, {
                method: 'POST',
                body: data
            });

            if (response.status !== 200) {
                const error = await response.json();
                throw error;
            } else {
                const list = await response.json();
                listsModule.makeListInDOM(list.name, list.id);
            }
        } catch (error) {
            alert('Impossible de créer une liste.');
            console.error(error);
        }
        utils.hideModals();
        document.querySelector("#addListModal form input[name='name']").value = '';
    },

    async handleDeleteList(event) {
        if (!confirm("Êtes-vous sûr(e) de vouloir supprimer cette liste ?")) {
            return;
        }

        const listElement = event.target.closest('.panel');
        const listId = listElement.getAttribute('list-id');

        const listHasCards = listElement.querySelectorAll('.box').length;
        if (listHasCards) {
            if (!confirm("Cette liste contient des cartes, êtes-vous sûr(e) de vouloir la supprimer ?")) {
                return;
            }
        }

        try {
            const response = await fetch(`${utils.base_url}/lists/${listId}`, {
                method: 'DELETE'
            });

            if (response.status !== 204) {
                const error = await response.json();
                throw error;
            } else {
                listElement.remove();
            }
        } catch (error) {
            alert('Impossible de supprimer la liste.');
            console.error(error);
        }
    },

    makeListInDOM(listName, listId) {
        const template = document.getElementById('template-list');

        const newList = document.importNode(template.content, true);
        newList.querySelector('h2').textContent = listName;

        newList.querySelector('.column').setAttribute('list-id', listId);
        newList.querySelector("form input[name='list-id']").value = listId;

        newList.querySelector('.button--add-card').addEventListener('click', cardsModule.showAddCardModal);

        const addCardForm = document.querySelector('#addCardModal form');
        addCardForm.addEventListener('submit', cardsModule.handleAddCardForm);

        newList.querySelector('h2').addEventListener('dblclick', listsModule.showEditListForm);

        newList.querySelector('.button--delete-list').addEventListener('click', listsModule.handleDeleteList);

        newList.querySelector('form').addEventListener('submit', listsModule.handleEditListForm);

        document.querySelector('#lists-container').appendChild(newList);
    },

    showEditListForm(event) {
        const listElement = event.target.closest('.panel');
        const formElement = listElement.querySelector('form');

        formElement.querySelector('input[name="name"]').value =
            event.target.textContent;

        event.target.classList.add('is-hidden');
        formElement.classList.remove('is-hidden');
    },

    async handleEditListForm(event) {
        event.preventDefault();

        const data = new FormData(event.target);
        const listElement = event.target.closest('.panel');
        const listId = listElement.getAttribute('list-id');

        try {
            const response = await fetch(`${utils.base_url}/lists/${listId}`, {
                method: 'PATCH',
                body: data
            });

            if (response.status !== 200) {
                const error = await response.json();
                throw error;
            } else {
                const list = await response.json();
                listElement.querySelector('h2').textContent = list.name;
            }
        } catch (error) {
            alert('Impossible de modifier la liste.');
            console.error(error);
        }

        event.target.classList.add('is-hidden');
        listElement.querySelector('h2').classList.remove('is-hidden');
    },

    async handleDropList() {
        document.querySelectorAll('.panel')
            .forEach((listElement, listPosition) => {
                const listId = listElement.getAttribute('list-id');
                let data = new FormData();
                data.set('position', listPosition);
                fetch(`${utils.base_url}/lists/${listId}`, {
                    method: 'PATCH',
                    body: data
                });
            });
    },

    async getListsFromAPI() {
        try {
            const response = await fetch(`${utils.base_url}/lists`);

            if (response.status !== 200) {
                const error = response.json();
                throw error;
            } else {
                const lists = await response.json();

                for (const list of lists) {
                    listsModule.makeListInDOM(list.name, list.id);

                    for (const card of list.cards) {
                        cardsModule.makeCardInDOM(card);

                        for (const tag of card.tags) {
                            tagsModule.makeTagInDOM(tag);
                        }
                    }
                }

                const container = document.querySelector('#lists-container');
                new Sortable(container, {
                    animation: 300,
                    draggable: '.panel',
                    onEnd: listsModule.handleDropList
                });
            }
        } catch (error) {
            alert("Impossible de charger les listes depuis l'API.");
            console.error(error);
        }
    }
};

module.exports = listsModule;