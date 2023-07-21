const authenticator = require("../../middleware/auth")
const { allPosts, addPost, editPost, deletePost, addComment, addReply, updateLike } = require("./controller/post.controller")

const router = require("express").Router()

router.get("/allPosts", allPosts)             // Show All Posts
router.post("/addPost", authenticator("addPost"), addPost)              // Add one Post
router.post("/addComment/:postId", authenticator("addComment"), addComment)              // Add one Commect
router.post("/addReply/:postId/:commentId", authenticator("addReply"), addReply)              // Add one Commect
router.put("/editPost/:postId", authenticator("editPost"), editPost)       // Edit One Post using ID as params
router.put("/updateLike/:postId", authenticator("updateLike"), updateLike)
router.delete("/deletePost/:postId", authenticator("deletePost"), deletePost)   // delete One Post using ID as params

module.exports = router