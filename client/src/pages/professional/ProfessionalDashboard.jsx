import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { FiBriefcase, FiCalendar, FiStar, FiDollarSign } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { contextData } from "../../context/ContextData";
import { toast } from "react-toastify";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

export default function ProfessionalDashboard() {
    const { currentUser } = useContext(contextData);
    const professionalData = currentUser.user;
    const [availability, setAvailability] = useState(professionalData?.availabilityStatus || "offline");
    const [assignedBookings, setAssignedBookings] = useState([]);
    const [assignmentLoading, setAssignmentLoading] = useState(false);
    const [acceptLoading, setAcceptLoading] = useState(false);
    const [rejectLoading, setRejectLoading] = useState(false);
    const [startAssignmentLoading, setStartAssignmentLoading] = useState(false);
    const [completeAssignmentLoading, setCompleteAssignmentLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate()
    useEffect(() => {
        if (location.state?.RouteError) {
            toast.error(location.state?.RouteError)
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [])

    //==================== Update Availability Professional ====================================
    const handleAvailabilityChange = async (e) => {
        const availabilityCheck = e.target.value;
        setAvailability(availabilityCheck);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/availability/update`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    availabilityCheck: availabilityCheck
                }),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(data.error || "Failed to update availability status");
            }
        }
        catch (e) {
            console.error("Server communication failed: ", e);
            toast.error("Availability setting failed");
        }
    };

    /*================================= BOOKING ACTIONS =============================================================== */
    // Fetch All Assigned Booking
    const fetchAllAssignedBookings = async () => {
        setAssignmentLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/booking/assigned/me`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setAssignedBookings(data.AssignedBooking || []);
            } else {
                toast.error(data.error || "Failed to fetch assigned bookings");
            }
        }
        catch (e) {
            console.error("Server connection failed to fetch assignments: ", e);
            toast.error("Server connection failed to fetch assignments");
        }
        finally {
            setAssignmentLoading(false);
        }
    };

    // Accept Booking
    const acceptAssignment = async (bookingId) => {
        setAcceptLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/assigned/booking/accept/${bookingId}`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                    fetchAllAssignedBookings();
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(data.error || "Failed to accept assignment");
            }
        }
        catch (e) {
            console.error("Server connection failed to accept assignment: ", e);
            toast.error("Server connection failed to accept assignment");
        }
        finally {
            setAcceptLoading(false);
        }
    };

    // Reject Booking
    const rejectAssignment = async (bookingId) => {
        setRejectLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/assigned/booking/reject/${bookingId}`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                    fetchAllAssignedBookings();
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(data.error || "Failed to reject assignment");
            }
        }
        catch (e) {
            console.error("Server connection failed to reject assignment: ", e);
            toast.error("Server connection failed to reject assignment");
        }
        finally {
            setRejectLoading(false);
        }
    };

    //Start Assignmen
    const startAssigment = async (bookingId) => {
        setStartAssignmentLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/assigned/booking/start/${bookingId}`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                    fetchAllAssignedBookings();
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(data.error || "Failed to start assignment");
            }
        }
        catch (e) {
            console.error("Server connection failed to start assignment: ", e)
            toast.error("Server connecion failed to start assignment")
        }
        finally {
            setStartAssignmentLoading(false)
        }
    }

    //complete Assignment
    const completeAssignment = async (bookingId) => {
        setCompleteAssignmentLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/assigned/booking/complete/${bookingId}`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success);
                    fetchAllAssignedBookings();
                } else {
                    toast.error(data.error);
                }
            } else {
                toast.error(data.error || "Failed to complete assignment");
            }
        }
        catch (e) {
            console.error("Server connection failed to complete assignment: ", e)
            toast.error("Server connection failed to complete assignment")
        }
        finally {
            setCompleteAssignmentLoading(false)
        }
    }

    useEffect(() => {
        if (professionalData) {
            setAvailability(professionalData.availabilityStatus || "offline");
        }
    }, [professionalData]);

    useEffect(() => {
        fetchAllAssignedBookings();
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-slate-50">
                <section className="border-b border-slate-200 bg-white">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <p className="inline-block border-b-2 text-xs font-medium tracking-[0.2rem] text-[#d68903] uppercase">
                            Professional Dashboard
                        </p>

                        <h1 className="mt-1 text-2xl font-bold text-[#0F172A] sm:text-3xl">
                            Welcome back{professionalData?.name ? `, ${professionalData.name}` : ""}
                        </h1>

                        <p className="mt-2 text-sm text-[#64748B]">
                            Manage your assigned services, availability and earnings.
                        </p>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <FiBriefcase className="text-2xl text-[#0F766E]" />
                                <span className="text-xs text-slate-400">Total</span>
                            </div>

                            <p className="mt-5 text-2xl font-bold text-[#0F172A]">
                                {professionalData?.totalJobs || 0}
                            </p>

                            <p className="mt-1 text-sm text-[#64748B]">
                                Total Jobs
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <FiCalendar className="text-2xl text-[#0F766E]" />
                                <span className="text-xs text-slate-400">Assigned</span>
                            </div>

                            <p className="mt-5 text-2xl font-bold text-[#0F172A]">
                                {assignedBookings.length}
                            </p>

                            <p className="mt-1 text-sm text-[#64748B]">
                                Upcoming Jobs
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <FiStar className="text-2xl text-[#F59E0B]" />
                                <span className="text-xs text-slate-400">Rating</span>
                            </div>

                            <p className="mt-5 text-2xl font-bold text-[#0F172A]">
                                {professionalData?.rating || 0}
                            </p>

                            <p className="mt-1 text-sm text-[#64748B]">
                                Average Rating
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <FiDollarSign className="text-2xl text-[#0F766E]" />
                                <span className="text-xs text-slate-400">Total</span>
                            </div>

                            <p className="mt-5 text-2xl font-bold text-[#0F172A]">
                                ₹{professionalData?.earnings || 0}
                            </p>

                            <p className="mt-1 text-sm text-[#64748B]">
                                Total Earnings
                            </p>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* =================== Assigned / Upcoming Jobs ===================================*/}
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="font-semibold text-[#0F172A]">
                                        Upcoming Jobs
                                    </h2>

                                    <p className="mt-1 text-sm text-[#64748B]">
                                        Your assigned service requests.
                                    </p>
                                </div>

                                <button
                                    onClick={() => navigate("/professional/bookings")}
                                    className="shrink-0 rounded-lg border border-[#0F766E] px-3 py-2 text-sm font-medium text-[#0F766E] transition hover:bg-[#0F766E] hover:text-white"
                                >
                                    Booking History
                                </button>
                            </div>


                            {/* =========================== BOOKING ASSIGNMENT ================================================== */}
                            <div className="mt-6 space-y-4">
                                {assignmentLoading ? (
                                    <div className="rounded-xl border border-slate-200 p-8 text-center">
                                        <p className="text-sm text-slate-500">
                                            Loading assigned jobs...
                                        </p>
                                    </div>
                                ) : assignedBookings.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                                        <p className="text-sm font-medium text-slate-600">
                                            No upcoming jobs
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Assigned service requests will appear here.
                                        </p>
                                    </div>
                                ) : (
                                    assignedBookings.map((booking) => (
                                        <div
                                            key={booking._id}
                                            className="rounded-xl border border-slate-200 p-5"
                                        >
                                            <div className="flex flex-col gap-5">
                                                <div>
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div>
                                                            <h3 className="font-semibold text-[#0F172A]">
                                                                {booking.service?.name || "Service"}
                                                            </h3>

                                                            <p className="mt-1 text-sm text-[#64748B]">
                                                                Customer: {booking.customer?.name || "N/A"}
                                                            </p>
                                                        </div>

                                                        <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${booking.status === "assigned"
                                                            ? "bg-blue-50 text-blue-700"
                                                            : "bg-emerald-50 text-emerald-700"
                                                            }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>

                                                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Date
                                                            </p>

                                                            <p className="mt-1 font-medium text-slate-700">
                                                                {booking.scheduleDate
                                                                    ? new Date(booking.scheduleDate).toLocaleDateString()
                                                                    : "Not scheduled"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Time
                                                            </p>

                                                            <p className="mt-1 font-medium text-slate-700">
                                                                {booking.timeSlot || "Not specified"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                Phone
                                                            </p>

                                                            <p className="mt-1 font-medium text-slate-700">
                                                                {booking.customer?.phone || "N/A"}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-xs text-slate-400">
                                                                City
                                                            </p>

                                                            <p className="mt-1 font-medium text-slate-700">
                                                                {booking.address?.city || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {booking.address && (
                                                        <div className="mt-3">
                                                            <p className="text-xs text-slate-400">
                                                                Service Address
                                                            </p>

                                                            <p className="mt-1 text-sm font-medium text-slate-700">
                                                                {booking.address.house},{" "}
                                                                {booking.address.street},{" "}
                                                                {booking.address.area},{" "}
                                                                {booking.address.city},{" "}
                                                                {booking.address.state} -{" "}
                                                                {booking.address.pincode}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {booking.notes && (
                                                        <div className="mt-3">
                                                            <p className="text-xs text-slate-400">
                                                                Customer Notes
                                                            </p>

                                                            <p className="mt-1 text-sm text-slate-600">
                                                                {booking.notes}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {booking.status === "assigned" && (
                                                    <div className="flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
                                                        <button
                                                            onClick={() => rejectAssignment(booking._id)}
                                                            disabled={rejectLoading || acceptLoading}
                                                            className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {rejectLoading ? "Rejecting..." : "Reject"}
                                                        </button>

                                                        <button
                                                            onClick={() => acceptAssignment(booking._id)}
                                                            disabled={acceptLoading || rejectLoading}
                                                            className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            {acceptLoading ? "Accepting..." : "Accept"}
                                                        </button>
                                                    </div>
                                                )}

                                                {booking.status === "accepted" && (
                                                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-emerald-600">
                                                                Booking accepted
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Start the service when you reach the customer.
                                                            </p>
                                                        </div>

                                                        <button onClick={() => startAssigment(booking._id)} disabled={startAssignmentLoading}
                                                            className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-50">
                                                            {startAssignmentLoading ? "Starting..." : "Start Service"}
                                                        </button>
                                                    </div>
                                                )}

                                                {booking.status === "in-progress" && (
                                                    <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-600">
                                                                Service in progress
                                                            </p>
                                                            <p className="mt-1 text-xs text-slate-500">
                                                                Complete the service after finishing the assigned work.
                                                            </p>
                                                        </div>

                                                        <button onClick={() => completeAssignment(booking._id)} disabled={completeAssignmentLoading} className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0c625c] disabled:cursor-not-allowed disabled:opacity-50">
                                                            {completeAssignmentLoading ? "Completing..." : "Complete Service"}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/*===================== Professional Status =========================================*/}
                        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6">
                            <div className="flex flex-col gap-1">
                                <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                                    Professional Status
                                </h2>

                                <p className="text-xs text-slate-500 sm:text-sm">
                                    Manage your verification and availability.
                                </p>
                            </div>

                            <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
                                {/* Verification */}
                                <div className="flex items-center justify-between gap-4 p-4 sm:p-5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${professionalData?.verificationStatus === "approved"
                                            ? "bg-emerald-50 text-emerald-600"
                                            : professionalData?.verificationStatus === "rejected"
                                                ? "bg-red-50 text-red-600"
                                                : "bg-amber-50 text-amber-600"
                                            }`}>
                                            <svg
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622C17.176 19.29 21 14.591 21 9c0-1.042-.133-2.053-.382-3.016z"
                                                />
                                            </svg>
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800">
                                                Verification
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Your professional account status
                                            </p>
                                        </div>
                                    </div>

                                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${professionalData?.verificationStatus === "approved"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : professionalData?.verificationStatus === "rejected"
                                            ? "bg-red-50 text-red-700"
                                            : "bg-amber-50 text-amber-700"
                                        }`}>
                                        {professionalData?.verificationStatus || "pending"}
                                    </span>
                                </div>

                                {/*============================ Availability ======================================================*/}
                                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${availability === "available"
                                            ? "bg-emerald-50"
                                            : availability === "busy"
                                                ? "bg-amber-50"
                                                : "bg-slate-100"
                                            }`}>
                                            <span className={`h-2.5 w-2.5 rounded-full ${availability === "available"
                                                ? "bg-emerald-500"
                                                : availability === "busy"
                                                    ? "bg-amber-500"
                                                    : "bg-slate-400"
                                                }`} />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-800">
                                                Availability
                                            </p>

                                            <p className="mt-0.5 text-xs text-slate-500">
                                                Choose whether you accept new requests
                                            </p>
                                        </div>
                                    </div>

                                    <select
                                        value={availability}
                                        onChange={handleAvailabilityChange}
                                        disabled={professionalData?.verificationStatus !== "approved"}
                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium capitalize text-slate-700 outline-none transition hover:border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400 sm:w-36"
                                    >
                                        <option value="available">
                                            Available
                                        </option>

                                        <option value="busy">
                                            Busy
                                        </option>

                                        <option value="offline">
                                            Offline
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {professionalData?.verificationStatus !== "approved" && (
                                <p className="mt-3 text-xs text-slate-400">
                                    Availability settings will be enabled after your profile is approved.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}