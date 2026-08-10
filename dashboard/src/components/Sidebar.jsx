import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  LayoutDashboard,
  Bell,
  FileText,
  Activity,
  Image,
  RotateCw,
  MessageSquareQuote,
  HelpCircle,
  Layers,
  FileUp,
  Users,
  UserRoundCog,
  HeartHandshake,
  ShieldCheck,
  Tag,
  Mail,
  Send,
  ClipboardList,
  Calendar,
  FolderGit2,
  FileCheck,
  GraduationCap,
  Building2,
  Handshake,
  Globe,
  User,
  LogOut,
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.login.loggedInUser);
  const role = typeof user === "object" && user ? user.role : "admin";

  const allMenuSections = [
    {
      title: "Overview",
      color: "#2563EB",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Content",
      color: "#DC2626",
      items: [
        { label: "Notices", path: "/notices", icon: Bell },
        { label: "Blogs", path: "/blogs", icon: FileText },
        { label: "Chairman Messages", path: "/chairman-messages", icon: UserRoundCog },
        { label: "Vision & Mission", path: "/vision-mission", icon: HeartHandshake },
        { label: "Core Values", path: "/core-values-framework", icon: ShieldCheck },
        { label: "Activities", path: "/activities", icon: Activity },
        { label: "Testimonials", path: "/testimonials", icon: MessageSquareQuote },
        { label: "FAQs", path: "/faqs", icon: HelpCircle },
        { label: "Categories", path: "/categories", icon: Tag },
      ],
    },
    {
      title: "School",
      color: "#16A34A",
      items: [
        { label: "Academics", path: "/academics-management", icon: GraduationCap },
        { label: "Infrastructure", path: "/infrastructure-management", icon: Building2 },
        { label: "Staff", path: "/teachers", icon: Users },
        { label: "Partners", path: "/partners-management", icon: Handshake },
        { label: "MUN", path: "/akshara-mun-management", icon: Globe },
        { label: "Projects", path: "/longterm-projects", icon: FolderGit2 },
      ],
    },
    {
      title: "Media",
      color: "#7C3AED",
      items: [
        { label: "Hero", path: "/hero-sliders", icon: Image },
        { label: "Gallery", path: "/galleries", icon: Layers },
        { label: "3D Gallery", path: "/3d-gallery", icon: RotateCw },
        { label: "Uploads PDF", path: "/downloads", icon: FileUp },
      ],
    },
    {
      title: "Admissions",
      color: "#EA580C",
      items: [
        { label: "Applications", path: "/online-applications", icon: FileCheck },
        { label: "Inquiries", path: "/enquiries", icon: ClipboardList },
        { label: "Events", path: "/events-calendar", icon: Calendar },
        { label: "Messages", path: "/contact-messages", icon: Mail },
        { label: "Subscribers", path: "/subscribers", icon: Send },
      ],
    },
  ];
  const menuSections = role === "frontdesk"
    ? allMenuSections.filter((section) => section.title === "Admissions")
    : allMenuSections;

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common.Authorization;
    window.location.reload();
  };

  return (
    <aside className="sidebar">
      <div className="brand-logo">
        <img src="/akasharalogo.png" alt="Aksharaa Logo" className="img-fluid" />
      </div>

      <ul className="sidebar-nav">
        {menuSections.map((section) => (
          <li key={section.title}>
            <div className="nav-heading" style={{ color: section.color }}>
              {section.title}
            </div>
            <ul className="sidebar-nav">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/dashboard" && location.pathname === "/");

                return (
                  <li key={item.path} className="nav-item">
                    <Link to={item.path} className={`nav-link ${isActive ? "active" : ""}`}>
                      <IconComponent />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>
        ))}

        <li className="nav-heading" style={{ color: "#0891B2" }}>Account</li>
        <li className="nav-item">
          <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
            <User />
            <span>Profile Settings</span>
          </Link>
        </li>
        <li className="nav-item mt-3">
          <button
            onClick={handleLogout}
            className="nav-link w-100 text-start border-0 text-danger"
            style={{ background: "rgba(239, 68, 68, 0.1)" }}
          >
            <LogOut />
            <span>Log Out</span>
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
