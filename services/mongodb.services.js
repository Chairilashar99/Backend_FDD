// const mongodb = require("mongodb");
// const MongoClient = mongodb.MongoClient;

// let _db;

// const mongoConnect = (callback) => {
//   MongoClient.connect(
//     "mongodb+srv://Chairilashar:w2pqIwLjtLu0Ekqf@cluster0.dccacst.mongodb.net/shop?retryWrites=true&w=majority"
//   )
//     .then( client => {
//       console.log("Connected!");
//       _db = client.db()
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       throw err;
//     });
// };

// const getDb = () => {
//    if (_db) {
//     return _db;
//    }
//    throw 'No database found!';
// }

// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

const { MongoClient } = require("mongodb");
const { mongoConfig } = require("../config");

class MongoDB {
  static connectToMongoDB = () => {
    MongoClient.connect(mongoConfig.connectionUrl)
      .then((connection) => {
        console.log("MongoDB Connected!");
        this.db = connection.db(mongoConfig.database);
      })
      .catch((error) => console.log(`MongoDB not connected: ${error}`));
  };
}

MongoDB.db = null;

module.exports = MongoDB;