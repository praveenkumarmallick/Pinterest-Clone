const mongoose = require("mongoose");

const postModel = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Update this to match your actual model name
  },
  title: String,
  description: String,
  image: String,
});

module.exports = mongoose.model("Post", postModel);
