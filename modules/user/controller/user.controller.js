const userModel = require("../../../DB/models/user/user.model")
const jwt = require('jsonwebtoken');
const CryptoJS = require("crypto-js");

const sendEmail = require("../../../common/sendEmail");
const { createInvoice } = require("../../../common/createInvoice");


const allUsers = async (req, res) => {
    const { limit = 4, page = 1 } = req.query
    const skip = (page - 1) * limit
    const users = await userModel.find({}).select("-password").skip(skip).limit(limit)
    res.json({ message: "All Users", users })
}

const addUser = async (req, res) => {
    try {
        const { email, password, username, cPassword, phone, gender, role } = req.body
        const emailExist = await userModel.findOne({ email })
        const usernameExist = await userModel.findOne({ username })
        if (usernameExist || emailExist) {
            res.status(400).json({ message: "User Already Registered" })
        } else {
            const newUser = new userModel({ username, email, password, phone, gender, role })
            const addedUser = newUser.save({ new: true })
            const token = jwt.sign({ email }, process.env.SECRET_TOKEN, { expiresIn: 3600 });   //token valid for 1-min
            // console.log(token);
            const tokenValid = jwt.sign({ email }, process.env.SECRET_TOKEN);   //token valid any Time
            const message = `
            <h2>This confirmation will expired after 1 Hours</h2>
            <a href=${req.protocol}://${req.headers.host}/user/confirmEmail/${token}>Click Here To confirm Email</a>
            <h2>Refresh Confirmation</h2>
            <a href=${req.protocol}://${req.headers.host}/user/confirmEmailValid/${tokenValid}>Click Here To confirm Email</a>
            `
            const mail = await sendEmail(email, message)
            // console.log(mail);
            if (mail && newUser) {
                res.json({ message: "User Added", newUser })
            } else {
                res.status(400).json({ message: "Error to send Email" })
            }
        }
    } catch (error) {
        res.status(500).json({ message: "Error To Register", error })
    }
}

const confirmEmailValid = async (req, res) => {
    try {
        const { token } = req.params
        const userId = jwt.verify(token, process.env.SECRET_TOKEN).id;
        // console.log(userId);
        const userExist = await userModel.findOne({ _id: userId })
        if (userExist) {
            if (userExist.isConfirmed) {
                res.status(400).json({ message: "Email is Already Verified" })
            } else {
                const confirmUser = await userModel.findByIdAndUpdate({ _id: userId }, { isConfirmed: true }, { new: true })
                res.json({ message: "Confirmed", confirmUser })
            }
        } else {
            res.status(400).json({ message: "User is Not Regitered" })
        }
    } catch (error) {
        res.status(400).json({ message: "Error To Confirm", error })
    }
}

const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params
        const { email } = jwt.verify(token, process.env.SECRET_TOKEN);
        console.log(email);
        const userExist = await userModel.findOne({ email })
        if (userExist) {
            if (userExist.isConfirmed) {
                res.status(400).json({ message: "Email is Already Verified" })
            } else {
                const confirmUser = await userModel.findOneAndUpdate({ email }, { isConfirmed: true }, { new: true })
                res.json({ message: "Confirmed", confirmUser })
            }
        } else {
            res.status(400).json({ message: "User is Not Regitered" })
        }
    } catch (error) {
        res.status(400).json({ message: "Error To Confirm", error })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const emailExist = await userModel.findOne({ email })
        if (emailExist) {
            if (!emailExist.isConfirmed) {
                res.status(400).json({ message: "Email is Not Confirmed Yet" })
            }
            const bytes = CryptoJS.AES.decrypt(emailExist.password, process.env.SECRET_KEY);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            // console.log(originalText);
            if (password === originalText) {
                const token = jwt.sign({ logUser: emailExist }, process.env.SECRET_TOKEN);
                res.json({ message: `Welcome ${emailExist.username}`, token })
            } else {
                res.status(401).json({ message: "Wrong Password" })
            }
        } else {
            res.status(400).json({ message: "Email is not Exist" })
        }
    } catch (error) {
        res.status(500).json({ message: "Error To login", error })
    }

}

const updatePhone = async (req, res) => {
    try {
        const { phone } = req.body
        const user = req.userIn
        const updatedPhone = await userModel.findByIdAndUpdate(user._id, { phone }, { new: true })
        res.json({ message: "Phone Updated", updatedPhone })
    } catch (error) {
        res.status(500).json({ message: "Error To Update Phone", error })
    }
}

const addProfilePic = async (req, res) => {
    try {
        const user = req.userIn
        if (!req.file) {
            res.status(400).json({ message: "Error To read file" })
        } else {
            const pictureURL = `${req.protocol}://${req.headers.host}/${req.file.path}`
            const updatedProfilePic = await userModel.findByIdAndUpdate(user._id, { profilePic: pictureURL }, { new: true })
            res.json({ message: "Done", updatedProfilePic })
        }
    } catch (error) {
        res.status(500).json({ message: "Error To Update profile picture", error })
    }
}

const AllUsersPDF = async (req, res) => {
    const users = await userModel.find({})
    createInvoice(users, "invoice.pdf");
    res.json({ message: "PDF Generated" })
}

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        const user = req.userIn
        const userExist = await userModel.findById(userId)
        // console.log(userExist);
        if (!userExist) {
            res.status(400).json({ message: "User you want to Delete is Not Exist" })
        } else {
            const deletedUser = await userModel.findByIdAndDelete(userId)
            res.json({ message: "User Deleted", Response: `User ${userExist.username} is Deleted By ${user.username}` })
        }
    } catch (error) {
        res.status(500).json({ message: "Error To Delete User", error })
    }
}


module.exports = {
    allUsers,
    addUser,
    confirmEmail,
    login,
    updatePhone,
    addProfilePic,
    AllUsersPDF,
    deleteUser,
    confirmEmailValid
}