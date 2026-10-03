import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoAdd, IoCheckmarkCircle, IoCloseCircle,IoArrowBackOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminSubscriptionPlans() {
    const navigate = useNavigate();
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    // ================== FETCH ALL PLANS ===============================================================
    const fetchPlans = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/subscriptionPlan/admin/all`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setPlans(data.SubscriptionPlan || []);
            } else {
                toast.error(data.error || "Failed to fetch plans");
            }
        } catch (error) {
            console.error("Failed to fetch subscription plans:", error);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    // ============================ UPDATE SUBSCRIPTON STATUS ===========================================
    const updatePlanStatus = async (planId, isActive) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/subscriptionPlan/admin/${planId}/status`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({ isActive })
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                await fetchPlans();
            } else {
                toast.error(data.error || "Failed to update plan");
            }
        } catch (e) {
            console.error("Failed to update plan:", e);
            toast.error("Server error");
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <button type="button" onClick={() => navigate(-1)} className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0F172A]" >
                        <IoArrowBackOutline />Back
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-xs font-semibold text-[#d68903] tracking-[0.2rem] uppercase">Admin</p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Subscription Plans</h1>
                            <p className="text-[#64748B] mt-2">Manage the subscription plans available to customers.</p>
                        </div>

                        <button type="button" onClick={() => navigate("/admin/subscriptionPlan/create")} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d665f]">
                            <IoAdd className="text-lg" />Create Plan
                        </button>
                    </div>

                    {loading ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-[#64748B]">Loading subscription plans...</div>
                    ) : plans.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                            <h2 className="text-lg font-bold text-[#0F172A]">No Subscription Plans</h2>
                            <p className="text-[#64748B] mt-2">Create your first subscription plan for customers.</p>

                            <button type="button" onClick={() => navigate("/admin/subscriptionPlan/create")}
                                className="mt-5 px-5 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d665f]">
                                Create First Plan
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {plans.map((plan) => (
                                <div key={plan._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-xl font-bold text-[#0F172A]">{plan.name}</h2>
                                            <p className="text-sm text-[#64748B] mt-1">{plan.description}</p>
                                        </div>

                                        {plan.isActive ? (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                                                <IoCheckmarkCircle />Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                                                <IoCloseCircle />Inactive
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-6 flex items-end gap-1">
                                        <span className="text-sm font-semibold text-[#64748B]">₹</span>
                                        <span className="text-3xl font-black text-[#0F172A]">{plan.price}</span>
                                        <span className="text-sm text-[#64748B] mb-1">/ {plan.billingCycle}</span>
                                    </div>

                                    <div className="mt-6 border-t border-gray-100 pt-5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-3">Included Services</p>

                                        <div className="space-y-2">
                                            {plan.benefits.map((benefit, index) => (
                                                <div key={index} className="flex items-center gap-2 text-sm text-[#475569]">
                                                    <IoCheckmarkCircle className="text-[#0F766E] shrink-0" />
                                                    <span>{benefit.isUnlimited ? "Unlimited" : benefit.quantity}{" "}{benefit.service}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updatePlanStatus(plan._id, !plan.isActive)}
                                        className={`mt-5 w-full rounded-lg px-4 py-2.5 text-sm font-semibold ${plan.isActive
                                            ? "border border-red-300 text-red-600 hover:bg-red-50"
                                            : "bg-[#0F766E] text-white hover:bg-[#0d665f]"
                                            }`}
                                    >
                                        {plan.isActive ? "Deactivate Plan" : "Activate Plan"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}