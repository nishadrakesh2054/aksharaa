import React, { useEffect } from "react";
import "../css/Team.css";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import sabinamam from "/sabinamam2.jpg";
import { useTeamBanners } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";
import LoadingState from "../components/states/LoadingState";
import ErrorState from "../components/states/ErrorState";

const TeamMember = ({ imgSrc, name, position, socialLinks }) => (
  <div className="col-md-3 col-sm-6  ">
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
              <a href={link.href}>
                <i className={`fab fa-${link.icon}`} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const TeamSection = ({ title, imgSrc, members }) => (
  <div className=" mb-2">
    
    {imgSrc && (
      <div className="row align-items-center">
        <div className="col-md-12 ">
          <img
            src={imgSrc || "/fallbackimage.avif"}
            alt={title}
            className="img-fluid"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = "/fallbackimage.avif";
            }}
          />
        </div>
      </div>
    )}
    <h3 className="team-head text-center  border-bottom-title w-100"  style={{ marginTop: "1rem" }}>
      {title}
    </h3>


    {members && (
      <div className="row">
        {members.map((member, index) => (
          <TeamMember key={index} {...member} />
        ))}
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
  const { data: teamBanners = [], isLoading, error } = useTeamBanners();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  const bannerSections = teamBanners.map((banner) => ({
    title: banner.title,
    imgSrc: getFileUrl(banner.image),
  }));
  const teamSections = [...bannerSections, ...staffSections];

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

      <div className="container ">
        {isLoading && <LoadingState label="Loading team sections..." />}
        {error && <ErrorState message={error.message} />}
        {teamSections.map((section, index) => (
          <TeamSection key={index} {...section} />
        ))}
        {!isLoading && !error && teamSections.length === 0 && (
          <p className="text-center py-5">No team data found.</p>
        )}
      </div>
    </>
  );
};

export default Team;
