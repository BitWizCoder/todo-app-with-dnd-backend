const mongoose = require("mongoose");

exports.connectMongoose = () => {
  mongoose
    .connect("mongodb://localhost:27017/passport")
    .then((e) => console.log(`Conected to MongoDB:${e.connection.host}`))
    .catch((e) => console.log(e));
};

const userSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
});

exports.User = mongoose.model("User", userSchema);
