import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackOutline, IoPersonOutline, IoLocationOutline, IoLockClosedOutline, IoLogOutOutline, IoBriefcaseOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { contextData } from "../../context/ContextData";
import { toast } from "react-toastify";

export default function Profile() {
    const { currentUser, logout, isLoading } = useContext(contextData);
    const navigate = useNavigate();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <p className="text-[#64748B]">Loading profile...</p>
                </div>
                <Footer />
            </>
        );
    }

    const user = currentUser.user;
    const role = currentUser.role;
    const isProfessional = role === "professional";


    /*================================= LOGOUT HANDLER ===================================================================== */
    const handleLogout = async () => {
        const result = await logout();
        if (result?.success) {
            toast.success("Logged out successfully");
            navigate("/login");
        } else {
            toast.error(result?.error || "Logout failed");
        }
    };

    /*================================== CHANGE PASSWORD =================================================================== */
    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("New password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        setPasswordLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/changePassword`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setShowPasswordForm(false);
            } else {
                toast.error(data.error || "Failed to change password");
            }
        } catch (e) {
            console.error("Failed to change password:", e);
            toast.error("Server failed to change password");
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-sm text-[#0F766E] hover:text-[#0F172A] mb-4"
                        >
                            <IoArrowBackOutline />
                            Go Back
                        </button>

                        <h1 className="text-3xl font-bold text-[#0F172A]">
                            Profile & Settings
                        </h1>

                        <p className="text-[#64748B] mt-2">
                            Manage your personal information and account settings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="bg-white rounded-2xl border border-slate-200 p-6">
                            <div className="w-16 h-16 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-2xl mx-auto">
                                <IoPersonOutline />
                            </div>

                            <h2 className="text-center text-xl font-semibold text-[#0F172A] mt-4">
                                {user?.name || "User"}
                            </h2>

                            <p className="text-center text-sm text-[#64748B] mt-1 capitalize">
                                {role || "User"}
                            </p>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="text-sm text-[#64748B]">
                                    Account Status
                                </p>
                                <p className="text-sm font-medium text-green-600 mt-1">
                                    {user?.isActive ? "Active" : "Inactive"}
                                </p>
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <IoPersonOutline className="text-[#0F766E] text-xl" />
                                    <h2 className="text-lg font-semibold text-[#0F172A]">
                                        Personal Information
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.name || ""}
                                            readOnly
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            readOnly
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            value={user?.phone || ""}
                                            readOnly
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none"
                                        />
                                    </div>

                                    {isProfessional && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                    Service Category
                                                </label>
                                                <input
                                                    type="text"
                                                    value={Array.isArray(user?.serviceCategory) ? user.serviceCategory.join(", ") : user?.serviceCategory || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none capitalize"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                    Experience
                                                </label>
                                                <input
                                                    type="text"
                                                    value={user?.experience ? `${user.experience} years` : ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                    Verification Status
                                                </label>
                                                <input
                                                    type="text"
                                                    value={user?.verificationStatus || ""}
                                                    readOnly
                                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none capitalize"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <IoLocationOutline className="text-[#0F766E] text-xl" />
                                    <h2 className="text-lg font-semibold text-[#0F172A]">
                                        Home Address
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {["house", "street", "area", "city", "state", "pincode"].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-[#0F172A] mb-2 capitalize">
                                                {field}
                                            </label>
                                            <input
                                                type="text"
                                                value={user?.address?.[field] || ""}
                                                readOnly
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-[#334155] outline-none"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {isProfessional && (
                                <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <IoBriefcaseOutline className="text-[#0F766E] text-xl" />
                                        <h2 className="text-lg font-semibold text-[#0F172A]">
                                            Professional Information
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <p className="text-sm text-[#64748B]">Availability</p>
                                            <p className="text-sm font-medium text-[#0F172A] mt-1 capitalize">
                                                {user?.availabilityStatus || "Not available"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#64748B]">Rating</p>
                                            <p className="text-sm font-medium text-[#0F172A] mt-1">
                                                {user?.rating ?? 0} / 5
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#64748B]">Total Jobs</p>
                                            <p className="text-sm font-medium text-[#0F172A] mt-1">
                                                {user?.totalJobs ?? 0}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-[#64748B]">Earnings</p>
                                            <p className="text-sm font-medium text-[#0F172A] mt-1">
                                                ₹{user?.earnings ?? 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl border border-slate-200 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <IoLockClosedOutline className="text-[#0F766E] text-xl" />
                                    <h2 className="text-lg font-semibold text-[#0F172A]">
                                        Security
                                    </h2>
                                </div>

                                <button onClick={() => setShowPasswordForm(!showPasswordForm)} className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-[#0F172A] hover:border-[#0F766E] transition">
                                    Change Password
                                </button>

                                {/* ============================= CHANGE PASSWORD BOX ========================================================= */}
                                {showPasswordForm && (
                                    <form onSubmit={handleChangePassword} className="mt-5 border-t border-slate-200 pt-5 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                Current Password
                                            </label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#0F766E]"
                                                placeholder="Enter current password"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#0F766E]"
                                                placeholder="Enter new password"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                                Confirm New Password
                                            </label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 border border-slate-200 rounded-xl outline-none focus:border-[#0F766E]"
                                                placeholder="Confirm new password"
                                            />
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                type="submit"
                                                disabled={passwordLoading}
                                                className="px-5 py-3 bg-[#0F766E] text-white rounded-xl text-sm font-medium hover:bg-[#0d665f] disabled:opacity-60"
                                            >
                                                {passwordLoading ? "Changing..." : "Change Password"}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setShowPasswordForm(false)}
                                                className="px-5 py-3 border border-slate-200 rounded-xl text-sm font-medium text-[#0F172A] hover:bg-slate-50"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl border border-red-100 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <IoLogOutOutline className="text-red-500 text-xl" />
                                    <h2 className="text-lg font-semibold text-[#0F172A]">
                                        Account
                                    </h2>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="px-5 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium hover:bg-red-100 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}