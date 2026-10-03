import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiMail, FiCheck, FiClock, FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    //Fetch All contact message
    async function fetchContacts() {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/contact/all`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setContacts(data.contacts || []);
            } else {
                toast.error(data.error || "Failed to fetch contacts");
            }
        } catch (e) {
            console.error("Failed to fetch contacts:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    }

    //Read or unread 
    async function updateStatus(id, status) {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/contact/status/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ status })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success || "Status updated");
                fetchContacts();
            } else {
                toast.error(data.error || "Failed to update status");
            }
        } catch (e) {
            console.error("Failed to update contact status:", e);
            toast.error("Server connection failed");
        }
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F9FAFB] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-5">
                        <Link to="/admin/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0F766E]">
                            <FiArrowLeft /> Back to Dashboard
                        </Link>
                    </div>

                    <div className="mb-8 flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0F172A] sm:text-3xl">Contact Messages</h1>
                            <p className="mt-1 text-sm text-[#64748B]">View messages submitted through the contact form.</p>
                        </div>

                        <button type="button" onClick={fetchContacts} disabled={loading}
                            className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-[#0F766E]/30 hover:bg-[#0F766E]/5 hover:text-[#0F766E] disabled:cursor-not-allowed disabled:opacity-50">
                            <FiRefreshCw className={loading ? "animate-spin" : ""} /> Refresh
                        </button>
                    </div>


                    {/* ========================= PRINT ALL CONTACT MESSAGES ========================================== */}
                    {loading ? (
                        <div className="rounded-xl border border-slate-100 bg-white p-10 text-center text-slate-500 shadow-sm">Loading contacts...</div>
                    ) : contacts.length === 0 ? (
                        <div className="rounded-xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                            <FiMail className="mx-auto mb-3 text-4xl text-slate-300" />
                            <h2 className="text-lg font-semibold text-[#0F172A]">No messages yet</h2>
                            <p className="mt-1 text-sm text-[#64748B]">Contact form submissions will appear here.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {contacts.map((contact) => (
                                <div key={contact._id} className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-lg font-bold text-[#0F172A]">{contact.subject}</h2>

                                                {contact.status === "new" ? (
                                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                                                        New
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                                        Read
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                                                <p><span className="font-semibold text-slate-700">Name:</span> {contact.name}</p>
                                                <p><span className="font-semibold text-slate-700">Email:</span> {contact.email}</p>
                                                <p><span className="font-semibold text-slate-700">Date:</span> {new Date(contact.createdAt).toLocaleString()}</p>
                                            </div>

                                            <div className="mt-4 rounded-lg bg-slate-50 p-4">
                                                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Message</p>
                                                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{contact.message}</p>
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            {contact.status === "new" ? (
                                                <button onClick={() => updateStatus(contact._id, "read")} className="flex items-center gap-2 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0b5f59]">
                                                    <FiCheck /> Mark as Read
                                                </button>
                                            ) : (
                                                <button onClick={() => updateStatus(contact._id, "new")} className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
                                                    <FiClock /> Mark as New
                                                </button>
                                            )}
                                        </div>
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
}
