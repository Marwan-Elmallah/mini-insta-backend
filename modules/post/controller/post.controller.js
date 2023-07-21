const postModel = require("../../../DB/models/post/post.model")
const userModel = require("../../../DB/models/user/user.model")

const allPosts = async (req, res) => {
    const posts = await postModel.find({})
    res.json({ message: "All Posts", posts })
}

const addPost = async (req, res) => {
    try {
        const { content } = req.body
        const postBy = req.userIn
        const newPost = await postModel.insertMany({ content, postBy })
        res.json({ message: "Post Added", newPost })
    } catch (error) {
        res.status(500).json({ message: "Error To Add Post", error })
    }
}

const addReply = async (req, res) => {
    try {
        const { content } = req.body
        const { postId, commentId } = req.params
        const replyBy = req.userIn
        const postExist = await postModel.findOne({ _id: postId })
        const commentExist = postExist.comments.find((ele) => ele._id == commentId)
        // console.log(commentExist);
        if (!postExist) {
            res.status(400).json({ message: "post is Not Available any more.." })
        }
        if (!commentExist) {
            res.status(400).json({ message: "comment is Not Available any more.." })
        }
        const newReply = { content, replyBy }
        commentExist.replies.push(newReply)
        // console.log(commentExist.replies);
        const addedReply = await postModel.findByIdAndUpdate({ _id: postId }, { comments: commentExist }, { new: true })
        res.json({ message: "Reply Added", addedReply })
    } catch (error) {
        res.status(500).json({ message: "Error To Add Reply", error })
    }
}

const addComment = async (req, res) => {
    try {
        const { content } = req.body
        const { postId } = req.params
        const commentBy = req.userIn
        const postExist = await postModel.findOne({ _id: postId })
        if (!postExist) {
            res.status(400).json({ message: "Post is Not Available any more.." })
        }
        const newComment = { content, commentBy }
        postExist.comments.push(newComment)
        // console.log(postExist.comments);
        const addedComment = await postModel.findByIdAndUpdate({ _id: postId }, { comments: postExist.comments }, { new: true })
        res.json({ message: "Comment Added", addedComment })
    } catch (error) {
        res.status(500).json({ message: "Error To Add Comment", error })
    }
}

const editPost = async (req, res) => {
    try {
        const { postId } = req.params
        const user = req.userIn
        const { content } = req.body
        const postExist = await postModel.findOne({ _id: postId })
        if (!postExist) {
            res.status(400).json({ message: "Post is Not Exist" })
        }
        if (postExist.postBy.toString() !== user._id) {
            res.status(400).json({ message: "You Not Authurized to Edit This Post" })
        }
        const updatedPost = await postModel.findByIdAndUpdate({ _id: postId }, { content }, { new: true })
        // console.log(postExist.postBy.toString(), user._id);
        res.json({ message: "Post Updated", updatedPost })
    } catch (error) {
        res.status(500).json({ message: "Error To Update This Post", error })
    }
}

const updateLike = async (req, res) => {
    try {
        const { postId } = req.params
        const user = req.userIn
        const postExist = await postModel.findOne({ _id: postId })
        if (!postExist) {
            res.status(400).json({ message: "Post is Not Exist" })
        }
        let likes = postExist.likes
        const alreadyLiked = likes.find((us) => us.toString() === user._id)
        if (!alreadyLiked) {
            likes.push(user._id)
            const liked = await postModel.findByIdAndUpdate({ _id: postId }, { likes }, { new: true })
            res.json({ message: "Liked :D", liked })
        } else {
            let disLiked = likes.filter((us) => us.toString() !== user._id)
            const liked = await postModel.findByIdAndUpdate({ _id: postId }, { likes: disLiked }, { new: true })
            res.json({ message: "Disliked :(", liked })
        }
    } catch (error) {
        res.status(500).json({ message: "Error To Update Likes on This Post", error })
    }
}

const deletePost = async (req, res) => {
    try {
        const { postId } = req.params
        const user = req.userIn
        const postExist = await postModel.findOne({ _id: postId })
        // console.log(postExist);
        if (!postExist) {
            res.status(400).json({ message: "Post is Not Exist" })
        } else {
            if (postExist.postBy.toString() !== user._id) {
                res.status(400).json({ message: "You Not Authurized to Delete This Post" })
            } else {
                const deletedPost = await postModel.findByIdAndDelete({ _id: postId })
                res.json({ message: "Post Deleted", deletedPost })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error To Delete This Post" })
    }
}


module.exports = {
    allPosts,
    addPost,
    editPost,
    deletePost,
    addComment,
    addReply,
    updateLike,
    deletePost
}