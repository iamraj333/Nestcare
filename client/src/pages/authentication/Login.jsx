
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoPersonOutline, IoBriefcaseOutline, IoShieldCheckmarkOutline, IoArrowForward } from "react-icons/io5";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import { contextData } from "../../context/ContextData";

export default function Login() {
    const { fetchUser } = useContext(contextData)
    const [isLoading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [userLogin, setUserLogin] = useState({
        role: "customer",
        email: "",
        password: "",
        isRemember: false
    })

    const location = useLocation()
    // let { RouteError } = location?.state
    useEffect(() => {
        if (!location.state?.RouteError) return;

        toast.error(location.state.RouteError);

        navigate(location.pathname, {
            replace: true,
            state: null,
        });
    }, [location, navigate]);


    const InputChange = (e) => {
        setUserLogin({
            ...userLogin,
            [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value
        })
    }
    const { role, email, password, isRemember } = userLogin

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!role || !email || !password) {
            toast.error("Field is required")
            return;
        }

        setLoading(true)

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLogin),
                credentials: "include"
            })

            const data = await response.json();

            if (data.success) {
                await fetchUser();
                toast.success(data.success);

                if (data.role === "customer") {
                    navigate("/user/dashboard");
                }
                else if (data.role === "professional") {
                    navigate("/professional/dashboard");
                }
                else if (data.role === "admin") {
                    navigate("/admin/dashboard");
                }
                else {
                    toast.error("Invalid role");
                }
            }
            else if (data.warning) {
                toast.warn(data.warning)
            }
            else {
                toast.error(data.error)
            }
        }
        catch (e) {
            console.error("Login failed:", e);
            toast.error("Login server error");
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 min-[375px]:px-5 sm:px-6 py-12">

                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-[0.2em] mb-3">Welcome Back</p>
                        <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A]">Login to NestCare</h1>
                        <p className="text-[#64748B] mt-3">Select your account type and continue.</p>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="mb-7">
                            <label className="block text-sm font-semibold text-[#0F172A] mb-3">
                                Login as
                            </label>

                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => setUserLogin({ ...userLogin, role: "customer" })} value={userLogin.role} className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200  ${userLogin.role == "customer" ? `bg-[#0F766E] text-white border-[#0F766E]` : `bg-white text-[#64748B] border-slate-200 hover:border-[#0F766E] hover:text-[#0F766E]`} `}><IoPersonOutline className="text-xl" />Customer</button>
                                <button onClick={() => setUserLogin({ ...userLogin, role: "professional" })} value={userLogin.role} className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${userLogin.role == "professional" ? `bg-[#0F766E] text-white border-[#0F766E]` : `bg-white text-[#64748B] border-slate-200 hover:border-[#0F766E] hover:text-[#0F766E]`} `}><IoBriefcaseOutline className="text-xl" />Professional</button>
                                <button onClick={() => setUserLogin({ ...userLogin, role: "admin" })} value={userLogin.role} className={`flex flex-col items-center justify-center gap-1.5 py-3 px-2 rounded-xl border transition-all duration-200 ${userLogin.role == "admin" ? `bg-[#0F766E] text-white border-[#0F766E]` : `bg-white text-[#64748B] border-slate-200 hover:border-[#0F766E] hover:text-[#0F766E]`} `}><IoShieldCheckmarkOutline className="text-xl" />Admin</button>
                            </div>

                        </div>


                        {/* ===================== LOGIN FORM ======================================== */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A] mb-2">Email Address</label>
                                <input name="email" onChange={(e) => InputChange(e)} value={userLogin.email} id="email" type="email" placeholder="Enter your email" required className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#47e8db]/30 transition" />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label htmlFor="password" className="block text-sm font-semibold text-[#0F172A]">Password</label>
                                    <Link to="/forgot-password" className="text-sm text-[#0F766E] hover:text-[#bb7702] transition">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input name="password" onChange={(e) => InputChange(e)} value={userLogin.password} id="password" type="password" placeholder="Enter your password" required className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none text-[#0F172A] placeholder:text-slate-400 focus:border-[#0F766E] focus:ring-2 focus:ring-[#47e8db]/30 transition" />
                            </div>

                            <div className="flex items-center gap-2">
                                <input name="isRemember" onChange={(e) => InputChange(e)} checked={userLogin.isRemember} id="remember" type="checkbox" className="outline-none border-none w-4 h-4 accent-[#0F766E]" />
                                <label htmlFor="remember" className="text-sm text-[#64748B]">Remember me</label>
                            </div>
                            <button disabled={isLoading} type="submit" className="w-full flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] text-white font-semibold py-3.5 rounded-xl transition-colors duration-300">
                                {isLoading ? "Logging Account..." : "Login"}
                                <IoArrowForward className="text-lg" />
                            </button>
                        </form>

                        <p className="text-center text-sm text-[#64748B] mt-7">
                            Don't have an account? <Link to="/getStarted" className="text-[#0F766E] font-semibold hover:text-[#bb7702] transition">Get Started</Link>
                        </p>

                    </div>

                </div>
            </div>
            <Footer />
        </>
    );
};

