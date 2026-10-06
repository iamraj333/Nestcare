import React, { useContext, useEffect, useState } from "react";
import { IoArrowBack, IoCallOutline, IoMailOutline, IoLocationOutline, IoSendOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { contextData } from "../../context/ContextData";

export default function Contact() {
    const navigate = useNavigate();
    const {currentUser}=useContext(contextData)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        if(currentUser.user){
            setFormData({
                ...formData,
                name:currentUser.user.name,
                email:currentUser.user.email
            })
        }
    },[])

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    //SUBMIT MESSAGE TO SERVER
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            toast.error("Please fill all fields");
            return;
        }

        if(currentUser.role==="admin"){
            toast.error("Admin, you are sending a message to yourself.")
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/contact/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                toast.success(data.success || "Your message has been sent successfully");
                setFormData({name: "",email: "",subject: "",message: ""});
            } else {
                toast.error(data.error || "Failed to send message");
            }
        } catch (e) {
            console.error("Contact form failed:", e);
            toast.error("Failed to send message");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-[#F9FAFB]">
                <section className="bg-[#0F766E]">
                    <div data-aos="fade-right" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-14 sm:py-20">
                        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white">
                            <IoArrowBack />
                            Back
                        </button>
                        <div className="max-w-2xl mt-8">
                            <p className="text-[#F59E0B] text-sm font-semibold uppercase tracking-wider">Get in touch</p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mt-2">How can we help?</h1>
                            <p className="text-white/75 mt-4 text-base sm:text-lg">
                                Have a question about NestCare? Send us a message and our team will get back to you.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                    <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                        <div className="space-y-4">
                            <div data-aos="fade-right" data-aos-delay="100" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-xl">
                                    <IoCallOutline />
                                </div>
                                <h2 className="font-bold text-[#0F172A] mt-4">Call Us</h2>
                                <p className="text-sm text-[#64748B] mt-1">Mon–Sat, 9 AM–6 PM</p>
                                <a href="tel:+919876543210" className="text-[#0F766E] font-semibold text-sm mt-3 inline-block hover:text-[#bb7702]">
                                    +91 98765 43210
                                </a>
                            </div>

                            <div data-aos="fade-right" data-aos-delay="200" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-amber-50 text-[#bb7702] flex items-center justify-center text-xl">
                                    <IoMailOutline />
                                </div>
                                <h2 className="font-bold text-[#0F172A] mt-4">Email Us</h2>
                                <p className="text-sm text-[#64748B] mt-1">For general enquiries</p>
                                <a href="mailto:support@nestcare.com" className="text-[#0F766E] font-semibold text-sm mt-3 inline-block hover:text-[#bb7702]">
                                    support@nestcare.com
                                </a>
                            </div>

                            <div data-aos="fade-right" data-aos-delay="300" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-[#dffaf7] text-[#0F766E] flex items-center justify-center text-xl">
                                    <IoLocationOutline />
                                </div>
                                <h2 className="font-bold text-[#0F172A] mt-4">Our Office</h2>
                                <p className="text-sm text-[#64748B] mt-2 leading-6">
                                    NestCare Support Centre<br />
                                    Mumbai, Maharashtra, India
                                </p>
                            </div>
                        </div>

                        <div data-aos="fade-left" className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
                            <h2 className="text-2xl font-bold text-[#0F172A]">Send us a message</h2>
                            <p className="text-sm text-[#64748B] mt-2">Fill in the details below and we'll get back to you.</p>

                            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your name"
                                            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#0F172A] mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="How can we help?"
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-[#0F172A] mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows="6"
                                        placeholder="Write your message..."
                                        className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none resize-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center justify-center gap-2 bg-[#0F766E] hover:bg-[#0b5f59] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition"
                                >
                                    {loading ? "Sending..." : "Send Message"}
                                    <IoSendOutline />
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
