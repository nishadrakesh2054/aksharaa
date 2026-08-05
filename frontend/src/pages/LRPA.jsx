import React from "react";
import "../css/Learning.css";
import "../css/academicPage.css";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import SectionHeader from "../components/SectionHeader";

import Assignment from "../../src/assets/LRPA/Assignment/GP4A7794.jpg";
import Observation from "../../src/assets/LRPA/Active Observation/GP4A7847.jpg";
import Continous from "../../src/assets/LRPA/Continous Assestment/GP4A7977.jpg";
import Time from "../../src/assets/LRPA/Time Bound/GP4A7970.jpg";

const LRPA = () => {
  const brandImg = [Assignment, Observation, Continous, Time];
  const responsive = {
    0: { items: 1 },
    768: { items: 2 },
    1024: { items: 2 },
  };

  const carouselItems = brandImg.map((img, index) => (
    <div className="px-1" key={index}>
      <div className="academic-slider-card">
        <img
          src={img}
          alt={`LRPA Slide ${index + 1}`}
          loading="lazy"
        />
      </div>
    </div>
  ));

  const lrpaSections = [
    {
      title: "Continuous Assessment",
      text: `allows ongoing evaluation of students' performance throughout their learning journey. This approach provides regular feedback and supports personalized learning by identifying areas for improvement and adapting strategies to meet individual needs. By monitoring progress continuously, we help students build confidence, stay motivated and engaged, promote a growth mindset, raise personal standards and push the boundaries of their progress`,
      image: Continous,
      numberClass: "number",
      number: "1",
    },
    {
      title: "Active Observation and Recording",
      text: `Teachers diligently observe and document students' activities, allowing them to gain a thorough understanding of each student's engagement, behavior, and unique learning style. This focused approach enables teachers to tailor their instructional methods to meet the individual needs and preferences of each student, fostering a more effective and personalized learning experience.`,
      image: Observation,
      numberClass: "number1",
      number: "2",
      reverse: true,
    },
    {
      title: "Assignments",
      text: ` that we provide play a vital role in children's learning and development. The assignment not only enhances their academic knowledge but also provides practical insights that reinforce a deeper understanding of the subject matter, catering to their individual levels. These assignments are designed to foster essential skills, such as critical thinking, research capabilities, and independent problem-solving, thereby equipping students with the tools necessary for their academic and personal growth.`,
      image: Assignment,
      numberClass: "number",
      number: "3",
    },
    {
      title: "Time Bound Written Assessment",
      text: `serve not only as a means to evaluate our students' current knowledge and skills but also stand as a key strategy in cultivating effective time management abilities. This type of assessment represents an initial step for students to familiarize themselves with the examination format they will encounter in the future, fostering preparedness and resilience. Moreover, it provides an in-depth insight into each student's academic comprehension and understanding, offering a well-rounded perspective on their learning journey and progress. Through such assessments, we aim to enhance students’ readiness for future examinations while equipping them with essential skills for academic and personal growth`,
      image: Time,
      numberClass: "number1",
      number: "4",
      reverse: true,
    },
  ];

  return (
    <>
      <div className="container-fluid px-0 mb-4">
        <AliceCarousel
          mouseTracking
          items={carouselItems}
          autoPlay
          infinite
          responsive={responsive}
          controlsStrategy="alternate"
          animationDuration={3000}
          disableButtonsControls
          disableDotsControls
        />
      </div>

      <div className="container py-4">
        {/* Section Header */}
        <SectionHeader
          badge="PEDAGOGY & METHODOLOGY"
          title="Learn Through LRPA:"
          highlight="A Comprehensive Approach to Education"
        />

        <div className="lrpa-intro-card bg-light p-4 rounded-4 shadow-sm border my-4">
          <p className="textcenter mb-0 text-secondary leading-relaxed">
            The LRPA (Learning, Reinforcement, Practice, and Application) model
            implemented at Aksharaa represents a distinctive approach to
            education, seamlessly blending traditional classroom instruction
            with hands-on, real-world application. In this innovative learning
            environment, students not only grasp theoretical concepts but also
            achieve mastery through repeated practical engagement. The
            educational emphasis lies in identifying and nurturing each
            student's individual strengths and addressing their challenges,
            fostering an environment where exploration is encouraged. The
            overarching goal is to empower students to apply their acquired
            knowledge and skills in practical, real-life scenarios. The adoption
            of this approach serves as a guiding principle, facilitating
            learning through the practical application of knowledge, thereby
            preparing children for the challenges and complexities of the
            contemporary world.
          </p>
        </div>
      </div>

      <div className="container lrpaContainer">
        {lrpaSections.map((section, index) => (
          <div
            key={index}
            className={`row d-flex align-items-center lrpacont justify-content-between ${
              index % 2 === 1 ? "bg-lrp2" : ""
            }`}
          >
            {section.reverse ? (
              <>
                <div className="col-md-8 position-relative">
                  <h4 className="border-bottom-title w-100 py-2 text-center">
                    {section.title}
                  </h4>
                  <p className="lrpamid-p pt-2">
                    <strong>{section.title}</strong> {section.text}
                  </p>
                </div>
                <div className="col-md-4 px-md-0">
                  <div className="contimg">
                    <img src={section.image} alt={section.title} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="col-md-4 px-md-0">
                  <div className="contimg">
                    <img src={section.image} alt={section.title} />
                  </div>
                </div>
                <div className="col-md-8 position-relative">
                  <h4 className="border-bottom-title w-100 py-2 text-center">
                    {section.title}
                  </h4>
                  <p className="lrpamid-p pt-2">
                    <strong>{section.title}</strong> {section.text}
                  </p>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default LRPA;
