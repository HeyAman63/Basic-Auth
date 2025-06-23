import jwt from 'jsonwebtoken';

const userAuth = async (req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return res.json({Success: false, message:'Not Authorized Login again'});
    }

    try {
        
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        if (tokenDecode.id) {
            req.user = { userId: tokenDecode.id }; // ✅ Set userId correctly
            next(); // ✅ Proceed to next middleware/controller
        } else {
            return res.status(403).json({ Success: false, message: 'Authorization failed.' });
        }

    } catch (error) {
        res.json({Success: false, message: error.message});
    }
}

export default userAuth;