import React, { useEffect } from "react";
import "../css/Team.css";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import sabinamam from "/sabinamam2.jpg";
import { useTeamBanners, useStaffProfiles } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";

const TeamMember = ({ imgSrc, name, position, socialLinks }) => (
  <div className="col-md-3 col-sm-6">
    <div className="our-team">
      <div className="img-container">
        <img
          src={imgSrc || "/fallbackimage.avif"}
          alt={name}
          className="img-fluid team-image"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/fallbackimage.avif";
          }}
        />
      </div>
      <div className="team-content">
        <h3 className="title">{name}</h3>
        <span className="post">{position}</span>
        <ul className="social-links">
          {(socialLinks || []).map((link, index) => (
            <li key={index}>
              <a href={link.href || "#"}>
                <i className={`fab fa-${link.icon}`} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const GroupBannerShowcase = ({ title, imgSrc }) => (
  <div className="col-12 group-banner-wrapper">
    <div className="group-banner-frame">
      <img
        src={imgSrc || "/fallbackimage.avif"}
        alt={title}
        className="group-banner-full-img"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.src = "/fallbackimage.avif";
        }}
      />
    </div>
    {title && (
      <div className="group-banner-header">
        <h3 className="group-banner-title-text">{title}</h3>
        <div className="group-banner-subtitle-bar"></div>
      </div>
    )}
  </div>
);

const staffSections = [
  {
    title: "Administration & Operations",
    members: [
      {
        imgSrc: "/team_1.jpg",
        name: "Rashmila Thapa",
        position: "Accountant",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
      {
        imgSrc: "/team_2.jpg",
        name: "Kaushila Pokharel",
        position: "Financial Manager",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
      {
        imgSrc: "/team_3.jpg",
        name: "Ram Kumar Adhikari",
        position: "IT Incharge",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
      {
        imgSrc: "/team_1.jpg",
        name: "Bimal Bhattarai",
        position: "Admin cum Transportation Incharge",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
      {
        imgSrc: "/team_2.jpg",
        name: "Sabin Nepal",
        position: "Operation Incharge",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
      {
        imgSrc: sabinamam,
        name: "Sabina Karanjeet",
        position: "Front Desk Officer",
        socialLinks: [
          { href: "#", icon: "facebook" },
          { href: "#", icon: "instagram" },
          { href: "#", icon: "viber" },
          { href: "#", icon: "linkedin" },
          { href: "#", icon: "whatsapp" },
        ],
      },
    ],
  },
];

const Team = () => {
  const location = useLocation();
  const { data: teamBanners = [], isLoading: bannersLoading, error: bannersError } = useTeamBanners();
  const { data: staffProfiles = [], isLoading: profilesLoading, error: profilesError } = useStaffProfiles();

  const isLoading = bannersLoading || profilesLoading;
  const error = bannersError || profilesError;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Map dynamic group section banners
  const bannerSections = (teamBanners || []).map((banner) => ({
    title: banner.title,
    imgSrc: getFileUrl(banner.image),
  }));

  // Group dynamic staff profiles by category
  const groupedProfiles = (staffProfiles || []).reduce((acc, profile) => {
    const cat = profile.category?.trim() || "Administration & Operations";
    if (!acc[cat]) acc[cat] = [];

    const socialLinks = [];
    if (profile.facebook) socialLinks.push({ href: profile.facebook, icon: "facebook" });
    if (profile.instagram) socialLinks.push({ href: profile.instagram, icon: "instagram" });
    if (profile.viber) socialLinks.push({ href: profile.viber, icon: "viber" });
    if (profile.linkedin) socialLinks.push({ href: profile.linkedin, icon: "linkedin" });
    if (profile.whatsapp) socialLinks.push({ href: profile.whatsapp, icon: "whatsapp" });

    acc[cat].push({
      imgSrc: getFileUrl(profile.image),
      name: profile.title,
      position: profile.position,
      socialLinks: socialLinks.length > 0 ? socialLinks : [
        { href: "#", icon: "facebook" },
        { href: "#", icon: "instagram" },
        { href: "#", icon: "viber" },
        { href: "#", icon: "linkedin" },
        { href: "#", icon: "whatsapp" },
      ],
    });
    return acc;
  }, {});

  const dynamicStaffSections = Object.keys(groupedProfiles).map((catTitle) => ({
    title: catTitle,
    members: groupedProfiles[catTitle],
  }));

  const staffToDisplay = dynamicStaffSections.length > 0 ? dynamicStaffSections : staffSections;

  return (
    <>
      <Helmet>
        <title>Team | Aksharaa</title>
        <meta
          name="description"
          content="Learn more about our team at Aksharaa School."
        />
        <meta
          name="keywords"
          content="team, staff, Aksharaa School, educators, administration"
        />
      </Helmet>

      <div className="container">
        {isLoading && <LoadingState label="Loading team sections..." />}
        {error && <ErrorState message={error.message} />}

        {/* Group Section Photo Banners (Full Image Display) */}
        {bannerSections.map((banner, idx) => (
          <GroupBannerShowcase key={idx} title={banner.title} imgSrc={banner.imgSrc} />
        ))}

        {/* Staff & Member Sections */}
        {staffToDisplay.map((section, sIdx) => (
          <div key={sIdx} className="mb-4">
            <h3 className="team-head text-center border-bottom-title w-100" style={{ marginTop: "1rem" }}>
              {section.title}
            </h3>
            <div className="row">
              {section.members.map((member, mIdx) => (
                <TeamMember key={mIdx} {...member} />
              ))}
            </div>
          </div>
        ))}

        {!isLoading && !error && bannerSections.length === 0 && staffToDisplay.length === 0 && (
          <p className="text-center py-5">No team data found.</p>
        )}
      </div>
    </>
  );
};

export default Team;
