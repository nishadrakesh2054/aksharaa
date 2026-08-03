import React, { useEffect, useState } from "react";
import "../css/Head.css";
import { Link, useLocation } from "react-router-dom";
import WhiteLogo from '../assets/Aksharaa School Logo_white.png';

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
                  {/* Home */}
                  <li className="nav-item firstlink active py-2">
                    <Link className="nav-link" to="/" onClick={closeNav}>
                      Home
                    </Link>
                  </li>

                  {/* About Us */}
                  <li className={`nav-item dropdown py-2 ${openMobileSubmenu === 'about' ? 'mobile-submenu-open' : ''}`}>
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                      href="#"
                      id="aboutDropdown"
                      role="button"
                      aria-expanded={openMobileSubmenu === 'about'}
                      onClick={(e) => toggleMobileSubmenu('about', e)}
                    >
                      <span>About Us</span>
                      <i className="fa-solid fa-chevron-down ms-1 dropdown-chevron"></i>
                    </a>
                    <ul
                      className={`dropdown-menu ${openMobileSubmenu === 'about' ? 'show-mobile' : ''}`}
                      aria-labelledby="aboutDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/about"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-circle-info me-2 dropdown-item-icon"></i>
                          Introduction
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/infrastructure"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-building-columns me-2 dropdown-item-icon"></i>
                          Aksharaa Infrastructure
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/about/lrpa"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-lightbulb me-2 dropdown-item-icon"></i>
                          LRPA Approach
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/about/chairman"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-user-tie me-2 dropdown-item-icon"></i>
                          Message From Executive
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/about/team"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-users me-2 dropdown-item-icon"></i>
                          Team
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Academic */}
                  <li className={`nav-item dropdown py-2 ${openMobileSubmenu === 'academic' ? 'mobile-submenu-open' : ''}`}>
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                      href="#"
                      id="academicDropdown"
                      role="button"
                      aria-expanded={openMobileSubmenu === 'academic'}
                      onClick={(e) => toggleMobileSubmenu('academic', e)}
                    >
                      <span>Academic</span>
                      <i className="fa-solid fa-chevron-down ms-1 dropdown-chevron"></i>
                    </a>
                    <ul
                      className={`dropdown-menu ${openMobileSubmenu === 'academic' ? 'show-mobile' : ''}`}
                      aria-labelledby="academicDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/academics/kindergarten"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-child me-2 dropdown-item-icon"></i>
                          Kindergarten
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/academics/elementary"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-school me-2 dropdown-item-icon"></i>
                          Elementary School
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/academics/middle"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-graduation-cap me-2 dropdown-item-icon"></i>
                          Middle School
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/academics/high"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-user-graduate me-2 dropdown-item-icon"></i>
                          Senior School
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admission/policy"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-file-shield me-2 dropdown-item-icon"></i>
                          Admission Policy
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/admission/procedure"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-clipboard-list me-2 dropdown-item-icon"></i>
                          Admission Procedure
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* News & Activities */}
                  <li className="nav-item py-2">
                    <Link
                      className="nav-link"
                      to="/newsactivity"
                      onClick={closeNav}
                    >
                      News & Activities
                    </Link>
                  </li>

                  {/* Aksharaa MUN */}
                  <li className="nav-item py-2">
                    <Link className="nav-link" to="/akshara-mun" onClick={closeNav}>
                      Aksharaa MUN
                    </Link>
                  </li>

                  {/* Contact */}
                  <li className="nav-item py-2">
                    <Link className="nav-link" to="/contact" onClick={closeNav}>
                      Contact
                    </Link>
                  </li>

                  {/* More Dropdown */}
                  <li className={`nav-item dropdown py-2 ${openMobileSubmenu === 'more' ? 'mobile-submenu-open' : ''}`}>
                    <a
                      className="nav-link dropdown-toggle d-flex align-items-center justify-content-between"
                      href="#"
                      id="moreDropdown"
                      role="button"
                      aria-expanded={openMobileSubmenu === 'more'}
                      onClick={(e) => toggleMobileSubmenu('more', e)}
                    >
                      <span className="d-flex align-items-center">
                        <i className="fa-solid fa-bars me-1"></i>
                        <span className="ms-1">More Links</span>
                      </span>
                      <i className="fa-solid fa-chevron-down ms-1 dropdown-chevron"></i>
                    </a>
                    <ul
                      className={`dropdown-menu ${openMobileSubmenu === 'more' ? 'show-mobile' : ''}`}
                      aria-labelledby="moreDropdown"
                    >
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/gallery"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-photo-film me-2 dropdown-item-icon"></i>
                          Gallery
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/downloads"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-file-arrow-down me-2 dropdown-item-icon"></i>
                          Download
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item"
                          to="/apply-online"
                          onClick={closeNav}
                        >
                          <i className="fa-solid fa-pen-to-square me-2 dropdown-item-icon"></i>
                          Apply Online
                        </Link>
                      </li>
                    </ul>
                  </li>

                  {/* Get Enquiry Button */}
                  <li className="nav-item lastlink py-2">
                    <Link to={'/getinquiry'} onClick={closeNav}>
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
