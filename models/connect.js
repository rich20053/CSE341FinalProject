const dotenv = require('dotenv');
dotenv.config();
const MongoClient = require('mongodb').MongoClient;

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log('Db is already initialized!');
    return callback(null, _db);
  }

  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client.db('gardengrow');
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });

};

const getDb = () => {
  while (!_db) {
    throw Error('Db not initialized');
  }
  return _db;
};

const closeDb = () => {
  if (_db) {
    _db.close(); // closes the database connection
    _db = null; // resets the _db variable
  }
};

module.exports = {
  initDb,
  getDb,
  closeDb
};

