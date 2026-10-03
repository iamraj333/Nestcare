import React from "react";
import { Link } from "react-router-dom";
import { IoHomeOutline, IoArrowBackOutline } from "react-icons/io5";
import { LuSparkles } from "react-icons/lu";
import Navbar from "../../components/Navbar";

const PageNotFound = () => {
    return (
        <>
        <Navbar/>
            <section className=" min-h-[calc(100vh-80px)] w-full bg-white flex items-center py-12 min-[375px]:py-14 sm:py-16 md:py-20 lg:py-24">
                <div className=" w-full max-w-[1600px] mx-auto px-4 min-[375px]:px-5 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24">
                    <div className="w-full max-w-4xl mx-auto text-center">

                        <div className="relative inline-block">
                            <div className=" absolute " />
                            <h1 className=" relative text-[80px] min-[375px]:text-[90px] sm:text-[120px] md:text-[150px] lg:text-[180px] xl:text-[210px] 2xl:text-[240px] leading-[0.85] font-black tracking-[-0.08em] text-[#0F172A] select-none">
                                4<span className="text-[#0F766E]">0</span>4
                            </h1>
                        </div>

                        <div className=" flex items-center justify-center gap-1.5 min-[375px]:gap-2 sm:gap-2.5 mt-5 sm:mt-6">
                            <LuSparkles className=" text-[#bb7702] text-xs sm:text-sm md:text-base" />

                            <span className=" text-[9px] min-[375px]:text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] sm:tracking-[0.25em] text-[#bb7702]">
                                Page Not Found
                            </span>

                            <LuSparkles className="text-[#bb7702] text-xs sm:text-sm md:text-base "
                            />
                        </div>

                        <h2 className=" mt-4 sm:mt-5 md:mt-6 text-2xl min-[375px]:text-[27px] sm:text-3xl md:text-4xl lg:text-[42px] xl:text-5xl font-extrabold text-[#0F172A] leading-[1.15] tracking-tight">
                            Looks Like This Page{" "}
                            <span className="text-[#0F766E]">
                                Needs A Little Cleaning
                            </span>
                        </h2>

                        <p className=" max-w-[580px] mx-auto mt-4 sm:mt-5 md:mt-6 text-sm sm:text-base md:text-lg text-[#64748B] leading-relaxed px-1 sm:px-2">
                            The page you're looking for may have been moved, removed,
                            or doesn't exist. Don't worry — let's get you back to a
                            clean and familiar space.
                        </p>

                        {/* =============================== BUTTONS =============================================================================== */}

                        <div className=" flex flex-col min-[375px]:flex-row items-stretch min-[375px]:items-center justify-center gap-3 sm:gap-4 mt-7 sm:mt-8 md:mt-9">
                            <Link to="/" className=" inline-flex items-center justify-center gap-2 w-full min-[375px]:w-auto min-w-0 min-[375px]:min-w-[160px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#0F766E] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[#0F766E]/20 hover:bg-[#0d665f] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                                <IoHomeOutline className="text-base sm:text-lg shrink-0" />
                                <span>Back To Home</span>
                            </Link>

                            <button type="button" onClick={() => window.history.back()} className=" inline-flex items-center justify-center gap-2 w-full min-[375px]:w-auto min-w-0 min-[375px]:min-w-[160px] px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white text-[#0F172A] text-xs sm:text-sm font-bold hover:border-[#0F766E]/30 hover:text-[#0F766E] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                                <IoArrowBackOutline className="text-base sm:text-lg shrink-0" />
                                <span>Go Back</span>
                            </button>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};

export default PageNotFound;
