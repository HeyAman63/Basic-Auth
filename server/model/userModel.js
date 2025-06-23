import mongoose from 'mongoose'

const UserScheema = new mongoose.Schema({
    name : {type: String , required: true},
    email : {type: String , required: true, unique: true},
    password : {type: String , required: true},
    verifyOtp : {type: String , default:''},
    verifyOtpExpireat : {type: Number , default:0},
    isAccountVefied : {type: Boolean , default:false},
    resetOtp : {type: String , default:''},
    resetOtpExpireAt : {type: Number , default:0},
})

const userModel = mongoose.models.User || mongoose.model("User",UserScheema)

export default userModel;