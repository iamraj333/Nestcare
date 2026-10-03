import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiCalendar, FiMapPin, FiUser, FiTool, FiClock } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/all`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                setBookings(data.BookingData || []);
            } else {
                toast.error(data.error || "Failed to fetch bookings");
            }
        } catch (e) {
            console.error("Failed to fetch bookings:", e);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const getStatusStyle = (status) => {
        const styles = {
            proposed: "bg-amber-100 text-amber-700",
            confirmed: "bg-blue-100 text-blue-700",
            assigned: "bg-purple-100 text-purple-700",
            accepted: "bg-indigo-100 text-indigo-700",
            "in-progress": "bg-cyan-100 text-cyan-700",
            completed: "bg-green-100 text-green-700",
            cancelled: "bg-red-100 text-red-700",
            rescheduled: "bg-orange-100 text-orange-700"
        };

        return styles[status] || "bg-slate-100 text-slate-700";
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
                <div className="mx-auto max-w-7xl">
                    <button
                        onClick={() => window.history.back()}
                        className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0b5f59]"
                    >
                        <FiArrowLeft />
                        Back
                    </button>

                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#0F172A] md:text-3xl">
                                All Bookings
                            </h1>
                            <p className="mt-1 text-[#64748B]">
                                View and monitor all customer service bookings.
                            </p>
                        </div>

                        <button
                            onClick={fetchBookings}
                            className="rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0b5f59]"
                        >
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6"
                                >
                                    <div className="h-5 w-48 rounded bg-slate-200"></div>
                                    <div className="mt-4 h-4 w-64 rounded bg-slate-200"></div>
                                    <div className="mt-2 h-4 w-56 rounded bg-slate-200"></div>
                                </div>
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <FiTool className="mx-auto text-4xl text-slate-400" />
                            <h2 className="mt-4 font-semibold text-[#0F172A]">
                                No bookings found
                            </h2>
                            <p className="mt-1 text-sm text-[#64748B]">
                                Customer bookings will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div
                                    key={booking._id}
                                    className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm md:p-6"
                                >
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-lg font-bold text-[#0F172A]">
                                                    {booking.service?.name || "Service"}
                                                </h2>

                                                <span
                                                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                                                        booking.status
                                                    )}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="mt-4 grid gap-3 text-sm text-[#64748B] sm:grid-cols-2">
                                                <p className="flex items-center gap-2">
                                                    <FiUser className="shrink-0" />
                                                    Customer: {booking.customer?.name || "N/A"}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiTool className="shrink-0" />
                                                    Professional:{" "}
                                                    {booking.professional?.name || "Not assigned"}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiCalendar className="shrink-0" />
                                                    {booking.scheduleDate
                                                        ? new Date(booking.scheduleDate).toLocaleDateString()
                                                        : "N/A"}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiClock className="shrink-0" />
                                                    {booking.timeSlot || "N/A"}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-start gap-2 text-sm text-[#64748B]">
                                                <FiMapPin className="mt-0.5 shrink-0" />
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

                                        <div className="shrink-0 text-sm text-[#64748B] lg:text-right">
                                            <p className="capitalize">
                                                Category: {booking.service?.category || "N/A"}
                                            </p>

                                            <p className="mt-2">
                                                Payment:{" "}
                                                <span className="font-medium capitalize text-[#0F172A]">
                                                    {booking.paymentStatus || "N/A"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>

                                    {booking.notes && (
                                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs font-semibold text-[#64748B]">
                                                Customer Notes
                                            </p>
                                            <p className="mt-1 text-sm text-[#0F172A]">
                                                {booking.notes}
                                            </p>
                                        </div>
                                    )}

                                    {booking.status === "completed" && booking.rating && (
                                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-4">
                                            <p className="text-sm font-semibold text-[#0F172A]">
                                                Customer Rating:{" "}
                                                <span className="text-[#F59E0B]">
                                                    {booking.rating}/5
                                                </span>
                                            </p>

                                            {booking.review && (
                                                <p className="mt-1 text-sm text-[#64748B]">
                                                    {booking.review}
                                                </p>
                                            )}
                                        </div>
                                    )}
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