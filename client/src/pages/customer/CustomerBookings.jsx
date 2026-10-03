import React, { useEffect, useState } from "react";
import { IoCalendarOutline, IoTimeOutline, IoLocationOutline, IoPersonOutline, IoStarOutline, IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CustomerBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState("");
    const [reviewLoading, setReviewLoading] = useState(false);
    const [disputeBooking, setDisputeBooking] = useState(null);
    const [disputeSubject, setDisputeSubject] = useState("");
    const [disputeDescription, setDisputeDescription] = useState("");
    const [disputeLoading, setDisputeLoading] = useState(false);

    // FETCH BOOKINGS DATA
    const fetchBookings = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/my`, {
                method: "GET",
                credentials: "include"
            });

            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    setBookings(data.bookingData)
                } else {
                    toast.error(data.error)
                }
            } else {
                toast.error(data.error || "Server failed to fetch booking data")
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

    const getStatusClass = (status) => {
        if (status === "completed") return "bg-green-100 text-green-700";
        if (status === "cancelled") return "bg-red-100 text-red-700";
        if (status === "proposed") return "bg-amber-100 text-amber-700";
        if (status === "confirmed") return "bg-blue-100 text-blue-700";
        if (status === "assigned") return "bg-purple-100 text-purple-700";
        if (status === "accepted") return "bg-indigo-100 text-indigo-700";
        if (status === "in-progress") return "bg-cyan-100 text-cyan-700";
        if (status === "rescheduled") return "bg-orange-100 text-orange-700";
        return "bg-slate-100 text-slate-700";
    };

    /*================== Cancel Booking ==========================================================*/
    const cancelBooking = async (bookingId) => {
        setCancelLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/cancel/${bookingId}`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                await fetchBookings();
            } else {
                toast.error(data.error || "Failed to cancel booking");
            }
        } catch (e) {
            console.error("Failed to cancel booking:", e);
            toast.error("Server error");
        }
        finally {
            setCancelLoading(false)
        }
    };



    /*================== Review Completed Booking Booking ==========================================================*/
    const submitReview = async () => {
        if (!reviewBooking) return;
        setReviewLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/review/${reviewBooking._id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ rating, review })
            });
            const data = await response.json();
            if (response.ok) {
                toast.success(data.success);
                setReviewBooking(null);
                setRating(5);
                setReview("");
                await fetchBookings();
            } else {
                toast.error(data.error || "Failed to submit review");
            }
        } catch (e) {
            console.error("Failed to submit review:", e);
            toast.error("Server error");
        } finally {
            setReviewLoading(false);
        }
    };


    /*======================== DISPUTE SUBMIT ================================================================ */
    const submitDispute = async () => {
        if (!disputeBooking) return;

        if (!disputeSubject.trim() || !disputeDescription.trim()) {
            toast.error("Subject and description are required");
            return;
        }

        setDisputeLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dispute/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    bookingId: disputeBooking._id,
                    subject: disputeSubject,
                    description: disputeDescription
                })
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                setDisputeBooking(null);
                setDisputeSubject("");
                setDisputeDescription("");
            } else {
                toast.error(data.error || "Failed to submit dispute");
            }
        } catch (e) {
            console.error("Failed to submit dispute:", e);
            toast.error("Server error");
        } finally {
            setDisputeLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <p className="text-slate-500">Loading bookings...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F9FAFB] px-4 py-8 md:px-8">
                <div className="max-w-6xl mx-auto">
                    <button onClick={() => window.history.back()} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0b5f59]">
                        <IoArrowBack />Back
                    </button>
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[#0F172A]">My Bookings</h1>
                        <p className="text-[#64748B] mt-1">View your service bookings and their current status.</p>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
                            <h2 className="text-xl font-semibold text-[#0F172A]">No bookings yet</h2>
                            <p className="text-slate-500 mt-2">Book an included service from your subscription.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                    <div className="flex flex-col md:flex-row gap-5">
                                        <img
                                            src={booking.service?.image}
                                            alt={booking.service?.name}
                                            className="w-full md:w-40 h-32 object-cover rounded-xl"
                                        />

                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                <div>
                                                    <h2 className="text-xl font-semibold text-[#0F172A]">
                                                        {booking.service?.name || "Service"}
                                                    </h2>
                                                    <p className="text-sm text-[#64748B] capitalize mt-1">
                                                        {booking.service?.category}
                                                    </p>
                                                </div>

                                                <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize w-fit ${getStatusClass(booking.status)}`}>
                                                    {booking.status.replace("-", " ")}
                                                </span>
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm text-slate-600">
                                                <div className="flex items-center gap-2">
                                                    <IoCalendarOutline className="text-[#0F766E]" />
                                                    {booking.scheduleDate
                                                        ? new Date(booking.scheduleDate).toLocaleDateString("en-IN")
                                                        : "Not scheduled"}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <IoTimeOutline className="text-[#0F766E]" />
                                                    {booking.timeSlot || "Not selected"}
                                                </div>

                                                <div className="flex items-start gap-2 sm:col-span-2">
                                                    <IoLocationOutline className="text-[#0F766E] mt-0.5" />
                                                    <span>
                                                        {booking.address?.house}, {booking.address?.street},{" "}
                                                        {booking.address?.area}, {booking.address?.city},{" "}
                                                        {booking.address?.state} - {booking.address?.pincode}
                                                    </span>
                                                </div>

                                                {booking.professional && (
                                                    <div className="flex items-center gap-2 sm:col-span-2">
                                                        <IoPersonOutline className="text-[#0F766E]" />
                                                        Professional: {booking.professional.name}
                                                    </div>
                                                )}
                                            </div>

                                            {booking.notes && (
                                                <p className="mt-4 text-sm text-slate-500">
                                                    <span className="font-medium text-slate-700">Notes:</span> {booking.notes}
                                                </p>
                                            )}
                                            {["proposed", "confirmed", "assigned", "accepted"].includes(booking.status) && (
                                                <button onClick={() => cancelBooking(booking._id)} disabled={cancelLoading} className="mt-4 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition disabled:cursor-not-allowed disabled:opacity-50">
                                                    {cancelLoading ? "Cancelling..." : "Cancel Booking"}
                                                </button>
                                            )}

                                            {booking.status === "completed" && !booking.rating && (
                                                <button
                                                    onClick={() => setReviewBooking(booking)}
                                                    className="mt-4 ml-2 rounded-lg bg-[#0F766E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b5f59]"
                                                >
                                                    Rate Service
                                                </button>
                                            )}

                                            {booking.status === "completed" && booking.rating && (
                                                <div className="mt-4 rounded-xl bg-slate-50 border border-slate-200 p-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-semibold text-[#0F172A]">Your Rating:</span>
                                                        <span className="text-[#F59E0B] font-bold">{booking.rating}/5</span>
                                                    </div>
                                                    {booking.review && (
                                                        <p className="mt-2 text-sm text-slate-600">
                                                            "{booking.review}"
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {booking.status === "completed" && (
                                                <button onClick={() => {
                                                    setDisputeBooking(booking);
                                                    setDisputeSubject("");
                                                    setDisputeDescription("");
                                                }}
                                                    className="mt-4 ml-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                                                    Raise Dispute
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>


            {/* ========================== REVIEW BOX ============================================================== */}
            {reviewBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#0F172A]">
                                Rate Service
                            </h2>
                            <button
                                onClick={() => setReviewBooking(null)}
                                className="text-2xl text-slate-400 hover:text-slate-600"
                            >
                                ×
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">
                            {reviewBooking.service?.name}
                        </p>

                        <div className="mt-5">
                            <p className="text-sm font-medium text-slate-700">Rating</p>
                            <div className="mt-2 flex gap-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setRating(star)}
                                        className={star <= rating ? "text-[#F59E0B]" : "text-slate-300"}
                                    >
                                        <IoStarOutline className="text-2xl" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your review..."
                            rows="4"
                            className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"
                        />

                        <button
                            onClick={submitReview}
                            disabled={reviewLoading}
                            className="mt-4 w-full rounded-lg bg-[#0F766E] py-2.5 text-sm font-medium text-white hover:bg-[#0b5f59] disabled:opacity-50"
                        >
                            {reviewLoading ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </div>
            )}

            {/* ============================ DISPUT BOX ========================================================== */}
            {disputeBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#0F172A]">Raise Dispute</h2>
                            <button onClick={() => setDisputeBooking(null)} className="text-2xl text-slate-400 hover:text-slate-600">
                                ×
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-slate-500">{disputeBooking.service?.name}</p>
                        <input type="text" value={disputeSubject} onChange={(e) => setDisputeSubject(e.target.value)} placeholder="Dispute subject"
                            className="mt-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"/>

                        <textarea value={disputeDescription} onChange={(e) => setDisputeDescription(e.target.value)} placeholder="Describe your issue..." rows="5"
                            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0F766E]"/>

                        <button onClick={submitDispute} disabled={disputeLoading} className="mt-4 w-full rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50">
                            {disputeLoading ? "Submitting..." : "Submit Dispute"}
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
};