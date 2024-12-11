import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {

    axios.defaults.withCredentials = true;

    // const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);

    const getAuthState = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/v1/auth/is-auth");

            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            };
        } catch (error) {
            toast.error(error.message);
        }
    };


    const getUserData = async () => {
        try {
            const { data } = await axios.get("http://localhost:5000/api/v1/user/data");
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        // backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
