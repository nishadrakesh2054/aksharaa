import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Error from "./pages/Error";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

import DashboardOverview from "./pages/DashboardOverview";
import NoticesPage from "./pages/NoticesPage";
import BlogsPage from "./pages/BlogsPage";
import ActivitiesPage from "./pages/ActivitiesPage";
import HeroSlidersPage from "./pages/HeroSlidersPage";
import ThreeDGalleryPage from "./pages/ThreeDGalleryPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import GalleriesPage from "./pages/GalleriesPage";
import DownloadsPage from "./pages/DownloadsPage";
import TeachersPage from "./pages/TeachersPage";
import CategoriesPage from "./pages/CategoriesPage";
import ContactMessagesPage from "./pages/ContactMessagesPage";
import SubscribersPage from "./pages/SubscribersPage";
import EnquiriesPage from "./pages/EnquiriesPage";
import EventsCalendarPage from "./pages/EventsCalendarPage";
import LongTermProjectsPage from "./pages/LongTermProjectsPage";
import OnlineApplicationsPage from "./pages/OnlineApplicationsPage";
import AcademicsPage from "./pages/AcademicsPage";
import MunPage from "./pages/MunPage";
import InfrastructurePage from "./pages/InfrastructurePage";
import PartnersPage from "./pages/PartnersPage";
import CreativeWeek from "./pages/CreativeWeek";

import GetBlog from "./components/getBlog";
import GetActivity from "./components/getActivity";

import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "./redux/slices/loginSlice";

const App = () => {
  const [statLoading, setStatLoading] = useState(true);
  const [stat, setStat] = useState(false);

  const dispatch = useDispatch();
  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  useEffect(() => {
    async function getServerStatus() {
      setStatLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_SERVERAPI}/api/v1/stat`
        );
        if (response.data.success && response.data.data) {
          setStat(Boolean(response.data.data.stat));
        } else if (response.data.stat) {
          setStat(true);
        }
      } catch (err) {
        console.error("Server stat fetch error:", err);
      } finally {
        setStatLoading(false);
      }
    }
    getServerStatus();
  }, []);

  useEffect(() => {
    async function getUserByToken() {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common.Authorization = token;
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_SERVERAPI}/api/v1/userTokenValidation`,
            {
              headers: {
                Authorization: token,
              },
            }
          );
          if (response.data.success) {
            const loggedUser = response.data.data?.user || response.data.user || {
              name: response.data.data?.name || response.data.name,
              email: response.data.data?.email || response.data.email,
              role: response.data.data?.role || response.data.role || "admin",
            };
            dispatch(loginActions.setLoggedInUser(loggedUser));
          }
        } catch (error) {
          toast.error(error.message);
          localStorage.removeItem("token");
          delete axios.defaults.headers.common.Authorization;
        }
      } else {
        delete axios.defaults.headers.common.Authorization;
        dispatch(loginActions.setResolved(true));
      }
    }
    getUserByToken();
  }, [dispatch]);

  if (statLoading || !resolved) {
    return (
      <div className="min-vh-100 w-100 d-flex justify-content-center align-items-center fw-bold text-primary">
        LOADING PORTAL...
      </div>
    );
  }

  if (stat && !statLoading && !user) {
    return <Login />;
  }

  if (!stat && !statLoading) {
    return <Register />;
  }

  const role = typeof user === "object" && user ? user.role : "admin";
  const restrictedElement = (element) => (
    role === "frontdesk" ? <Navigate to="/online-applications" replace /> : element
  );

  return (
    <>
      <Sidebar />

      <Routes>
        {/* Landing redirects to main Dashboard Analytics Page */}
        <Route path="/" element={<Navigate to={role === "frontdesk" ? "/online-applications" : "/dashboard"} replace />} />
        <Route path="/dashboard" element={restrictedElement(<DashboardOverview />)} />

        {/* Unified CRUD Section Routes */}
        <Route path="/notices" element={restrictedElement(<NoticesPage />)} />
        <Route path="/blogs" element={restrictedElement(<BlogsPage />)} />
        <Route path="/blogs/:id" element={restrictedElement(<GetBlog />)} />
        <Route path="/activities" element={restrictedElement(<ActivitiesPage />)} />
        <Route path="/activities/:id" element={restrictedElement(<GetActivity />)} />
        <Route path="/hero-sliders" element={restrictedElement(<HeroSlidersPage />)} />
        <Route path="/3d-gallery" element={restrictedElement(<ThreeDGalleryPage />)} />
        <Route path="/testimonials" element={restrictedElement(<TestimonialsPage />)} />
        <Route path="/galleries" element={restrictedElement(<GalleriesPage />)} />
        <Route path="/downloads" element={restrictedElement(<DownloadsPage />)} />
        <Route path="/teachers" element={restrictedElement(<TeachersPage />)} />
        <Route path="/categories" element={restrictedElement(<CategoriesPage />)} />
        <Route path="/contact-messages" element={<ContactMessagesPage />} />
        <Route path="/subscribers" element={<SubscribersPage />} />
        <Route path="/enquiries" element={<EnquiriesPage />} />
        <Route path="/online-applications" element={<OnlineApplicationsPage />} />
        <Route path="/events-calendar" element={<EventsCalendarPage />} />
        <Route path="/longterm-projects" element={restrictedElement(<LongTermProjectsPage />)} />
        <Route path="/infrastructure-management" element={restrictedElement(<InfrastructurePage />)} />
        <Route path="/partners-management" element={restrictedElement(<PartnersPage />)} />
        <Route path="/creative-week-management" element={restrictedElement(<CreativeWeek />)} />
        <Route path="/academics-management" element={restrictedElement(<AcademicsPage />)} />
        <Route path="/akshara-mun-management" element={restrictedElement(<MunPage />)} />

        {/* Backward Compatibility Route Aliases */}
        <Route path="/getinquiry" element={<Navigate to="/enquiries" replace />} />
        <Route path="/get-notice" element={<Navigate to="/notices" replace />} />
        <Route path="/important-notice" element={<Navigate to="/notices" replace />} />
        <Route path="/get-blogs" element={<Navigate to="/blogs" replace />} />
        <Route path="/latest-blog" element={<Navigate to="/blogs" replace />} />
        <Route path="/get-activities" element={<Navigate to="/activities" replace />} />
        <Route path="/activity-blog" element={<Navigate to="/activities" replace />} />
        <Route path="/banner-img" element={<Navigate to="/hero-sliders" replace />} />
        <Route path="/banner-photo" element={<Navigate to="/hero-sliders" replace />} />
        <Route path="/get3d-photos" element={<Navigate to="/3d-gallery" replace />} />
        <Route path="/threeD" element={<Navigate to="/3d-gallery" replace />} />
        <Route path="/getalltestimonial" element={<Navigate to="/testimonials" replace />} />
        <Route path="/testimonial" element={<Navigate to="/testimonials" replace />} />
        <Route path="/getallphotos" element={<Navigate to="/galleries" replace />} />
        <Route path="/getpdf" element={<Navigate to="/downloads" replace />} />
        <Route path="/getallteacherprofile" element={<Navigate to="/teachers" replace />} />
        <Route path="/blogcategory" element={<Navigate to="/categories" replace />} />
        <Route path="/activitycategory" element={<Navigate to="/categories" replace />} />

        {/* Profile & Auth */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />

        {/* Fallback */}
        <Route path="*" element={<Error />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
