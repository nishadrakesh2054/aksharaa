import React from "react";
import "../css/Mobilecheck.css";
import { Link } from "react-router-dom";
import seniorImg from "../../src/assets/children/High School final.png";
import middleImg from "../../src/assets/children/Middle school_png.png";
import kindergartenImg from "../../src/assets/children/Kindergarten _final.png";
import elementaryImg from "../../src/assets/children/Elementary School_final.png";
import SectionHeader from "./SectionHeader";

// Reusable Section Component
const Section = ({
  title,
  description,
  image,
  imageAlt,
  buttonText,
  buttonLink,
  reverse,
}) => {
  return (
    <div
      className={`row align-items-center my-4 ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <div className="col-lg-3 col-md-6 col-12 text-start mb-3 mb-lg-0">
        <h2 className="mb-head">{title}</h2>
        <p className="mb-p">{description}</p>
        <Link to={buttonLink} className="mb-link text-decoration-none">
          {buttonText} <i className="fas fa-arrow-right ms-1"></i>
        </Link>
      </div>
      <div className="col-lg-9 col-md-6 col-12 bgimg">
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="img-fluid rounded custom-img"
        />
      </div>
    </div>
  );
};

const Mobilecheck = () => {
  return (
    <div className="demo py-5">
      <div className="container py-4">
        {/* Heading Section */}
        <SectionHeader
          badge="OUR PHILOSOPHY & APPROACH"
          title="Aksharaa's Guiding"
          highlight="Principle"
        />

        {/* Sections */}
        <Section
          title={
            <>
              <i className="fa-solid fa-user-graduate me-2 title-icon"></i>
              Senior School (Grade 8-10)
            </>
          }
          description="Our Senior School program combines rigorous academics with value-based education, ensuring students are well-prepared for higher education and real-life challenges. Counseling and support services are available to guide students through their academic and personal decisions. Our graduates leave with a strong academic foundation, leadership qualities, critical thinking skills, problem-solving skills and a deep sense of social responsibility.."
          image={seniorImg}
          imageAlt="Senior School"
          buttonText="Enroll now"
          buttonLink="/academics/high"
        />

        <Section
          title={
            <>
              <i className="fa-solid fa-graduation-cap me-2 title-icon"></i>
              Middle School (Grade 6-7)
            </>
          }
          description="Middle School education at Aksharaa encourages independent ethical learning and reasoning, equipping students with the skills and values necessary for future success. Students learn to manage their time effectively taking responsibility for their own learning. Our advisory programs provide exposure, additional support and mentorship, helping students navigate this critical stage."
          image={middleImg}
          imageAlt="Girl"
          buttonText="Enroll now"
          buttonLink="/academics/middle"
          reverse
        />

        <Section
          title={
            <>
              <i className="fa-solid fa-school me-2 title-icon"></i>
              Elementary School (Grade 1-5)
            </>
          }
          description="Aksharaa’s Elementary School nurtures intellectual growth and character development, ensuring students excel academically while embodying ethical principles. We aim to develop confident, well-rounded individuals prepared for middle school and beyond."
          image={kindergartenImg}
          imageAlt="Girl 2"
          buttonText="Enroll now"
          buttonLink="/academics/elementary"
        />

        <Section
          title={
            <>
              <i className="fa-solid fa-child me-2 title-icon"></i>
              Kindergarten Daycare - ECD II (PG-UKG)
            </>
          }
          description="In our Kindergarten classes, children learn through playful experiences while instilling values like kindness, honesty, and respect, creating a strong educational foundation. Activities are carefully crafted to be fun and educational, promoting holistic growth. We believe in teaching children the importance of empathy and cooperation from an early age."
          image={elementaryImg}
          imageAlt="Kindergarten"
          buttonText="Enroll now"
          buttonLink="/academics/kindergarten"
          reverse
        />
      </div>
    </div>
  );
};

export default Mobilecheck;
