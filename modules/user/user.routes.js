const { allUsers, addUser, confirmEmail, login, updatePhone, addProfilePic, AllUsersPDF, deleteUser, confirmEmailValid } = require("./controller/user.controller")
const { registerSchema, loginSchema } = require("./user.validation")
const validator = require("../../middleware/validator")
const authenticator = require("../../middleware/auth")

const router = require("express").Router()
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
        // console.log(req.body);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        // console.log(file.originalname.replace(/\s/g, ''))
        cb(null, file.fieldname + '-' + uniqueSuffix + "-" + file.originalname.replace(/\s/g, ''))
    }
})

function fileFilter(req, file, cb) {
    // console.log(file.mimetype);
    if (file.mimetype === "image/jpeg") {
        cb(null, true)
    } else {
        cb(null, false)
    }

}
const upload = multer({ storage: storage, fileFilter })



router.get("/user/allUsers", allUsers)               // Show All Users
router.post("/user/register", authenticator("register"), validator(registerSchema), addUser)                // Add one User
router.get("/user/confirmEmail/:token", confirmEmail)
router.get("/user/confirmEmailValid/:token", confirmEmailValid)
router.post("/user/login", validator(loginSchema), login)
router.patch("/user/updatePhone", authenticator("updatePhone"), updatePhone)
router.patch("/user/addProfilePic", authenticator("updateProfilePic"), upload.single('avatar'), addProfilePic)
router.post("/user/AllUsersPDF", AllUsersPDF)
router.delete("/user/deleteUser/:userId", authenticator("deleteUser"), deleteUser)

module.exports = router