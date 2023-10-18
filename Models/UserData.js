class UserData{
    constructor(contacts, coin){
        if (contacts == null) {
            contacts = [];
        }
    
        if (coin == null || coin < 0) {
            coin = -1;
        }

        this.contacts = contacts;
        this.coin = coin;
    }
}

module.exports = UserData;