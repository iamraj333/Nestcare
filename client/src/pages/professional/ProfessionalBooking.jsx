import React, { useEffect, useState } from "react";
import { FiCalendar, FiMapPin, FiUser, FiBriefcase, FiArrowLeft, } from "react-icons/fi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function ProfessionalBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    //==================== FETCH ALL BOOKING WHICH ASSIGNED OR DONE BY PROFESSIONAL ====================================
    const fetchBookingHistory = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/booking/history`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setBookings(data.bookingData || []);
            } else {
                toast.error(data.error || "Failed to fetch booking history");
            }
        } catch (e) {
            console.error("Failed to fetch booking history:", e);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingHistory();
    }, []);

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
                <div className="mx-auto max-w-6xl">
                    <button onClick={() => window.history.back()} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0b5f59]">
                        <FiArrowLeft />Back
                    </button>
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-[#0F172A] md:text-3xl">
                            Booking History
                        </h1>
                        <p className="mt-1 text-[#64748B]">
                            View your completed service jobs.
                        </p>
                    </div>

                    {loading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(item => (
                                <div key={item} className="animate-pulse rounded-2xl border border-slate-100 bg-white p-6">
                                    <div className="h-5 w-48 rounded bg-slate-200"></div>
                                    <div className="mt-4 h-4 w-64 rounded bg-slate-200"></div>
                                    <div className="mt-2 h-4 w-52 rounded bg-slate-200"></div>
                                </div>
                            ))}
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                            <FiBriefcase className="mx-auto text-4xl text-slate-400" />
                            <h2 className="mt-4 font-semibold text-[#0F172A]">
                                No completed bookings
                            </h2>
                            <p className="mt-1 text-sm text-[#64748B]">
                                Your completed jobs will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map(booking => (
                                <div
                                    key={booking._id}
                                    className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
                                >
                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                                        <div>
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h2 className="text-lg font-bold text-[#0F172A]">
                                                    {booking.service?.name || "Service"}
                                                </h2>
                                                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                                                    Completed
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-2 text-sm text-[#64748B]">
                                                <p className="flex items-center gap-2">
                                                    <FiUser />
                                                    {booking.customer?.name || "Customer"}
                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <FiCalendar />
                                                    {booking.scheduleDate
                                                        ? new Date(booking.scheduleDate).toLocaleDateString()
                                                        : "N/A"}
                                                    {booking.timeSlot && (
                                                        <span className="text-[#0F766E]">
                                                            • {booking.timeSlot}
                                                        </span>
                                                    )}
                                                </p>

                                                <p className="flex items-start gap-2">
                                                    <FiMapPin className="mt-0.5 shrink-0" />
                                                    {booking.address?.house}, {booking.address?.street},{" "}
                                                    {booking.address?.area}, {booking.address?.city},{" "}
                                                    {booking.address?.state} - {booking.address?.pincode}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-sm text-[#64748B]">
                                            <p className="capitalize">
                                                Category: {booking.service?.category || "N/A"}
                                            </p>
                                            {booking.rating && (
                                                <p className="mt-2 font-medium text-[#F59E0B]">
                                                    Rating: {booking.rating}/5
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {booking.review && (
                                        <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs font-medium text-[#64748B]">
                                                Customer Review
                                            </p>
                                            <p className="mt-1 text-sm text-[#0F172A]">
                                                {booking.review}
                                            </p>
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