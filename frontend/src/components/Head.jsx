import React, { useEffect, useState } from "react";
import "../css/Head.css";
import { Link, useLocation } from "react-router-dom";
import WhiteLogo from "../assets/Aksharaa School Logo_white.png";
import { navItems } from "../config/siteRoutes";

const Head = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [isNavOpen, setIsNavOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState(null);

  const handleNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  const closeNav = () => {
    setIsNavOpen(false);
    setOpenMobileSubmenu(null);
  };

  const toggleMobileSubmenu = (menuName, e) => {
    if (window.innerWidth <= 991) {
      e.preventDefault();
      setOpenMobileSubmenu(openMobileSubmenu === menuName ? null : menuName);
    }
  };

  const isActivePath = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header>
        <div className="container mx-auto">
          <div className="row d-flex align-items-center">
            <nav className="navbar navbar-expand-lg navbar-dark p-0 w-100">
              <Link
                className="navbar-brand d-block d-lg-none"
                to="/"
                onClick={closeNav}
              >
                <img
                  src={WhiteLogo}
                  alt="Akshara Logo"
                  className="img-fluid navbar-logo ms-1"
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                aria-controls="navbarNav"
                aria-expanded={isNavOpen}
                aria-label="Toggle navigation"
                onClick={handleNavToggle}
              >
                <span className="navbar-toggler-icons">
                  <i className={`fa-solid ${isNavOpen ? "fa-xmark" : "fa-bars"}`}></i>
                </span>
              </button>

              <div
                className={`collapse navbar-collapse ${
                  isNavOpen ? "show" : ""
                }`}
                id="navbarNav"
              >
                <ul className="navbar-nav ms-auto d-flex justify-content-lg-end align-items-lg-center m-0 p-0 gap-lg-3 gap-xl-4">
                  {navItems.map((item) => {
                    if (item.type === "link") {
                      return (
                        <li
                          className={`nav-item py-2 ${isActivePath(item.path) ? "active" : ""}`}
                          key={item.key}
                        >
                          <Link className="nav-link" to={item.path} onClick={closeNav}>
                            {item.label}
                          </Link>
                        </li>
                      );
                    }

                    const isDropdownActive = item.items.some((child) =>
                      isActivePath(child.path),
                    );

                    return (
                      <li
                        className={`nav-item dropdown py-2 ${
                          openMobileSubmenu === item.key ? "mobile-submenu-open" : ""
                        } ${isDropdownActive ? "active" : ""}`}
                        key={item.key}
                      >
                        <a
                          className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                          href="#"
                          id={`${item.key}Dropdown`}
                          role="button"
                          aria-expanded={openMobileSubmenu === item.key}
                          onClick={(e) => toggleMobileSubmenu(item.key, e)}
                        >
                          <span className="d-flex align-items-center">
                            {item.icon ? <i className={`${item.icon} me-1`}></i> : null}
                            <span className={item.icon ? "ms-1" : ""}>{item.label}</span>
                          </span>
                          <i className="fa-solid fa-chevron-down ms-1 dropdown-chevron"></i>
                        </a>
                        <ul
                          className={`dropdown-menu ${
                            openMobileSubmenu === item.key ? "show-mobile" : ""
                          }`}
                          aria-labelledby={`${item.key}Dropdown`}
                        >
                          {item.items.map((child) => (
                            <li key={child.path}>
                              <Link
                                className="dropdown-item"
                                to={child.path}
                                onClick={closeNav}
                              >
                                <i className={`${child.icon} me-2 dropdown-item-icon`}></i>
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}

                  <li className="nav-item lastlink py-2">
                    <Link to="/getinquiry" onClick={closeNav}>
                      <button
                        className="head-btn rounded-pill animated-button blinking-button"
                        role="button"
                      >
                        Get Enquiry
                      </button>
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Head;
