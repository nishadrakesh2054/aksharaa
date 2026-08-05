import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import getImageUrl from "../utils/imageUrl";
import { listFromResponse } from "../utils/apiResponse";
import {
  Activity,
  ArrowRight,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Download,
  FileCheck,
  FileText,
  Image,
  Inbox,
  Layers,
  Mail,
  MessageSquareQuote,
  Palette,
  Send,
  TrendingUp,
  Users,
} from "lucide-react";

const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const formatDate = (value) => {
  if (!value) return "No date";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const isOnlineApplication = (item) =>
  (item.source || "").toLowerCase().includes("apply") ||
  (item.documents && item.documents.length > 0) ||
  Boolean(item.studentPhoto);

const DashboardOverview = () => {
  const [data, setData] = useState({
    blogs: [],
    activities: [],
    notices: [],
    galleries: [],
    teachers: [],
    downloads: [],
    contacts: [],
    subscribers: [],
    enquiries: [],
    events: [],
    projects: [],
    infrastructure: [],
    partners: [],
    creatives: [],
    academics: [],
    heroes: [],
    threeD: [],
    testimonials: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const endpoints = [
          ["blogs", "/api/v1/blog", ["blogs"]],
          ["activities", "/api/v1/activity", ["activities"]],
          ["notices", "/api/v1/notice/getallnotice", ["notices"]],
          ["galleries", "/api/v1/getallgallery", ["gallery", "galleries"]],
          ["teachers", "/api/v1/getallprofile", ["profiles"]],
          ["downloads", "/api/v1/getallpdf", ["pdfs", "pdf"]],
          ["contacts", "/api/v1/getallcontacts", ["contacts"]],
          ["subscribers", "/api/v1/getallsubscribers", ["subscribers"]],
          ["enquiries", "/api/v1/enquiry", ["enquiries"]],
          ["events", "/api/v1/events", ["events"]],
          ["projects", "/api/v1/projects", ["projects"]],
          ["infrastructure", "/api/v1/infrastructure", ["infrastructure"]],
          ["partners", "/api/v1/partners", ["partners"]],
          ["creatives", "/api/v1/creative/getallcreativeweek", ["creative", "notices"]],
          ["academics", "/api/v1/academic", ["academics"]],
          ["heroes", "/api/v1/hero/getallheroimg", ["Heros", "heros"]],
          ["threeD", "/api/v1/three/getallthreedimg", ["gallery", "threeD"]],
          ["testimonials", "/api/v1/testimonial", ["testimonial", "testimonials"]],
        ];

        const results = await Promise.allSettled(
          endpoints.map(([, path]) => axios.get(`${import.meta.env.VITE_SERVERAPI}${path}`))
        );

        const nextData = {};
        endpoints.forEach(([key, , keys], index) => {
          const result = results[index];
          nextData[key] =
            result.status === "fulfilled" ? listFromResponse(result.value.data, keys) : [];
        });

        setData((prev) => ({ ...prev, ...nextData }));
      } catch (error) {
        console.error("Dashboard overview fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const onlineApplications = useMemo(
    () => data.enquiries.filter(isOnlineApplication),
    [data.enquiries]
  );
  const admissionInquiries = useMemo(
    () => data.enquiries.filter((item) => !isOnlineApplication(item)),
    [data.enquiries]
  );

  const unreadContacts = data.contacts.filter((item) => !item.isRead).length;
  const unreadApplications = onlineApplications.filter((item) => !item.isRead).length;
  const unreadInquiries = admissionInquiries.filter((item) => !item.isRead).length;
  const unreadSubscribers = data.subscribers.filter((item) => !item.isRead).length;

  const priorityCards = [
    {
      title: "Online Applications",
      count: onlineApplications.length,
      detail: `${unreadApplications} Unread`,
      icon: FileCheck,
      color: "#15803D",
      iconBg: "#DCFCE7",
      cardBg: "linear-gradient(135deg, #F0FDF4 0%, #FFFFFF 100%)",
      borderColor: "#C7EFD2",
      link: "/online-applications",
    },
    {
      title: "Admission Inquiries",
      count: admissionInquiries.length,
      detail: `${unreadInquiries} Unread`,
      icon: ClipboardList,
      color: "#0369A1",
      iconBg: "#E0F2FE",
      cardBg: "linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%)",
      borderColor: "#BAE6FD",
      link: "/enquiries",
    },
    {
      title: "Contact Messages",
      count: data.contacts.length,
      detail: `${unreadContacts} Unread`,
      icon: Mail,
      color: "#C2410C",
      iconBg: "#FFEDD5",
      cardBg: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
      borderColor: "#FFEDD5",
      link: "/contact-messages",
    },
    {
      title: "Subscribers",
      count: data.subscribers.length,
      detail: `${unreadSubscribers} Unread`,
      icon: Send,
      color: "#6D28D9",
      iconBg: "#F3E8FF",
      cardBg: "linear-gradient(135deg, #FDF4FF 0%, #FFFFFF 100%)",
      borderColor: "#E9D5FF",
      link: "/subscribers",
    },
  ];



  const contentMetrics = [
    { label: "Blogs", count: data.blogs.length, icon: FileText, path: "/blogs", color: "#4F46E5" },
    { label: "Activities", count: data.activities.length, icon: Activity, path: "/activities", color: "#059669" },
    { label: "Notices", count: data.notices.length, icon: Bell, path: "/notices", color: "#D97706" },
    { label: "Creatives", count: data.creatives.length, icon: Palette, path: "/creative-week-management", color: "#DB2777" },
    { label: "Testimonials", count: data.testimonials.length, icon: MessageSquareQuote, path: "/testimonials", color: "#7C3AED" },
    { label: "Events", count: data.events.length, icon: Calendar, path: "/events-calendar", color: "#0F766E" },
  ];

  const schoolMetrics = [
    { label: "Academics", count: data.academics.length, icon: BookOpen, path: "/academics-management" },
    { label: "Infrastructure", count: data.infrastructure.length, icon: Building2, path: "/infrastructure-management" },
    { label: "Staff", count: data.teachers.length, icon: Users, path: "/teachers" },
    { label: "Partners", count: data.partners.length, icon: CheckCircle2, path: "/partners-management" },
    { label: "Projects", count: data.projects.length, icon: TrendingUp, path: "/longterm-projects" },
  ];

  const mediaMetrics = [
    { label: "Hero", count: data.heroes.length, icon: Image, path: "/hero-sliders" },
    { label: "Gallery", count: data.galleries.length, icon: Layers, path: "/galleries" },
    { label: "3D Gallery", count: data.threeD.length, icon: Image, path: "/3d-gallery" },
    { label: "Downloads", count: data.downloads.length, icon: Download, path: "/downloads" },
  ];

  const recentUpdates = [
    ...data.blogs.map((item) => ({ type: "Blog", title: item.title, image: item.image, date: item.createdAt, path: "/blogs" })),
    ...data.activities.map((item) => ({ type: "Activity", title: item.title, image: item.image, date: item.createdAt, path: "/activities" })),
    ...data.notices.map((item) => ({ type: "Notice", title: item.title || "Notice", image: item.images, date: item.createdAt, path: "/notices" })),
    ...data.creatives.map((item) => ({ type: "Creative", title: item.title, image: Array.isArray(item.images) ? item.images[0] : item.images, date: item.createdAt, path: "/creative-week-management" })),
  ]
    .filter((item) => item.title)
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 6);

  const newestInbox = [
    ...onlineApplications.map((item) => ({
      type: "Application",
      title: item.studentName || "Online application",
      detail: item.parentEmail || item.phone || "Admission form",
      unread: !item.isRead,
      date: item.createdAt,
      path: "/online-applications",
    })),
    ...admissionInquiries.map((item) => ({
      type: "Inquiry",
      title: item.studentName || "Admission inquiry",
      detail: item.parentEmail || item.phone || "Admission inquiry",
      unread: !item.isRead,
      date: item.createdAt,
      path: "/enquiries",
    })),
    ...data.contacts.map((item) => ({
      type: "Message",
      title: item.name || "Contact message",
      detail: item.email || item.subject || "Website message",
      unread: !item.isRead,
      date: item.createdAt,
      path: "/contact-messages",
    })),
  ]
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 3);

  const quickActions = [
    { label: "Publish Notice", path: "/notices", icon: Bell },
    { label: "Write Blog", path: "/blogs", icon: FileText },
    { label: "Add Creative", path: "/creative-week-management", icon: Palette },
    { label: "Update Infrastructure", path: "/infrastructure-management", icon: Building2 },
    { label: "Manage Admissions", path: "/online-applications", icon: FileCheck },
  ];



  return (
    <div id="main">
      {/* Clean Brand Welcome Header */}
      <div className="mb-4">
        <h4 className="fw-bold mb-1" style={{ color: "#196642", fontSize: "1.35rem" }}>
          Welcome to Aksharaa  Dashboard
        </h4>
        <p className="text-muted mb-0 small">
          Live monitoring hub for student admissions, academic news, school infrastructure, and digital operations.
        </p>
      </div>


      {/* 4 Key Priority Action Metric Cards */}
      <div className="row g-3 mb-4">
        {priorityCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <div key={card.title} className="col-12 col-sm-6 col-xl-3">
              <Link to={card.link} className="text-decoration-none">
                <div
                  className="executive-card h-100 p-4 rounded-3 shadow-sm transition-all hover-lift position-relative"
                  style={{
                    background: card.cardBg,
                    border: `1px solid ${card.borderColor}`,
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center flex-shrink-0"
                      style={{
                        backgroundColor: card.iconBg,
                        color: card.color,
                        width: "44px",
                        height: "44px",
                      }}
                    >
                      <IconComponent size={22} />
                    </div>
                    <span
                      className="badge rounded-pill px-2.5 py-1 fw-bold"
                      style={{
                        backgroundColor: card.iconBg,
                        color: card.color,
                        fontSize: "11px",
                        border: `1px solid ${card.borderColor}`,
                      }}
                    >
                      {loading ? "..." : card.detail}
                    </span>
                  </div>

                  <div>
                    <span
                      className="text-muted small fw-bold text-uppercase d-block mb-1"
                      style={{ fontSize: "11px", letterSpacing: "0.06em" }}
                    >
                      {card.title}
                    </span>
                    <div className="d-flex align-items-baseline justify-content-between">
                      <h2
                        className="fw-bold mb-0"
                        style={{ color: "#0F172A", fontSize: "2.1rem", lineHeight: 1 }}
                      >
                        {loading ? "..." : card.count}
                      </h2>
                      <span className="small fw-bold d-inline-flex align-items-center gap-1" style={{ color: card.color }}>
                        View <ArrowRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>



      {/* Content Pipeline & Work Queue */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-xl-8">
          <div className="executive-card p-4 h-100 bg-white border rounded-3 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
              <div>
                <h5 className="fw-semibold mb-0" style={{ color: "#0F172A", fontSize: "1.05rem" }}>
                  Content Modules
                </h5>
                <small className="text-muted">Public modules displayed on website</small>
              </div>
              <span className="badge bg-light text-secondary border fw-medium">Active Website Modules</span>
            </div>
            <div className="row g-3">
              {contentMetrics.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.label} className="col-6 col-md-4">
                    <Link to={item.path} className="text-decoration-none">
                      <div className="border rounded-3 p-3 h-100 bg-light-subtle transition-all hover-lift">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <div className="p-2 rounded-2" style={{ background: `${item.color}15`, color: item.color }}>
                            <IconComponent size={18} />
                          </div>
                          <span className="fw-semibold fs-4" style={{ color: "#0F172A" }}>{loading ? "..." : item.count}</span>
                        </div>
                        <div className="small fw-semibold" style={{ color: "#0F172A" }}>{item.label}</div>
                        <small className="text-muted" style={{ fontSize: "11px" }}>Manage content</small>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="executive-card p-4 h-100 bg-white border rounded-3 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3">
              <h5 className="fw-semibold mb-0 d-flex align-items-center gap-2" style={{ color: "#0F172A", fontSize: "1.05rem" }}>
                <Inbox size={18} className="text-primary" /> Admissions Queue
              </h5>
              <Link to="/online-applications" className="small text-primary text-decoration-none fw-medium">View All</Link>
            </div>
            <div className="d-flex flex-column gap-2">
              {newestInbox.length > 0 ? (
                newestInbox.map((item, index) => (
                  <Link key={`${item.type}-${index}`} to={item.path} className="text-decoration-none">
                    <div className="d-flex align-items-center justify-content-between gap-3 border rounded-3 p-3 bg-light-subtle hover-lift">
                      <div className="min-w-0">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          {item.unread ? (
                            <span className="badge bg-danger text-uppercase fw-semibold" style={{ fontSize: "9px" }}>New</span>
                          ) : (
                            <span className="badge bg-secondary text-uppercase" style={{ fontSize: "9px" }}>Received</span>
                          )}
                          <span className="small fw-semibold" style={{ color: "#0F172A" }}>{item.type}</span>
                        </div>
                        <div className="fw-semibold text-truncate" style={{ color: "#0F172A", fontSize: "13px" }}>
                          {item.title}
                        </div>
                        <div className="small text-muted text-truncate">{item.detail}</div>
                      </div>
                      <ArrowRight size={16} className="text-primary flex-shrink-0" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted py-4 small">No inbox activity yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Directory Coverage, Recent Updates, Quick Actions */}
      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <div className="executive-card p-4 h-100 bg-white border rounded-3 shadow-sm">
            <h5 className="fw-semibold mb-1" style={{ color: "#0F172A", fontSize: "1.05rem" }}>School Directory</h5>
            <p className="small text-muted mb-3 pb-2 border-bottom">Campus infrastructure, staff, & partners</p>
            <div className="d-flex flex-column gap-2 mb-4">
              {schoolMetrics.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.label} to={item.path} className="text-decoration-none">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light hover-lift">
                      <span className="d-flex align-items-center gap-2 fw-semibold small" style={{ color: "#0F172A" }}>
                        <IconComponent size={16} className="text-primary" /> {item.label}
                      </span>
                      <span className="badge bg-white border text-dark fw-semibold">{loading ? "..." : item.count}</span>
                    </div>
                  </Link>
                );
              })}
            </div>

            <h6 className="fw-semibold mb-2 pb-2 border-bottom" style={{ color: "#0F172A", fontSize: "0.95rem" }}>Media & Downloads</h6>
            <div className="d-flex flex-column gap-2">
              {mediaMetrics.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.label} to={item.path} className="text-decoration-none">
                    <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light hover-lift">
                      <span className="d-flex align-items-center gap-2 fw-semibold small" style={{ color: "#0F172A" }}>
                        <IconComponent size={16} className="text-success" /> {item.label}
                      </span>
                      <span className="badge bg-white border text-dark fw-semibold">{loading ? "..." : item.count}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="executive-card p-4 h-100 bg-white border rounded-3 shadow-sm">
            <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
              <h5 className="fw-semibold mb-0" style={{ color: "#0F172A", fontSize: "1.05rem" }}>Recent Updates</h5>
              <span className="small text-muted">Latest posts</span>
            </div>
            <div className="d-flex flex-column gap-3">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((item, index) => (
                  <Link key={`${item.type}-${index}`} to={item.path} className="text-decoration-none">
                    <div className="d-flex align-items-center gap-3 p-2 rounded-3 hover-lift border">
                      <img
                        src={getImageUrl(item.image)}
                        alt={item.title}
                        width="46"
                        height="46"
                        className="rounded-3 object-fit-cover border flex-shrink-0"
                        onError={(e) => {
                          e.currentTarget.src = "/fallbackimage.avif";
                        }}
                      />
                      <div className="min-w-0 flex-grow-1" style={{ minWidth: 0 }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-0" style={{ fontSize: "10px" }}>{item.type}</span>
                          <small className="text-muted" style={{ fontSize: "10px" }}>{formatDate(item.date)}</small>
                        </div>
                        <div
                          className="fw-semibold mt-1"
                          style={{
                            color: "#0F172A",
                            fontSize: "12.5px",
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {stripHtml(item.title)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center text-muted py-4 small">No recent website updates found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          <div className="executive-card p-4 h-100 bg-white border rounded-3 shadow-sm">
            <h5 className="fw-semibold mb-3 d-flex align-items-center gap-2 border-bottom pb-2" style={{ color: "#0F172A", fontSize: "1.05rem" }}>
              <TrendingUp size={18} className="text-primary" /> Quick Actions
            </h5>
            <div className="d-flex flex-column gap-2">
              {quickActions.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link key={item.label} to={item.path} className="btn btn-outline-secondary text-start d-flex align-items-center justify-content-between p-3 rounded-3 hover-lift border">
                    <span className="d-flex align-items-center gap-2 fw-semibold small" style={{ color: "#0F172A" }}>
                      <IconComponent size={18} className="text-primary" /> {item.label}
                    </span>
                    <ArrowRight size={16} className="text-muted" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

    </div>
  );

};

export default DashboardOverview;
