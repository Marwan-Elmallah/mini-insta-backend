const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    replyBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }]
}, { timestamps: true })

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    commentBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true
    },
    replies: [replySchema],
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }]
}, { timestamps: true })

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    postBy: {
        type: mongoose.Types.ObjectId,
        ref: "user",
    },
    comments: [commentSchema],
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }]
}, { timestamps: true })

const postModel = mongoose.model("post", postSchema)


module.exports = postModel