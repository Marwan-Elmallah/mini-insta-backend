const jwt = require("jsonwebtoken");
const endPoints = require("../modules/user/user.roles");

const authenticator = (endPoint) => {
    return (req, res, next) => {
        try {
            const token = req.headers["authorization"].split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
            const role = decoded.logUser.role
            // console.log(endPoints[endPoint].includes(role));
            if (endPoints[endPoint].includes(role)) {
                req.userIn = decoded.logUser
                // console.log(decoded.logUser);
                next()
            } else {
                res.status(400).json({ message: "Not Authorized" })
            }
        } catch (error) {
            res.status(500).json({ message: "Error in Auth" })
        }
    }
}

module.exports = authenticator