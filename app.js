const express = require("express")
const path = require("path")
require("dotenv").config()
const { usersRoute, postsRoute } = require("./Routes/allRoutes")
const initConnection = require("./DB/connection")
const app = express()

app.use("/uploads", express.static(path.join(__dirname, "uploads")))

initConnection()
app.use(express.json())
app.use(usersRoute, postsRoute)

app.listen(process.env.PORT, () => console.log("Server is Running..."))