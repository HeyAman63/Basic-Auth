import express from 'express';
import { isAuthenticated, login, logout, Register, resetPassword, sendResetOtp, sendVerifyOtp, verifiyEmail } from '../controller/authController.js';
import userAuth from '../middleware/userAuth.js';

const authRouter = express.Router();

authRouter.post("/register", Register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp",userAuth,sendVerifyOtp);
authRouter.post("/verify-account",userAuth,verifiyEmail);
authRouter.get("/is-auth",userAuth,isAuthenticated);
authRouter.post("/send-reset-otp",sendResetOtp);
authRouter.post("/reset-password",resetPassword);

export default authRouter;