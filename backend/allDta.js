const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
const uri = process.env.MONGODB_URI;
const dbName = "mydatabase";
const collectionName = "mycollection";

async function getAllData() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const data = await collection.find({}).toArray();
    console.log(data);
    return data;
  } catch (err) {
    console.error("Error fetching data:", err);
  } finally {
    await client.close();
  }
}

getAllData();
