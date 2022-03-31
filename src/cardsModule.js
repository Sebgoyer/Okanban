const utils = require('./utils');

const cardsModule = {
    init() {
        cardsModule.addListenerToActions();
    },

    addListenerToActions() {
        document.querySelector('#editCardModal form').addEventListener('submit', cardsModule.handleEditCardForm);
    },

    showAddCardModal(event) {
        let listElement = event.target.closest('.panel');
        const listId = listElement.getAttribute('list-id');
        const modal = document.getElementById('addCardModal');
        const input = modal.querySelector("input[name='list_id']");
        input.value = listId;
        modal.classList.add('is-active');
    },

    async handleAddCardForm(event) {
        event.preventDefault();

        let data = new FormData(event.target);

        try {
            const response = await fetch(`${utils.base_url}/cards`, {
                method: 'POST',
                body: data
            });

            if (response.status !== 200) {
                const error = await response.json();
                throw error;
            } else {
                const card = await response.json();
                cardsModule.makeCardInDOM(card);
            }
        } catch (error) {
            alert('Impossible de créer une carte.');
            console.error(error);
        }

        utils.hideModals();
        document.querySelector("#addCardModal form input[name='description']").value = '';
    },

    showEditCardModal(event) {
        const cardElement = event.target.closest('.box');
        const cardDescription = cardElement.querySelector('.card-name').textContent;
        const cardId = cardElement.getAttribute('card-id');

        const editCardModalElement = document.getElementById('editCardModal');
        editCardModalElement.classList.add('is-active');
        editCardModalElement.querySelector("input[name='description']").value = cardDescription;
        editCardModalElement.querySelector("input[name='card_id']").value = cardId;
    },

    showEditCardForm(event) {
        const cardElement = event.target.closest('.box');
        const formElement = cardElement.querySelector('form');
        const descriptionElement = cardElement.querySelector('.card-name');

        formElement.querySelector('input[name="description"]').value = descriptionElement.textContent;
        
        descriptionElement.classList.add('is-hidden');
        formElement.classList.remove('is-hidden');
    },

    async handleEditCardForm(event) {
        event.preventDefault();

        const formElement = event.target;

        const cardId = formElement.querySelector("input[name='card_id']").value;

        let data = new FormData(formElement);

        try {
            const response = await fetch(`${utils.base_url}/cards/${cardId}`, {
                method: 'PATCH',
                body: data
            });

            if (response.status !== 200) {
                const error = await response.json();
                throw error;
            } else {
                const card = await response.json();
                utils.hideModals();
            }
        } catch (error) {
            alert('Impossible de modifier la carte.');
            console.error(error);
        }
    },

    async handleDeleteCard(event) {
        if(!confirm("Êtes-vous sûr(e) de vouloir supprimer cette carte ?")) {
            return;
        }

        const cardElement = event.target.closest('.box');
        const cardId = cardElement.getAttribute('card-id');
        
        try {
            const response = await fetch(`${utils.base_url}/cards/${cardId}`, {
                method: 'DELETE'
            });

            if(response.status !== 204) {
                const error = await response.json();
                throw error;
            } else {
                cardElement.remove();
            }
        } catch(error) {
            alert('Impossible de supprimer la carte.');
            console.error(error);
        }
    },

    makeCardInDOM(card) {
        const template = document.getElementById('template-card');

        const newCard = document.importNode(template.content, true);

        newCard.querySelector('.card-name').textContent = card.description;

        newCard.querySelector('.box').setAttribute('card-id', card.id);
        newCard.querySelector('.box').setAttribute('style', `background-color: ${card.color}`);

        newCard.querySelector('.edit-card-btn').addEventListener('click', cardsModule.showEditCardModal);

        newCard.querySelector('.delete-card-btn').addEventListener('click', cardsModule.handleDeleteCard);

        const correctList = document.querySelector(`[list-id='${card.list_id}']`);
        correctList.querySelector('.panel-block').appendChild(newCard);
    }
};

module.exports = cardsModule;