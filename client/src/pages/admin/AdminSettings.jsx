import React from "react";
import { IoArrowBack, IoInformationCircleOutline, IoLogOutOutline, IoSettingsOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { contextData } from "../../context/ContextData";
import { useContext } from "react";

export default function AdminSettings() {
    const { currentUser, logout } = useContext(contextData);
    const navigate = useNavigate();
    const admin = currentUser?.user;

    //HANDLE LOGOUT
    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result?.success) {
                toast.success(result.success);
            } else {
                toast.error(result?.error || "Logout failed");
            }
            navigate("/login");
        } catch (e) {
            console.error("Admin logout failed:", e);
            toast.error("Logout failed");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50">
                <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                    <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702] mb-6">
                        <IoArrowBack /> Back
                    </button>
                    <div className="mb-8">
                        <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">Admin</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">Settings</h1>
                        <p className="text-[#64748B] mt-2">Manage and view your administrator account settings.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-2xl">
                                <IoSettingsOutline />
                            </div>
                            <h2 className="text-xl font-bold text-[#0F172A] mt-5">Admin Account</h2>
                            <div className="mt-6 space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Name</p>
                                    <p className="text-sm font-medium text-[#0F172A] mt-1">{admin?.name || "Administrator"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Email</p>
                                    <p className="text-sm font-medium text-[#0F172A] mt-1 break-all">{admin?.email || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Account Type</p>
                                    <span className="inline-flex mt-2 px-3 py-1 rounded-full bg-[#dffaf7] text-[#0F766E] text-xs font-semibold">Administrator</span>
                                </div>
                            </div>
                        </section>
                        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#bb7702] flex items-center justify-center text-2xl">
                                <IoInformationCircleOutline />
                            </div>
                            <h2 className="text-xl font-bold text-[#0F172A] mt-5">System Information</h2>
                            <div className="mt-6 space-y-5">
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Platform</p>
                                    <p className="text-sm font-medium text-[#0F172A] mt-1">NestCare</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</p>
                                    <p className="text-sm font-medium text-[#0F172A] mt-1">System Administrator</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Access</p>
                                    <p className="text-sm font-medium text-[#0F172A] mt-1">Full administrative access</p>
                                </div>
                            </div>
                        </section>
                    </div>
                    <section className="bg-white border border-red-100 rounded-2xl p-6 shadow-sm mt-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#0F172A]">Sign Out</h2>
                                <p className="text-sm text-[#64748B] mt-1">Sign out from your NestCare administrator account.</p>
                            </div>
                            <button type="button" onClick={handleLogout} className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl transition">
                                <IoLogOutOutline />
                                Sign Out
                            </button>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
}
