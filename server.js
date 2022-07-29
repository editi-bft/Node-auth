const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const User = require('./model/user')
const bcrypt = require('bcryptjs')

mongoose.connect('mongodb://localhost:27017/login-app-db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const app = express()
app.use('/', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json())


app.post('/api/register', async (req, res) => {
    console.log(req.body)
    // const userSchema = new User(req.body);
    // await userSchema.save((err, result) => {
    //     if (err) {
    //         return res.json({
    //             status: 409,
    //             message: 'Already Registered'
    //         })
    //     }
    //     else {
    //         return res.json({
    //             status: 201,
    //             message: 'User Registered'
    //         })          }
    //})
    //Analyst
    //Scripts reading databases

    const { username,password } = req.body

    console.log(await bcrypt.hash(password,10))
    // Cook -> Developer
    //Salt,Pepper,Oil,Vegetables-> Password

    //(...,....,Salt,Pepper,Oil,Vegetables) -> Food

    //bcrypt,md5,sha1,sha256,sha512...

    // 1. The collision should be improbable
    // 2. the algorithm should be slow..
    //SPECIAL_FUNCTION(Password) ->32555555555577777###333
    // Hashing the passwords

    // res.json({ status:'ok'})
})

app.listen(9999, () => {
    console.log('Server')
})