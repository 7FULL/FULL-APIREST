class UserData{
    constructor(contacts, coins, user, items, streamKey){
        if (contacts == null) {
            contacts = [];
        }

        if (items == null) {
            items = [];
        }
    
        if (coins == null || coins < 0) {
            coins = -1;
        }

        if (streamKey == null) {
            streamKey = this.generateStreamKey();
        }

        this.contacts = contacts;
        this.coins = coins;
        this.user = user;
        this.items = items;
        this.streamKey = streamKey;
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

    generateStreamKey(){
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}

module.exports = UserData;