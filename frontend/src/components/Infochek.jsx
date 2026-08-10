import React from "react";
import SectionHeader from "./SectionHeader";
import "../css/infocheck.css";
import ifograpgh from "/round.jpeg";
import { useCoreValuesFramework } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";

const fallbackContent = {
  badge: "CORE VALUES & PHILOSOPHY",
  title: "Our Core",
  highlight: "Values Framework",
  description:
    "Aksharaa School provides a balanced education that emphasizes both strong values and academic achievement. Through collaboration with parents and stakeholders, we focus on building resilience, leadership skills, and emotional intelligence in every student, ensuring their holistic growth and development. We cultivate critical thinking and a positive attitude, guiding students to embrace new perspectives and take responsible action.",
  image: ifograpgh,
  imageAlt: "Aksharaa Core Values Infographic",
};

const Infochek = () => {
  const { data } = useCoreValuesFramework();
  const content = data && data.isActive !== false ? data : fallbackContent;
  const imageSrc = getFileUrl(content.image, ifograpgh);

  return (
    <section className="infocheck-section section-bg-white py-3 py-md-5 my-0">
      <div className="container mx-auto">
        <SectionHeader
          badge={content.badge}
          title={content.title}
          highlight={content.highlight}
        />

        {/* Left Aligned Text Description */}
        <div className="infocheck-text-wrapper text-start w-100 my-3 my-md-4">
          <p className="infocheck-description">
            {content.description}
          </p>
        </div>

        {/* Infographic Image Wrapper */}
        <div className="figure-wrapper d-flex justify-content-center align-items-center mt-3 mt-md-4 p-2 p-md-3 bg-white rounded-4 shadow-sm mx-auto">
          <img
            src={imageSrc}
            alt={content.imageAlt || fallbackContent.imageAlt}
            loading="lazy"
            className="img-fluid rounded-3 infocheck-img"
          />
        </div>
      </div>
    </section>
  );
};

export default Infochek;
