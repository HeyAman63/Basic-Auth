import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authrouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js';


const app = express();
const port = process.env.PORT || 4000;
connectDB();
app.use(express.json());
app.use(cookieParser());
// const allowedOrigins = ['http://localhost:5173']
app.use(cors({
  origin: "http://localhost:5173",  // your frontend origin
  credentials: true                // allow cookies/auth headers
}));


// API end Points 
app.get("/",(req,res)=> res.send("API WORKING"));

app.use("/api/auth",authrouter)
app.use("/api/user",userRouter)

app.listen(port,()=>console.log(`Server has started on port : ${port}`))