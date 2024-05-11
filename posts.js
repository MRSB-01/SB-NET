const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    postText: {
        type: String,
        require: true
    },
    image: {
        type: String,
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: { 
        type: Date.now()
        
    }

});

module.exports = mongoose.model("post", postSchema);