import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw, FiSearch, FiUserCheck, FiUserX } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminProfessionals() {
    const [professionals, setProfessionals] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);


    //FETCH ALL PROFESSIONAL
    const fetchProfessionals = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/all`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setProfessionals(data.professionalData || []);
            } else {
                toast.error(data.error || "Failed to fetch professionals");
            }
        } catch (e) {
            console.error("Failed to fetch professionals:", e);
            toast.error("Server failed to fetch professionals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfessionals();
    }, []);

    //Search handler
    const filteredProfessionals = professionals.filter((professional) => {
        const searchText = search.toLowerCase();
        return (
            professional.name?.toLowerCase().includes(searchText) ||
            professional.email?.toLowerCase().includes(searchText) ||
            professional.phone?.includes(searchText) ||
            professional.serviceCategory[0]?.includes(searchText)
        );
    });




    // UPDATE PROFESSIONAL VERIFICATION
    const updateVerification = async (professionalId, action) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/${professionalId}/verification/${action}`,
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );
            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                    fetchProfessionals();
                } else if (data.warning) {
                    toast.warning(data.warning);
                } else {
                    toast.error(data.error || "Failed to update verification");
                }
            } else {
                toast.error(data.error || "Failed to update verification");
            }
        } catch (e) {
            console.error("Failed to update verification:", e);
            toast.error("Server failed to update verification");
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <Link to="/admin/dashboard" className="mb-3 inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F766E]" >
                                <FiArrowLeft />Back to Dashboard
                            </Link>
                            <h1 className="text-3xl font-bold text-[#0F172A]">Professionals</h1>
                            <p className="mt-1 text-[#64748B]">Manage and view all registered professionals.</p>
                        </div>

                        <button onClick={fetchProfessionals} disabled={loading} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0d655f] disabled:opacity-60">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />Refresh
                        </button>
                    </div>
                    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="relative">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, phone or category..." className="w-full rounded-lg border border-slate-200 py-3 pl-11 pr-4 text-sm text-[#0F172A] outline-none focus:border-[#0F766E]" />
                        </div>
                    </div>

                    {loading ? (
                        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0F766E]"></div>
                            <p className="mt-4 text-sm text-[#64748B]">Loading professionals...</p>
                        </div>
                    ) : filteredProfessionals.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
                            <FiUserCheck className="mx-auto text-4xl text-slate-300" />
                            <h3 className="mt-4 text-lg font-semibold text-[#0F172A]">No professionals found</h3>
                            <p className="mt-1 text-sm text-[#64748B]">{search ? "Try a different search." : "No professionals are registered yet."}</p>
                        </div>
                    ) : (
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {filteredProfessionals.map((professional) => (
                                <div key={professional._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="font-semibold text-[#0F172A]">{professional.name}</h2>
                                            <p className="mt-1 text-sm text-[#64748B]">{professional.email}</p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${professional.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {professional.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm">
                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Phone</span>
                                            <span className="font-medium text-[#0F172A]">{professional.phone || "-"}</span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Category</span>
                                            <span className="font-medium capitalize text-[#0F172A]">{Array.isArray(professional?.serviceCategory) ? professional.serviceCategory.join(", ") : professional?.serviceCategory || ""}</span>
                                        </div>
                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Experience</span>
                                            <span className="font-medium text-[#0F172A]">{professional.experience || 0} years</span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Verification</span>
                                            <span
                                                className={`font-medium capitalize ${professional.verificationStatus === "approved" ? "text-green-600" : professional.verificationStatus === "rejected" ? "text-red-600" : "text-amber-600"}`}>
                                                {professional.verificationStatus || "pending"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Availability</span>
                                            <span className="font-medium capitalize text-[#0F172A]">{professional.availabilityStatus || "offline"}</span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Total Jobs</span>
                                            <span className="font-medium text-[#0F172A]">{professional.totalJobs || 0}</span>
                                        </div>

                                        <div className="flex justify-between gap-4">
                                            <span className="text-[#64748B]">Rating</span>
                                            <span className="font-medium text-[#0F172A]">{professional.rating || 0}</span>
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            {professional.isActive ? (
                                                <>
                                                    <FiUserCheck className="text-green-600" />
                                                    <span className="text-green-700">Account active</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiUserX className="text-red-600" />
                                                    <span className="text-red-700">Account inactive</span>
                                                </>
                                            )}
                                        </div>

                                        {professional.verificationStatus === "pending" && (
                                            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                                                <button onClick={() => updateVerification(professional._id, "approve")} className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700">
                                                    Approve
                                                </button>
                                                <button onClick={() => updateVerification(professional._id, "reject")} className="flex-1 rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};