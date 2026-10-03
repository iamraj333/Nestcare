import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoAlertCircleOutline, IoArrowForward, IoCalendarOutline, IoCardOutline, IoCheckmarkCircle, IoConstructOutline, IoPersonOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { contextData } from "../../context/ContextData";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";

export default function Dashboard() {
    const { currentUser, isLoading } = useContext(contextData);
    const [subscriptionPlanData, setSubscriptionData] = useState(null);
    const [fetchSubscriptionLoading, setFetchSubscriptionLoading] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [fetchBookingsLoading, setFetchBookingsLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.RouteError) {
            toast.error(location.state?.RouteError);
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    /*================================== FETCH CUSTOMER SUBSCRIPTION =================================================== */
    const fetchMySubscription = async () => {
        setFetchSubscriptionLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/subscription/my`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setSubscriptionData(data.subscriptionData);
            } else {
                toast.error(data.error || "Subscription failed to fetch");
            }
        } catch (e) {
            console.error("Server connection failed to fetch subscription:", e);
            toast.error("Server connection failed to fetch subscription");
        } finally {
            setFetchSubscriptionLoading(false);
        }
    };

    /*=================================== FETCH CUSTOMER BOOKIN ========================================== */
    const fetchBookings = async () => {
        setFetchBookingsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/my`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setBookings(data.bookingData || []);
            } else {
                toast.error(data.error || "Bookings failed to fetch");
            }
        } catch (e) {
            console.error("Server connection failed to fetch bookings:", e);
            toast.error("Server connection failed to fetch bookings");
        } finally {
            setFetchBookingsLoading(false);
        }
    };

    useEffect(() => {
        fetchMySubscription();
        fetchBookings();
    }, []);

    const getStatusClass = (status) => {
        if (status === "completed") return "bg-green-50 text-green-700";
        if (status === "cancelled") return "bg-red-50 text-red-700";
        if (status === "proposed") return "bg-amber-50 text-amber-700";
        if (status === "confirmed") return "bg-blue-50 text-blue-700";
        if (status === "assigned") return "bg-purple-50 text-purple-700";
        if (status === "accepted") return "bg-teal-50 text-teal-700";
        if (status === "in-progress") return "bg-indigo-50 text-indigo-700";
        if (status === "rescheduled") return "bg-orange-50 text-orange-700";
        return "bg-slate-100 text-slate-700";
    };

    const formatStatus = (status) => {
        return status
            ?.split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    if (isLoading) {
        return <Loading />;
    }

    const { name } = currentUser.user;
    const recentBookings = bookings.slice(0, 3);

    return (
        <>
            <Outlet />
            <Navbar />
            <div className="min-h-screen bg-slate-50">
                <section className="bg-white border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                            <div>
                                <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">Customer Dashboard</p>
                                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-2">Welcome back, {name.split(" ")[0]}</h1>
                                <p className="text-[#64748B] mt-1">Manage your home maintenance services.</p>
                            </div>
                            <Link to="/services" className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] text-white font-semibold px-5 py-3 rounded-xl transition">
                                <IoConstructOutline />
                                Book a Service
                            </Link>
                        </div>
                    </div>
                </section>
                <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[#bb7702] text-xs font-semibold uppercase tracking-wider">Active Subscription</p>
                                {fetchSubscriptionLoading ? (
                                    <div className="mt-3 h-7 w-40 bg-slate-200 rounded animate-pulse"></div>
                                ) : subscriptionPlanData && subscriptionPlanData.length > 0 ? (
                                    <h2 className="text-2xl font-bold text-[#0F172A] mt-2">{subscriptionPlanData[0].plan.name} Plan</h2>
                                ) : (
                                    <h2 className="text-2xl font-bold text-[#0F172A] mt-2">No Active Plan</h2>
                                )}
                            </div>
                            <div className="w-11 h-11 rounded-xl bg-[#f9d596] flex items-center justify-center">
                                <IoCardOutline className="text-[#bb7702] text-xl" />
                            </div>
                        </div>
                        {fetchSubscriptionLoading ? (
                            <div className="mt-5 space-y-3">
                                <div className="h-6 w-28 bg-slate-200 rounded animate-pulse"></div>
                                <div className="h-5 w-56 bg-slate-200 rounded animate-pulse"></div>
                            </div>
                        ) : subscriptionPlanData && subscriptionPlanData.length >= 1 ? (
                            <>
                                <p className="text-xl font-semibold text-[#0F766E] mt-5">
                                    ₹{subscriptionPlanData[0].plan.price}
                                    <span className="text-sm font-normal text-[#64748B]"> / {subscriptionPlanData[0].plan.billingCycle}</span>
                                </p>
                                <div className="flex items-center gap-2 mt-3">
                                    <IoCheckmarkCircle className="text-[#0F766E]" />
                                    <span className="text-sm text-[#64748B]">
                                        Active until{" "}
                                        {new Date(subscriptionPlanData[0].endDate).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>
                                <Link to="/customer/manageSubscription" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702] mt-6">
                                    Manage Subscription<IoArrowForward />
                                </Link>
                            </>
                        ) : (
                            <div className="mt-5">
                                <p className="text-sm text-[#64748B]">You don't have an active subscription yet.</p>
                                <button type="button" onClick={() => navigate("/plans")} className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702] mt-5">
                                    Explore Plans<IoArrowForward />
                                </button>
                            </div>
                        )}
                    </div>
                    <section className="bg-white border border-slate-200 rounded-2xl shadow-sm mt-6">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
                            <div>
                                <p className="text-sm text-[#bb7702] font-semibold uppercase tracking-wider">Service History</p>
                                <h2 className="text-xl font-bold text-[#0F172A] mt-1">Recent Bookings</h2>
                            </div>
                            <Link to="/customer/bookings" className="text-sm font-semibold text-[#0F766E] hover:text-[#bb7702]">View All</Link>
                        </div>
                        {fetchBookingsLoading ? (
                            <div className="divide-y divide-slate-100">
                                {[1, 2, 3].map(item => (
                                    <div key={item} className="px-6 py-5 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-slate-200 animate-pulse"></div>
                                            <div>
                                                <div className="h-5 w-40 bg-slate-200 rounded animate-pulse"></div>
                                                <div className="h-4 w-28 bg-slate-200 rounded animate-pulse mt-2"></div>
                                            </div>
                                        </div>
                                        <div className="h-7 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                        ) : recentBookings.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentBookings.map(booking => (
                                    <div key={booking._id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-xl bg-[#dffaf7] flex items-center justify-center">
                                                <IoConstructOutline className="text-[#0F766E] text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-[#0F172A]">{booking.service?.name || "Service"}</h3>
                                                <p className="text-sm text-[#64748B] mt-1">
                                                    {booking.scheduleDate
                                                        ? new Date(booking.scheduleDate).toLocaleDateString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric"
                                                        })
                                                        : "Date not available"}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`w-fit text-sm font-medium px-3 py-1.5 rounded-full ${getStatusClass(booking.status)}`}>
                                            {formatStatus(booking.status)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-6 py-10 text-center">
                                <IoCalendarOutline className="text-3xl text-slate-300 mx-auto" />
                                <p className="text-sm text-[#64748B] mt-3">You don't have any bookings yet.</p>
                                <Link to="/services" className="inline-flex items-center gap-1 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702] mt-4">
                                    Book a Service<IoArrowForward />
                                </Link>
                            </div>
                        )}
                    </section>
                    <section className="mt-6">
                        <h2 className="text-xl font-bold text-[#0F172A] mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Link to="/services" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#47e8db] hover:shadow-md transition">
                                <IoConstructOutline className="text-[#0F766E] text-2xl mb-3" />
                                <h3 className="font-semibold text-[#0F172A]">Book a Service</h3>
                                <p className="text-sm text-[#64748B] mt-1">Schedule a maintenance service.</p>
                            </Link>

                            <Link to="/user/profile" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#47e8db] hover:shadow-md transition">
                                <IoPersonOutline className="text-[#0F766E] text-2xl mb-3" />
                                <h3 className="font-semibold text-[#0F172A]">Profile & Settings</h3>
                                <p className="text-sm text-[#64748B] mt-1">Manage your profile, address and account settings.</p>
                            </Link>

                            <Link to="/customer/bookings" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#47e8db] hover:shadow-md transition">
                                <IoCalendarOutline className="text-[#0F766E] text-2xl mb-3" />
                                <h3 className="font-semibold text-[#0F172A]">My Bookings</h3>
                                <p className="text-sm text-[#64748B] mt-1">Check your upcoming and past services.</p>
                            </Link>

                            <Link to="/customer/disputes" className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-[#47e8db] hover:shadow-md transition">
                                <IoAlertCircleOutline className="text-[#0F766E] text-2xl mb-3" />
                                <h3 className="font-semibold text-[#0F172A]">My Disputes</h3>
                                <p className="text-sm text-[#64748B] mt-1">View and track your submitted disputes.</p>
                            </Link>
                        </div>
                    </section>
                </main>
            </div>
            <Footer />
        </>
    );
};