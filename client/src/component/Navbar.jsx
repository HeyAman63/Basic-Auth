import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";


const Navbar = () => {
    const navigate = useNavigate();
    const { userData, getUserData, setUserData, setIsLoggedIn,backendurl, isLoggedIn } = useContext(AppContext);
    const sendVerificationOtp = async()=>{
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(`${backendurl}/api/auth/send-verify-otp`);
        console.log(res.data.Success)
        if(res.data?.Success){
          toast(res.data.message)
          navigate('/email-verify')
        }else{
          toast.error(res.data.message);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Verification failed")
      }
    }
    const logout = async()=>{
      try {
        axios.defaults.withCredentials = true ;
        const res = await axios.post(`${backendurl}/api/auth/logout`);
        console.log(res.data?.Success)
        if(res.data.Success){
          setIsLoggedIn(false)
          setUserData(null)
          toast("Logout Successfully")
          navigate('/');
        }else{
          toast.error("Logout Failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
        toast.error(error.response?.data?.message || "Logout Failed (caught error)");
      }
    }

    useEffect(()=>{
      {isLoggedIn && userData && userData.isAccountVerified && navigate('/')}
    },[isLoggedIn,userData]);
  return (
    <div className="flex w-full justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
        <img  src={assets.logo} alt="" className="w-28 sm:w-32" />
        {isLoggedIn?
        (<div 
          className="w-8 h-8 hover:cursor-pointer flex justify-center items-center rounded-full bg-black text-white relative group">
            {userData?.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded-lg pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!userData?.isAccountVerified && <li onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-gray-200 cursor-pointer ">Verify Email</li>}
                <li 
                onClick={logout}
                className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                >Logout</li>
              </ul>
            </div>
        </div>):
          (<button 
            onClick={()=>{
            navigate("/login");
          }}
          className="px-6 p-2 hover:bg-gray-100 rounded-full cursor-pointer flex border-gray-100 border-2">
            <div>Login</div>
            <img src={assets.arrow_icon} className="ml-2" /> 
            
          </button>
        )}
        
    </div>
  );
};

export default Navbar;
