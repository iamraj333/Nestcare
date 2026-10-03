import { Link, Navigate, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useContext, useEffect, useState } from "react";
import { FiBriefcase, FiUser, FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";
import { contextData } from "../../context/ContextData";

export default function ProfessionalRegistration() {
    const {fetchUser}=useContext(contextData)
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate=useNavigate()
    const [professionalData, setProfessionalData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        house: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        serviceCategories: [],
        experience: "",
        idProof: "",
        addressProof: "",
        certificate: ""
    });


    function InputChangeHandler(e) {
        setProfessionalData({
            ...professionalData,
            [e.target.name]: e.target.value
        })
    }

    //Handling chekbox event
    function CategoryChangeHandler(e) {
        const { value, checked } = e.target;

        if (checked) {
            setProfessionalData({
                ...professionalData,
                serviceCategories: [
                    ...professionalData.serviceCategories,
                    value
                ]
            });
        }
        else {
            setProfessionalData({
                ...professionalData,
                serviceCategories: professionalData.serviceCategories.filter(
                    category => category !== value
                )
            });
        }
    }


    //making data formate to backend
    const { name, phone, email, password, house, street, area, city, state, pincode, serviceCategories, experience, idProof, addressProof, certificate } = professionalData
    const ProfessionalRegisterData = {
        name: name,
        phone: phone,
        email: email,
        password: password,
        address: {
            house: house,
            street: street,
            area: area,
            city: city,
            state: state,
            pincode: pincode,
        },
        serviceCategory: serviceCategories,
        experience: experience,
        document: {
            idProof: idProof,
            addressProof: addressProof,
            certification: certificate
        }
    }

    //==================== PROFESSIONAL REGISTRATION ====================================
    const ProfessionalRegisterSubmit = async (e) => {
        e.preventDefault();
        setIsSubmit(true)

        const {name,phone,email,password,address,serviceCategory,experience,document}=ProfessionalRegisterData

        if (name.trim().length < 3) {
            toast.error("Name must be at least 3 characters long.");
            setIsSubmit(false);
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            setIsSubmit(false);
            return;
        }

        if (!email) {
            toast.error("Please enter a valid email address.");
            setIsSubmit(false);
            return;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long.");
            setIsSubmit(false);
            return;
        }

        if (!address?.house?.trim()) {
            toast.error("Please enter your flat, house, or building number.");
            setIsSubmit(false);
            return;
        }

        if (!address?.street?.trim()) {
            toast.error("Please enter your street or locality.");
            setIsSubmit(false);
            return;
        }

        if (!address?.area?.trim()) {
            toast.error("Please enter your area or landmark.");
            setIsSubmit(false);
            return;
        }

        if (!address?.city?.trim()) {
            toast.error("Please enter your city.");
            setIsSubmit(false);
            return;
        }

        if (!address?.state?.trim()) {
            toast.error("Please enter your state.");
            setIsSubmit(false);
            return;
        }

        const pincodeReg=/^[0-9]{6}$/;
        if (!pincodeReg.test(address?.pincode)) {
            toast.error("Please enter a valid 6-digit pincode.");
            setIsSubmit(false);
            return;
        }

        if(serviceCategory.length<=0){
            toast.error("Please enter service category")
            setIsSubmit(false)
            return;
        }

        const experienceReg= /^[0-9]+$/;
        if(!experienceReg.test(experience)){
            toast.error("Please enter your experience")
            setIsSubmit(false)
            return;
        }

        if(!document.idProof || !document.addressProof || !document.certification){
            toast.error("Document must for verification")
            setIsSubmit(false)
            return;
        }

        try{
            const response=await fetch(`${import.meta.env.VITE_SERVER_URL}/professional/register`,{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify(ProfessionalRegisterData),
                credentials:"include"
            })

            const data=await response.json();
            if(response.ok && data.success){
                toast.success(data.success)
                await fetchUser()
                navigate("/professional/dashboard")
            }
            else if(data.warning){
                toast.warn(data.warning)
            }
            else{
                toast.error(data.error)
            }
            
        }
        catch(e){
            console.error("Server communication failed: ",e)
            toast.error("Registration server error");
        }
        finally{
            setIsSubmit(false)
        }

    }

    const inputClass = "w-full h-11 px-3.5 border border-slate-300 rounded-lg bg-white text-sm text-slate-800 outline-none transition focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10";
    const labelClass = "block mb-1.5 text-sm font-medium text-slate-700";

    return (
        <>
            <Navbar />
            <main className="relative overflow-hidden bg-slate-50">
                <div className="absolute inset-x-0 top-0 h-72 sm:h-80 bg-[#0F766E]/90 rounded-b-[80px] sm:rounded-b-[120px]" />

                <section className="relative px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
                    <div className="mx-auto w-full max-w-4xl">
                        <div className="mb-7 text-center sm:mb-8">
                            <span className="text-xs font-semibold text-[#eeae41] p-1 border-b-2 border-gray-300 uppercase tracking-[0.2rem]">
                                Join NestCare
                            </span>
                            <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Become a Professional</h1>
                            <p className="mt-1 text-sm text-zinc-200/90">
                                Register with NestCare and provide trusted home maintenance services.
                            </p>
                        </div>

                        <form onSubmit={(event) => ProfessionalRegisterSubmit(event)} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                            <div className="p-5 sm:p-7 lg:p-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div className="flex items-center gap-3">
                                        <FiUser className="text-xl text-[#0F766E]" />
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Personal Details</h2>
                                            <p className="mt-1 text-xs text-slate-500">Enter your basic account information.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-[#F59E0B]">01</span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                                    <div>
                                        <label htmlFor="name" className={labelClass}>Full Name</label>
                                        <input onChange={InputChangeHandler} value={professionalData.name} className={inputClass} type="text" name="name" id="name" placeholder="Akash Singh" />
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className={labelClass}>Phone Number</label>
                                        <input onChange={InputChangeHandler} value={professionalData.phone} className={inputClass} type="tel" name="phone" id="phone" maxLength="10" placeholder="9876543210" />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClass}>Email Address</label>
                                        <input onChange={InputChangeHandler} value={professionalData.email} className={inputClass} type="email" name="email" id="email" placeholder="akash@mail.com" />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className={labelClass}>Password</label>
                                        <input onChange={InputChangeHandler} value={professionalData.password} className={inputClass} type="password" name="password" id="password" placeholder="Minimum 8 characters" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 p-5 sm:p-7 lg:p-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div className="flex items-center gap-3">
                                        <FiBriefcase className="text-xl text-[#0F766E]" />
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Professional Details</h2>
                                            <p className="mt-1 text-xs text-slate-500">Tell us about your services and experience.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-[#F59E0B]">02</span>
                                </div>

                                <div className="mt-5">
                                    <label className={labelClass}>Service Categories</label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 hover:border-[#0F766E]">
                                            <input name="category" type="checkbox" value="cleaning" checked={professionalData.serviceCategories.includes("cleaning")} onChange={CategoryChangeHandler} className="accent-[#0F766E]" />
                                            <span className="text-sm text-slate-700">Cleaning</span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 hover:border-[#0F766E]">
                                            <input name="category" type="checkbox" value="plumbing" checked={professionalData.serviceCategories.includes("plumbing")} onChange={CategoryChangeHandler} className="accent-[#0F766E]" />
                                            <span className="text-sm text-slate-700">
                                                Plumbing
                                            </span>
                                        </label>

                                        <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-3 hover:border-[#0F766E]">
                                            <input name="category" type="checkbox" value="electrical" checked={professionalData.serviceCategories.includes("electrical")} onChange={CategoryChangeHandler} className="accent-[#0F766E]" />
                                            <span className="text-sm text-slate-700">Electrical</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="mt-5 sm:w-1/2">
                                    <label htmlFor="experience" className={labelClass}>Experience</label>
                                    <input onChange={InputChangeHandler} value={professionalData.experience} className={inputClass} type="number" min="0" name="experience" id="experience" placeholder="Years of experience" />
                                </div>
                            </div>

                            <div className="border-t border-slate-200 p-5 sm:p-7 lg:p-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div className="flex items-center gap-3">
                                        <FiMapPin className="text-xl text-[#0F766E]" />
                                        <div>
                                            <h2 className="font-semibold text-slate-900">Service Address</h2>
                                            <p className="mt-1 text-xs text-slate-500">Enter your current professional address.</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold text-[#F59E0B]">03</span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <div>
                                        <label htmlFor="house" className={labelClass}>House / Flat</label>
                                        <input onChange={InputChangeHandler} value={professionalData.house} className={inputClass} type="text" name="house" id="house" placeholder="Flat 204, Moonligh Appartment" />
                                    </div>

                                    <div>
                                        <label htmlFor="street" className={labelClass}>Street / Road</label>
                                        <input onChange={InputChangeHandler} value={professionalData.street} className={inputClass} type="text" name="street" id="street" placeholder="MG Road" />
                                    </div>

                                    <div>
                                        <label htmlFor="area" className={labelClass}>Area</label>
                                        <input onChange={InputChangeHandler} value={professionalData.area} className={inputClass} type="text" name="area" id="area" placeholder="Andheri East" />
                                    </div>

                                    <div>
                                        <label htmlFor="city" className={labelClass}>City</label>
                                        <input onChange={InputChangeHandler} value={professionalData.city} className={inputClass} type="text" name="city" id="city" placeholder="Mumbai" />
                                    </div>

                                    <div>
                                        <label htmlFor="state" className={labelClass}>State</label>
                                        <input onChange={InputChangeHandler} value={professionalData.state} className={inputClass} type="text" name="state" id="state" placeholder="Maharashtra" />
                                    </div>

                                    <div>
                                        <label htmlFor="pincode" className={labelClass}>Pincode</label>
                                        <input onChange={InputChangeHandler} value={professionalData.pincode} className={inputClass} type="text" name="pincode" id="pincode" maxLength="6" placeholder="400069" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 p-5 sm:p-7 lg:p-8">
                                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                                    <div>
                                        <h2 className="font-semibold text-slate-900">Verification Documents</h2>
                                        <p className="mt-1 text-xs text-slate-500">Provide document references for admin verification.</p>
                                    </div>
                                    <span className="text-xs font-semibold text-[#F59E0B]">04</span>
                                </div>

                                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label htmlFor="idProof" className={labelClass}>ID Proof</label>
                                        <input onChange={InputChangeHandler} value={professionalData.idProof} className={inputClass} type="text" name="idProof" id="idProof" placeholder="ID proof URL" />
                                    </div>

                                    <div>
                                        <label htmlFor="addressProof" className={labelClass}>Address Proof</label>
                                        <input onChange={InputChangeHandler} value={professionalData.addressProof} className={inputClass} type="text" name="addressProof" id="addressProof" placeholder="Address proof URL" />
                                    </div>

                                    <div>
                                        <label htmlFor="certificate" className={labelClass}>Certificate</label>
                                        <input onChange={InputChangeHandler} value={professionalData.certificate} className={inputClass} type="text" name="certificate" id="certificate" placeholder="Certificate URL" />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-slate-200 bg-slate-50 px-5 py-5 sm:px-7 lg:px-8">
                                <button disabled={isSubmit} type="submit" className="h-11 w-full rounded-lg bg-[#0F766E] text-sm font-semibold text-white transition hover:bg-[#0d6861]" >
                                    {isSubmit ? "Submitting...": "Create Professional Account"}
                                </button>

                                <p className="mt-4 text-center text-sm text-slate-500">
                                    Already have an account?{" "}
                                    <Link to="/login" className="font-semibold text-[#0F766E] transition hover:text-[#bb7702]">Login
                                    </Link>
                                </p>
                            </div>

                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}