import { useContext, useState, useEffect } from 'react'
import { assets } from '../assets/assets.js'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext.jsx'

const Header = () => {
   const { userData, getUserData, isLoggedIn } = useContext(AppContext);
   useEffect((e) => {
   }, [getUserData])
   

  return (
    <div 
      className='flex flex-col space-x-2.5 justify-center relative  text-center text-gray-800  items-center'>
        <img 
          src={assets.header_img}  
          alt=""  
          className='w-36 h-36 rounded-full mb-6'
        />
        <h1 
          className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
            Hey!! {userData ? userData.name :"Developer"}  
            <img 
              src={assets.hand_wave} 
              className='w-8 aspect-square' 
              alt="" 
            />
        </h1>
        <h2 
          className='text-3xl sm:text-5xl font-semibold mb-4'>
            Welcome to our Website
        </h2>
        <p 
          className='mb-8 max-w-md'>
            "Welcome back — let’s build something amazing."
        </p>
        <button 
          className='px-8 py-2.5 transition-all border-1 border-gray-300 rounded-full hover:bg-gray-200 cursor-pointer'>
            Get Started
        </button>
    </div>
  )
}

export default Header