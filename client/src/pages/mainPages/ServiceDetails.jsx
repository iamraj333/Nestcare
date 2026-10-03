import React, { useEffect, useState } from "react";
import { IoArrowBack, IoCheckmarkCircle, IoTimeOutline } from "react-icons/io5";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useContext } from "react";
import { contextData } from "../../context/ContextData";

export default function ServiceDetails() {
    const navigate = useNavigate()
    const { serviceId } = useParams();
    const { currentUser } = useContext(contextData)
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    //==================== FETCHING SPECIFIC SERVICE DATA ====================================
    const fetchService = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/${serviceId}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (response.ok) {
                if (data.success) {
                    setService(data.serviceData);
                }
                else {
                    toast.error(data.error)
                }
            } else {
                toast.error(data.error || "Failed to fetch service");
            }
        } catch (e) {
            console.error("Failed to fetch service:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, [serviceId]);

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-[60vh] flex items-center justify-center">
                    <p className="text-[#64748B]">Loading service...</p>
                </div>
                <Footer />
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Navbar />
                <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
                    <h2 className="text-2xl font-bold text-[#0F172A]">Service Not Found</h2>
                    <p className="mt-2 text-sm text-[#64748B]">This service is no longer available.</p>
                    <Link to="/services" className="mt-5 px-5 py-2.5 rounded-xl bg-[#0F766E] text-white text-sm font-semibold">
                        Back to Services
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="bg-[#F9FAFB] py-8 sm:py-10 lg:py-14">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-10">
                    <Link to="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748B] hover:text-[#0F766E] transition-colors">
                        <IoArrowBack />
                        Back to Services
                    </Link>
                    <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="grid lg:grid-cols-2">
                            <div className="h-64 sm:h-80 lg:h-full min-h-[420px] bg-slate-100">
                                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-6 sm:p-8 lg:p-10">
                                <span className="inline-block px-3 py-1.5 rounded-full bg-[#0F766E]/10 text-[#0F766E] text-xs font-bold uppercase tracking-wider">
                                    {service.category}
                                </span>
                                <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight">
                                    {service.name}
                                </h1>
                                <p className="mt-4 text-sm sm:text-base text-[#64748B] leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="mt-6 flex flex-wrap gap-4">
                                    <div className="px-4 py-3 rounded-xl bg-[#F9FAFB] border border-slate-100">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Starting From</p>
                                        <p className="mt-1 text-lg font-bold text-[#0F172A]">₹{service.basePrice}</p>
                                    </div>
                                    <div className="px-4 py-3 rounded-xl bg-[#F9FAFB] border border-slate-100">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Duration</p>
                                        <p className="mt-1 flex items-center gap-1.5 text-lg font-bold text-[#0F172A]">
                                            <IoTimeOutline className="text-[#0F766E]" />
                                            {service.duration} min
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-7 pt-6 border-t border-slate-100">
                                    <h2 className="text-lg font-bold text-[#0F172A]">What's Included</h2>
                                    <div className="mt-4 space-y-3">
                                        {service.features?.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <IoCheckmarkCircle className="shrink-0 text-[#0F766E] text-lg" />
                                                <span className="text-sm text-[#475569]">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {
                                    currentUser && currentUser.role == "customer" ? (
                                        <button type="button" onClick={() => navigate(`/booking/${service._id}`)} className="mt-8 inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0c625c] transition-colors">
                                            Book This Service
                                        </button>

                                    ) : (<Link to="/plans" className="mt-8 inline-flex items-center justify-center w-full px-6 py-3.5 rounded-xl bg-[#0F766E] text-white text-sm font-bold hover:bg-[#0c625c] transition-colors">
                                        Explore Subscription Plans
                                    </Link>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};
