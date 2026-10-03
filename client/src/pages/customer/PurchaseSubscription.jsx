import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoCheckmarkCircle, IoArrowBack, IoShieldCheckmark } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function PurchaseSubscription() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [plan, setPlan] = useState(null);
    const [planLoading, setPlanLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("");

    //======================== FETCHING PLAN DATA ==========================================================
    const fetchPlan = async () => {
        setPlanLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscriptionPlan/${id}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) setPlan(data.subscriptionPlan);
            else toast.error(data.error);
        } catch (e) {
            console.error("Failed to fetch subscription plan:", e);
            toast.error("Server connection failed");
        } finally {
            setPlanLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, [id]);


    //======================== Load RazorPay ==========================================================

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePurchase = async () => {
        if (!paymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        setPurchaseLoading(true);

        try {
            const isScriptLoaded = await loadRazorpay();

            if (!isScriptLoaded) {
                toast.error("Razorpay Checkout failed to load");
                setPurchaseLoading(false);
                return;
            }

            const orderResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/subscription/create-order`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ planId: id })
                }
            );

            const orderData = await orderResponse.json();
            if (!orderResponse.ok) {
                toast.error(orderData.error);
                setPurchaseLoading(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "NestCare",
                description: `${plan.name} Subscription`,
                order_id: orderData.order.id,
                handler: async function (paymentResponse) {
                    try {
                        const verifyResponse = await fetch(`${import.meta.env.VITE_SERVER_URL}/user/subscription/verify-payment`,
                            {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    ...paymentResponse,
                                    planId: id,
                                    paymentMethod
                                })
                            }
                        );

                        const verifyData = await verifyResponse.json();

                        if (verifyResponse.ok) {
                            toast.success("Subscription purchased successfully");
                            navigate("/user/dashboard");
                        } else {
                            toast.error(verifyData.error || "Payment verification failed");
                        }
                    } catch (e) {
                        console.error("Payment verification failed:", e);
                        toast.error("Unable to verify payment");
                    } finally {
                        setPurchaseLoading(false);
                    }
                },
                prefill: {},
                theme: {
                    color: "#0F766E"
                },
                modal: {
                    ondismiss: () => setPurchaseLoading(false)
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.on("payment.failed", function (response) {
                toast.error(response.error.description || "Payment failed");
                setPurchaseLoading(false);
            });
            razorpay.open();
        } catch (e) {
            console.error("Subscription purchase failed:", e);
            toast.error("Server connection failed");
            setPurchaseLoading(false);
        }
    };

    if (planLoading) {
        return (
            <>
                <Navbar />
                <section className="min-h-[70vh] bg-slate-50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-[#0F766E]/20 border-t-[#0F766E] rounded-full animate-spin"></div>
                </section>
                <Footer />
            </>
        );
    }

    if (!plan) {
        return (
            <>
                <Navbar />
                <section className="min-h-[70vh] bg-slate-50 flex items-center justify-center px-4">
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-[#0F172A]">Subscription plan not found</h2>
                        <button type="button" onClick={() => navigate("/plans")}
                            className="mt-5 rounded-xl bg-[#0F766E] px-5 py-3 text-sm font-semibold text-white">
                            Back to Plans
                        </button>
                    </div>
                </section>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <section className="min-h-screen bg-slate-50 py-10 sm:py-14">
                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button type="button" onClick={() => navigate("/plans")}
                        className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#0F766E]">
                        <IoArrowBack />Back to Plans
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#bb7702]">{plan.name}</span>
                                    <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-[#0F172A]">{plan.name} Care</h1>
                                </div>
                                <IoShieldCheckmark className="text-3xl text-[#0F766E]" />
                            </div>

                            <p className="mt-4 text-sm sm:text-base leading-relaxed text-[#64748B]">{plan.description}</p>

                            <div className="mt-7 border-t border-slate-100 pt-6">
                                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0F172A]">What's Included</h2>
                                <div className="mt-4 space-y-3">
                                    {plan.benefits.map((benefit, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <IoCheckmarkCircle className="mt-0.5 shrink-0 text-xl text-[#0F766E]" />
                                            <span className="text-sm text-[#475569]">
                                                {benefit.isUnlimited ? `Unlimited ${benefit.service}` : `${benefit.quantity} ${benefit.service}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                            <h2 className="text-xl font-extrabold text-[#0F172A]">Complete Your Purchase</h2>
                            <div className="mt-6 flex items-end gap-1 border-b border-slate-100 pb-6">
                                <span className="text-sm font-bold text-[#64748B]">₹</span>
                                <span className="text-4xl font-black text-[#0F172A]">{plan.price}</span>
                                <span className="pb-1 text-sm text-[#64748B]">/{plan.billingCycle}</span>
                            </div>

                            <div className="mt-6">
                                <p className="text-sm font-bold text-[#0F172A]">Select Payment Method</p>
                                <div className="mt-4 space-y-3">
                                    {["UPI", "card", "netbanking"].map((method) => (
                                        <label key={method}
                                            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${paymentMethod === method
                                                ? "border-[#0F766E] bg-[#0F766E]/5"
                                                : "border-slate-200 hover:border-[#0F766E]/40"
                                                }`}>
                                            <input type="radio" name="paymentMethod" value={method}
                                                checked={paymentMethod === method}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-[#0F766E]" />
                                            <span className="text-sm font-semibold capitalize text-[#0F172A]">
                                                {method === "UPI" ? "UPI" : method === "card" ? "Credit / Debit Card" : "Net Banking"}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button type="button" onClick={handlePurchase} disabled={purchaseLoading}
                                className="mt-7 w-full rounded-xl bg-[#0F766E] py-3.5 text-sm font-bold text-white transition hover:bg-[#0d665f] disabled:cursor-not-allowed disabled:opacity-60">
                                {purchaseLoading ? "Processing..." : `Purchase ${plan.name} Plan`}
                            </button>
                            <p className="mt-4 text-center text-xs leading-relaxed text-[#64748B]">
                                Secure payment powered by Razorpay Test Mode.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
}