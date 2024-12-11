import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";

import { assets } from "../assets/assets";
import Logo from "../assets/logo.png";
import { AuthContext } from "../context/authContext";

const Login = () => {
    const [state, setState] = useState("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const { setIsLoggedin, getUserData } = useContext(AuthContext);

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            axios.defaults.withCredentials = true;

            const endpoint = state === "Sign Up"
                ? `http://localhost:5000/api/v1/auth/register`
                : `http://localhost:5000/api/v1/auth/login`;

            const payload = state === "Sign Up"
                ? { name, email, password }
                : { email, password };

            const { data } = await axios.post(endpoint, payload);

            if (data.success) {
                console.log(data?.message)
                toast.success(data?.message);
                getUserData();
                setIsLoggedin(true);
                setTimeout(() => {
                    navigate("/");
                }, 1000);
                setName("");
                setEmail("");
                setPassword("");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" richColors />
            <div className="flex justify-center items-center min-h-screen px-6 bg-gradient-to-br from-blue-200 to-purple-400">
                <img
                    onClick={() => navigate("/")}
                    src={Logo}
                    alt="logo"
                    className="absolute left-5 sm:left-20 top-5 w-16 cursor-pointer"
                />
                <div className="bg-slate-900 p-10 rounded-lg w-full sm:w-96 text-indigo-300 text-sm">
                    <h2 className="text-3xl font-semibold text-white text-center mb-3">
                        {state === "Sign Up" ? "Create account" : "Login"}
                    </h2>
                    <p className="text-center text-sm mb-6">
                        {state === "Sign Up" ? "Create your account" : "Login to your account"}
                    </p>
                    <form onSubmit={handleOnSubmit}>
                        {state === "Sign Up" && (
                            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                                <img src={assets.person_icon} alt="person" />
                                <input
                                    type="text"
                                    aria-label="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="bg-transparent outline-none"
                                    required
                                />
                            </div>
                        )}
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.mail_icon} alt="email" />
                            <input
                                type="email"
                                aria-label="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email address"
                                className="bg-transparent outline-none"
                                required
                            />
                        </div>
                        <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
                            <img src={assets.lock_icon} alt="password" />
                            <input
                                type="password"
                                aria-label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="bg-transparent outline-none"
                                required
                            />
                        </div>
                        <p onClick={() => navigate("/reset-password")} className="mb-4 text-indigo-500 cursor-pointer">
                            Forgot password?
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2.5 rounded-full ${loading ? "bg-gray-500" : "bg-gradient-to-r from-indigo-500 to-indigo-900"} font-medium text-slate-100`}
                        >
                            {loading ? "Processing..." : state}
                        </button>
                        <p className="text-gray-400 text-center text-xs mt-4">
                            {state === "Sign Up" ? (
                                <>
                                    Already have an account?{" "}
                                    <span onClick={() => setState("Login")} className="ml-2 text-blue-400 cursor-pointer hover:underline">
                                        Login here
                                    </span>
                                </>
                            ) : (
                                <>
                                    Don't have an account?{" "}
                                    <span onClick={() => setState("Sign Up")} className="ml-2 text-blue-400 cursor-pointer hover:underline">
                                        Sign up
                                    </span>
                                </>
                            )}
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;
