import React, { useRef, useState } from "react";
import "../css/Learning.css";
import { useNavigate } from "react-router-dom";

import seniorImg from "../../src/assets/children/High School final.png";
import middleImg from "../../src/assets/children/Middle school_png.png";
import kindergartenImg from "../../src/assets/children/Kindergarten _final.png";
import elementaryImg from "../../src/assets/children/Elementary School_final.png";

import SectionHeader from "./SectionHeader";

const Learning = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(null);
  const hoverRef = useRef(null);
  const [hover, setHover] = useState(false);
  const handleImageClick = (section) => {
    setActiveSection(section);
  };
  const handleClose = () => {
    setActiveSection(null);
  };
  const handleEffect = (e) => {
    if (hoverRef.current && hover) {
      requestAnimationFrame(() => {
        hoverRef.current.style.top = `${e.pageY}px`;
        hoverRef.current.style.left = `${e.pageX}px`;
      });
    }
  };

  return (
    <>
      <div
        className="learning py-5 my-3"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={handleEffect}
      >
        <div className="container">
          <div className="row d-flex align-items-center justify-content-between fuche-sec">
            <div className={`col-md-4 pe-4 ${activeSection ? "d-none" : ""}`}>
              <span className="badge bg-success bg-opacity-25 text-success fw-bold px-3 py-2 rounded-pill mb-2">
                GUIDING PRINCIPLE
              </span>
              <h2 className="fw-semibold sanskar text-white mb-3">संस्कारयुक्त शिक्षा</h2>
              <p className=" text-light  "
                style={{  textAlign: "left",  }}
                >
              Our guiding concept at Aksharaa School is "संस्कारयुक्त शिक्षा" which translates education infused with values. Our commitment lies in shaping individuals of exemplary character. Placing greater emphasis on instilling and nurturing the value of integrity rather than solely focusing on textbook knowledge or examination preparation, empowering students to navigate the world beyond the classroom with confidence and moral clarity. Our Learning-Reinforcement-Practice-Application (LRPA) module enhances cognitive abilities with fun and curiosity, encouraging critical thinking, collaboration, creativity, and problem-solving. We believe the entire development of a child's character and values to be an integral part of meaningful education, which goes beyond academic achievement. In addition to fostering academic development, our curriculum aims to cultivate values like respect, compassion, responsibility and many more. This positions Aksharaa as a top educational institution in Kathmandu, preparing students to become well rounded individuals who are both intellectually enriched and conscious of their moral and social responsibilities. 
              </p>

              <button
                className="button-21"
                role="button"
                onClick={() => navigate("/about/lrpa")}
              >
                Read More<i className="fa-solid fa-arrow-right ms-2"></i>
              </button>
            </div>

            {activeSection === "senior" && (
              <div className="col-md-4">
                <button onClick={handleClose} className="close-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 className="border-bottom-title w-100 text-center ">
                  Senior School (Class 8-10)
                </h3>
                <p className="lrpa-text px-2">
                Our Senior School program combines rigorous academics with value-based education, ensuring students are well-prepared for higher education and real-life challenges. Counseling and support services are available to guide students through their academic and personal decisions. Our graduates leave with a strong academic foundation, leadership qualities, critical thinking skills, problem-solving skills and a deep sense of social responsibility..
                </p>
                <button
                  className="button-21"
                  role="button"
                  onClick={() => navigate("/academics/high")}
                >
                  Enroll now
                </button>
              </div>
            )}

            {activeSection === "middle" && (
              <div className="col-md-4">
                <button onClick={handleClose} className="close-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 className="border-bottom-title w-100 text-center">
                  Middle School (Class 6-7)
                </h3>
                <p className="lrpa-text px-2">
                Middle School education at Aksharaa encourages independent ethical learning and reasoning, equipping students with the skills and values necessary for future success. Students learn to manage their time effectively taking responsibility for their own learning. Our advisory programs provide exposure, additional support and mentorship, helping students navigate this critical stage.
                </p>
                <button
                  className="button-21"
                  role="button"
                  onClick={() => navigate("/academics/middle")}
                >
                  Enroll now
                </button>
              </div>
            )}

            {activeSection === "elementary" && (
              <div className="col-md-4">
                <button onClick={handleClose} className="close-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 className="border-bottom-title w-100 text-center">
                  Elementary School (Class1-5)
                </h3>
                <p className="lrpa-text px-2">
                Aksharaa’s Elementary School nurtures intellectual growth and character development, ensuring students excel academically while embodying ethical principles. Through collaborative, long-term, individual assignments and projects students learn the value of hard work and integrity. Our goal is to develop confident, well-rounded individuals who are prepared for middle school and beyond.
                </p>
                <button
                  className="button-21"
                  role="button"
                  onClick={() => navigate("/academics/elementary")}
                >
                  Enroll now
                </button>
              </div>
            )}

            {activeSection === "kindergarten" && (
              <div className="col-md-4">
                <button onClick={handleClose} className="close-btn">
                  <i className="fa-solid fa-xmark"></i>
                </button>
                <h3 className="border-bottom-title w-100 text-center">
                  Kindergarten (PG-KG)
                </h3>
                <p className="lrpa-text px-2">
                In our Kindergarten classes, children learn through playful experiences while instilling values like kindness, honesty, and respect, creating a strong educational foundation. Activities are carefully crafted to be fun and educational, promoting holistic growth. We believe in teaching children the importance of empathy and cooperation from an early age.
             
</p>
                <button
                  className="button-21"
                  role="button"
                  onClick={() => navigate("/academics/kindergarten")}
                >
                  Enroll now
                </button>
              </div>
            )}

            {/* Photos section */}
            <div className="col-md-2 rotatediv">
              <div
                className="row d-flex justify-content-between align-items-center position-relative learnimg"
                onClick={() => handleImageClick("senior")}
              >
                <div className="inner-content">
                  <img src={seniorImg} alt="" className="img-custom" loading="lazy"/>
                  <p className="seniors border px-3 rounded-2 py-1 border me-4">
                    Senior School
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-2 rotatediv">
              <div
                className="row d-flex justify-content-between align-items-center position-relative learnimg"
                onClick={() => handleImageClick("middle")}
              >
                <div className="inner-content">
                  <img
                    src={middleImg}
                    alt=""
                    className="img-custom kinder_img2"
                    loading="lazy"
                  />
                  <p className="seniors px-3 rounded-2 py-1 border me-4">
                    Middle School
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-2 rotatediv">
              <div
                className="row d-flex justify-content-start align-items-center position-relative learnimg"
                onClick={() => handleImageClick("elementary")}
              >
                <div className="inner-content">
                  <img
                    src={elementaryImg}
                    alt=""
                    loading="lazy"
                    className="img-custom kinder_img1"
                  />
                  <p className="seniors   rounded-2 py-1 border me-5 px-1 text-nowrap">
                    Elementary School
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-2 rotatediv">
              <div
                className="row d-flex justify-content-between align-items-center position-relative learnimg"
                onClick={() => handleImageClick("kindergarten")}
              >
                <div className="inner-content">
                  <img
                    src={kindergartenImg}
                    alt=""
                    loading="lazy"
                    className="img-custom kinder_img"
                  />
                  <p className="seniors px-3 rounded-2 py-1 border me-5">
                    Kindergarten
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className={`position-absolute hoverView ${
            hover ? "hovering" : "unhover"
          }  `}
          ref={hoverRef}
        >
          View
        </div>
      </div>
    </>
  );
};

export default Learning;
