const roles = {
    admin: "Admin",
    user: "User",
    visitor: "Visitor"
}

const endPoints = {
    updatePhone: [roles.admin, roles.user],
    updateProfilePic: [roles.user],
    register: [roles.admin],
    deleteUser: [roles.admin],
    addPost: [roles.user],
    addComment: [roles.user],
    addReply: [roles.user],
    editPost: [roles.user],
    updateLike: [roles.user],
    deletePost: [roles.user]
}



module.exports = endPoints