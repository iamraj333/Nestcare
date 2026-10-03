import React from "react";
import { Link } from "react-router-dom";
import { IoPersonOutline, IoConstructOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const GetStarted = () => {
    return (
        <>
            <Navbar />
            <main className="bg-slate-50 py-14">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <p className="text-[#bb7702] text-sm font-semibold uppercase tracking-[0.2em] mb-4">
                            Get Started With NestCare
                        </p>
                        <h1 className="text-4xl font-bold text-[#0F172A] mt-3">How would you like to use NestCare?</h1>
                        <p className="text-[#64748B] mt-4">Choose your role to continue.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-12">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#bb7702]/10 flex items-center justify-center mx-auto">
                                <IoPersonOutline className="text-[#bb7702] text-3xl" />
                            </div>
                            <h2 className="text-2xl font-semibold text-[#0F172A] mt-6">Customer</h2>
                            <p className="text-[#64748B] mt-3">Manage your home maintenance, subscriptions and services.</p>
                            <Link to="/user/register" className="block mt-7 bg-[#0F766E] text-white py-3 rounded-xl font-medium hover:bg-[#0d665f] transition">
                                Continue as Customer
                            </Link>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#bb7702]/10 flex items-center justify-center mx-auto">
                                <IoConstructOutline className="text-[#bb7702] text-3xl" />
                            </div>
                            <h2 className="text-2xl font-semibold text-[#0F172A] mt-6">Professional</h2>
                            <p className="text-[#64748B] mt-3">Provide home maintenance services through NestCare.</p>
                            <Link to="/professional/register" className="block mt-7 border border-[#0F766E] text-[#0F766E] py-3 rounded-xl font-medium hover:bg-[#f0fdfa] transition" >Continue as Professional</Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default GetStarted;