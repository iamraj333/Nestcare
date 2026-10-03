import { useContext, useEffect, useState } from "react";
import { contextData } from "../../context/ContextData";
import { FiAlertCircle, FiMail } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
    FiUsers,
    FiBriefcase,
    FiUserCheck,
    FiUserX,
    FiCheckCircle,
    FiRefreshCw,
    FiSettings,
    FiCalendar,
    FiArrowRight,
    FiX,
    FiMapPin
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMailOutline } from "react-icons/io5";

export default function Dashboard() {
    const { currentUser } = useContext(contextData);

    const [pendingProfessional, setPendingProfessionals] = useState([]);
    const [proposedBooking, setProposedBooking] = useState([]);
    const [approvedAvailableProfessional, setApprovedAvailableProfessional] = useState([]);
    const [customerCount, setCustomerCount] = useState(0);
    const [assignedProfessional, setAssignedProfessional] = useState("");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [proposedBookingLoading, setProposedBookingLoading] = useState(true);
    const [assignLoading, setAssignLoading] = useState(false);
    const [approving, setApproving] = useState("");
    const [rejecting, setRejecting] = useState("");
    const [refreshing, setRefreshing] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.RouteError) {
            toast.error(location.state.RouteError);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, []);

    // FETCH PENDING PROFESSIONALS
    const fetchPendingProfessionals = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/verification/pending`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await response.json();
            if (response.ok) {
                setPendingProfessionals(data.pendingProfessional || []);
            } else {
                toast.error(data.error || "Failed to fetch professionals");
            }
        } catch (e) {
            console.error("Failed to fetch professionals:", e);
            toast.error("Server connection failed");
        } finally {
            setIsLoading(false);
        }
    };

    // FETCH PROPOSED BOOKINGS
    const fetchProposedBookings = async () => {
        setProposedBookingLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/bookings/proposed`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );
            const data = await response.json();
            if (response.ok) {
                setProposedBooking(data.ProposedBooking || []);
            } else {
                toast.error(data.error || "Failed to fetch bookings");
            }
        } catch (e) {
            console.error("Failed to fetch proposed bookings:", e);
            toast.error("Server connection failed");
        } finally {
            setProposedBookingLoading(false);
        }
    };

    // FETCH AVAILABLE PROFESSIONALS
    const fetchAvailableProfessionals = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/available`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if (response.ok) {
                setApprovedAvailableProfessional(
                    data.AllActiveApprovedProfessional || []
                );
            } else {
                toast.error(data.error || "Failed to fetch professionals");
            }
        } catch (e) {
            console.error("Failed to fetch available professionals:", e);
            toast.error("Server connection failed");
        }
    };

    // FETCH CUSTOMERS
    const fetchCustomers = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/user/all`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if (response.ok) {
                setCustomerCount((data.customerData || []).length);
            } else {
                toast.error(data.error || "Failed to fetch customers");
            }
        } catch (e) {
            console.error("Failed to fetch customers:", e);
        }
    };

    // REFRESH DASHBOARD
    const refreshDashboard = async () => {
        setRefreshing(true);
        await Promise.all([
            fetchPendingProfessionals(),
            fetchProposedBookings(),
            fetchAvailableProfessionals(),
            fetchCustomers()
        ]);
        setRefreshing(false);
    };

    // APPROVE PROFESSIONAL
    const ProfessionalApproveBtn = async (professionalId) => {
        setApproving(professionalId);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/${professionalId}/verification/approve`,
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.success);

                await Promise.all([
                    fetchPendingProfessionals(),
                    fetchAvailableProfessionals()
                ]);
            } else {
                toast.error(data.error || "Failed to approve professional");
            }
        } catch (e) {
            console.error("Server failed to approve:", e);
            toast.error("Server failed to approve professional");
        } finally {
            setApproving("");
        }
    };

    // REJECT PROFESSIONAL
    const ProfessionalRejectBtn = async (professionalId) => {
        setRejecting(professionalId);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/professional/${professionalId}/verification/reject`,
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.success);
                await fetchPendingProfessionals();
            } else {
                toast.error(data.error || "Failed to reject professional");
            }
        } catch (e) {
            console.error("Server failed to reject:", e);
            toast.error("Server failed to reject professional");
        } finally {
            setRejecting("");
        }
    };

    // ASSIGN PROFESSIONAL
    const assignProfessional = async () => {
        if (!selectedBooking || !assignedProfessional) {
            toast.error("Please select a professional");
            return;
        }

        setAssignLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/admin/booking/professionalAssign/${selectedBooking._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        professionalInfo: assignedProfessional
                    })
                }
            );

            const data = await response.json();
            if (response.ok && data.success) {
                toast.success(data.success);

                setShowAssignModal(false);
                setSelectedBooking(null);
                setAssignedProfessional("");

                await Promise.all([
                    fetchProposedBookings(),
                    fetchAvailableProfessionals()
                ]);
            } else {
                toast.error(data.error || "Failed to assign professional");
            }
        } catch (e) {
            console.error("Server connection failed to assign professional:", e);
            toast.error("Server connection failed");
        } finally {
            setAssignLoading(false);
        }
    };

    // OPEN ASSIGN MODAL
    const openAssignModal = (booking) => {
        setSelectedBooking(booking);
        setAssignedProfessional("");
        setShowAssignModal(true);
    };

    // CLOSE ASSIGN MODAL
    const closeAssignModal = () => {
        if (assignLoading) return;

        setShowAssignModal(false);
        setSelectedBooking(null);
        setAssignedProfessional("");
    };

    useEffect(() => {
        refreshDashboard();
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F8FAFC] px-4 py-6 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">

                    {/* ========================= ADMIN INFO ============================================================ */}
                    <section className="overflow-hidden rounded-3xl bg-[#0F766E] shadow-lg">
                        <div className="relative p-6 sm:p-8 lg:p-10">
                            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/10"></div>
                            <div className="absolute -bottom-24 right-20 h-48 w-48 rounded-full bg-[#F59E0B]/20"></div>
                            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">NestCare Admin</p>
                                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Admin Dashboard</h1>
                                    <p className="mt-2 max-w-xl text-sm leading-6 text-teal-50">Monitor professionals, bookings and daily home-care operations from one place.</p>
                                </div>

                                <button type="button" onClick={refreshDashboard} disabled={refreshing} className="relative inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-bold text-[#0F766E] shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 md:self-center">
                                    <FiRefreshCw className={refreshing ? "animate-spin" : ""} />
                                    {refreshing ? "Refreshing..." : "Refresh Dashboard"}
                                </button>
                            </div>
                        </div>
                    </section>

                    {/*=============================== ADMIN OPERATION ===============================================*/}
                    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                    <FiUsers size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Verification</span>
                            </div>
                            <p className="mt-5 text-3xl font-extrabold text-[#0F172A]">{pendingProfessional.length}</p>
                            <p className="mt-1 text-sm font-medium text-[#64748B]">Professionals pending approval</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-teal-50 p-3 text-[#0F766E]">
                                    <FiCalendar size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Bookings</span>
                            </div>
                            <p className="mt-5 text-3xl font-extrabold text-[#0F172A]">{proposedBooking.length}</p>
                            <p className="mt-1 text-sm font-medium text-[#64748B]">Bookings waiting for assignment</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                                    <FiCheckCircle size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Available</span>
                            </div>
                            <p className="mt-5 text-3xl font-extrabold text-[#0F172A]">{approvedAvailableProfessional.length}
                            </p>
                            <p className="mt-1 text-sm font-medium text-[#64748B]">Professionals ready for jobs</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <FiUserCheck size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                    Customers
                                </span>
                            </div>
                            <p className="mt-5 text-3xl font-extrabold text-[#0F172A]">{customerCount}</p>
                            <p className="mt-1 text-sm font-medium text-[#64748B]">Registered customers</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                    <FiSettings size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Plans</span>
                            </div>
                            <p className="mt-5 text-2xl font-extrabold text-[#0F172A]">Manage</p>
                            <p className="mt-1 text-sm font-medium text-[#64748B]">Subscription plans</p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                            <div className="flex items-center justify-between">
                                <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
                                    <FiBriefcase size={21} />
                                </div>
                                <span className="text-xs font-bold uppercase tracking-wide text-slate-400">Account</span>
                            </div>
                            <p className="mt-5 text-xl font-extrabold text-[#0F172A]">Administrator</p>
                            <p className="mt-1 truncate text-sm text-[#64748B]">{currentUser.user?.email || ""}</p>
                        </div>
                    </section>

                    {/*=================================== QUICK MANAGEMENT ====================================================*/}
                    <section className="mt-8">
                        <div className="mb-4">
                            <h2 className="text-xl font-extrabold text-[#0F172A]">Quick Management</h2>
                            <p className="mt-1 text-sm text-[#64748B]">Access the main NestCare management areas.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/customers")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <FiUserCheck size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Customers</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    View and manage registered customers.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/professionals")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                        <FiUsers size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Professionals</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    View and manage all professionals.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/page/subscriptionPlan")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-teal-50 p-3 text-[#0F766E]">
                                        <FiSettings size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Subscription Plans</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    Create and manage customer plans.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/page/services")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                                        <FiBriefcase size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Services</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    Manage services, pricing and availability.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/bookings")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                                        <FiCalendar size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Booking Management</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    View and monitor all customer bookings.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/disputes")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-red-50 p-3 text-red-600">
                                        <FiAlertCircle size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Dispute Management</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    Review and manage customer disputes.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/community")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                        <IoMailOutline size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Community</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    View community subscribers.
                                </p>
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate("/admin/contacts")}
                                className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-200 hover:shadow-md sm:p-5"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="rounded-xl bg-teal-50 p-3 text-[#0F766E]">
                                        <FiMail size={21} />
                                    </div>
                                    <FiArrowRight className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-[#0F766E]" />
                                </div>
                                <h3 className="mt-5 font-bold text-[#0F172A]">Contact Messages</h3>
                                <p className="mt-1 text-xs leading-5 text-[#64748B]">
                                    View customer contact messages.
                                </p>
                            </button>
                        </div>
                    </section>

                    {/* ===================================== PROFESSIONAL VERIFICATION =====================================================*/}
                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                                        <FiUsers size={17} />
                                    </div>
                                    <h2 className="text-lg font-extrabold text-[#0F172A]">
                                        Professional Verification
                                    </h2>
                                </div>
                                <p className="mt-2 text-sm text-[#64748B]">
                                    Review professionals waiting for approval.
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                                {pendingProfessional.length} Pending
                            </span>
                        </div>

                        {isLoading ? (
                            <div className="p-12 text-center">
                                <FiRefreshCw
                                    className="mx-auto animate-spin text-[#0F766E]"
                                    size={24}
                                />
                                <p className="mt-3 text-sm text-[#64748B]">
                                    Loading professionals...
                                </p>
                            </div>
                        ) : pendingProfessional.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                                    <FiCheckCircle size={28} />
                                </div>
                                <p className="mt-4 font-bold text-[#0F172A]">
                                    No pending professionals
                                </p>
                                <p className="mt-1 text-sm text-[#64748B]">
                                    All professional registrations have been reviewed.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {pendingProfessional.map((professional) => (
                                    <div key={professional._id} className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex min-w-0 gap-4">
                                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 font-bold text-[#0F766E]">
                                                    {professional.name?.charAt(0)?.toUpperCase()}
                                                </div>

                                                <div className="min-w-0">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <h3 className="font-bold text-[#0F172A]">
                                                            {professional.name}
                                                        </h3>
                                                        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">
                                                            Pending
                                                        </span>
                                                    </div>

                                                    <p className="mt-1 truncate text-sm text-[#64748B]">
                                                        {professional.email}
                                                    </p>

                                                    <p className="mt-1 text-sm text-[#64748B]">
                                                        {professional.phone}
                                                    </p>

                                                    <div className="mt-3 flex flex-wrap gap-2">
                                                        {Array.isArray(professional.serviceCategory) ? (
                                                            professional.serviceCategory.map((category) => (
                                                                <span
                                                                    key={category}
                                                                    className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-[#0F766E]"
                                                                >
                                                                    {category}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            professional.serviceCategory && (
                                                                <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold capitalize text-[#0F766E]">
                                                                    {professional.serviceCategory}
                                                                </span>
                                                            )
                                                        )}

                                                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                            {professional.experience || 0} years experience
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 border-t border-slate-100 pt-4 lg:border-0 lg:pt-0">
                                                <button
                                                    type="button"
                                                    disabled={
                                                        approving === professional._id ||
                                                        rejecting === professional._id
                                                    }
                                                    onClick={() =>
                                                        ProfessionalApproveBtn(professional._id)
                                                    }
                                                    className="flex-1 rounded-lg bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                                                >
                                                    {approving === professional._id
                                                        ? "Approving..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    disabled={
                                                        approving === professional._id ||
                                                        rejecting === professional._id
                                                    }
                                                    onClick={() =>
                                                        ProfessionalRejectBtn(professional._id)
                                                    }
                                                    className="flex-1 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
                                                >
                                                    {rejecting === professional._id
                                                        ? "Rejecting..."
                                                        : "Reject"}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/*============================= PROPOSED BOOKINGS =============================================================*/}
                    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="rounded-lg bg-teal-50 p-2 text-[#0F766E]">
                                        <FiCalendar size={17} />
                                    </div>
                                    <h2 className="text-lg font-extrabold text-[#0F172A]">
                                        Proposed Bookings
                                    </h2>
                                </div>

                                <p className="mt-2 text-sm text-[#64748B]">
                                    Assign an available professional to customer bookings.
                                </p>
                            </div>

                            <span className="w-fit rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-[#0F766E]">
                                {proposedBooking.length} Pending
                            </span>
                        </div>

                        {proposedBookingLoading ? (
                            <div className="p-12 text-center">
                                <FiRefreshCw
                                    className="mx-auto animate-spin text-[#0F766E]"
                                    size={24}
                                />
                                <p className="mt-3 text-sm text-[#64748B]">
                                    Loading bookings...
                                </p>
                            </div>
                        ) : proposedBooking.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-[#0F766E]">
                                    <FiCalendar size={27} />
                                </div>

                                <p className="mt-4 font-bold text-[#0F172A]">
                                    No proposed bookings
                                </p>

                                <p className="mt-1 text-sm text-[#64748B]">
                                    There are no bookings waiting for professional assignment.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {proposedBooking.map((booking) => (
                                    <div key={booking._id} className="p-5 sm:p-6">
                                        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h3 className="font-bold text-[#0F172A]">
                                                        {booking.service?.name || "Service"}
                                                    </h3>

                                                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase text-amber-700">
                                                        Proposed
                                                    </span>
                                                </div>

                                                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                            Customer
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                            {booking.customer?.name || "N/A"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                            Phone
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                            {booking.customer?.phone || "N/A"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                            Date
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                            {booking.scheduleDate
                                                                ? new Date(
                                                                    booking.scheduleDate
                                                                ).toLocaleDateString("en-IN")
                                                                : "Not scheduled"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                                                            Time
                                                        </p>
                                                        <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                            {booking.timeSlot || "Not selected"}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex items-start gap-2 text-sm text-[#64748B]">
                                                    <FiMapPin className="mt-0.5 shrink-0 text-[#0F766E]" />
                                                    <span>
                                                        {booking.address?.house},{" "}
                                                        {booking.address?.street},{" "}
                                                        {booking.address?.area},{" "}
                                                        {booking.address?.city},{" "}
                                                        {booking.address?.state} -{" "}
                                                        {booking.address?.pincode}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => openAssignModal(booking)}
                                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c625c]"
                                            >
                                                Assign Professional
                                                <FiArrowRight />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* ============================ ASSIGN PROFESSIONAL BOX =========================================================== */}
            {showAssignModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                        <div className="border-b border-slate-100 bg-[#F8FAFC] p-5 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-[#bb7702]">
                                        Booking Assignment
                                    </p>

                                    <h2 className="mt-1 text-xl font-extrabold text-[#0F172A]">
                                        Assign Professional
                                    </h2>
                                </div>

                                <button type="button" onClick={closeAssignModal} disabled={assignLoading} className="rounded-lg p-2 text-[#64748B] transition hover:bg-white hover:text-[#0F172A] disabled:opacity-50">
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        {selectedBooking && (
                            <div className="p-5 sm:p-6">
                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <div>
                                        <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                                            Service
                                        </p>
                                        <p className="mt-1 font-bold capitalize text-[#0F172A]">
                                            {selectedBooking.service?.name || "Service"}
                                        </p>
                                    </div>

                                    <div className="mt-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                                                Customer
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                {selectedBooking.customer?.name || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                                                Date
                                            </p>
                                            <p className="mt-1 text-sm font-semibold text-[#0F172A]">
                                                {selectedBooking.scheduleDate ? new Date(selectedBooking.scheduleDate).toLocaleDateString("en-IN") : "Not scheduled"}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="mb-2 block text-sm font-bold text-[#0F172A]">
                                        Select Professional
                                    </label>

                                    <select value={assignedProfessional} onChange={(e) => setAssignedProfessional(e.target.value)}
                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-[#0F766E]">
                                        <option value="">
                                            Select Professional
                                        </option>

                                        {approvedAvailableProfessional
                                            .filter((professional) => {
                                                const bookingCategory = selectedBooking?.service?.category;

                                                if (Array.isArray(professional.serviceCategory)) {
                                                    return professional.serviceCategory.includes(
                                                        bookingCategory
                                                    );
                                                }

                                                return (
                                                    professional.serviceCategory ===
                                                    bookingCategory
                                                );
                                            })
                                            .map((professional) => (
                                                <option
                                                    key={professional._id}
                                                    value={professional._id}
                                                >
                                                    {professional.name} -{" "}
                                                    {Array.isArray(
                                                        professional.serviceCategory
                                                    )
                                                        ? professional.serviceCategory.join(", ")
                                                        : professional.serviceCategory}
                                                </option>
                                            ))}
                                    </select>

                                    {approvedAvailableProfessional.filter((professional) => {
                                        const bookingCategory =
                                            selectedBooking?.service?.category;

                                        if (Array.isArray(professional.serviceCategory)) {
                                            return professional.serviceCategory.includes(
                                                bookingCategory
                                            );
                                        }

                                        return (
                                            professional.serviceCategory ===
                                            bookingCategory
                                        );
                                    }).length === 0 && (
                                            <p className="mt-2 flex items-center gap-1 text-xs text-red-500">
                                                <FiUserX />
                                                No available professionals found for this service.
                                            </p>
                                        )}
                                </div>

                                <div className="mt-6 flex gap-3">
                                    <button type="button" onClick={closeAssignModal} disabled={assignLoading}
                                        className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-[#64748B] transition hover:bg-slate-50 disabled:opacity-50">
                                        Cancel
                                    </button>

                                    <button type="button" onClick={assignProfessional} disabled={!assignedProfessional || assignLoading}
                                        className="flex-1 rounded-xl bg-[#0F766E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-50">
                                        {assignLoading ? "Assigning...": "Assign Professional"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}