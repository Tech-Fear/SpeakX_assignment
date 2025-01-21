const mapData = (question) => {
  const baseData = {
    id: question._id,
    type: question.type,
    title: question.title,
  };

  if (question.type === "MCQ") {
    return {
      ...baseData,
      options: question.options.map((option) => ({
        text: option.text,
        isCorrectAnswer: option.isCorrectAnswer,
      })),
    };
  } else if (question.type === "ANAGRAM") {
    return {
      ...baseData,
      solution: question.solution,
      blocks: question.blocks.map((block) => ({
        text: block.text,
        showInOption: block.showInOption,
        isAnswer: block.isAnswer,
      })),
    };
  } else {
    return baseData;
  }
};

module.exports = { mapData };
