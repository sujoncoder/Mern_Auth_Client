import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import { Toaster, toast } from "sonner";


const EmailVerify = () => {
    axios.defaults.withCredentials = true;

    const { userData, isLoggedin, getUserData } = useContext(AuthContext);

    // NAVIGATE LOCATION
    const navigate = useNavigate();

    // REFERENCE INPUT
    const inputRefs = React.useRef([]);

    // HANDLE INPUT
    const handleInput = (e, index) => {
        if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    // HANDLE KEY DOWN
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && e.target.value === "" && index > 0) {
            inputRefs.current[index - 1].focus()
        }
    };

    // HANDLE PASTE
    const handlePaste = async (e) => {
        const paste = e.clipboardData.getData("text");
        const pasteArray = paste.split("");
        pasteArray.forEach((char, index) => {
            if (inputRefs.current[index]) {
                inputRefs.current[index].value = char
            }
        })
    };

    // ON SUBMIT HANDLE
    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const optArray = inputRefs.current.map(e => e.value);
            const otp = optArray.join("");

            const { data } = await axios.post("http://localhost:5000/api/v1/auth/verify-account", { otp });

            if (data.success) {
                toast.success(data?.message);
                getUserData()
                setTimeout(() => {
                    navigate("/")
                }, 1000);
            } else {
                toast.error(data.message);
            };
        } catch (error) {
            toast.error(error.message);
        }

    };


    useEffect(() => {
        isLoggedin && userData && userData.isAccountVerified && navigate("/");
    }, [isLoggedin, userData]);


    return (
        <>
            <Toaster position="top-center" richColors />

            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
                <img
                    onClick={() => navigate("/")}
                    src={Logo}
                    alt="logo"
                    className="absolute left-5 sm:left-20 top-5 w-16 cursor-pointer"
                />

                <form onSubmit={onSubmitHandler} className="bg-slate-900 p-8 rounded-lg shodow-lg w-96 text-sm">
                    <h1 className="text-white text-2xl font-semibold text-center mb-4">Verify OTP</h1>

                    <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent to your email id</p>

                    <div className="flex justify-between mb-8" onPaste={handlePaste}>
                        {Array(6).fill(0).map((_, index) => (
                            <input type="text" maxLength="1" key={index} required className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                                ref={e => inputRefs.current[index] = e}
                                onInput={(e) => handleInput(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                            />

                        ))}
                    </div>

                    <button className="w-full py-3 font-medium text-slate-100 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">Verify email</button>
                </form>
            </div>
        </>
    )
}

export default EmailVerify