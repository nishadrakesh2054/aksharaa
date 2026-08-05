import React from "react";
const TopBar = () => {
  return (
    <>
      {/* Desktop TopBar */}
      <div className="topbar-wrapper  border-bottom d-none d-lg-block py-1">
        <div className="container mx-auto">
          <div className="row align-items-center">
            {/* Main Logo Column */}
            <div className="col-lg-3">
              <a href="/" className="d-inline-block text-decoration-none">
                <img
                  src="/logo1.png"
                  alt="Aksharaa School"
                  className="topbar-logo"
                  width="250"
                  height="80"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </a>
            </div>

            {/* Contact Details & Social Media Links */}
            <div className="col-lg-9">
              <div className="row align-items-center justify-content-between g-2">
                {/* Location */}
                <div className="col-lg-4">
                  <div className="topbar-info-item d-flex align-items-center gap-2">
                    <span className="topbar-icon-box">
                      <i className="fas fa-map-marker-alt top-icon"></i>
                    </span>
                    <div>
                      <h6 className="top-head mb-0">Our School</h6>
                      <small className="top-p">
                        Kageshwori Manohara 9, Kathmandu
                      </small>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="col-lg-3">
                  <a
                    href="mailto:info@aksharaaschool.edu.np"
                    className="text-decoration-none"
                  >
                    <div className="topbar-info-item d-flex align-items-center gap-2">
                      <span className="topbar-icon-box">
                        <i className="fas fa-envelope top-icon"></i>
                      </span>
                      <div>
                        <h6 className="top-head mb-0">Email Us</h6>
                        <small className="top-p">
                          info@aksharaaschool.edu.np
                        </small>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Phone */}
                <div className="col-lg-3">
                  <a href="tel:+977014993031" className="text-decoration-none">
                    <div className="topbar-info-item d-flex align-items-center gap-2">
                      <span className="topbar-icon-box">
                        <i className="fas fa-phone-alt top-icon"></i>
                      </span>
                      <div>
                        <h6 className="top-head mb-0">Call Us</h6>
                        <small className="top-p">+977-01-4993031/32/33</small>
                      </div>
                    </div>
                  </a>
                </div>

                {/* Social Media Links */}
                <div className="col-lg-2 d-flex justify-content-end">
                  <div className="topbar-social-group d-flex align-items-center gap-2">
                    <a
                      href="https://www.facebook.com/AksharaaSchool/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="topbar-social-link fb-link"
                      title="Facebook"
                    >
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                    <a
                      href="https://www.instagram.com/aksharaa_school_/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="topbar-social-link insta-link"
                      title="Instagram"
                    >
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                    <a
                      href="https://www.youtube.com/@aksharaaschool6713"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="topbar-social-link yt-link"
                      title="YouTube"
                    >
                      <i className="fa-brands fa-youtube"></i>
                    </a>
                    <a
                      href="https://www.linkedin.com/company/aksharaa-school/?originalSubdomain=np"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="topbar-social-link li-link"
                      title="LinkedIn"
                    >
                      <i className="fa-brands fa-linkedin-in"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View Continuous Slow Marquee Ticker */}
      <div className="mobile-topbar-marquee d-block d-lg-none py-1 overflow-hidden">
        <div className="mobile-marquee-track">
          <div className="mobile-marquee-content d-flex align-items-center">
            <span className="marquee-item">
              <i className="fas fa-map-marker-alt me-1 text-pinkish"></i>
              Kageshwori Manohara 9, Kathmandu, Nepal
            </span>
            <span className="marquee-divider">•</span>
            <span className="marquee-item">
              <i className="fas fa-envelope me-1 text-pinkish"></i>
              <a
                href="mailto:info@aksharaaschool.edu.np"
                className="text-white text-decoration-none"
              >
                info@aksharaaschool.edu.np
              </a>
            </span>
            <span className="marquee-divider">•</span>
            <span className="marquee-item">
              <i className="fas fa-phone-alt me-1 text-pinkish"></i>
              <a
                href="tel:+977014993031"
                className="text-white text-decoration-none"
              >
                +977-01-4993031/32/33
              </a>
            </span>
            <span className="marquee-divider">•</span>
          </div>

          {/* Duplicate track for seamless infinite marquee loop */}
          <div
            className="mobile-marquee-content d-flex align-items-center"
            aria-hidden="true"
          >
            <span className="marquee-item">
              <i className="fas fa-map-marker-alt me-1 text-pinkish"></i>
              Kageshwori Manohara 9, Kathmandu, Nepal
            </span>
            <span className="marquee-divider">•</span>
            <span className="marquee-item">
              <i className="fas fa-envelope me-1 text-pinkish"></i>
              <a
                href="mailto:info@aksharaaschool.edu.np"
                className="text-white text-decoration-none"
              >
                info@aksharaaschool.edu.np
              </a>
            </span>
            <span className="marquee-divider">•</span>
            <span className="marquee-item">
              <i className="fas fa-phone-alt me-1 text-pinkish"></i>
              <a
                href="tel:+977014993031"
                className="text-white text-decoration-none"
              >
                +977-01-4993031/32/33
              </a>
            </span>
            <span className="marquee-divider">•</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopBar;
