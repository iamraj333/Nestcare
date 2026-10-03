import Home from "./pages/mainPages/Home"
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PageNotFound from "./pages/mainPages/PageNotFound"
import Service from "./pages/mainPages/Service"
import SubscriptionPlans from "./pages/mainPages/SubscriptionPlans"
import Register from "./pages/authentication/Registration"
import GetStarted from "./pages/authentication/GetStarted"
import Profile from "./pages/customer/Profile"
import Login from "./pages/authentication/Login"
import ProfessionalRegister from "./pages/professional/ProfessionalRegistration"
import UserProtectRoute from "./components/UserProtectedRoute"
import Dashboard from "./pages/customer/Dashboard"
import ProfessionalProtectedRoute from "./components/ProfessionalProtectedRoute"
import ProfessionalDashboard from "./pages/professional/ProfessionalDashboard"
import { ToastContainer } from "react-toastify"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import CreateSubscriptionPlan from "./pages/admin/CreateSubscriptionPlan"
import AdminSubscriptionPlans from "./pages/admin/AdminSubscriptionPlans"
import PurchaseSubscription from "./pages/customer/PurchaseSubscription"
import CreateService from "./pages/admin/CreateService"
import AdminServices from "./pages/admin/AdminServices"
import EditService from "./pages/admin/EditServices"
import ServiceDetails from "./pages/mainPages/ServiceDetails"
import AdminProfessionals from "./pages/admin/AdminProfessionals"
import AdminCustomers from "./pages/admin/AdminCustomers"
import Booking from "./pages/customer/Booking"
import CustomerBookings from "./pages/customer/CustomerBookings"
import ProfessionalBookings from "./pages/professional/ProfessionalBooking"
import AdminBookings from "./pages/admin/AdminBookings"
import AdminDisputes from "./pages/admin/AdminDisputes"
import CustomerDisputes from "./pages/customer/CustomerDisputes"
import AdminCommunity from "./pages/admin/AdminCommunity"
import HowItWorks from "./pages/mainPages/HowItWorks"
import AdminSettings from "./pages/admin/AdminSettings"
import ManageSubscription from "./pages/customer/ManageSubscription"
import Contact from "./pages/mainPages/Contact"
import AdminContacts from "./pages/admin/AdminContact"

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/services" element={<Service />}></Route>
          <Route path="/services/:serviceId" element={<ServiceDetails />}></Route>
          <Route path="/plans" element={<SubscriptionPlans />}></Route>
          <Route path="/howitworks" element={<HowItWorks />}></Route>
          <Route path="/getStarted" element={<GetStarted />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/contact" element={<Contact/>}></Route>

          {/*========= USER ROUTES ===================== */}
          <Route path="/user/register" element={<Register />}></Route>
          <Route path="/user/dashboard" element={<UserProtectRoute><Dashboard /></UserProtectRoute>}></Route>
          <Route path="/user/profile" element={<Profile />}></Route>
          <Route path="/plans/purchase/:id" element={<PurchaseSubscription/>}></Route>
          <Route path="/booking/:id" element={<UserProtectRoute><Booking/></UserProtectRoute>}></Route>
          <Route path="/customer/bookings" element={<UserProtectRoute><CustomerBookings/></UserProtectRoute>}></Route>
          <Route path="/customer/disputes" element={<UserProtectRoute><CustomerDisputes/></UserProtectRoute>}></Route>
          <Route path="/customer/manageSubscription" element={<UserProtectRoute><ManageSubscription/></UserProtectRoute>}></Route>

          {/*===================== PROFESSIONALS ROUTES =============================*/}
          <Route path="/professional/register" element={<ProfessionalRegister />}></Route>
          <Route path="/professional/dashboard" element={<ProfessionalProtectedRoute><ProfessionalDashboard /></ProfessionalProtectedRoute>}></Route>
          <Route path="/professional/bookings" element={<ProfessionalProtectedRoute><ProfessionalBookings /></ProfessionalProtectedRoute>}></Route>

          {/*===================== ADMIN ROUTES =============================*/}
          <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>}></Route>
          <Route path="/admin/subscriptionPlan/create" element={<AdminProtectedRoute><CreateSubscriptionPlan /></AdminProtectedRoute>}></Route>
          <Route path="/admin/page/subscriptionPlan" element={<AdminProtectedRoute><AdminSubscriptionPlans /></AdminProtectedRoute>}></Route>
          <Route path="/admin/service/create" element={<AdminProtectedRoute><CreateService/></AdminProtectedRoute>}></Route>
          <Route path="/admin/page/services" element={<AdminProtectedRoute><AdminServices/></AdminProtectedRoute>}></Route>
          <Route path="/admin/service/edit/:serviceId" element={<AdminProtectedRoute><EditService/></AdminProtectedRoute>}></Route>
          <Route path="/admin/professionals" element={<AdminProtectedRoute><AdminProfessionals/></AdminProtectedRoute>}></Route>
          <Route path="/admin/customers" element={<AdminProtectedRoute><AdminCustomers/></AdminProtectedRoute>}></Route>
          <Route path="/admin/bookings" element={<AdminProtectedRoute><AdminBookings/></AdminProtectedRoute>}></Route>
          <Route path="/admin/disputes" element={<AdminProtectedRoute><AdminDisputes/></AdminProtectedRoute>}></Route>
          <Route path="/admin/community" element={<AdminProtectedRoute><AdminCommunity/></AdminProtectedRoute>}></Route>
          <Route path="/admin/settings" element={<AdminProtectedRoute><AdminSettings/></AdminProtectedRoute>}></Route>
          <Route path="/admin/contacts" element={<AdminProtectedRoute><AdminContacts/></AdminProtectedRoute>}></Route>
          <Route path="*" element={<PageNotFound />}></Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </>
  )
}

export default App
