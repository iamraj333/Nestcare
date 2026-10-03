import React, { useEffect, useState } from "react";
import { IoArrowBack, IoArrowForward, IoCalendarOutline, IoCardOutline, IoCheckmarkCircle, IoRefreshOutline, IoTimeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";

export default function ManageSubscription() {
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //==================== PURCHASED SUBSCRIPTION DATA FETCHING ====================================
    const fetchSubscription = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/subscription/my`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                setSubscription(data.subscriptionData?.[0] || null);
            } else {
                toast.error(data.error || "Failed to fetch subscription");
            }
        } catch (e) {
            console.error("Failed to fetch subscription:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubscription();
    }, []);

    const getDaysLeft = (endDate) => {
        const today = new Date();
        const expiryDate = new Date(endDate);
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);
        return Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    };

    if (loading) {
        return <Loading />;
    }

    const daysLeft = subscription ? getDaysLeft(subscription.endDate) : null;
    const isExpiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft >= 0;
    const isExpired = daysLeft !== null && daysLeft < 0;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB]">
                <section className="bg-white border-b border-slate-200">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F766E] hover:text-[#bb7702]">
                            <IoArrowBack />Back
                        </button>
                        <div className="mt-6">
                            <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">Subscription</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mt-1">Manage Subscription</h1>
                            <p className="text-[#64748B] mt-2">View your current plan, benefits and subscription status.</p>
                        </div>
                    </div>
                </section>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
                    {!subscription ? (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-3xl mx-auto">
                                <IoCardOutline />
                            </div>
                            <h2 className="text-2xl font-bold text-[#0F172A] mt-5">No Active Subscription</h2>
                            <p className="text-[#64748B] mt-2 max-w-md mx-auto">Choose a NestCare plan to start managing your home maintenance services.</p>
                            <Link to="/plans" className="inline-flex items-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] text-white font-semibold px-6 py-3 rounded-xl mt-6 transition">
                                Explore Plans
                                <IoArrowForward />
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {isExpired && (
                                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <p className="text-red-700 font-bold">Your subscription has expired</p>
                                            <p className="text-sm text-red-600 mt-1">Renew your subscription to continue booking included services.</p>
                                        </div>
                                        <Link to="/plans" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl transition">
                                            Renew Plan <IoRefreshOutline />
                                        </Link>
                                    </div>
                                </div>
                            )}
                            {isExpiringSoon && (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div className="flex items-start gap-3">
                                            <IoTimeOutline className="text-amber-600 text-xl mt-0.5 shrink-0" />
                                            <div>
                                                <p className="text-amber-800 font-bold">
                                                    {daysLeft === 0 ? "Your subscription expires today" : `Your subscription expires in ${daysLeft} day${daysLeft === 1 ? "" : "s"}`}
                                                </p>
                                                <p className="text-sm text-amber-700 mt-1">Renew your plan to continue enjoying NestCare services.</p>
                                            </div>
                                        </div>
                                        <Link to="/plans" className="inline-flex items-center justify-center gap-2 bg-[#bb7702] hover:bg-[#996300] text-white font-semibold px-5 py-3 rounded-xl transition">
                                            Renew Plan
                                            <IoArrowForward />
                                        </Link>
                                    </div>
                                </div>
                            )}
                            <div className="grid lg:grid-cols-3 gap-6">
                                <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div className="bg-[#0F766E] p-6 sm:p-8">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                            <div>
                                                <p className="text-white/70 text-sm font-semibold uppercase tracking-wider">Current Plan</p>
                                                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">{subscription.plan?.name || "Subscription"} Plan</h2>
                                            </div>
                                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center text-2xl">
                                                <IoCardOutline />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex flex-wrap items-end gap-x-2">
                                            <span className="text-3xl font-bold text-white">₹{subscription.plan?.price || 0}</span>
                                            <span className="text-white/70 pb-1">/ {subscription.plan?.billingCycle || "plan"}</span>
                                        </div>
                                    </div>
                                    <div className="p-6 sm:p-8">
                                        <h3 className="text-lg font-bold text-[#0F172A]">Subscription Details</h3>
                                        <div className="grid sm:grid-cols-2 gap-4 mt-5">
                                            <div className="rounded-xl bg-slate-50 p-4">
                                                <div className="flex items-center gap-2 text-[#64748B]">
                                                    <IoCalendarOutline />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Start Date</span>
                                                </div>
                                                <p className="font-semibold text-[#0F172A] mt-2">{formatDate(subscription.startDate)}</p>
                                            </div>
                                            <div className={`rounded-xl p-4 ${isExpiringSoon || isExpired ? "bg-amber-50" : "bg-slate-50"}`}>
                                                <div className="flex items-center gap-2 text-[#64748B]">
                                                    <IoTimeOutline />
                                                    <span className="text-xs font-semibold uppercase tracking-wider">Expiry Date</span>
                                                </div>
                                                <p className="font-semibold text-[#0F172A] mt-2">{formatDate(subscription.endDate)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-5 text-sm">
                                            <IoCheckmarkCircle className={isExpired ? "text-red-500" : "text-[#16A34A]"} />
                                            <span className="text-[#64748B]">
                                                Status: <span className={`font-semibold ${isExpired ? "text-red-600" : "text-[#16A34A]"}`}>{isExpired ? "Expired" : "Active"}</span>
                                            </span>
                                        </div>
                                    </div>
                                </section>
                                <section className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-7 h-fit">
                                    <p className="text-[#bb7702] text-xs font-semibold uppercase tracking-wider">Plan Benefits</p>
                                    <h2 className="text-xl font-bold text-[#0F172A] mt-2">What's Included</h2>
                                    <div className="mt-5 space-y-4">
                                        {subscription.plan?.benefits?.length > 0 ? (
                                            subscription.plan.benefits.map((benefit, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <IoCheckmarkCircle className="text-[#0F766E] text-lg mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#0F172A]">{benefit.service}</p>
                                                        <p className="text-xs text-[#64748B] mt-0.5">
                                                            {benefit.isUnlimited ? "Unlimited" : `${benefit.quantity} service${benefit.quantity === 1 ? "" : "s"}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-sm text-[#64748B]">No benefits available.</p>
                                        )}
                                    </div>
                                </section>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-[#0F172A]">Need a different plan?</h2>
                                        <p className="text-sm text-[#64748B] mt-1">Explore available NestCare plans for your home.</p>
                                    </div>
                                    <Link to="/plans" className="inline-flex items-center justify-center gap-2 border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white font-semibold px-5 py-3 rounded-xl transition">
                                        View Plans
                                        <IoArrowForward />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
