const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

// Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/Pinterest-Clone_DB")
  .then(() => {
    console.log("Database Connected Successfully...");
  })
  .catch((error) => {
    console.log(error);
  });

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: String,
  email: String,
  phone: Number,
  password: String,
  profileImage: String,
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);
