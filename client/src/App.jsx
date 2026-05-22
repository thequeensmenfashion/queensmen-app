import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Models from "./pages/Models";
import ModelDetails from "./pages/ModelDetails";
import Flyers from "./pages/Flyers";
import Apply from "./pages/Apply";
import BookModel from "./pages/BookModel";
import Contact from "./pages/Contact";
import AdminSystemCheck from "./admin/AdminSystemCheck";
import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminApplications from "./admin/AdminApplications";
import AdminBookings from "./admin/AdminBookings";
import AdminMessages from "./admin/AdminMessages";
import AdminModels from "./admin/AdminModels";
import AdminFlyers from "./admin/AdminFlyers";
import AdminSettings from "./admin/AdminSettings";
import AdminChangePassword from "./admin/AdminChangePassword";


function AppLayout() {
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPage && <Navbar />}

      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/models" element={<Models />} />
        <Route path="/models/:id" element={<ModelDetails />} />
        <Route path="/flyers" element={<Flyers />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/book" element={<BookModel />} />
        <Route path="/contact" element={<Contact />} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ADMIN PROTECTED ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedAdminRoute>
              <AdminChangePassword />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedAdminRoute>
              <AdminApplications />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdminRoute>
              <AdminBookings />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/messages"
          element={
            <ProtectedAdminRoute>
              <AdminMessages />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/models"
          element={
            <ProtectedAdminRoute>
              <AdminModels />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/flyers"
          element={
            <ProtectedAdminRoute>
              <AdminFlyers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <ProtectedAdminRoute>
              <AdminSettings />
            </ProtectedAdminRoute>
          }
        />
<Route
  path="/admin/system-check"
  element={
    <ProtectedAdminRoute>
      <AdminSystemCheck />
    </ProtectedAdminRoute>
  }
/>
      </Routes>

      {!isAdminPage && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
