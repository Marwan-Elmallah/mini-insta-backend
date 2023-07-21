const { default: mongoose } = require("mongoose")
const CryptoJS = require("crypto-js");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        unique: true
    },
    gender: String,
    isConfirmed: {
        type: Boolean,
        default: false
    },
    profilePic: String,
    coverPic: String,
    followers: Array,
    role: {
        type: String,
    }
}, { timestamps: true })

userSchema.pre("save", function (next) {
    const ciphertext = CryptoJS.AES.encrypt(this.password, process.env.SECRET_KEY).toString();
    this.password = ciphertext
    next()
})

const userModel = mongoose.model("user", userSchema)


module.exports = userModel