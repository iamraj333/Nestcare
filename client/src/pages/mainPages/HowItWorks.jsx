import React from "react";
import { Link } from "react-router-dom";
import { IoArrowForward, IoCalendarOutline, IoCheckmarkCircleOutline, IoConstructOutline, IoHomeOutline, IoPersonOutline, IoShieldCheckmarkOutline, IoSparklesOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function HowItWorks() {
    const steps = [
        {
            number: "01",
            icon: <IoPersonOutline />,
            title: "Create Your Account",
            description: "Sign up with your basic details and add your home address so NestCare can provide services at your doorstep."
        },
        {
            number: "02",
            icon: <IoSparklesOutline />,
            title: "Choose a Care Plan",
            description: "Explore our monthly, quarterly and yearly plans and choose the one that fits your home's maintenance needs."
        },
        {
            number: "03",
            icon: <IoCalendarOutline />,
            title: "Book a Service",
            description: "Choose an included service, select a convenient date and time slot, and submit your service request."
        },
        {
            number: "04",
            icon: <IoConstructOutline />,
            title: "Get Professional Service",
            description: "Our team assigns an appropriate professional to your booking so your home receives reliable maintenance."
        }
    ];

    const benefits = [
        {
            icon: <IoShieldCheckmarkOutline />,
            title: "Verified Professionals",
            description: "Services are handled by professionals who go through the NestCare verification process."
        },
        {
            icon: <IoCalendarOutline />,
            title: "Planned Maintenance",
            description: "Keep your home maintenance organized with scheduled services instead of waiting for problems."
        },
        {
            icon: <IoCheckmarkCircleOutline />,
            title: "Subscription Benefits",
            description: "Get access to services included in your selected care plan without paying separately at every booking."
        },
        {
            icon: <IoHomeOutline />,
            title: "At-Home Convenience",
            description: "Book your maintenance services from anywhere and get professional assistance at your home."
        }
    ];

    return (
        <>
            <Navbar />
            <main className="bg-[#F9FAFB] text-[#0F172A]">
                <section className="relative overflow-hidden bg-[#0F766E]">
                    <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#47e8db]/20 blur-3xl" />
                    <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-[#F59E0B]/10 blur-3xl" />
                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-10 lg:py-24">
                        <div data-aos="fade-up" className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
                                <IoSparklesOutline className="text-[#FBBF24]" />
                                Simple. Planned. Reliable.
                            </span>
                            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                                Home care made
                                <span className="text-[#FBBF24]"> simple.</span>
                            </h1>
                            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                                NestCare helps you move from unexpected home repairs to planned and reliable home maintenance.
                            </p>
                            <div data-aos="zoom-in" className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                                <Link to="/plans" className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-semibold text-[#0F766E] shadow-md transition hover:bg-slate-50">
                                    Explore Plans
                                    <IoArrowForward />
                                </Link>
                                <Link to="/services" className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10">
                                    View Services
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
                    <div data-aos="fade-up" className="max-w-2xl mx-auto text-center">
                        <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">How It Works</p>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-2">Four simple steps to better home care</h2>
                        <p className="text-[#64748B] mt-4 leading-relaxed">From creating your account to getting your service completed, NestCare keeps the entire process simple.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 mt-12">
                        {steps.map((step,index) => (
                            <div data-aos="fade-up" data-aos-delay={index*100} key={step.number} className="relative bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-[#47e8db] transition duration-300">
                                <div className="flex items-center justify-between">
                                    <div className="w-12 h-12 rounded-xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-2xl">
                                        {step.icon}
                                    </div>
                                    <span className="text-3xl font-bold text-slate-100">{step.number}</span>
                                </div>
                                <h3 className="text-lg font-bold mt-6">{step.title}</h3>
                                <p className="text-sm text-[#64748B] leading-relaxed mt-3">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
                <section className="bg-white border-y border-slate-200">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
                        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                            <div data-aos="fade-right">
                                <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-wider">Why NestCare</p>
                                <h2 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">More than a repair service</h2>
                                <p className="text-[#64748B] leading-relaxed mt-5 max-w-xl">
                                    NestCare is designed around planned home maintenance, helping customers keep important household services organized and accessible through a subscription-based approach.
                                </p>
                                <div className="grid sm:grid-cols-2 gap-4 mt-8">
                                    {benefits.map((benefit,index) => (
                                        <div data-aos="zoom-in" data-aos-delay={index*100} key={benefit.title} className="flex gap-4 p-4 rounded-xl bg-[#F9FAFB] border border-slate-100">
                                            <div className="shrink-0 w-10 h-10 rounded-lg bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-xl">
                                                {benefit.icon}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">{benefit.title}</h3>
                                                <p className="text-sm text-[#64748B] leading-relaxed mt-1">{benefit.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div data-aos="fade-left" className="relative">
                                <div className="bg-[#0F766E] rounded-3xl p-7 sm:p-9 lg:p-10 overflow-hidden">
                                    <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-white/10"></div>
                                    <div data-aos="zoom-in" data-aos-delay="300" className="absolute -bottom-20 -left-16 w-48 h-48 rounded-full bg-[#F59E0B]/20"></div>
                                    <div className="relative">
                                        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-3xl">
                                            <IoHomeOutline />
                                        </div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mt-7">Take care of your home before problems grow.</h3>
                                        <p className="text-white/75 leading-relaxed mt-4">
                                            Choose a plan, book the services included in your subscription, and let NestCare help you maintain your home with less hassle.
                                        </p>
                                        <Link to="/plans" className="inline-flex items-center gap-2 bg-[#F59E0B] hover:bg-[#d88905] text-white font-semibold px-5 py-3 rounded-xl mt-7 transition">
                                            Get Started
                                            <IoArrowForward />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20">
                    <div data-aos="fade-up" className="max-w-3xl mx-auto text-center">
                        <div className="w-14 h-14 rounded-2xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-3xl mx-auto">
                            <IoCheckmarkCircleOutline />
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold mt-5">Ready to take better care of your home?</h2>
                        <p className="text-[#64748B] leading-relaxed mt-4">Choose a NestCare plan and make your home maintenance more organized.</p>
                        <Link to="/plans" className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] text-white font-semibold px-6 py-3.5 rounded-xl mt-7 transition">
                            Explore Subscription Plans
                            <IoArrowForward />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
