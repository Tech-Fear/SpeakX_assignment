const { MongoClient } = require("mongodb");
const { mapData } = require("../utils/mapData.js");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODB_URI;

const searchQuestions = async (req, res) => {
  const { query, page, limit, type } = req.query;
  const skip = (page - 1) * limit;
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("Question");
    const collection = database.collection("questions");

    let queryFilter = {};

    if (query && query.trim() !== "") {
      queryFilter.title = new RegExp(query, "i");
    }

    if (type && type.trim() !== "") {
      queryFilter.type = type;
    }

    const cursor = collection
      .find(queryFilter)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const questions = await cursor.toArray();
    const totalCount = await collection.countDocuments(queryFilter);

    const mappedQuestions = questions.map(mapData);
    res.json({
      questions: mappedQuestions,
      totalCount: totalCount,
    });
  } catch (err) {
    console.error("Error retrieving data:", err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
};

module.exports = { searchQuestions };
