import React, { useEffect, useState } from "react";
import { IoAddOutline, IoCreateOutline, IoRefreshOutline, IoArrowBack } from "react-icons/io5";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function AdminServices() {
    const navigate = useNavigate();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusLoading, setStatusLoading] = useState(null);

    //Fetch ALL SERVICES
    const fetchServices = async () => {
        setLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/admin/all`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                setServices(data.serviceData || []);
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

    //Hndling service active or inactive status
    const handleStatusChange = async (serviceId) => {
        setStatusLoading(serviceId);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/status/${serviceId}`,
                {
                    method: "PATCH",
                    credentials: "include"
                }
            );

            const data = await response.json();
            if (response.ok) {
                toast.success(data.success);

                setServices((services) =>
                    services.map((service) =>
                        service._id === serviceId ? {
                            ...service,
                            isActive: data.serviceData.isActive
                        } : service
                    )
                );
            } else {
                toast.error(data.error || "Failed to update service status");
            }
        } catch (e) {
            console.error("Failed to update service status:", e);
            toast.error("Server connection failed");
        } finally {
            setStatusLoading(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto">
                    <button onClick={() => window.history.back()} className="mb-5 flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0b5f59]" >
                        <IoArrowBack /> Back
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <div>
                            <p className="text-[#bb7702] text-xs font-semibold uppercase tracking-wider">Admin</p>
                            <h1 className="text-3xl font-bold text-[#0F172A] mt-2">Services</h1>
                            <p className="text-[#64748B] mt-2">Manage services available on NestCare.</p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={fetchServices}
                                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 bg-white text-[#0F172A] hover:bg-slate-50 transition">
                                <IoRefreshOutline className="text-lg" />Refresh
                            </button>

                            <Link to="/admin/service/create"
                                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d655f] transition">
                                <IoAddOutline className="text-lg" />Add Service
                            </Link>
                        </div>
                    </div>

                    {loading ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                            <p className="text-[#64748B]">Loading services...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                            <h2 className="text-lg font-semibold text-[#0F172A]">No services found</h2>
                            <p className="text-[#64748B] mt-2">Create your first service to make it available to customers.</p>
                            <Link to="/admin/service/create"
                                className="inline-flex items-center gap-2 mt-5 px-5 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d655f] transition">
                                <IoAddOutline className="text-lg" />Create Service
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {services.map((service) => (
                                <div key={service._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                                    <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-lg font-bold text-[#0F172A]">{service.name}</h2>
                                                <p className="text-sm text-[#0F766E] font-medium capitalize mt-1">{service.category}</p>
                                            </div>

                                            <span
                                                className={`text-xs font-semibold px-3 py-1 rounded-full ${service.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {service.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[#64748B] mt-3 line-clamp-2">{service.description}</p>
                                        <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs text-[#64748B]">Base Price</p>
                                                <p className="text-lg font-bold text-[#0F172A]">₹{service.basePrice}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-[#64748B]">Duration</p>
                                                <p className="text-sm font-semibold text-[#0F172A]">{service.duration} min</p>
                                            </div>
                                        </div>

                                        {service.features?.length > 0 && (
                                            <div className="mt-4">
                                                <p className="text-xs font-semibold text-[#0F172A] mb-2">Features</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {service.features.map((feature, index) => (
                                                        <span key={index} className="text-xs bg-slate-100 text-[#475569] px-2.5 py-1.5 rounded-lg">
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-3 mt-5">
                                            <button onClick={() => navigate(`/admin/service/edit/${service._id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-[#0F172A] font-medium hover:bg-slate-50 transition">
                                                <IoCreateOutline />Edit
                                            </button>

                                            <button
                                                onClick={() => handleStatusChange(service._id)}
                                                disabled={statusLoading === service._id}
                                                className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-60 ${service.isActive
                                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                                    }`}
                                            >
                                                {statusLoading === service._id ? "Updating..." : service.isActive ? "Deactivate" : "Activate"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}