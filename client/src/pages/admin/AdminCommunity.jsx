import React, { useEffect, useState } from "react";
import { IoArrowBack, IoMailOutline, IoRefreshOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminCommunity() {
    const [communityData, setCommunityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch all community subscriber
    const fetchCommunityData = async () => {
        setLoading(true);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/community/all`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setCommunityData(data.communityData || []);
            } else {
                toast.error(data.error || "Failed to fetch community data");
            }
        } catch (e) {
            console.error("Failed to fetch community data:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommunityData();
    }, []);

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702] mb-4">
                                <IoArrowBack />Back
                            </button>
                            <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">Community</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">Community Subscribers</h1>
                            <p className="text-[#64748B] mt-1">View all users who joined the NestCare community.</p>
                        </div>
                        <button type="button" onClick={fetchCommunityData} className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] text-white font-semibold px-4 py-2.5 rounded-xl transition">
                            <IoRefreshOutline className="text-lg" />Refresh
                        </button>
                    </div>

                    {/* ============================= PRINTING ALL COMMUNITY EMAILS ============================================= */}
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="divide-y divide-slate-100">
                                {[1, 2, 3, 4].map((item) => (
                                    <div key={item} className="p-5 animate-pulse">
                                        <div className="h-5 bg-slate-200 rounded w-48"></div>
                                        <div className="h-4 bg-slate-200 rounded w-32 mt-2"></div>
                                    </div>
                                ))}
                            </div>
                        ) : communityData.length === 0 ? (
                            <div className="py-16 text-center">
                                <IoMailOutline className="text-4xl text-slate-300 mx-auto" />
                                <h2 className="text-lg font-semibold text-[#0F172A] mt-4">No community subscribers</h2>
                                <p className="text-sm text-[#64748B] mt-1">Community subscriber data will appear here.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[800px]">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Email</th>
                                            <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Subscribed At</th>
                                            <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                            <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Created At</th>
                                            <th className="text-left px-5 py-4 text-xs font-semibold text-slate-500 uppercase">Updated At</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {communityData.map((subscriber) => (
                                            <tr key={subscriber._id} className="hover:bg-slate-50 transition">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-[#dffaf7] flex items-center justify-center">
                                                            <IoMailOutline className="text-[#0F766E] text-lg" />
                                                        </div>
                                                        <span className="font-medium text-[#0F172A]">
                                                            {subscriber.email}
                                                        </span>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-[#64748B]">
                                                    {subscriber.subscribedAt ? new Date(subscriber.subscribedAt).toLocaleString("en-IN"): "N/A"}
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${subscriber.isActive
                                                            ? "bg-green-100 text-green-700": "bg-red-100 text-red-700"}`}>
                                                        {subscriber.isActive ? "Active" : "Inactive"}
                                                    </span>
                                                </td>

                                                <td className="px-5 py-4 text-sm text-[#64748B]">
                                                    {subscriber.createdAt ? new Date(subscriber.createdAt).toLocaleString("en-IN") : "N/A"}
                                                </td>
                                                <td className="px-5 py-4 text-sm text-[#64748B]">
                                                    {subscriber.updatedAt ? new Date(subscriber.updatedAt).toLocaleString("en-IN") : "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {!loading && communityData.length > 0 && (
                        <p className="text-sm text-[#64748B] mt-4">
                            Total subscribers:{" "}
                            <span className="font-semibold text-[#0F172A]">
                                {communityData.length || 0}
                            </span>
                        </p>
                    )}

                </main>
            </div>

            <Footer />
        </>
    );
}