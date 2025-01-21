const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrectAnswer: {
    type: Boolean,
    required: true,
  },
});

const blockSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  showInOption: {
    type: Boolean,
    required: true,
  },
  isAnswer: {
    type: Boolean,
    required: true,
  },
});

const questionSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ["MCQ", "ANAGRAM", "READ_ALONG", "CONTENT_ONLY"],
  },
  options: {
    type: [optionSchema],
    required: function () {
      return this.type === "MCQ";
    },
  },
  solution: {
    type: String,
    required: function () {
      return this.type === "ANAGRAM";
    },
  },
  blocks: {
    type: [blockSchema],
    required: function () {
      return this.type === "ANAGRAM";
    },
  },
  siblingId: {
    type: Schema.Types.ObjectId,
    ref: "Question",
  },
  title: {
    type: String,
    required: true,
  },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
