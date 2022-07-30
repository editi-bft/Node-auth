const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type:String, required: true},
    password: { type:String, required: true},
    email: {type:String, required: true,unique: true},
    mobile:{type:String},
    gender:{enum:['Male','Female','Others'] }
},
{ collection:'users'}
)

const model = mongoose.model('UserSchema', UserSchema)
module.exports = model