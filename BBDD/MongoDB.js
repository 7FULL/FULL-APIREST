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
        coins: 100
      };

      await this.client.db("FULL").collection("User").insertOne(newUser);
    
      return new UserData([], 100);
    }

    const userData = new UserData(result.contacts, result.coin);
    
    return userData;
  }

  // Reset User Data
  resetUserData(id){
    // We set the coins back to 100 to the player with the id
    this.client.db("FULL").collection("User").updateOne({ user: id }, { $set: { coins: 100 } });
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
}

// Singleton
class MongoDBSingleton {
  constructor() {
    if (!MongoDBSingleton.instance) {
      MongoDBSingleton.instance = new MongoDB();
    }
  }

  getInstance() {
    return MongoDBSingleton.instance;
  }
}

module.exports = MongoDBSingleton;
