import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { assets } from "../assets/assets";

const ResetPassword = () => {
    axios.defaults.withCredentials = true;

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isEmailSent, setIsEmailSent] = useState("")
    const [otp, setOtp] = useState(0);
    const [isOtpSubmited, setIsOtpSubmited] = useState(false);

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



    // HANDLE EMAIL FORM
    const onSubmitEmail = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:5000/api/v1/auth/send-reset-otp", { email });

            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && setIsEmailSent(true);

        } catch (error) {
            toast.error(error.message);
        }
    };


    // HANDLE OTP FORM
    const onSubmitOtp = (e) => {
        e.preventDefault();
        const optArray = inputRefs.current.map((e) => e.value);
        setOtp(optArray.join(""))
        setIsOtpSubmited(true)
    };


    // HANDLE ONSUBMIT OTP
    const onSubmitNewPassword = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:5000/api/v1/auth/reset-password", { email, otp, newPassword });

            data.success ? toast.success(data.message) : toast.error(data.message);

            data.success && navigate("/login");

        } catch (error) {
            toast.error(error.message)
        };
    };


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

                {/* mail input form  */}
                {!isEmailSent &&
                    <form onSubmit={onSubmitEmail} className="bg-slate-900 p-8 rounded-lg shodow-lg w-96 text-sm">

                        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password</h1>

                        <p className="text-center mb-6 text-indigo-300">Enter your registered email address</p>

                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.mail_icon} alt="mail-icon" className="w-4 h-4" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email id" className="bg-transparent outline-none text-slate-100"
                                required
                            />
                        </div>

                        <button className="w-full py-2.5 font-medium text-slate-100 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 mt-4">
                            Submit
                        </button>
                    </form>
                }




                {/* otp  input form */}
                {!isOtpSubmited && isEmailSent &&
                    <form onSubmit={onSubmitOtp} className="bg-slate-900 p-8 rounded-lg shodow-lg w-96 text-sm">
                        <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset password OTP</h1>

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

                        <button className="w-full py-2.5 font-medium text-slate-100 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900">Submit</button>
                    </form>
                };


                {/* new password form  */}
                {isOtpSubmited && isEmailSent &&
                    <form onSubmit={onSubmitNewPassword} className="bg-slate-900 p-8 rounded-lg shodow-lg w-96 text-sm">

                        <h1 className="text-white text-2xl font-semibold text-center mb-4">New password</h1>

                        <p className="text-center mb-6 text-indigo-300">Enter the new password below</p>

                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.lock_icon} alt="mail-icon" className="w-4 h-4" />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Password" className="bg-transparent outline-none text-slate-100"
                                required
                            />
                        </div>

                        <button className="w-full py-2.5 font-medium text-slate-100 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 mt-4">
                            Submit
                        </button>
                    </form>
                }


            </div >
        </>
    )
}

export default ResetPassword