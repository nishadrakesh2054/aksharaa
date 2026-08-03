import React, { Suspense, lazy, useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import TopBar from "./components/TopBar";
import Head from "./components/Head";
import Footer from "./components/Footer";
import SideIcon from "./components/SideIcon";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";
import LoadingState from "./components/states/LoadingState";
import InitialLoader from "./components/InitialLoader";
import { useNotices } from "./api/hooks/usePublicContent";
import { getFileUrl } from "./api/media";

// Lazy-loaded page components for fast route loading and bundle splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const AksharaMUN = lazy(() => import("./pages/AksharaMUN"));
const Infrastructure = lazy(() => import("./pages/Infrastructure"));
const InfraDetails = lazy(() => import("./pages/InfraDetails"));
const Kindegarten = lazy(() => import("./pages/Kindergarten"));
const Elementryschool = lazy(() => import("./pages/Elementryschool"));
const Middleschool = lazy(() => import("./pages/Middleschool"));
const Highschool = lazy(() => import("./pages/Highschool"));
const Admissionpolicy = lazy(() => import("./pages/Admissionpolicy"));
const AdmissionProcedure = lazy(() => import("./pages/AdmissionProcedure"));
const ApplyOnline = lazy(() => import("./pages/ApplyOnline"));
const ChairmanMsg = lazy(() => import("./components/ChairmanMsg"));
const Team = lazy(() => import("./pages/Team"));
const EnquiryModel = lazy(() => import("./components/EnquiryModel"));
const LRPA = lazy(() => import("./pages/LRPA"));
const Blog = lazy(() => import("./pages/Blog"));
const LongTermProject = lazy(() => import("./pages/LongTermProject"));
const LatestBlogDetails = lazy(() => import("./pages/LatestBlogDetails"));
const CategoryBlogs = lazy(() => import("./pages/categoryBlogs"));
const Contact = lazy(() => import("./pages/Contact"));
const Photos = lazy(() => import("./components/Photos"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Download = lazy(() => import("./pages/Download"));
const Error = lazy(() => import("./components/Error"));

const PageFallback = () => (
  <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
    <LoadingState label="Loading page content..." />
  </div>
);

const App = () => {
  const { data: notices = [] } = useNotices();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [popupVisible, setPopupVisible] = useState(true);
  const [siteLoading, setSiteLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setSiteLoading(false);
      }, 1000);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  const activeNotices = notices.filter((n) => n.isActive !== false);

  const handleClose = () => {
    if (currentImageIndex < activeNotices.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    } else {
      setPopupVisible(false);
    }
  };

  return (
    <>
      <InitialLoader loading={siteLoading} />
      <ScrollToTop />

      {popupVisible && activeNotices && activeNotices.length ? (
        <div id="popoupContainer">
          <div className="imageContainer">
            <img
              src={getFileUrl(activeNotices[currentImageIndex]?.images)}
              alt="Notice popup"
              className="popupimg img-fluid"
            />
            <button
              className="popup-close-btn"
              onClick={handleClose}
              title="Close Notice"
              aria-label="Close Notice"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      ) : null}


      <TopBar />
      <Head />

      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/akshara-mun" element={<AksharaMUN />} />
            <Route path="/infrastructure" element={<Infrastructure />} />
            <Route path="/infrastructure/:id" element={<InfraDetails />} />
            <Route path="/academics/kindergarten" element={<Kindegarten />} />
            <Route path="/academics/elementary" element={<Elementryschool />} />
            <Route path="/academics/middle" element={<Middleschool />} />
            <Route path="/academics/high" element={<Highschool />} />
            <Route path="/admission/policy" element={<Admissionpolicy />} />
            <Route path="/admission/procedure" element={<AdmissionProcedure />} />
            <Route path="/apply-online" element={<ApplyOnline />} />
            <Route path="/about/chairman" element={<ChairmanMsg />} />
            <Route path="/about/team" element={<Team />} />
            <Route path="/getinquiry" element={<EnquiryModel />} />
            <Route path="/about/lrpa" element={<LRPA />} />
            <Route path="/newsactivity" element={<Blog />} />
            <Route
              path="/newsactivity/longterm-project/:id"
              element={<LongTermProject />}
            />
            <Route
              path="/newsactivity/:id"
              element={<LatestBlogDetails news={true} />}
            />
            <Route
              path="/newsactivitycategory/:categoryId"
              element={<CategoryBlogs news={true} />}
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gallery" element={<Photos />} />
            <Route path="/gallery/:id" element={<Gallery />} />
            <Route path="/blog/:id" element={<LatestBlogDetails />} />
            <Route path="/category/:categoryId" element={<CategoryBlogs />} />
            <Route path="/downloads" element={<Download />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      <SideIcon />
      <Footer />
    </>
  );
};

export default App;
