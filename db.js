const { MongoClient } = require('mongodb');

const uri = 'mongodb://0.0.0.0/web'; // Update with your MongoDB connection string

let client;

async function connectToMongoDB() {
  if (!client) {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
  }
}

function getClient() {
  return client;
}

module.exports = {
  connectToMongoDB,
  getClient,
};
