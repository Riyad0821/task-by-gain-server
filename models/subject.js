const moongose = require("mongoose");

const Schema = moongose.Schema;

const subjectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  students: [{
    type: Schema.Types.ObjectId,
    ref: "Student"
  }],
});

module.exports = moongose.model("Subject", subjectSchema);