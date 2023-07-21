# mini-insta-backend
Mini Instagram with Users &amp; Posts

This is Tamplate with 2-Modules => Users & Products
This Tamplate Installed Express & nodemon & dotenv & Mongoose & bcrypt & crypto-js and joi

Mongoose >>> Data Base
bcrypt >>>>> Encrypting & Decrypting
crypto-js >> Hashing
joi >>>>>>>> validation
dotenv >>>>> private variable we don't upload

User Model {
    create >> Only Admin
    confirm Email by Gmail
    Login and generate Token
    Add Profile picture 
    Edit Phone >> same User
    get all users in PDF file
    get all users using pagination
}

post Model {
    create post
    Delete Post >> only user Created it
    update Post >> ---------------------
    add Comment
    add Reply
    Like / Dislike
    get All Posts
}


Start Run by >>>> npm start