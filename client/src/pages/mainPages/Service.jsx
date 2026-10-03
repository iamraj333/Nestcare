import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoArrowForward } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Service = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    //==================== FETCH ACTIVE SERVICES ====================================
    const fetchServices = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/all`,{
                method:'GET',
                credentials:"include"
            });

            const data = await response.json();

            if (response.ok) {
                setServices(data.allServices || []);
            } else {
                toast.error(data.error || "Failed to fetch services");
            }
        } catch (e) {
            console.error("Failed to fetch services:", e);
            toast.error("Server connection failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <>
            <Navbar />

            <section className="py-4 bg-white">
                <div className="w-full max-w-[1400px] mx-auto px-4 min-[375px]:px-5 sm:px-6 md:px-10 lg:px-16">
                    <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-12 md:mb-14">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#bb7702] border-b-2 border-[#0F766E]/20 pb-1">
                            What We Offer
                        </span>
                        <h1 className="font-poppins mt-4 sm:mt-5 text-2xl min-[375px]:text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                            Complete <span className="text-[#0F766E]">Care</span> For Your <span className="text-[#0F766E]">Home</span>
                        </h1>
                        <p className="mt-4 sm:mt-5 text-sm sm:text-base lg:text-lg text-[#64748B] leading-relaxed">
                            From cleaning and plumbing to electrical maintenance, our trusted professionals help keep your home safe, comfortable and beautifully maintained.
                        </p>
                    </div>

                    {/* ======================== Service Cards ======================== */}
                    {loading ? (
                        <div className="py-16 text-center">
                            <p className="text-[#64748B]">Loading services...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="py-16 text-center border-2 rounded-xl border-dashed border-zinc-600/50">
                            <h2 className="text-xl font-bold text-[#DC2626]">No Services Available</h2>
                            <p className="mt-2 text-sm text-[#64748B]">Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7">
                            {services.map((service, index) => (
                                <article  key={service._id}
                                    className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                    <div className="relative h-52 min-[375px]:h-56 sm:h-60 lg:h-56 overflow-hidden bg-slate-100">
                                        <img src={service.image} alt={service.name} loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />
                                        <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#0F766E] shadow-sm">
                                            {service.category}
                                        </span>
                                        <span className="absolute bottom-4 right-4 text-4xl font-black text-white/20">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    <div className="p-5 sm:p-6">
                                        <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors duration-300">
                                            {service.name}
                                        </h2>
                                        <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed">
                                            {service.description}
                                        </p>
                                        <div className="mt-5 pt-5 border-t border-slate-100 space-y-2.5">
                                            {service.features?.map((feature, featureIndex) => (
                                                <div key={featureIndex} className="flex items-center gap-2.5">
                                                    <IoCheckmarkCircle className="shrink-0 text-[#0F766E] text-base" />
                                                    <span className="text-xs sm:text-sm text-[#475569]">{feature}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#bb7702]">Professional Care</span>
                                                <p className="text-sm font-bold text-[#0F172A] mt-1">From ₹{service.basePrice}</p>
                                            </div>

                                            <Link to={`/services/${service._id}`} className="w-9 h-9 rounded-full bg-[#0F766E]/10 text-[#0F766E] flex items-center justify-center group-hover:bg-[#0F766E] group-hover:text-white transition-all duration-300"
                                                aria-label={`View ${service.name}`}>
                                                <IoArrowForward className="text-base -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}

                    {/* ======================== Plans Section ======================== */}
                    <div className="relative mt-10 sm:mt-12 lg:mt-14 overflow-hidden rounded-2xl bg-[#0F172A] px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
                        <div className="absolute -right-16 -top-20 w-52 h-52 rounded-full bg-[#0F766E]/20" />
                        <div className="absolute -left-16 -bottom-24 w-56 h-56 rounded-full bg-[#f9d596]/10" />
                        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-6">
                            <div className="text-center sm:text-left">
                                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#f9d596]">One Trusted Team</p>
                                <h3 className="font-poppins mt-1.5 text-xl sm:text-2xl font-extrabold text-white">
                                    Choose the Plan That <span className="text-[#47e8db]">Fits You</span>
                                </h3>
                                <p className="mt-1.5 text-xs sm:text-sm text-slate-400">
                                    Explore our carefully designed plans and find the perfect option for your needs, goals, and budget.
                                </p>
                            </div>

                            <Link to="/plans" className="shrink-0 inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#f9d596] text-[#0F172A] text-xs sm:text-sm font-bold hover:bg-[#f5ca78] transition-colors duration-300">
                                Explore Our Plans
                                <IoArrowForward />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default Service;