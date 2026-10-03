import React, { useEffect, useState } from "react";
import { IoAdd, IoClose, IoCloudUploadOutline, IoArrowBackOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function EditService() {
    const { serviceId } = useParams();
    const navigate = useNavigate();

    const [serviceData, setServiceData] = useState({
        name: "",
        category: "",
        description: "",
        basePrice: "",
        duration: ""
    });

    const [features, setFeatures] = useState([]);
    const [featureInput, setFeatureInput] = useState("");
    const [serviceImage, setServiceImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setServiceData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };

    //FETCH SERVICE DATA
    const fetchService = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/service/${serviceId}`,
                {
                    method: "GET",
                    credentials: "include"
                }
            );

            const data = await response.json();

            if (response.ok) {
                const service = data.serviceData;

                setServiceData({
                    name: service.name || "",
                    category: service.category || "",
                    description: service.description || "",
                    basePrice: service.basePrice ?? "",
                    duration: service.duration ?? ""
                });

                setFeatures(service.features || []);
                setImagePreview(service.image || "");
            } else {
                toast.error(data.error || "Failed to fetch service");
                navigate("/admin/page/services");
            }
        } catch (e) {
            console.error("Failed to fetch service:", e);
            toast.error("Server connection failed");
            navigate("/admin/page/services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchService();
    }, [serviceId]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setServiceImage(file);

        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
    };

    const addFeature = () => {
        const feature = featureInput.trim();

        if (!feature) {
            toast.error("Enter a feature");
            return;
        }

        setFeatures((previousFeatures) => [
            ...previousFeatures,
            feature
        ]);

        setFeatureInput("");
    };

    const removeFeature = (indexToRemove) => {
        setFeatures((previousFeatures) =>
            previousFeatures.filter(
                (item, index) => index !== indexToRemove
            )
        );
    };

    //EDIT SERVICES
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, category, description, basePrice, duration } = serviceData;

        if (!name.trim()) {
            toast.error("Please enter service name");
            return;
        }

        if (!category) {
            toast.error("Please select a category");
            return;
        }

        if (!description.trim()) {
            toast.error("Please enter description");
            return;
        }

        if (basePrice === "" || Number(basePrice) < 0) {
            toast.error("Please enter a valid base price");
            return;
        }

        if (!duration) {
            toast.error("Please enter duration");
            return;
        }

        if (features.length === 0) {
            toast.error("Please enter service feature");
            return;
        }

        const formData = new FormData()

        formData.append("name", name.trim())
        formData.append("category", category)
        formData.append("description", description.trim())
        formData.append("features", JSON.stringify(features))
        formData.append("basePrice", basePrice)
        formData.append("duration", duration)

        if (serviceImage) {
            formData.append("image", serviceImage)
        }

        setUpdateLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/service/update/${serviceId}`,
                {
                    method: "PUT",
                    credentials: "include",
                    body: formData
                }
            );

            const data = await response.json();

            if (response.ok) {
                if (data.success) {
                    toast.success(data.success || "Service updated successfully");
                    navigate("/admin/page/services");
                }
                else {
                    toast.error(data.error)
                }
            } else {
                toast.error(data.error || "Failed to update service");
            }
        } catch (e) {
            console.error("Failed to update service:", e);
            toast.error("Server connection failed");
        } finally {
            setUpdateLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                    <p className="text-[#64748B]">Loading service...</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
                <div className="max-w-4xl mx-auto">
                    <button type="button" onClick={() => navigate(-1)} className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#0F766E] hover:text-[#0F172A]">
                        <IoArrowBackOutline /> Back
                    </button>
                    <div className="mb-8">
                        <p className="text-[#bb7702] text-xs font-semibold uppercase tracking-wider">
                            Admin
                        </p>
                        <h1 className="text-3xl font-bold text-[#0F172A] mt-2">
                            Edit Service
                        </h1>
                        <p className="text-[#64748B] mt-2">
                            Update service details.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Service Name
                                </label>

                                <input type="text" name="name" value={serviceData.name} onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E]"/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Category
                                </label>

                                <select name="category" value={serviceData.category} onChange={handleChange}
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E] bg-white">
                                    <option value="">Select category</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="plumbing">Plumbing</option>
                                    <option value="electrical">Electrical</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Description
                                </label>

                                <textarea name="description" value={serviceData.description} onChange={handleChange} rows="4"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E] resize-none"/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Base Price
                                </label>

                                <input type="number" name="basePrice" value={serviceData.basePrice} onChange={handleChange} min="0"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E]"/>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Duration (minutes)
                                </label>

                                <input type="number" name="duration" value={serviceData.duration} onChange={handleChange} min="1"
                                    className="w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E]"/>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Service Image
                                </label>

                                <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#0F766E] transition">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Service preview" className="w-full max-h-64 object-cover rounded-lg"/>
                                    ) : (
                                        <>
                                            <IoCloudUploadOutline className="text-4xl text-[#0F766E] mb-2" />
                                            <p className="text-sm font-medium text-[#0F172A]">
                                                Click to upload new image
                                            </p>
                                            <p className="text-xs text-[#64748B] mt-1">
                                                JPG, PNG or WEBP · Maximum 5MB
                                            </p>
                                        </>
                                    )}

                                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden"/>
                                </label>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-[#0F172A] mb-2">
                                    Service Features
                                </label>

                                <div className="flex gap-3">
                                    <input type="text" value={featureInput} onChange={(e) =>setFeatureInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault();
                                                addFeature();
                                            }
                                        }}
                                        placeholder="e.g. Kitchen deep cleaning"
                                        className="flex-1 border border-slate-300 rounded-xl px-4 py-3 outline-none focus:border-[#0F766E]"
                                    />

                                    <button type="button" onClick={addFeature} className="px-4 rounded-xl bg-[#0F766E] text-white hover:bg-[#0d655f] transition">
                                        <IoAdd className="text-xl" />
                                    </button>
                                </div>

                                {features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {features.map((feature, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-slate-100 text-[#0F172A] px-3 py-2 rounded-lg text-sm">
                                                <span>{feature}</span>
                                                <button type="button" onClick={() =>removeFeature(index) }
                                                    className="text-slate-500 hover:text-red-500">
                                                    <IoClose />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button type="button" onClick={() => navigate("/admin/page/services")}
                                className="px-6 py-3 rounded-xl border border-slate-300 text-[#0F172A] font-semibold hover:bg-slate-50 transition">
                                Cancel
                            </button>

                            <button type="submit" disabled={updateLoading}
                                className="px-6 py-3 rounded-xl bg-[#0F766E] text-white font-semibold hover:bg-[#0d655f] transition disabled:opacity-60 disabled:cursor-not-allowed">
                                {updateLoading ? "Updating..." : "Update Service"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
}