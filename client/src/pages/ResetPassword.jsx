import React, { useState,useRef, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const navigate = useNavigate();
  const {backendurl} = useContext(AppContext);
  axios.defaults.withCredentials = true;
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = useRef([])
  
    const handleInput = (e,index)=>{
      if(e.target.value.length > 0 && index < inputRefs.current.length-1){
        inputRefs.current[index+1].focus();
      }
    }
    const handleKeydown = (e,index)=>{
      if(e.key === "Backspace" && e.target.value === "" && index > 0){
        inputRefs.current[index-1].focus();
      }
    }
    const handlePaste = (e)=>{
      const paste = e.clipboardData.getData('text');
      const pasteArray = paste.split('');
      pasteArray.forEach((char,index)=>{
        if(inputRefs.current[index]){
          inputRefs.current[index].value = char;
        }
      })
    }

    const onSubmitEmail = async (e)=>{
      e.preventDefault();
      try {
        const res = await axios.post(`${backendurl}/api/auth/send-reset-otp`,{email});
        if(res.data.Success){
          setIsEmailSent(true);
          toast.success(res.data.message)
        }else{
          toast.error(res.data.message || " Invalid Email ");
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }

    const onSubmitOtp = async (e)=>{
      e.preventDefault();
      try {
        const otpArray = inputRefs.current.map(e=>e.value)
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
      } catch (error) {
        toast.error(error.response?.data?.message || "Somthing went wrong");
      }
    }

    const onSubmitNewPassword = async (e)=>{
      e.preventDefault();
      try {
        
        const res = await axios.post(`${backendurl}/api/auth/reset-password`,{
          email,
          otp,
          newPassword
        });

        if(res.data.Success){
          toast.success(res.data.message || "password reset Successfully");
          navigate('/login');
        }else{
          toast.error(res.data.message || "password reset Failed");
        }
      } catch (error) {
        toast.error(error.response?.data?.message);
      }
    }
  return (
    <div className="flex items-center justify-center sm:px-0 px-6 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
                onClick={() => navigate("/")}
                src={assets.logo}
                className="cursor-pointer absolute left-5 sm:left-20 top-5 sm:w-32 w-28 "
      />
      {/* Enter email id */}

{!isEmailSent && 
      <form 
      onSubmit={onSubmitEmail}
      className='flex flex-col bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter Your Registered Email Address</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
          <img src={assets.mail_icon} alt="" />
          <input 
          onChange={e=>setEmail(e.target.value)} 
          value={email} type="email" 
          placeholder='Enter Email Address' 
          className='text-white focus:outline-none'
          required
          />
        </div>
        <button
        className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer rounded-3xl'
        type='submit'>Sent OTP</button>
      </form>
}
      {/* otp unput form */}
{isEmailSent && !isOtpSubmitted &&
      <form 
      onSubmit={onSubmitOtp}
      className='flex flex-col bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter The 6 Digit Code Sent To Your Email</p>
        <div 
        onPaste={handlePaste}
        className='flex justify-center mb-8'>
          {Array(6).fill(0).map((__,index)=>(
          <input 
          key={index}
          maxLength='1'
          required
          type="text" 
          ref={e=>inputRefs.current[index] = e}
          onInput={(e)=>handleInput(e,index)}
          onKeyDown={(e)=>handleKeydown(e,index)}
          className='mr-2 w-12 h-12 rounded-lg text-white text-center text-xl bg-[#333a5c]' />
          ))}
        </div>
        <button  
        type='submit'
        className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer rounded-3xl'>
          Submit
        </button>
      </form>
}
      {/* New Password */}
{isOtpSubmitted && isEmailSent &&
      <form 
      onSubmit={onSubmitNewPassword}
      className='flex flex-col bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
        <p className='text-center mb-6 text-indigo-300'>Enter Your New Password bellow</p>
        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
          <img src={assets.lock_icon} alt="" />
          <input 
          onChange={e=>setNewPassword(e.target.value)} 
          value={newPassword} type="password" 
          placeholder='Enter New Password' 
          className='text-white focus:outline-none'
          required
          />
        </div>
        <button 
        className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer rounded-3xl'
        type='submit'>Submit</button>
      </form>
}
    </div>
  )
}

export default ResetPassword