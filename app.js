require('dotenv').config()
const express=require("express")
const bodyParser=require("body-parser")
const ejs=require("ejs")
const app=express()
const mongoose=require("mongoose")
const encrypt=require("mongoose-encryption")
mongoose.connect("mongodb://0.0.0.0/userDB").then(console.log("connected to database"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const userSchema=new mongoose.Schema({
    email:String,
    password:String
})

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFeilds:["password"]})

const User=new mongoose.model("User",userSchema)

app.route("/")
.get(function(req,res){
    res.render("home")
})

app.route("/login")
.get(function(req,res){
    res.render("login")
})
.post(function(req,res){
    User.find({}).then(function(found){
        found.forEach(function(i){
            if(i.email===req.body.email){
                if(i.password===req.body.password) {
                    console.log("Authenticated")
                    res.render("secrets")
                }else{
                    console.log("Wrong password")
                    res.redirect("/login")
                }
            }
        })
    })
})

app.route("/register")
.get(function(req,res){
    res.render("register")
})
.post(function(req,res){
    if (req.body.password===req.body.password_confirm) {
        const newUser=new User({
            email:req.body.email,
            password:req.body.password
        })
        console.log(newUser)
        newUser.save().then(res.render("secrets"))
    }
})

const port=process.env.PORT||3000
app.listen(port,function() {
  console.log(`Server started on port ${port}`)
})