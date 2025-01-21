// const express = require("express");
// const grpc = require("@grpc/grpc-js");
// const protoLoader = require("@grpc/proto-loader");
// const { MongoClient } = require("mongodb");
// const path = require("path");
// const cors = require("cors");

// const PROTO_PATH = path.join(__dirname, "./proto/question.proto");
// const packageDef = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,
//   longs: String,
//   enums: String,
//   defaults: true,
//   oneofs: true,
// });

// const quesProto = grpc.loadPackageDefinition(packageDef).question;

// const app = express();
// const port = 5000;

// app.use(cors());
// app.use(express.json());

// const client = new quesProto.QuestionService(
//   "localhost:50051",
//   grpc.credentials.createInsecure()
// );

// const mapData = (question) => {
//   const baseData = {
//     id: question._id,
//     type: question.type,
//     title: question.title,
//   };

//   if (question.type === "MCQ") {
//     return {
//       ...baseData,
//       options: question.options.map((option) => ({
//         text: option.text,
//         isCorrectAnswer: option.isCorrectAnswer,
//       })),
//     };
//   } else if (question.type === "ANAGRAM") {
//     return {
//       ...baseData,
//       solution: question.solution,
//       blocks: question.blocks.map((block) => ({
//         text: block.text,
//         showInOption: block.showInOption,
//         isAnswer: block.isAnswer,
//       })),
//     };
//   } else {
//     return baseData;
//   }
// };

// const uri =
//   "mongodb+srv://ajeetsingh:C9hKISZM1pyRianu@test.c6xnn.mongodb.net/?retryWrites=true&w=majority&appName=test";

// async function connectToDatabase() {
//   try {
//     const client = new MongoClient(uri);
//     await client.connect();
//     console.log("Connected to MongoDB");
//     return client;
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err);
//     throw err;
//   }
// }

// app.get("/search", async (req, res) => {
//   const { query, page, limit } = req.query;
//   const skip = (page - 1) * limit;

//   try {
//     const client = await connectToDatabase();
//     const database = client.db("Question");
//     const collection = database.collection("questions");

//     const cursor = collection
//       .find({ title: new RegExp(query, "i") })
//       .skip(parseInt(skip))
//       .limit(parseInt(limit));

//     const questions = await cursor.toArray();
//     const totalCount = await collection.countDocuments({
//       title: new RegExp(query, "i"),
//     });

//     const mappedQuestions = questions.map(mapData);
//     res.json({
//       questions: mappedQuestions,
//       totalCount: totalCount,
//     });

//     client.close();
//   } catch (err) {
//     console.error("Error retrieving data:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(port, async () => {
//   console.log(`Express server is running on http://localhost:${port}`);
// });

// const grpcServer = new grpc.Server();

// const searchQuestions = (req, next) => {
//   const { query, page, limit } = req.request;

//   MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then((client) => {
//       const database = client.db("Question");
//       const collection = database.collection("questions");

//       const cursor = collection
//         .find({ title: new RegExp(query, "i") })
//         .skip((page - 1) * limit)
//         .limit(limit);

//       cursor
//         .toArray()
//         .then((questions) => {
//           collection
//             .countDocuments({ title: new RegExp(query, "i") })
//             .then((totalCount) => {
//               next(null, {
//                 questions: questions.map(mapData),
//                 totalCount: totalCount,
//               });
//               client.close();
//             })
//             .catch((error) => {
//               next(error);
//               client.close();
//             });
//         })
//         .catch((error) => {
//           next(error);
//           client.close();
//         });
//     })
//     .catch((error) => {
//       next(error);
//     });
// };

// grpcServer.addService(quesProto.QuestionService.service, {
//   SearchQues: searchQuestions,
// });

// grpcServer.bindAsync(
//   "127.0.0.1:50051",
//   grpc.ServerCredentials.createInsecure(),
//   () => {
//     grpcServer.start();
//   }
// );

const express = require("express");
const cors = require("cors");
const { searchQuestions } = require("./controllers/questionController");
const { startGrpcServer } = require("./grpc/index.js");
const { connectToDatabase } = require("./db/connect.js");
const dotenv = require("dotenv");
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
require("dotenv").config();
app.get("/search", searchQuestions);

app.listen(port, async () => {
  console.log(`Express server is running on http://localhost:${port}`);
  startGrpcServer();
});

connectToDatabase();
