import Navbar from "../../components/Navbar";
import Hero from "../../assets/images/myhero.png";
import aboutImage from "../../assets/images/about.png";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { LuSparkles } from "react-icons/lu";
import { MdSchedule } from "react-icons/md";
import { MdOutlineCleanHands, MdOutlineHomeWork } from "react-icons/md";
import { BiBuildingHouse } from "react-icons/bi";
import { HiArrowUpRight } from "react-icons/hi2";
import { AiFillStar } from "react-icons/ai";
import { MdVerifiedUser } from "react-icons/md";
import Footer from "../../components/Footer";
import { FaHouseUser } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";



export default function Home() {
    const navigate = useNavigate()
    const services = [
        {
            icon: <MdOutlineHomeWork className="text-2xl" />,
            title: "Regular Residential Cleaning",
            description: "Scheduled dusting, vacuuming, and surface sanitization designed to keep your living areas fresh and inviting on a recurring basis.",
        },
        {
            icon: <LuSparkles className="text-2xl" />,
            title: "Deep & Preventive Care",
            description: "A meticulous, top-to-bottom scrub attacking hidden grime, limescale, and allergens before they cause wear and damage to your home.",
        },
        {
            icon: <MdOutlineCleanHands className="text-2xl" />,
            title: "Eco-Friendly Sanitization",
            description: "Advanced decontamination treatments using certified non-toxic, baby-and-pet-safe formulas for total medical-grade peace of mind.",
        },
        {
            icon: <BiBuildingHouse className="text-2xl" />,
            title: "Move-In / Move-Out Clean",
            description: "Comprehensive turn-over cleaning for landlords and tenants, ensuring every baseboard, appliance, and corner is pristine.",
        }
    ];

    const reviews = [
        {
            name: "Akshita Gupta",
            role: "Homeowner & Busy Lady",
            image: "https://unsplash.com",
            rating: 5,
            quote: "NestCare has completely changed my weekends! Their preventive care approach means I don't see dust building up anymore. The team is incredibly polite, thorough, and completely trustworthy.",
        },
        {
            name: "Arjun Singh",
            role: "Property Manager",
            image: "https://unsplash.com",
            rating: 5,
            quote: "I use NestCare for all my move-out and turnover cleanings. Their eco-certified solutions leave properties smelling completely fresh without harsh chemicals, which my tenants love.",
        },
        {
            name: "Namit Patel",
            role: "Residential Clients",
            image: "https://unsplash.com",
            rating: 5,
            quote: "Finding a cleaner that doesn't trigger our child's asthma was tough until NestCare. Their green sanitization practices are amazing, and the flexible scheduling fits perfectly with our shifts.",
        }
    ];


    return (
        <div className="w-full min-h-screen bg-slate-50 font-sans">
            <Navbar />

            <header
                className="relative w-full min-h-[650px] md:h-[600px] flex items-center bg-cover bg-center bg-no-repeat overflow-hidden"
                style={{ backgroundImage: `url(${Hero})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-transparent z-10" />

                <div data-aos="fade-right" className="container mx-auto px-6 md:px-12 lg:px-16 z-20 py-16 md:py-0 w-full">
                    <div className="max-w-2xl flex flex-col items-start">

                        <span className="inline-block px-3 py-1.5 rounded-full bg-[#f9d596]/30 text-[#935e03] text-xs font-bold tracking-wide uppercase">
                            NestCare - Cleaning Company
                        </span>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0F172A] mt-5 leading-tight tracking-tight">
                            Your <span className="text-[#0F766E]">Home</span>, <br className="sm:hidden" />
                            Our <span className="text-[#0F766E]">Care</span>
                        </h1>

                        <p className="mt-4 text-base sm:text-lg font-medium text-[#64748B] max-w-xl leading-relaxed">
                            Creating a healthier, safer environment for your loved ones using gentle, eco-friendly solutions.
                        </p>

                        <div className="flex flex-wrap items-center gap-y-4 mt-8 w-full">
                            <div className="text-[#475569] font-semibold text-sm flex items-center gap-2.5 pr-4 sm:border-r-2 sm:border-[#0F766E]/20">
                                <IoShieldCheckmarkOutline className="text-2xl text-[#0F766E] shrink-0" />
                                <span>Verified Professionals</span>
                            </div>
                            <div className="text-[#475569] font-semibold text-sm flex items-center gap-2.5 px-0 sm:px-4 md:border-r-2 md:border-[#0F766E]/20 w-full sm:w-auto">
                                <LuSparkles className="text-2xl text-[#0F766E] shrink-0" />
                                <span>Preventive Care</span>
                            </div>
                            <div className="text-[#475569] font-semibold text-sm flex items-center gap-2.5 px-0 md:px-4 w-full md:w-auto">
                                <MdSchedule className="text-2xl text-[#0F766E] shrink-0" />
                                <span>Flexible Scheduling</span>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-10 w-full sm:w-auto">
                            <Link to={"/plans"} className="rounded-xl bg-[#0F766E] hover:bg-[#0D645D] transition-colors font-semibold text-sm p-3.5 px-6 text-white shadow-md shadow-[#0F766E]/20 text-center">
                                View Plans
                            </Link>
                            <Link to={"/howItWorks"} className="rounded-xl bg-white/80 hover:bg-white border border-slate-200 transition-colors font-semibold text-sm p-3.5 px-6 text-[#0F172A] shadow-sm text-center">
                                See How it Works
                            </Link>
                        </div>

                    </div>
                </div>
            </header>

            {/* ===================== Services Section ======================================================== */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">

                    <div data-aos="fade-up" className="flex flex-col items-center text-center max-w-2xl mx-auto mb-16">
                        <span className="text-xs font-bold uppercase tracking-widest text-[#bb7702] border-b-2 border-[#0F766E]/20 pb-1 mb-4">
                            What We Offer
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                            Our Specialized Services Tailored <br className="hidden sm:inline" /> To Your Comfort
                        </h2>
                        <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                            From standard upkeep to deep environmental sanitization, our trained crew ensures your home remains a clean, safe refuge.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                data-aos="fade-up"
                                data-aos-delay={index*100}
                                className="group relative flex flex-col items-start bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="p-3.5 rounded-xl bg-[#0F766E]/10 text-[#0F766E] transition-colors group-hover:bg-[#0F766E] group-hover:text-white duration-300 mb-6 shrink-0">
                                    {service.icon}
                                </div>

                                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#0F766E] transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="mt-2.5 text-sm text-[#64748B] leading-relaxed flex-grow">
                                    {service.description}
                                </p>

                                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#0F766E] cursor-pointer group-hover:underline">
                                    <span>Learn More</span>
                                    <HiArrowUpRight className="text-sm transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div data-aos="fade-up"  className="flex justify-center mt-12">
                        <button onClick={() => navigate("/services")} className="group rounded-xl bg-[#0F766E] hover:bg-[#0D645D] transition-colors font-semibold text-sm p-4 px-8 text-white shadow-md shadow-[#0F766E]/15 flex items-center gap-2">
                            View All Services
                            <span className="inline-block transform group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>

                </div>
            </section>



            {/* ===================== About Section ======================================================== */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        <div  data-aos="fade-right" className="relative group order-2 lg:order-1">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-tr from-[#0F766E]/10 to-transparent -rotate-1 scale-95 transition-transform group-hover:scale-100 duration-500" />

                            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-[4/3] sm:aspect-[16/10] lg:aspect-square bg-slate-100 border border-slate-200">
                                <img
                                    src={aboutImage}
                                    alt="Professional cleaning team at work"
                                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                                />
                            </div>

                            <div data-aos="zoom-in" className="absolute -bottom-6 -right-2 sm:right-6 bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-3 animate-fade-in">
                                <div className="w-12 h-12 rounded-lg bg-[#f9d596]/20 flex items-center justify-center text-[#935e03] font-bold text-xl">
                                    5★
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Top Rated</p>
                                    <p className="text-sm font-semibold text-[#64748B]">In Customer Care</p>
                                </div>
                            </div>
                        </div>

                        <div  data-aos="fade-left" className="flex flex-col items-start order-1 lg:order-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#bb7702] border-b-2 border-[#0F766E]/20 pb-1 mb-4">
                                Who We Are
                            </span>

                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight">
                                Redefining Home Care With A <span className="text-[#0F766E]">Smarter, Safer</span> Clean
                            </h2>

                            <p className="mt-6 text-base text-[#64748B] leading-relaxed">
                                At NestCare, we believe a clean home is a healthy home. We don't just clear away surface dirt; we implement proactive sanitization regimens designed to protect your family and extend the pristine freshness of your sanctuary.
                            </p>

                            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                                Every member of our team is fully vetted, meticulously trained, and equipped with non-toxic, eco-certified formulas that deliver flawless results without leaving behind harsh residues or allergens.
                            </p>

                            {/* Bulleted Core Values */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 w-full">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#0F766E]/10 text-[#0F766E] mt-0.5 shrink-0">
                                        <IoShieldCheckmarkOutline className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A] text-sm">Full Liability Coverage</h4>
                                        <p className="text-xs text-[#64748B] mt-0.5">Complete safety, insured professionals, absolute trust.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#0F766E]/10 text-[#0F766E] mt-0.5 shrink-0">
                                        <LuSparkles className="text-lg" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-[#0F172A] text-sm">100% Eco-Safe Agents</h4>
                                        <p className="text-xs text-[#64748B] mt-0.5">Cruelty-free, baby-friendly, and non-allergenic solutions.</p>
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                                Thank You!
                            </p>

                            <div className="w-full items-center gap-4 mt-8">
                                <div className="float-right">
                                    <h5 className="font-bold text-[#0F172A] text-sm">Rajkumar Gupta</h5>
                                    <p className="text-xs text-[#64748B]">Founder & Managing Director</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>



            {/* ===================== Reviews Section============================================================ */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 md:px-12 lg:px-16">

                    <div  data-aos="fade-up" className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                        <div className="max-w-xl">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#bb7702] border-b-2 border-[#0F766E]/20 pb-1 mb-4 inline-block">
                                Testimonials
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight tracking-tight mt-2">
                                What Our Happy Nest Owners Say About Us
                            </h2>
                            <p className="mt-4 text-base text-[#64748B] leading-relaxed">
                                Discover how we help families across the community breathe easier and live cleaner lives every single week.
                            </p>
                        </div>

                        <div  data-aos="zoom-in" data-aos-delay="200" className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shrink-0 self-start md:self-auto">
                            <div className="text-3xl font-black text-[#0F172A]">4.9</div>
                            <div>
                                <div className="flex text-amber-500 text-lg">
                                    {[...Array(5)].map((_, i) => <AiFillStar key={i} />)}
                                </div>
                                <p className="text-xs font-bold text-[#64748B] mt-0.5 uppercase tracking-wide">
                                    Out of 500+ Reviews
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                        {reviews.map((review, index) => (
                            <div
                                data-aos="fade-up"
                                data-aos-delay={index*100}
                                key={index}
                                className="flex flex-col bg-slate-50 border border-slate-200/50 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 justify-between"
                            >
                                <div>
                                    <div className="flex text-amber-500 text-base mb-5">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <AiFillStar key={i} />
                                        ))}
                                    </div>

                                    <p className="text-base text-[#475569] italic leading-relaxed font-medium">
                                        "{review.quote}"
                                    </p>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center gap-4">
                                    <div className="w-12 h-12 flex justify-center items-center rounded-full overflow-hidden bg-slate-200 shadow-sm shrink-0">
                                        <FaHouseUser className="text-2xl" />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-bold text-[#0F172A] text-sm leading-none">
                                                {review.name}
                                            </h4>
                                            <MdVerifiedUser className="text-[#0F766E] text-sm shrink-0" title="Verified Client" />
                                        </div>
                                        <p className="text-xs text-[#64748B] mt-1 font-medium">
                                            {review.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>


            {/* ===================== Footer Section============================================================ */}
            <Footer />
        </div>
    );
}
