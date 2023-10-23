class UserData{
    constructor(contacts, coins, user, items){
        if (contacts == null) {
            contacts = [];
        }

        if (items == null) {
            items = [];
        }
    
        if (coins == null || coins < 0) {
            coins = -1;
        }

        this.contacts = contacts;
        this.coins = coins;
        this.user = user;
        this.items = items;
    }

    addContact(contact){
        this.contacts.push(contact);
    }

    removeContact(contact){
        const index = this.contacts.indexOf(contact);

        if (index > -1) {
            this.contacts.splice(index, 1);
        }
    }
}

module.exports = UserData;