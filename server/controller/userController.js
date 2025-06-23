import userModel from "../model/userModel.js";

export const getUserData = async (req,res)=>{
    try {
        const {userId} = req.user;
        const user = await userModel.findById(userId);
        if(!user){
            return res.json({Success:false, message:"user not found"});
        } 
        res.json({
            Success:true, 
            userData:{
                name: user.name,
                isAccountVerified: user.isAccountVefied,
            }
        })
    } catch (error) {
        res.json({Success:false, message: error.message});
    }
}