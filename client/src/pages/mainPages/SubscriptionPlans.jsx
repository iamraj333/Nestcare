import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoSparkles, IoArrowBack } from "react-icons/io5";
import { LuCrown, LuShieldCheck } from "react-icons/lu";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SubscriptionPlans() {
    const [subscriptionPlans, setSubscriptionPlans] = useState([])
    const [subscriptionFetchLoading, setSubscriptionFetchLoading] = useState(false)
    const navigate = useNavigate()

    //==================== FETCH ALL ACTIVE PLANS ====================================
    const fetchAllSubscriptionPlans = async () => {
        setSubscriptionFetchLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscriptionPlan/all`, {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json()
            if (response.ok) {
                setSubscriptionPlans(data.SubscriptionPlan)
            }
            else {
                toast.error(data.error)
            }
        }
        catch (e) {
            console.error("Server connection failed to fetch subscription plans: ", e)
            toast.error("Server connection failed to fetch subscription plans")
        }
        finally {
            setSubscriptionFetchLoading(false)
        }
    }

    useEffect(() => {
        fetchAllSubscriptionPlans()
    }, [])

    return (
        <>
            <Navbar />
            <section className="py-12 min-[375px]:py-14 sm:py-16 md:py-20 lg:py-24 bg-slate-50">
                <div className="w-full max-w-[1400px] mx-auto px-4 min-[375px]:px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20">
                    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-14">
                        <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#bb7702] border-b-2 border-[#0F766E]/20 pb-1">
                            <IoSparkles />
                            Membership Plans
                        </span>

                        <h2 className="font-poppins mt-4 sm:mt-5 text-2xl min-[375px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                            Explore <span className="text-[#0F766E]">Our</span> Subscription{" "}
                            <span className="text-[#0F766E]">Plans</span>
                        </h2>

                        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed">
                            Choose a maintenance plan that keeps your home clean, safe,
                            comfortable, and ready for whatever comes next.
                        </p>
                    </div>

                    {/* ====================== Subscription Plan Section ================================================================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch">
                        {subscriptionFetchLoading ? (
                            <div className="col-span-full flex justify-center items-center py-20">
                                <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin"></div>
                            </div>
                        ) : subscriptionPlans.length === 0 ? (
                            <div className="col-span-full text-center py-20 border-2 rounded-xl border-dashed border-zinc-600/50">
                                <p className="text-sm sm:text-base text-[#DC2626]">
                                    No subscription plans available.
                                </p>
                            </div>
                        ) : (
                            subscriptionPlans.map((plan, index) => (
                                <div key={index}
                                    className={`relative flex flex-col bg-white rounded-2xl border p-5 sm:p-6 lg:p-7 transition-all duration-300 ${index == 1
                                        ? "border-[#0F766E] shadow-xl lg:-translate-y-3"
                                        : "border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
                                        }`}>
                                    {index === 1 && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#0F766E] px-4 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-md">
                                                <LuCrown />
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className={`absolute top-0 left-6 right-6 h-2 rounded-b-full ${index === 1 ? "bg-[#f9d596]" : "bg-[#0F766E]/10"}`} />

                                    <div className={index === 1 ? "pt-3" : ""}>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#bb7702]">
                                                {plan.name}
                                            </span>

                                            <LuShieldCheck className="text-[#0F766E] text-lg" />
                                        </div>

                                        <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                                            {plan.name} Care
                                        </h3>

                                        <p className="mt-2 text-xs sm:text-sm text-[#64748B] leading-relaxed min-h-[40px]">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 sm:mt-7 pb-6 border-b border-slate-100">
                                        <div className="flex items-end gap-1">
                                            <span className="text-sm sm:text-base font-bold text-[#64748B]">
                                                ₹
                                            </span>
                                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0F172A] tracking-tight">
                                                {plan.price}
                                            </span>
                                            <span className="pb-1 text-xs sm:text-sm text-[#64748B]">
                                                /{plan.billingCycle}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 py-6 space-y-3">
                                        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0F172A]">
                                            What's Included
                                        </p>

                                        {plan.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-start gap-2.5">
                                                <IoCheckmarkCircle className="shrink-0 mt-0.5 text-[#0F766E] text-lg" />
                                                <span className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                                                    {benefit.isUnlimited ? "Unlimited" : benefit.quantity} {benefit.service}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    <button type="button" onClick={() => { navigate(`/plans/purchase/${plan._id}`) }}
                                        className={`w-full py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${index === 1
                                            ? "bg-[#0F766E] text-white hover:bg-[#0d665f] shadow-lg shadow-[#0F766E]/20"
                                            : "bg-[#0F766E]/10 text-[#0F766E] hover:bg-[#0F766E] hover:text-white"
                                            }`}
                                    >
                                        Choose {plan.name}
                                    </button>
                                </div>
                            ))
                        )
                        }
                    </div>

                    <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center">
                        <div className="flex items-center gap-2">
                            <IoCheckmarkCircle className="text-[#0F766E] text-lg" />
                            <span className="text-xs sm:text-sm text-[#64748B]">
                                Reliable Professionals
                            </span>
                        </div>

                        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />

                        <div className="flex items-center gap-2">
                            <IoCheckmarkCircle className="text-[#0F766E] text-lg" />
                            <span className="text-xs sm:text-sm text-[#64748B]">
                                Priority Support
                            </span>
                        </div>

                        <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />

                        <div className="flex items-center gap-2">
                            <IoCheckmarkCircle className="text-[#0F766E] text-lg" />
                            <span className="text-xs sm:text-sm text-[#64748B]">
                                Hassle-Free Service
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};

