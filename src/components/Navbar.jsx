import { useNavigate } from "react-router-dom";

import Logo from "../assets/logo.png";
import { IoIosArrowRoundForward } from "react-icons/io";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { Toaster, toast } from "sonner";
import axios from "axios";


const Navbar = () => {
    const { userData, setUserData, setIsLoggedin } = useContext(AuthContext);

    const navigate = useNavigate();

    // SEND VERIFICATION OTP
    const sendVerificationOtp = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post("http://localhost:5000/api/v1/auth/send-verify-otp");

            if (data.success) {
                toast.success(data?.message);
                setTimeout(() => {
                    navigate("/email-verify")
                }, 1000);
            } else {
                toast.error(data.message)
            };
        } catch (error) {
            toast.error(error.message)
        };
    };


    // HANDLE LOGOUT
    const logout = async () => {
        try {
            axios.defaults.withCredentials = true;
            const { data } = await axios.post("http://localhost:5000/api/v1/auth/logout");

            data.success && setIsLoggedin(false);
            data.success && setUserData(false);
            toast.success(data?.message)
            navigate("/")

        } catch (error) {
            toast.error(error.message)
        }
    };


    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
                <img src={Logo} alt="logo" className="w-16" />

                {
                    userData ?
                        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-slate-500 text-white relative group cursor-pointer font-bold">
                            {userData.name[0].toUpperCase()}
                            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-slate-500 rounded pt-10 transition-all">
                                <ul className="list-none m-0 p-2 bg-slate-50 text-sm">

                                    {
                                        !userData.isAccountVerified && <li
                                            onClick={sendVerificationOtp} className="py-1 px-2 hover:bg-slate-200 cursor-pointer">Verify email</li>
                                    }


                                    <li onClick={logout} className="py-1 px-2 hover:bg-slate-200 cursor-pointer pr-10">Logout</li>
                                </ul>
                            </div>
                        </div>
                        :
                        <button onClick={() => navigate("/login")} className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all">
                            Login
                            <IoIosArrowRoundForward />
                        </button>
                }
            </div>
        </>
    )
}

export default Navbar