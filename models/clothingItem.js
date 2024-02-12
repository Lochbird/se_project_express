const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  weather: {
    type: String,
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => {
        return validator.isURL(value);
      },
      message: "Invalid URL",
    },
  },
});

module.exports = mongoose.model("ClothingItems", clothingItemSchema);
