import React, { useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa6";
import { HiOutlinePhone, HiOutlineMapPin } from "react-icons/hi2";
import { HiOutlineMail } from "react-icons/hi";
import { toast } from "react-toastify";
import Logo from "../assets/images/nestcare.png";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);


    const handleSubscribe = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/community/subscribe`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success);
                setEmail("");
            } else {
                toast.error(data.error || "Failed to join community");
            }
        } catch (e) {
            console.error("Failed to subscribe:", e);
            toast.error("Server connection failed");
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <footer className="bg-slate-50 text-[#64748B] pt-12 sm:pt-14 lg:pt-16 pb-6 sm:pb-8 border-t border-slate-200/60">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 xl:gap-14 pb-10 sm:pb-12 border-b border-slate-200">
                    <div  data-aos="fade-up" data-aos-delay="100" className="min-w-0">
                        <div className="flex items-center">
                            <img
                                src={Logo}
                                alt="NestCare"
                                className="w-auto h-10 sm:h-11 max-w-[180px] object-contain"
                            />
                        </div>

                        <p className="mt-4 text-sm leading-6 max-w-sm">
                            Creating healthier, safer environments for families through specialized, eco-friendly cleaning and preventive home care routines.
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5 mt-5">
                            <a href="#" aria-label="Facebook" className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#64748B] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] transition-all duration-300 text-sm shadow-sm">
                                <FaFacebookF />
                            </a>
                            <a href="#" aria-label="Instagram" className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#64748B] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] transition-all duration-300 text-sm shadow-sm">
                                <FaInstagram />
                            </a>
                            <a href="#" aria-label="Twitter" className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#64748B] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] transition-all duration-300 text-sm shadow-sm">
                                <FaTwitter />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="p-2.5 rounded-xl bg-white border border-slate-200 text-[#64748B] hover:bg-[#0F766E] hover:text-white hover:border-[#0F766E] transition-all duration-300 text-sm shadow-sm">
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>

                    <div  data-aos="fade-up" data-aos-delay="200">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4 sm:mb-5">
                            Our Company
                        </h4>
                        <ul className="space-y-3 text-sm font-medium">
                            <li><a href="#" className="hover:text-[#0F766E] hover:underline transition-all">About Our Story</a></li>
                            <li><a href="#" className="hover:text-[#0F766E] hover:underline transition-all">Specialized Services</a></li>
                            <li><a href="/plans" className="hover:text-[#0F766E] hover:underline transition-all">Pricing & Packages</a></li>
                            <li><a href="#" className="hover:text-[#0F766E] hover:underline transition-all">Client Testimonials</a></li>
                            <li><a href="#" className="hover:text-[#0F766E] hover:underline transition-all">Careers / Join Crew</a></li>
                        </ul>
                    </div>

                    <div  data-aos="fade-up" data-aos-delay="300">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4 sm:mb-5">
                            Contact Info
                        </h4>
                        <ul className="space-y-4 text-sm font-medium text-[#475569]">
                            <li className="flex items-start gap-3">
                                <HiOutlineMapPin className="text-xl text-[#0F766E] mt-0.5 shrink-0" />
                                <span className="leading-5">
                                    123 Street, Borivali, Mumbai, Maharashtra 400066
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <HiOutlinePhone className="text-xl text-[#0F766E] shrink-0" />
                                <a href="tel:+919876543210" className="hover:text-[#0F766E] transition-colors break-all">
                                    +91 9876543210
                                </a>
                            </li>
                            <li className="flex items-center gap-3 min-w-0">
                                <HiOutlineMail className="text-xl text-[#0F766E] shrink-0" />
                                <a href="mailto:support@nestcare.com" className="hover:text-[#0F766E] transition-colors break-all">
                                    support@nestcare.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div  data-aos="fade-up" data-aos-delay="400" className="min-w-0">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F172A] mb-4 sm:mb-5">
                            Fresh Care Tips
                        </h4>

                        <p className="text-sm leading-6 mb-4">
                            Subscribe to receive healthy living suggestions and promotional service offers.
                        </p>

                        <form onSubmit={handleSubscribe} className="w-full">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full min-w-0 p-3.5 px-4 rounded-xl bg-white border border-slate-200 text-[#0F172A] placeholder-slate-400 text-sm focus:outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10 shadow-sm"
                                    disabled={isSubmitting}
                                    required
                                />

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full p-3.5 px-5 rounded-xl bg-[#0F766E] hover:bg-[#0D645D] disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-white font-semibold text-sm shadow-md shadow-[#0F766E]/15"
                                >
                                    {isSubmitting ? "Joining..." : "Join Community"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-between gap-4 pt-7 sm:pt-8 text-xs font-medium text-[#94A3B8] text-center lg:text-left">
                    <p>
                        © {new Date().getFullYear()} NestCare Cleaning Company. All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        <a href="#" className="hover:text-[#0F766E] hover:underline transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-[#0F766E] hover:underline transition-colors">
                            Terms of Service
                        </a>
                        <a
                            href="https://github.com/iamraj333"
                            target="_blank"
                            rel="noreferrer"
                            className="hover:text-[#0F766E] hover:underline transition-colors"
                        >
                            Developed By - Rajkumar Gupta
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}