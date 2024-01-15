const { MongoClient, ServerApiVersion } = require('mongodb');
const UserData = require('../Models/UserData');

class MongoDB {
  constructor() {
    this.uri = "mongodb+srv://fullglobaltech:gbjY7H9OD8Kjh8cE@full.wn7m584.mongodb.net/?retryWrites=true&w=majority";
    this.client = new MongoClient(this.uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    console.log("");
    console.log("Connecting to MongoDB...");
    console.log("");

    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      await this.client.db("admin").command({ ping: 1 });
      console.log("");
      console.log("Connected successfully to MongoDB");
      console.log("");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
    }
  }

  async close() {
    await this.client.close();

    console.log("Connection to MongoDB closed");
  }

  // User Data
  async getUserData(req) {
    const user = req;

    const result = await this.client.db("FULL").collection("User").findOne({ user: user });

    // Convert tu userdata
    if (result == null) {
      // New User insert in DB
      const newUser = {
        user: user,
        contacts: [],
        coins: 100,
        items: []
      };

      await this.client.db("FULL").collection("User").insertOne(newUser);
    
      return new UserData([], 100);
    }

    let streamKey = "";

    // Because we have added a new field to the user data we need to check if the user has the field
    if (result.streamKey == null) {
        // We generate the stream key
        streamKey = this.generateStreamKey();

        // We add the field
        await this.client.db("FULL").collection("User").updateOne({ user: user }, { $set: { streamKey: streamKey } });
    }else{
        // We get the stream key
        streamKey = result.streamKey;
    }

    let topContacts = [];

    //We generate a list of five contacts with the most coins searching in the DB with the id
    for ( let i = 0; i < result.contacts.length; i++) {
      const contact = result.contacts[i];
      const contactData = await this.client.db("FULL").collection("User").findOne({ user: contact.id });

      if (contactData != null) {
        topContacts.push({
          name: contact.name,
          coins: contactData.coins
        });
      }
    }

    // We sort the list
    topContacts.sort((a, b) => {
      return b.coins - a.coins;
    });

    // We get the first five elements
    topContacts = topContacts.slice(0, 5);

    return new UserData(result.contacts, result.coins, result.user, result.items, streamKey, topContacts);
  }

  generateStreamKey(){
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  // Reset User Data
  resetUserData(id){
    // We set the coins back to 100 to the player with the id and we delete all the items
    this.client.db("FULL").collection("User").updateOne({ user: id }, { $set: { coins: 100, items: [] } });
  }

  // Add contact
  async addContact(req) {
    const user = req.user;
    const contact = req.contact;

    // We get the user data
    const userData = await this.getUserData(user);

    // We add the contact
    userData.addContact(contact);

    // We update the user data
    await this.client.db("FULL").collection("User").updateOne({ user: user }, { $set: { contacts: userData.contacts } });

    return userData;
  }

  // Update objects
  async updateObjects(req) {
    const user = req.user;
    const objects = req.data;

    // We get the user data
    const userData = await this.getUserData(user);

    // We update the user data
    await this.client.db("FULL").collection("User").updateOne({ user: user }, { $set: { items: objects } });

    return userData;
  }

    // Update coins
    async updateCoins(req) {
      const user = req.user;
      const coins = req.data;

      // We get the user data
      const userData = await this.getUserData(user);

      // We update the user data
      await this.client.db("FULL").collection("User").updateOne({ user: user }, { $set: { coins: coins } });

      return userData;
    }
}

module.exports = {
    MongoDB
}
