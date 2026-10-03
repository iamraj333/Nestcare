import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { contextData } from "../context/ContextData";

export default function ProfessionalProtectedRoute({ children }) {
    const { isLoading, currentUser } = useContext(contextData);
    

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-[#64748B]">Loading...</p>
            </div>
        );
    }

    if (!currentUser.user) {
        return (
            <Navigate to="/login" replace state={{ RouteError: "Please login to access this page" }}/>
        );
    }

    if (currentUser.role === "professional") {
        return children;
    }

    if (currentUser.role === "customer") {
        return (
            <Navigate to="/user/dashboard" replace state={{ RouteError: "This page is only available to professionals" }}/>
        );
    }

    if (currentUser.role === "admin") {
        return (
            <Navigate to="/admin/dashboard" replace state={{ RouteError: "This page is only available to professionals" }}/>
        );
    }

    return <Navigate to="/login" replace />;
}