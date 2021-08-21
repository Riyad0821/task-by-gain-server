const moongose = require("mongoose");

const Schema = moongose.Schema;

const studentSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  subjects: [{
    type: Schema.Types.ObjectId,
    ref: "Subject"
  }],
});

module.exports = moongose.model("Student", studentSchema);