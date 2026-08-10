import React from "react";
import SectionHeader from "./SectionHeader";
import { useVisionMission } from "../api/hooks/usePublicContent";
import "../css/mission.css";

// const missionData = [
//   {
//     iconClass: "fas fa-bullseye",
//     title: "OUR MISSION",
//     description:
//       "Aksharaa School inculcates value-based education with academic excellence through collaboration with parents and stakeholders to instill resilience, leadership skills, and emotional intelligence in each learner.",
//     badgeClass: "badge-emerald",
//     cardClass: "card-emerald",
//   },
//   {
//     iconClass: "fas fa-eye",
//     title: "OUR VISION",
//     description:
//       "Nurturing young learners to become lifelong learners, globally competent, and responsible citizens empowered to excel in a rapidly evolving world.",
//     badgeClass: "badge-blue",
//     cardClass: "card-blue",
//   },
//   {
//     iconClass: "fas fa-heart",
//     title: "OUR CORE VALUES",
//     description:
//       "We are committed to fostering excellence, integrity, and inclusivity. We encourage positivity, empathy, effective communication, innovation, and critical thinking to build well-rounded individuals.",
//     badgeClass: "badge-pink",
//     cardClass: "card-pink",
//   },
// ];

const Mission = () => {
  const { data } = useVisionMission();
  const items = Array.isArray(data) && data.length > 0 ? data : missionData;

  return (
    <section className="mission-section py-5">
      <div className="container py-2">
        <SectionHeader
          badge="FOUNDATIONAL PILLARS"
          title="Our Core"
          highlight="Mission & Values"
        />

        <div className="row g-4 justify-content-center align-items-stretch mt-2">
          {items.map((item, index) => (
            <div key={item._id || index} className="col-lg-4 col-md-6 col-sm-12 d-flex">
              <div className={`mission-card ${item.cardClass} d-flex flex-column justify-content-start p-4 w-100 h-100 rounded-4`}>
                <div className="mission-icon-wrapper mb-3">
                  <div className={`mission-icon-badge ${item.badgeClass}`}>
                    <i className={item.iconClass}></i>
                  </div>
                </div>
                <h4 className="mission-head fw-bold mb-3">{item.title}</h4>
                <p className="mission-p text-secondary mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Mission;
