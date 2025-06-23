import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import { toast } from "react-toastify";
import { useEffect } from "react";


const Login = () => {
  const {backendurl,setIsLoggedIn, getUserData}= useContext(AppContext);
  const navigate = useNavigate();
  const [state, setState] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandeller = async (e)=>{
    try {
      e.preventDefault();
      axios.defaults.withCredentials = true; 
      if(state === "Sign Up"){
        console.log(`${backendurl}/api/auth/register`)
        const res = await axios.post(`${backendurl}/api/auth/register`,{
          name,
          email,
          password,
        });
        if(res.data.Success){
          setIsLoggedIn(true)
          getUserData()
          toast.success(res.data.message || "User Register Successfully");
          navigate('/')
        }else{
          toast.error(res.message || "Registration faild");
        }
        
      }else{
        const res = await axios.post(`${backendurl}/api/auth/login`,{
          email,
          password,
        });
        if(res.data.Success){
          setIsLoggedIn(true)
          getUserData()
          toast.success(res.data.message || "Login Successfully");
          navigate('/')
        }else{
          toast.error(res.message || "Login Faild");
        }
      }
    } catch (error) {
      toast.error(error.message || "Somthing went Wrong");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center sm:px-0 px-6 min-h-screen bg-gradient-to-br from-blue-200 to-purple-400 ">
      <img
        onClick={() => navigate("/")}
        src={assets.logo}
        className="cursor-pointer absolute left-5 sm:left-20 top-5 sm:w-32 w-28 "
      />
      <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === "Sign Up" ? "create account" : "Login"}
        </h2>
        <p className="text-center text-sm mb-6">
          {state === "Sign Up"
            ? "create your account"
            : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandeller}>
          {state === "Sign Up" && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
              <img src={assets.person_icon} />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                className="border-none text-white focus:outline-none"
                required
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.mail_icon} />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email id"
              className="border-none text-white focus:outline-none"
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333a5c]">
            <img src={assets.lock_icon} />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              className="border-none text-white focus:outline-none"
              required
            />
          </div>
          <p
            className="mb-4 text-indigo-500 cursor-pointer"
            onClick={() => navigate("/reset-password")}
          >
            Forgot Password ?
          </p>
          <button
            onClick={e=>console.log("Button was clicked")}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 cursor-pointer"
          >
            {state}
          </button>
        </form>

        {state === "Sign Up" ? (
          <p className="text-xs text-center text-gray-600 py-3">
            Don't have an account{" "}
            <span
              onClick={() => setState("Login")}
              className="cursor-pointer underline text-indigo-500"
            >
              Sign up
            </span>
          </p>
        ) : (
          <p className="text-xs text-center text-gray-600 pt-3">
            Already have an account ?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="cursor-pointer underline text-indigo-500"
            >
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
