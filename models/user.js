const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "You must enter a valid URL"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
    },
  },
});

module.exports = mongoose.model("user", userSchema);
