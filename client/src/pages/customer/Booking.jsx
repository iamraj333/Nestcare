import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoArrowBack, IoCalendarOutline, IoLocationOutline } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { toast } from "react-toastify";
import { useContext } from "react";
import { contextData } from "../../context/ContextData";

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useContext(contextData)
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        scheduledDate: "",
        timeSlot: "",
        house: "",
        street: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        notes: ""
    });

    useEffect(() => {
        // FETCH SPECIFIC SERVICE
        const fetchService = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/${id}`, {
                    method: "GET",
                    credentials: "include"
                });
                const data = await res.json();
                if (!res.ok) {
                    setError(data.error || "Failed to fetch service");
                }
                setService(data.serviceData);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchService();
    }, [id]);

    useEffect(() => {
        if (currentUser?.user?.address) {
            const { house, street, area, city, state, pincode } = currentUser?.user?.address;

            setFormData({
                ...formData,
                house: house || "",
                street: street || "",
                area: area || "",
                city: city || "",
                state: state || "",
                pincode: pincode || ""
            })
        }
    }, [currentUser])


    const handleChange = e => setFormData({
        ...formData,
        [e.target.name]: e.target.value
    });

    const { scheduledDate, timeSlot, house, street, area, city, state, pincode, notes } = formData;
    const bookingData = {
        serviceId: id,
        scheduledDate: scheduledDate,
        timeSlot: timeSlot,
        address: {
            house: house,
            street: street,
            area: area,
            city: city,
            state: state,
            pincode: pincode
        },
        notes: notes
    }

    /*======================== SEND BOOKING DATA TO SERVER FOR BOOK SERVICE ==================================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const { scheduledDate, timeSlot, address, notes } = bookingData
        if (!scheduledDate) {
            setError("Please select a scheduled date.");
            return;
        }

        if (new Date(scheduledDate) < new Date(new Date().setHours(0, 0, 0, 0))) {
            setError("Please select a valid future date.");
            return;
        }

        if (!timeSlot) {
            setError("Please select a time slot.");
            return;
        }

        if (!address.house) {
            setError("Please enter your house/building number.");
            return;
        }

        if (!address.street) {
            setError("Please enter your street.");
            return;
        }

        if (!address.area) {
            setError("Please enter your area.");
            return;
        }

        if (!address.city) {
            setError("Please enter your city.");
            return;
        }

        if (!address.state) {
            setError("Please select your state.");
            return;
        }

        if (!/^[0-9]{6}$/.test(address.pincode)) {
            setError("Please enter a valid 6-digit pincode.");
            return;
        }

        try {
            setSubmitting(true);
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/booking/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(bookingData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success(data.success)
                navigate("/customer/bookings");
            } else {
                toast.error(data.error)
            }
        } catch (e) {
            console.error("Server connection failed to create booking: ", e)
            setError("Server connection failed to book service");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <><Navbar /><div className="min-h-screen flex items-center justify-center"><p className="text-slate-500">Loading...</p></div><Footer /></>;

    if (!service) return <><Navbar /><div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error || "Service not found"}</p></div><Footer /></>;

    return <>
        <Navbar />
        <main className="min-h-screen bg-[#F9FAFB] py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-[#0F766E] mb-6">
                    <IoArrowBack />Back
                </button>

                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-fit">
                        <img src={service.image} alt={service.name} className="w-full h-56 object-cover" />
                        <div className="p-6">
                            <p className="text-sm text-[#0F766E] font-medium capitalize">{service.category}</p>
                            <h1 className="text-2xl font-bold text-[#0F172A] mt-2">{service.name}</h1>
                            <p className="text-slate-600 mt-3">{service.description}</p>
                            <div className="mt-5 pt-5 border-t border-slate-200">
                                <p className="text-sm text-slate-500">Included in your subscription</p>
                                <p className="text-[#16A34A] font-semibold mt-1">No additional payment required</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-7">
                            <div className="w-11 h-11 rounded-xl bg-[#0F766E]/10 flex items-center justify-center">
                                <IoCalendarOutline className="text-[#0F766E] text-xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-[#0F172A]">Book Your Service</h2>
                                <p className="text-sm text-slate-500">Choose your preferred date, time and address</p>
                            </div>
                        </div>

                        {error && <div className="mb-5 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Date *</label>
                                    <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleChange} min={new Date().toISOString().split("T")[0]} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Slot *</label>
                                    <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]">
                                        <option value="">Select time slot</option>
                                        <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                                        <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                                        <option value="02:00 PM - 04:00 PM">02:00 PM - 04:00 PM</option>
                                        <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <IoLocationOutline className="text-[#0F766E] text-xl" />
                                    <h3 className="font-semibold text-[#0F172A]">Service Address</h3>
                                </div>
                                <div className="grid md:grid-cols-2 gap-5">
                                    <input type="text" name="house" placeholder="House / Flat No. *" value={formData.house} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                    <input type="text" name="street" placeholder="Street *" value={formData.street} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                    <input type="text" name="area" placeholder="Area *" value={formData.area} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                    <input type="text" name="city" placeholder="City *" value={formData.city} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                    <input type="text" name="state" placeholder="State *" value={formData.state} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                    <input type="text" name="pincode" placeholder="Pincode *" value={formData.pincode} onChange={handleChange} className="border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E]" />
                                </div>

                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
                                <textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Anything the professional should know?" className="w-full border border-slate-300 rounded-lg px-4 py-3 outline-none focus:border-[#0F766E] resize-none" />
                            </div>

                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-sm text-amber-800">Your service is covered by your active subscription. No additional payment is required for this booking.</p>
                            </div>

                            <button type="submit" disabled={submitting} className="w-full bg-[#0F766E] hover:bg-[#0b625c] text-white font-semibold py-3.5 rounded-lg transition disabled:opacity-60">
                                {submitting ? "Booking..." : "Confirm Booking"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
        <Footer />
    </>;
};
