import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function CreateSubscriptionPlan() {
    const navigate = useNavigate()

    const [benefits, setBenefits] = useState([
        { service: "cleaning", quantity: 1, isUnlimited: false },
        { service: "plumbing", quantity: 1, isUnlimited: false },
        { service: "electrical", quantity: 1, isUnlimited: false }
    ]);

    const [planData, setPlanData] = useState({
        name: "",
        description: "",
        billingCycle: "monthly",
        price: "",
        isActive: true
    })
    const [submitLoading, setSubmitLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setPlanData({
            ...planData,
            [name]: type === "checkbox" ? checked : value
        })
    }

    /*===================== BENEFITS HANDLER ======================================================= */
    const addBenefit = () => {
        setBenefits([
            ...benefits,
            { service: "cleaning", quantity: 1, isUnlimited: false },
        ])
    }

    const removeBenefit = (index) => {
        if (benefits.length == 1) {
            toast.warn("At least one service is required")
            return;
        }
        setBenefits(benefits.filter((item, itemIndex) => index !== itemIndex))
    }

    const BenefitChangeHandler = (e, index) => {
        const { name, type, value, checked } = e.target;

        setBenefits((benefits) =>
            benefits.map((item, i) => {
                if (i !== index) return item;
                return {
                    ...item,
                    [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value
                };
            })
        );
    };


    const { name, description, billingCycle, price, isActive } = planData
    const subscriptionPlanData = {
        name: name.trim(),
        description: description.trim(),
        billingCycle: billingCycle,
        price: price,
        benefits: benefits,
        isActive: isActive
    }


    //Send All Plan data to server to create plan
    const handleSubmit = async (e) => {
        e.preventDefault()

        try {

            const { name, description, billingCycle, price, benefits, isActive } = subscriptionPlanData
            if (!name) {
                toast.error("Plan name is required")
                return;
            }
            if (description.length <= 8) {
                toast.error("Plan description should be greater than 8 character.")
                return;
            }
            if (!price || Number(price) < 0) {
                toast.error("Enter valid price")
                return;
            }
            if (benefits.length == 0) {
                toast.error("Add atleast one service benefit")
                return;
            }

            setSubmitLoading(true)
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/subscriptionPlan/create`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(subscriptionPlanData),
                credentials: "include"
            })

            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    toast.success(data.success)
                    navigate("/admin/page/subscriptionPlan")
                }
                else {
                    toast.error(data.error)
                }
            }
            else {
                toast.error(data.error || "Failed to create subscription plan")
            }
        }
        catch (e) {
            console.error("Server connection failed to create plan: ", e)
            toast.error("Server connection failed to create plan")
        }
        finally {
            setSubmitLoading(false)
        }
    }



    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-[#F9FAFB] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0F172A]">
                        ← Back
                    </button>
                    <div className="mb-8">
                        <p className="text-xs font-semibold inline-block text-[#d68903] tracking-[0.2rem] uppercase">Create Plan</p>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A]">Create Subscription Plan</h1>
                        <p className="text-[#64748B] mt-2">Create a plan that customers can purchase for home maintenance services.</p>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Plan Name</label>
                                <input type="text" name="name" value={planData.name} onChange={handleChange} placeholder="e.g. Basic Care" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#0F766E]" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] mb-2">Price</label>
                                <input type="number" name="price" value={planData.price} onChange={handleChange} min="0" placeholder="499" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#0F766E]" />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Description</label>
                            <textarea name="description" value={planData.description} onChange={handleChange} rows="3" placeholder="Essential maintenance for your home." className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#0F766E] resize-none" />
                        </div>

                        <div className="mt-5">
                            <label className="block text-sm font-semibold text-[#0F172A] mb-2">Billing Cycle</label>
                            <select name="billingCycle" value={planData.billingCycle} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#0F766E] bg-white">
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-bold text-[#0F172A]">Included Services</h2>
                                    <p className="text-sm text-[#64748B]">Set how many times each service is included.</p>
                                </div>

                                <button type="button" onClick={addBenefit} className="px-4 py-2 rounded-lg bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#0d665f]">
                                    + Add Service
                                </button>
                            </div>

                            <div className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <div key={index} className="p-4 rounded-xl border border-gray-200 bg-[#F9FAFB]">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                                            <div>
                                                <label className="block text-xs font-semibold text-[#64748B] mb-2">Service</label>

                                                <select onChange={(e) => BenefitChangeHandler(e, index)} name="service" value={benefit.service}
                                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#0F766E]">
                                                    <option value="cleaning">Cleaning</option>
                                                    <option value="plumbing">Plumbing </option>
                                                    <option value="electrical">Electrical</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-[#64748B] mb-2">Quantity</label>

                                                <input onChange={(e) => BenefitChangeHandler(e, index)} name="quantity" type="number" min="0" value={benefit.quantity} disabled={benefit.isUnlimited}
                                                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white outline-none focus:border-[#0F766E] disabled:bg-gray-100" />
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <label className="flex items-center gap-2 text-sm text-[#0F172A]">
                                                    <input onChange={(e) => BenefitChangeHandler(e, index)} name="isUnlimited" type="checkbox" checked={benefit.isUnlimited}
                                                        className="w-4 h-4 accent-[#0F766E]" />
                                                    Unlimited
                                                </label>

                                                <button type="button" onClick={() => removeBenefit(index)}
                                                    className="ml-auto px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-6 flex items-center gap-3">
                            <input type="checkbox" name="isActive" checked={planData.isActive} onChange={handleChange} className="w-4 h-4 accent-[#0F766E]" />
                            <label className="text-sm font-medium text-[#0F172A]">Make this plan active</label>
                        </div>

                        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 rounded-xl border border-gray-200 text-[#475569] font-semibold hover:bg-gray-50">
                                Cancel
                            </button>

                            <button type="submit" disabled={submitLoading} className="px-6 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d665f] disabled:opacity-60">
                                {submitLoading ? "Creating..." : "Create Plan"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};
