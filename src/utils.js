const utils = {
    base_url: 'http://localhost:3000',

    hideModals() {
        const modals = document.querySelectorAll('.modal')
        for (let modal of modals) {
            modal.classList.remove('is-active')
        }
    }
};

module.exports = utils;