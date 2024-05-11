const mongoose = require("mongoose");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/UMS");

const userSchema = mongoose.Schema({

    username: {type: String, unique: true},
    email: String,
    contact: Number,
    password: String,
    profileImage: {type: String},
    bio: String,
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }]
});


userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);