import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/images/nestcare.png";
import { FiHeart, FiLogIn, FiLogOut, FiMenu, FiX, FiUser, FiGrid, FiChevronDown, FiArrowRight, FiMail } from "react-icons/fi";
import { contextData } from "../context/ContextData";
import { toast } from "react-toastify";

export default function Navbar({ notify }) {
    const { currentUser, logout, isLoading } = useContext(contextData);
    const [menuOpen, setMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();

    function dropdownButton(e) {
        e.stopPropagation();
        setDropdownOpen(!dropdownOpen);
    }

    document.addEventListener('click',(e)=>{
        e.stopPropagation();
        setDropdownOpen(false)
    })

    async function logoutHandler() {
        try {
            const message = await logout();

            if (message.success) {
                toast.success(message.success);
                navigate("/login");
            } else {
                toast.error(message.error || "Logout failed");
            }
        } catch (e) {
            toast.error("Something went wrong");
        } finally {
            setMenuOpen(false);
            setDropdownOpen(false);
        }
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white shadow-sm">
                {notify && (
                    <div className="flex items-center justify-center gap-2 bg-[#0F766E] px-4 py-2 text-center text-xs font-semibold text-white">
                        <FiHeart className="shrink-0" />
                        <span className="truncate">{notify}</span>
                    </div>
                )}

                <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                    <Link to="/" className="shrink-0">
                        <img src={Logo} alt="NestCare Logo" className="w-[105px] sm:w-[110px]" />
                    </Link>

                    <ul className="hidden items-center gap-1 sm:flex">
                        <li>
                            <Link to="/services" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#0F766E]/5 hover:text-[#0F766E]">Services</Link>
                        </li>
                        <li>
                            <Link to="/howitworks" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#0F766E]/5 hover:text-[#0F766E]">How It Works</Link>
                        </li>
                        <li>
                            <Link to="/plans" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#0F766E]/5 hover:text-[#0F766E]">Plans</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-[#0F766E]/5 hover:text-[#0F766E]">Contact</Link>
                        </li>
                    </ul>

                    <div className="hidden items-center gap-3 sm:flex">
                        {currentUser.user && !isLoading ? (
                            <div className="relative">
                                <button onClick={(e) => dropdownButton(e)} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${dropdownOpen ? "border-[#0F766E]/30 bg-[#0F766E]/5 text-[#0F766E]" : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"}`}>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F766E] text-xs font-bold text-white">
                                        {currentUser.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                    <span className="max-w-[130px] truncate">Hi, {currentUser.user?.name || "User"}</span>
                                    <FiChevronDown className={`transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-100 bg-white py-1 shadow-xl ring-1 ring-black/5">
                                        <div className="border-b border-slate-100 px-4 py-3">
                                            <p className="truncate text-sm font-semibold text-[#0F172A]">{currentUser.user?.name || "User"}</p>
                                            <p className="mt-0.5 text-xs capitalize text-slate-500">{currentUser.role || "User"}</p>
                                        </div>

                                        <Link to={currentUser.role === "customer" ? "/user/dashboard" : currentUser.role === "professional" ? "/professional/dashboard" : currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#0F766E]">
                                            <FiGrid className="text-slate-400" /> Dashboard
                                        </Link>

                                        {currentUser.role !== "admin" ? (
                                            <Link to="/user/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#0F766E]">
                                                <FiUser className="text-slate-400" /> Profile
                                            </Link>
                                        ) : (
                                            <Link to="/admin/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#0F766E]">
                                                <FiUser className="text-slate-400" /> Settings
                                            </Link>
                                        )}

                                        <Link to="/contact" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#0F766E]">
                                            <FiMail className="text-slate-400" /> Contact
                                        </Link>

                                        <div className="my-1 border-t border-slate-100" />

                                        <button onClick={logoutHandler} className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50">
                                            <FiLogOut /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : !isLoading && (
                            <>
                                <Link to="/login" className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-[#0F766E]">
                                    <FiLogIn /> Login
                                </Link>
                                <Link to="/getStarted" className="group flex items-center gap-1.5 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0b5f59] hover:shadow-md lg:px-5">
                                    Get Started <FiArrowRight className="transition-transform group-hover:translate-x-1" />
                                </Link>
                            </>
                        )}
                    </div>

                    <button onClick={() => setMenuOpen(!menuOpen)} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 sm:hidden">
                        {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
                    </button>
                </nav>

                {menuOpen && (
                    <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-sm sm:hidden">
                        <ul className="space-y-1">
                            <li>
                                <Link to="/services" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">Services</Link>
                            </li>
                            <li>
                                <Link to="/howitworks" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">How It Works</Link>
                            </li>
                            <li>
                                <Link to="/plans" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">Plans</Link>
                            </li>
                            <li>
                                <Link to="/contact" onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">Contact</Link>
                            </li>
                        </ul>

                        <div className="mt-4 border-t border-slate-100 pt-4">
                            {currentUser.user && !isLoading ? (
                                <div className="space-y-1">
                                    <div className="mb-2 rounded-xl bg-slate-50 px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0F766E] text-sm font-bold text-white">
                                                {currentUser.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-semibold text-[#0F172A]">{currentUser.user?.name || "User"}</p>
                                                <p className="text-xs capitalize text-slate-500">{currentUser.role || "User"}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link to={currentUser.role === "customer" ? "/user/dashboard" : currentUser.role === "professional" ? "/professional/dashboard" : currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"} onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">
                                        <FiGrid /> Dashboard
                                    </Link>

                                    {currentUser.role !== "admin" ? (
                                        <Link to="/user/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">
                                            <FiUser /> Profile
                                        </Link>
                                    ) : (
                                        <Link to="/admin/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">
                                            <FiUser /> Settings
                                        </Link>
                                    )}

                                    <Link to="/contact" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-[#0F766E]">
                                        <FiMail /> Contact
                                    </Link>

                                    <button onClick={logoutHandler} className="mt-2 flex w-full items-center gap-3 border-t border-slate-100 px-3 py-3 text-left text-base font-medium text-red-600 hover:bg-red-50">
                                        <FiLogOut /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                                        <FiLogIn /> Login
                                    </Link>
                                    <Link to="/getStarted" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] py-3 text-sm font-semibold text-white hover:bg-[#0b5f59]">
                                        Get Started <FiArrowRight />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </header>
        </>
    );
}