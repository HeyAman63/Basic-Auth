import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const EmailVerify = () => {
  const {backendurl,isLoggedIn, getUserData} = useContext(AppContext);
  const navigate = useNavigate();
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

  const onSubmitHandeller = async(e)=>{
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map(e=>e.value);
      const otp = otpArray.join('');
      const res = await  axios.post(`${backendurl}/api/auth/verify-account`,{
        otp
      });
      if(res.data.Success){
        toast.success(res.data.message);
        getUserData();
        navigate('/'); 
      }else{
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification Failed")
    }
  }
  return (
    <div className="flex flex-col items-center justify-center sm:px-0 px-6 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
          onClick={() => navigate("/")}
          src={assets.logo}
          className="cursor-pointer absolute left-5 sm:left-20 top-5 sm:w-32 w-28 "
      />
      <form 
      onSubmit={onSubmitHandeller}
      className='flex flex-col bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
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
        className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer rounded-3xl'>
          Verify Email
        </button>
        </form>
    </div>
  )
}

export default EmailVerify