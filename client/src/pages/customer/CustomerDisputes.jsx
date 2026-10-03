import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IoArrowBack } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CustomerDisputes() {
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);

    /*================== FETCH ALL CUSTOMER DISPUTES AND RESOLUTION ===================================== */
    const fetchDisputes = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dispute/my`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setDisputes(data.disputeData || []);
            } else {
                toast.error(data.error || "Failed to fetch disputes");
            }
        } catch (e) {
            console.error("Failed to fetch disputes:", e);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, []);

    const getStatusClass = (status) => {
        if (status === "open") return "bg-red-100 text-red-700";
        if (status === "under-review") return "bg-amber-100 text-amber-700";
        if (status === "resolved") return "bg-green-100 text-green-700";
        if (status === "rejected") return "bg-slate-100 text-slate-700";
        return "bg-slate-100 text-slate-700";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <p className="text-slate-500">Loading disputes...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
                <div className="mx-auto max-w-5xl">
                    <button onClick={() => window.history.back()} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0b5f59]">
                        <IoArrowBack /> Back
                    </button>

                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0F172A]">My Disputes</h1>
                        <p className="mt-1 text-[#64748B]">Track your submitted service disputes.</p>
                    </div>

                    {/*========================== PRINT ALL DISPUTES AND RESOLUTION ============================== */}
                    {disputes.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <h2 className="text-xl font-semibold text-[#0F172A]">No disputes</h2>
                            <p className="mt-2 text-sm text-slate-500">You have not raised any disputes yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {disputes.map((dispute) => (
                                <div
                                    key={dispute._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="text-lg font-bold text-[#0F172A]">{dispute.subject}</h2>
                                            <p className="mt-1 text-sm text-[#64748B]">{dispute.booking?.service?.name || "Service booking"} </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(dispute.status)}`}>
                                            {dispute.status.replace("-", " ")}
                                        </span>
                                    </div>

                                    <div className="mt-5 space-y-3 text-sm">
                                        <p className="text-slate-600">
                                            <span className="font-semibold text-[#0F172A]">
                                                Professional:
                                            </span>{" "}
                                            {dispute.professional?.name || "N/A"}
                                        </p>

                                        <div>
                                            <p className="font-semibold text-[#0F172A]">Description</p>
                                            <p className="mt-1 text-slate-600">{dispute.description}</p>
                                        </div>
                                        {dispute.resolution && (
                                            <div className="rounded-xl bg-slate-50 p-4">
                                                <p className="font-semibold text-[#0F172A]">Resolution</p>
                                                <p className="mt-1 text-slate-600">{dispute.resolution}</p>
                                            </div>
                                        )}
                                    </div>

                                    <p className="mt-5 text-xs text-slate-400">
                                        Submitted on{" "}
                                        {new Date(dispute.createdAt).toLocaleDateString("en-IN")}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </>
    );
}