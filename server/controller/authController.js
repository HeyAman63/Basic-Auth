import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../model/userModel.js';
import transporter from '../config/nodemailer.js';
import {EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE} from '../config/emailTemplates.js'

export const Register = async (req,res)=>{
    const {name, email, password,} = req.body;

    if(!name || !email || !password){
        return res.status(404).json({Success:false, message:"missing Details"});
    }

    try {
        const existingUser = await userModel.findOne({email})
        if(existingUser){
            return res.json({Success:false, message:"User Already exist"});
        }

        const hassedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name, email, password : hassedPassword})
        await user.save();

        const token = jwt.sign({id : user._id}, process.env.JWT_SECRET, {expiresIn:'7d'});
        res.cookie("token",token, {
            httpOnly : true,
            secure: process.env.NODE_ENV === 'Production',
            sameSite: process.env.NODE_ENV === 'Production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000,

        });
        // Sending Welcome email 
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to Aman's Website ",
            text:`Welcome to Aman's Website. Your account has been created with email id : ${email}`,
            html: `<b>Welcome to Aman's Website. Your account has been created with email id : ${email}</b>`,
        }
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent:", info.messageId);

        return res.json({Success:true});

    } catch (error) {
        return res.json({Success:false, message: error.message})
    }
}

export const login = async (req ,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({Success : false, message : "Email and Password are required"});
    }

    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({Success : false, message:"Invalid Email"})
        }
        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.json({Success :false, message:"Invalid password"});
        }

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});
        res.cookie('token', token, {
            httpOnly:true,
            secure:process.env.NODE_ENV === "Production",
            sameSite:process.env.NODE_ENV === "Production" ? "null" : "strict",
            maxAge:7*24*60*60*1000,
        });
        return res.json({Success:true});

    } catch (error) {
        return res.json({Success:false, message: error.message});
    }
}


export const logout = async (req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === "Production",
            sameSite:process.env.NODE_ENV === "Production"?"none":"strict",
        })
        return res.json({Success:true, message:"User is logout successfully"});
    } catch (error) {
        return res.json({Success:false, message:error.message});
    }
}

// send verification otp to users email
export const sendVerifyOtp = async (req,res) =>{
    try {
        const {userId} = req.user;
        const user = await userModel.findById(userId);
        if(user.isAccountVefied){
            return res.json({Success:false, message:"User already verified"});
        }
        const otp = String(Math.floor( 100000 + Math.random()*900000 ));
        user.verifyOtp = otp;
        user.verifyOtpExpireat = Date.now()+24*60*60*1000;
        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "OTP for account verification",
            html: EMAIL_VERIFY_TEMPLATE.replace('{{otp}}',otp).replace('{{email}}',user.email)
        }
        await transporter.sendMail(mailOptions);
        res.json({Success:true, message:'OTP has been sent to your registered email'});
    } catch (error) {
        res.json({Success:false, message:error.message});
    }
}


// verify email function using otp 
export const verifiyEmail = async (req,res)=>{
    const {userId} = req.user;
    const {otp} = req.body;
    if(!userId || !otp){
        return res.json({Success:false, message:"Missing details"});
    }
    try {
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({Success:false,message:"user not found"});
        }
        if(user.verifyOtp === '' || user.verifyOtp !== otp ){
            return res.json({Success: false, message:"invalid Otp"});
        }
        if(user.verifyOtpExpireat < Date.now()){
            return res.json({Success: false, message: "OTP expired"});
        }

        user.isAccountVefied = true ;
        user.verifyOtp = '';
        user.verifyOtpExpireat = 0;
        await user.save();

        return res.json({Success:true, message: "Email verified Successfully"});
    } catch (error) {
        return  res.json({Success:false, message:error.message});
    }
}

// to check if user is login or not 
export const isAuthenticated = async (req,res)=>{
    try {
        return res.json({Success:true});
    } catch (error) {
        res.json({Success:false, message:error.message});
    }
}

// send password reset otp 

export const sendResetOtp = async (req,res)=>{
    const {email}= req.body;
    if(!email){
        return res.json({Success:false, message: "Email required"});
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({Success:false, message:"User does not exist"});
        }
        const otp = String(Math.floor(100000+Math.random()*900000));
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now()+15*60*1000;
        await user.save();
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to:user.email,
            subject:"Password Reset Otp",
            html:PASSWORD_RESET_TEMPLATE.replace('{{otp}}',otp).replace('{{email}}',user.email),
        }
        await transporter.sendMail(mailOptions);
        return res.json({Success:true, message:"Otp Send to your email"});
    } catch (error) {
        res.json({Success:false, message:error.message});
    }
}

// reset user password 

export const resetPassword = async (req,res)=>{
    const {email, otp, newPassword} = req.body;
    if(!email || !otp || !newPassword){
        return res.json({Success:false,message:"Fill the required detailsl like (Email, otp, new Password)"})
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({Success:false, message:"User not found"});
        }
        if(user.resetOtp ==="" || user.resetOtp !== otp){
            return res.json({Success:false, message:"Invalid Otp"})
        }
        if(user.resetOtpExpireAt < Date.now()){
            return res.json({Success:false, message:"Otp expired"});
        }
        const newPass =await bcrypt.hash(newPassword,10);
        user.password = newPass;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();
        return res.json({Success:true, message:"Password has been reset successfully"});
    } catch (error) {
        res.json({Success:false, message:error.message});
    }
}