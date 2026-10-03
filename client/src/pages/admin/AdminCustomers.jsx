
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FiUsers, FiRefreshCw, FiMapPin, FiPhone, FiMail, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function AdminCustomers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    //Fetch all customers data
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/user/all`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setCustomers(data.customerData || []);
            } else {
                toast.error(data.error || "Failed to fetch customers");
            }
        } catch (e) {
            console.error("Failed to fetch customers:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    const refreshCustomers = async () => {
        setRefreshing(true);
        await fetchCustomers();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <section className="rounded-3xl bg-[#0F766E] p-6 shadow-lg sm:p-8">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">NestCare Admin</p>
                                <h1 className="mt-2 text-3xl font-extrabold text-white">Customer Management</h1>
                                <p className="mt-2 text-sm text-teal-50">View registered NestCare customers and their account details.</p>
                            </div>
                            <button
                                type="button"
                                onClick={refreshCustomers}
                                disabled={refreshing}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0F766E] disabled:opacity-70"
                            >
                                <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                                {refreshing ? "Refreshing..." : "Refresh"}
                            </button>
                        </div>
                    </section>

                    <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 p-5 sm:p-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <FiUsers size={21} />
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-[#0F172A]">Registered Customers</h2>
                                    <p className="text-sm text-[#64748B]">{customers.length} customers</p>
                                </div>
                            </div>
                        </div>

                        {/* ================== PRINT ALL CUSTOMER ================================================== */}
                        {loading ? (
                            <div className="p-12 text-center">
                                <FiRefreshCw className="mx-auto animate-spin text-[#0F766E]" size={25} />
                                <p className="mt-3 text-sm text-[#64748B]">Loading customers...</p>
                            </div>
                        ) : customers.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                    <FiUsers size={27} />
                                </div>
                                <p className="mt-4 font-bold text-[#0F172A]">No customers found</p>
                                <p className="mt-1 text-sm text-[#64748B]">Registered customers will appear here.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4 p-5 sm:p-6 lg:grid-cols-2">
                                {customers.map((customer) => (
                                    <div key={customer._id} className="rounded-2xl border border-slate-200 p-5 transition hover:border-teal-200 hover:shadow-sm">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-bold text-[#0F766E]">
                                                    {customer.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-bold text-[#0F172A]">{customer.name}</h3>
                                                    <p className="truncate text-sm text-[#64748B]">{customer.email}</p>
                                                </div>
                                            </div>

                                            {customer.isActive ? (
                                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                                                    <FiCheckCircle />Active
                                                </span>
                                            ) : (
                                                <span className="flex shrink-0 items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                                                    <FiXCircle />Inactive
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                                <FiMail className="shrink-0 text-[#0F766E]" />
                                                <span className="truncate">{customer.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[#64748B]">
                                                <FiPhone className="shrink-0 text-[#0F766E]" />
                                                <span>{customer.phone}</span>
                                            </div>
                                            <div className="flex items-start gap-2 text-sm text-[#64748B]">
                                                <FiMapPin className="mt-0.5 shrink-0 text-[#0F766E]" />
                                                <span>
                                                    {customer.address?.house}, {customer.address?.street}, {customer.address?.area},{" "}
                                                    {customer.address?.city}, {customer.address?.state} - {customer.address?.pincode}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    );
}
