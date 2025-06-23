import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendurl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthStatus = async ()=>{
        try {
            const res = axios.get(`${backendurl}/api/auth/is-auth`);
            if(res.data.Success){
                setIsLoggedIn(true)
                getUserData()
            }
        } catch (error) {
            toast.error(error.response?.data.message || 'faild to get auth status');
        }
    }
    // useEffect(() => {
    //   getAuthStatus()
    // }, [])

    const getUserData = async () => {
        try {
        const res = await axios.get(`${backendurl}/api/user/data`, {
            withCredentials: true,
        });
        if (res.data.Success) {
            setUserData(res.data.userData);
            setIsLoggedIn(true);
        } else {
            toast.error(res.data.message || "User not found");
        }
        } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch user data");
        }
    };

    // Optional: fetch user data on mount if token exists
    useEffect(() => {
        getUserData();
    }, []);

    const value = {
        backendurl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
    );
};
