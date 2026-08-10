import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar";

import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { loginActions } from "./redux/slices/loginSlice";

const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Error = lazy(() => import("./pages/Error"));
const Profile = lazy(() => import("./pages/Profile"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const DashboardOverview = lazy(() => import("./pages/DashboardOverview"));
const NoticesPage = lazy(() => import("./pages/NoticesPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const ActivitiesPage = lazy(() => import("./pages/ActivitiesPage"));
const HeroSlidersPage = lazy(() => import("./pages/HeroSlidersPage"));
const ThreeDGalleryPage = lazy(() => import("./pages/ThreeDGalleryPage"));
const TestimonialsPage = lazy(() => import("./pages/TestimonialsPage"));
const FaqsPage = lazy(() => import("./pages/FaqsPage"));
const GalleriesPage = lazy(() => import("./pages/GalleriesPage"));
const DownloadsPage = lazy(() => import("./pages/DownloadsPage"));
const TeachersPage = lazy(() => import("./pages/TeachersPage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const ContactMessagesPage = lazy(() => import("./pages/ContactMessagesPage"));
const SubscribersPage = lazy(() => import("./pages/SubscribersPage"));
const EnquiriesPage = lazy(() => import("./pages/EnquiriesPage"));
const EventsCalendarPage = lazy(() => import("./pages/EventsCalendarPage"));
const LongTermProjectsPage = lazy(() => import("./pages/LongTermProjectsPage"));
const OnlineApplicationsPage = lazy(() => import("./pages/OnlineApplicationsPage"));
const AcademicsPage = lazy(() => import("./pages/AcademicsPage"));
const MunPage = lazy(() => import("./pages/MunPage"));
const InfrastructurePage = lazy(() => import("./pages/InfrastructurePage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const CreativeWeek = lazy(() => import("./pages/CreativeWeek"));
const ChairmanMessagesPage = lazy(() => import("./pages/ChairmanMessagesPage"));
const VisionMissionPage = lazy(() => import("./pages/VisionMissionPage"));
const CoreValuesFrameworkPage = lazy(() => import("./pages/CoreValuesFrameworkPage"));
const GetBlog = lazy(() => import("./components/getBlog"));
const GetActivity = lazy(() => import("./components/getActivity"));

const PageLoader = () => (
  <div id="main" className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const AuthLoader = () => (
  <div className="min-vh-100 d-flex justify-content-center align-items-center bg-light">
    <div className="spinner-border text-success" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const App = () => {
  const [statLoading, setStatLoading] = useState(true);
  const [stat, setStat] = useState(false);

  const dispatch = useDispatch();
  const { resolved, user } = useSelector((state) => state.login.loggedInUser);

  useEffect(() => {
    let isMounted = true;

    // Safety fallback: ensure loading screen resolves within 3 seconds max
    const fallbackTimer = setTimeout(() => {
      if (isMounted) {
        setStatLoading(false);
        dispatch(loginActions.setResolved(true));
      }
    }, 3000);

    async function initDashboard() {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common.Authorization = token;
      } else {
        delete axios.defaults.headers.common.Authorization;
      }

      // Execute status check and token validation concurrently
      const statPromise = axios
        .get(`${import.meta.env.VITE_SERVERAPI}/api/v1/stat`)
        .then((res) => {
          if (isMounted) {
            if (res.data.success && res.data.data) {
              setStat(Boolean(res.data.data.stat));
            } else if (res.data.stat) {
              setStat(true);
            }
          }
        })
        .catch((err) => {
          console.error("Server stat fetch error:", err);
          if (isMounted) setStat(true); // Default fallback to active stat on network error
        })
        .finally(() => {
          if (isMounted) setStatLoading(false);
        });

      const userPromise = (async () => {
        if (token) {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_SERVERAPI}/api/v1/userTokenValidation`,
              { headers: { Authorization: token } }
            );
            if (isMounted && res.data.success) {
              const loggedUser = res.data.data?.user || res.data.user || {
                name: res.data.data?.name || res.data.name,
                email: res.data.data?.email || res.data.email,
                role: res.data.data?.role || res.data.role || "admin",
              };
              dispatch(loginActions.setLoggedInUser(loggedUser));
            }
          } catch (error) {
            console.error("Token validation error:", error);
            localStorage.removeItem("token");
            delete axios.defaults.headers.common.Authorization;
          } finally {
            if (isMounted) dispatch(loginActions.setResolved(true));
          }
        } else {
          if (isMounted) dispatch(loginActions.setResolved(true));
        }
      })();

      await Promise.allSettled([statPromise, userPromise]);
      clearTimeout(fallbackTimer);
    }

    initDashboard();

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimer);
    };
  }, [dispatch]);

  if (statLoading || !resolved) {
    return (
      <div
        className="min-vh-100 w-100 d-flex flex-column justify-content-center align-items-center bg-light"
        style={{ transition: "all 0.3s ease" }}
      >
        <div className="spinner-border text-success mb-3" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h6 className="fw-bold text-dark mb-1" style={{ letterSpacing: "0.5px" }}>
          Aksharaa Portal Loading...
        </h6>
        <small className="text-muted">Please wait a moment</small>
      </div>
    );
  }

  if (stat && !statLoading && !user) {
    return (
      <Suspense fallback={<AuthLoader />}>
        <Login />
      </Suspense>
    );
  }

  if (!stat && !statLoading) {
    return (
      <Suspense fallback={<AuthLoader />}>
        <Register />
      </Suspense>
    );
  }

  const role = typeof user === "object" && user ? user.role : "admin";
  const restrictedElement = (element) => (
    role === "frontdesk" ? <Navigate to="/online-applications" replace /> : element
  );

  return (
    <>
      <Sidebar />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Landing redirects to main Dashboard Analytics Page */}
          <Route path="/" element={<Navigate to={role === "frontdesk" ? "/online-applications" : "/dashboard"} replace />} />
          <Route path="/dashboard" element={restrictedElement(<DashboardOverview />)} />

          {/* Unified CRUD Section Routes */}
          <Route path="/notices" element={restrictedElement(<NoticesPage />)} />
          <Route path="/blogs" element={restrictedElement(<BlogsPage />)} />
          <Route path="/chairman-messages" element={restrictedElement(<ChairmanMessagesPage />)} />
          <Route path="/vision-mission" element={restrictedElement(<VisionMissionPage />)} />
          <Route path="/core-values-framework" element={restrictedElement(<CoreValuesFrameworkPage />)} />
          <Route path="/blogs/:id" element={restrictedElement(<GetBlog />)} />
          <Route path="/activities" element={restrictedElement(<ActivitiesPage />)} />
          <Route path="/activities/:id" element={restrictedElement(<GetActivity />)} />
          <Route path="/hero-sliders" element={restrictedElement(<HeroSlidersPage />)} />
          <Route path="/3d-gallery" element={restrictedElement(<ThreeDGalleryPage />)} />
          <Route path="/testimonials" element={restrictedElement(<TestimonialsPage />)} />
          <Route path="/faqs" element={restrictedElement(<FaqsPage />)} />
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
          <Route path="/about-chairman" element={<Navigate to="/chairman-messages" replace />} />
          <Route path="/chairman-management" element={<Navigate to="/chairman-messages" replace />} />
          <Route path="/vision&mission" element={<Navigate to="/vision-mission" replace />} />
          <Route path="/vision-mission-management" element={<Navigate to="/vision-mission" replace />} />
          <Route path="/core-values" element={<Navigate to="/core-values-framework" replace />} />
          <Route path="/latest-blog" element={<Navigate to="/blogs" replace />} />
          <Route path="/get-activities" element={<Navigate to="/activities" replace />} />
          <Route path="/activity-blog" element={<Navigate to="/activities" replace />} />
          <Route path="/banner-img" element={<Navigate to="/hero-sliders" replace />} />
          <Route path="/banner-photo" element={<Navigate to="/hero-sliders" replace />} />
          <Route path="/get3d-photos" element={<Navigate to="/3d-gallery" replace />} />
          <Route path="/threeD" element={<Navigate to="/3d-gallery" replace />} />
          <Route path="/getalltestimonial" element={<Navigate to="/testimonials" replace />} />
          <Route path="/testimonial" element={<Navigate to="/testimonials" replace />} />
          <Route path="/faq" element={<Navigate to="/faqs" replace />} />
          <Route path="/faqs-management" element={<Navigate to="/faqs" replace />} />
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
      </Suspense>

      <Toaster position="top-right" />
    </>
  );
};

export default App;
