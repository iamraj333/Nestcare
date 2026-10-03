import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { FiArrowLeft, FiRefreshCw, FiCheckCircle, FiXCircle } from "react-icons/fi"

export default function AdminDisputes() {
    const navigate = useNavigate()
    const [disputes, setDisputes] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDispute, setSelectedDispute] = useState(null)
    const [resolution, setResolution] = useState("")
    const [updating, setUpdating] = useState(false)

    async function fetchDisputes() {
        setLoading(true)
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/dispute/all`, {
                method: "GET",
                credentials: "include"
            })

            const data = await response.json()

            if (response.ok) {
                setDisputes(data.disputeData || [])
            } else {
                toast.error(data.error || "Failed to fetch disputes")
            }
        } catch (e) {
            console.error("Failed to fetch disputes:", e)
            toast.error("Server connection failed")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchDisputes()
    }, [])

    async function updateStatus(status) {
        if (!selectedDispute) return

        if (!resolution.trim()) {
            toast.error("Enter resolution")
            return
        }

        setUpdating(true)

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_URL}/dispute/status/${selectedDispute._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        status,
                        resolution
                    })
                }
            )

            const data = await response.json()

            if (response.ok) {
                toast.success(data.success)
                setSelectedDispute(null)
                setResolution("")
                fetchDisputes()
            } else {
                toast.error(data.error || "Failed to update dispute")
            }
        } catch (e) {
            console.error("Failed to update dispute:", e)
            toast.error("Server connection failed")
        } finally {
            setUpdating(false)
        }
    }

    function getStatusClass(status) {
        if (status === "open") {
            return "bg-red-50 text-red-600"
        }

        if (status === "under-review") {
            return "bg-amber-50 text-amber-600"
        }

        if (status === "resolved") {
            return "bg-green-50 text-green-600"
        }

        return "bg-slate-100 text-slate-600"
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#F9FAFB] px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <button
                                onClick={() => navigate(-1)}
                                className="mb-3 flex items-center gap-2 text-sm font-medium text-[#64748B] hover:text-[#0F766E]"
                            >
                                <FiArrowLeft />
                                Back
                            </button>

                            <h1 className="text-2xl font-bold text-[#0F172A]">
                                Dispute Management
                            </h1>

                            <p className="mt-1 text-sm text-[#64748B]">
                                Review and manage customer disputes.
                            </p>
                        </div>

                        <button
                            onClick={fetchDisputes}
                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0F172A] shadow-sm hover:border-[#0F766E] hover:text-[#0F766E]"
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>
                    </div>

                    {loading ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <p className="text-sm text-[#64748B]">
                                Loading disputes...
                            </p>
                        </div>
                    ) : disputes.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                            <p className="font-semibold text-[#0F172A]">
                                No disputes found
                            </p>
                            <p className="mt-1 text-sm text-[#64748B]">
                                There are currently no customer disputes.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">
                            {disputes.map((dispute) => (
                                <div
                                    key={dispute._id}
                                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                                >
                                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                        <div>
                                            <h2 className="font-bold text-[#0F172A]">
                                                {dispute.subject}
                                            </h2>

                                            <p className="mt-1 text-sm text-[#64748B]">
                                                {dispute.customer?.name || "Customer"}
                                            </p>
                                        </div>

                                        <span
                                            className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                                                dispute.status
                                            )}`}
                                        >
                                            {dispute.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-[#64748B]">
                                        <p>
                                            <strong className="text-[#0F172A]">
                                                Professional:
                                            </strong>{" "}
                                            {dispute.professional?.name || "N/A"}
                                        </p>

                                        <p>
                                            <strong className="text-[#0F172A]">
                                                Service Date:
                                            </strong>{" "}
                                            {dispute.booking?.scheduleDate
                                                ? new Date(
                                                    dispute.booking.scheduleDate
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </p>

                                        <p>
                                            <strong className="text-[#0F172A]">
                                                Description:
                                            </strong>{" "}
                                            {dispute.description}
                                        </p>
                                    </div>

                                    {dispute.resolution && (
                                        <div className="mt-4 rounded-xl bg-slate-50 p-4">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                                                Resolution
                                            </p>
                                            <p className="mt-1 text-sm text-[#0F172A]">
                                                {dispute.resolution}
                                            </p>
                                        </div>
                                    )}

                                    {(dispute.status === "open" ||
                                        dispute.status === "under-review") && (
                                            <div className="mt-5 flex flex-wrap gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedDispute(dispute)
                                                        setResolution("")
                                                    }}
                                                    className="flex items-center gap-2 rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0d665f]"
                                                >
                                                    <FiCheckCircle />
                                                    Resolve
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedDispute(dispute)
                                                        setResolution("")
                                                    }}
                                                    className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100"
                                                >
                                                    <FiXCircle />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {selectedDispute && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                        <h2 className="text-xl font-bold text-[#0F172A]">
                            Update Dispute
                        </h2>

                        <p className="mt-2 text-sm text-[#64748B]">
                            {selectedDispute.subject}
                        </p>

                        <textarea value={resolution} onChange={(e) => setResolution(e.target.value)} rows="5" placeholder="Enter resolution..."
                            className="mt-5 w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/10" />

                        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                onClick={() => {
                                    setSelectedDispute(null)
                                    setResolution("")
                                }}
                                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-[#64748B]">
                                Cancel
                            </button>

                            <button disabled={updating} onClick={() => updateStatus("rejected")}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                                Reject
                            </button>

                            <button disabled={updating} onClick={() => updateStatus("resolved")}
                                className="rounded-xl bg-[#0F766E] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                                Resolve
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    )
}
