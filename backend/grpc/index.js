const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const { searchQuestions } = require("./searchService");

const PROTO_PATH = path.join(__dirname, "../../proto/question.proto");
const packageDef = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const quesProto = grpc.loadPackageDefinition(packageDef).question;

const grpcServer = new grpc.Server();

grpcServer.addService(quesProto.QuestionService.service, {
  SearchQues: searchQuestions,
});

const startGrpcServer = () => {
  grpcServer.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("gRPC server running on port 50051");
      grpcServer.start();
    }
  );
};

module.exports = { startGrpcServer };
