const { MongoClient } = require("mongodb");
const { mapData } = require("../utils/mapData.js");
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODB_URI;
const searchQuestions = (req, next) => {
  const { query, page, limit } = req.request;
  console.log("query", query);
  MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      const database = client.db("Question");
      const collection = database.collection("questions");

      const cursor = collection
        .find({ title: new RegExp(query, "i") })
        .skip((page - 1) * limit)
        .limit(limit);

      cursor
        .toArray()
        .then((questions) => {
          collection
            .countDocuments({ title: new RegExp(query, "i") })
            .then((totalCount) => {
              next(null, {
                questions: questions.map(mapData),
                totalCount: totalCount,
              });
              client.close();
            })
            .catch((error) => {
              next(error);
              client.close();
            });
        })
        .catch((error) => {
          next(error);
          client.close();
        });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports = { searchQuestions };
