import React, { useEffect, useState, memo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";
import SEO from "../components/SEO";
import School2 from "../../src/assets/School2.jpg";
import "../css/philosophy.css";
import "../css/aboutPage.css";

const aboutData = {
  introText: [
    `Aksharaa School provides an enriching educational experience with its blend of modern facilities and innovative teaching methods. Our expansive premises feature spacious buildings and full-sized playgrounds, offering a holistic learning environment that extends beyond traditional classroom settings`,
    `At Aksharaa School, we are committed to integrating cutting-edge technology into our curriculum. Our classrooms are equipped with computers, laptops, projectors, and other advanced tools, facilitating interactive and project-based learning. This technology supports students in conducting research, creating multimedia presentations, and collaborating effectively on group projects.`,

    `We pride ourselves on fostering critical thinking and problem-solving skills through hands-on experiences. Our students engage in a variety of enriching activities, including educational field trips, guest lectures, and international tours. These experiences are designed to broaden their perspectives and apply classroom knowledge to real-world situations.`,

    `Our approach to education combines intellectual mentoring with practical application. Students are encouraged to explore, discuss, and apply their knowledge through diverse methods such as role plays, group work, and virtual learning. This integration of theory and practice not only strengthens their understanding but also prepares them for future challenges with confidence and adaptability.`,

    `At Aksharaa School, we believe in nurturing well-rounded individuals who are ready to make meaningful contributions to society. Our focus on holistic development ensures that students leave us not only with academic excellence but also with the skills and experiences needed to succeed in an ever-evolving world.`,
  ],
  whyChooseUs: [
    {
      icon: "fas fa-building",
      title: "Modern Infrastructure",
      description:
        "Earthquake-resistant buildings and modern facilities ensure a safe and advanced learning environment.",
    },
    {
      icon: "fas fa-laptop-code",
      title: "Technologically Advanced Classrooms",
      description:
        "Integration of Information Communication Technology (ICT) and Learning Management Systems (LMS) to enhance learning.",
    },
    {
      icon: "fas fa-child",
      title: "Holistic Development",
      description:
        "Focus on physical, mental, and intellectual growth through our innovative Learning by Practice Reinforcement Approach (LRPA).",
    },
    {
      icon: "fas fa-chalkboard-teacher",
      title: "Experienced Faculty",
      description:
        "Dedicated and skilled educators committed to nurturing each child's potential.",
    },
    {
      icon: "fas fa-heart",
      title: "Inclusive Learning Environment",
      description:
        "Child-friendly facilities that support a well-rounded education.",
    },
  ],
};

const PhilosophySection = memo(({ navigate }) => (
  <section className="philosophy-section section-bg-alt py-5 my-3">
    <div className="container py-2">
      <SectionHeader
        badge="PEDAGOGY & METHODOLOGY"
        title="Our Philosophy"
        highlight="& Approach"
      />

      <div className="row d-flex align-items-center mt-4">
        {/* Left Side Text Content */}
        <div className="col-lg-6 col-md-12 mb-4 pe-lg-5 text-start">
          <p className="philosophy-text-lead mb-3">
            Aksharaa School adopts a student-centered, constructivist philosophy, fostering autonomous learning and emphasizing awareness, autonomy, and authenticity. We cater to diverse intelligences, promoting holistic growth through a balanced education system.
          </p>
          <p className="philosophy-text-body mb-3">
            Our Learning-Reinforcement-Practice-Application (LRPA) module enhances cognitive abilities with fun and curiosity, encouraging critical thinking, collaboration, creativity, and problem-solving. This prepares students to be global citizens.
          </p>
          <p className="philosophy-text-body mb-4">
            We value respect and diversity, blending traditional values with modern technology. Through national festivals and educational trips, we instill patriotism and global awareness, aiming to nurture well-rounded, globally competent citizens.
          </p>

          <button
            className="philosophy-btn mt-2"
            onClick={() => navigate("/about-lrpa")}
          >
            <span>Explore LRPA Approach</span>
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        {/* Right Side Video Banner */}
        <div className="col-lg-6 col-md-12 mb-4">
          <div className="philosophy-image-wrapper">
            <iframe
              className="philosophy-video"
              src="https://www.youtube.com/embed/nvz3GgY4Nts?autoplay=1&mute=1&start=43&loop=1&playlist=nvz3GgY4Nts&controls=0&rel=0&modestbranding=1&playsinline=1"
              title="Aksharaa School Philosophy Video"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
            ></iframe>
            <div className="philosophy-floating-badge">
              <i className="fas fa-award"></i>
              <div>
                <div className="badge-number">15+ Years</div>
                <div className="badge-label">Educational Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
));

const AboutContent = memo(() => (
  <section className="about-page-wrapper py-5">
    <div className="container mx-auto">
      <SectionHeader
        badge="WHO WE ARE"
        title="Aksharaa"
        highlight="Highlights & Introduction"
      />

      {/* Intro Description Card */}
      <div className="about-intro-box my-4">
        {aboutData.introText.map((text, index) => (
          <p className="mb-3" key={index}>
            {text}
          </p>
        ))}
      </div>


      <div className="about-intro-box my-4">
        <h4 className="fw-bold text-dark mb-3">Introduction of Aksharaa School</h4>
        <p className="mb-3">
          Established in 2011, Aksharaa School, the Best School in Kathmandu is a co-education institute offering day school from Kindergarten through grade 10. The school operates in three earthquake-resistant academic and administrative blocks spread over 23 ropanis of land. Our advanced infrastructure includes modern classrooms and facilities designed to provide a safe, technologically advanced learning environment that meets international standards.
        </p>
        <p className="mb-0">
          Ranked among internationally accredited schools, Aksharaa is renowned for employing innovative teaching methodologies in technology-enhanced classrooms. Our child-friendly facilities create sophisticated learning environments, encouraging students to engage deeply during their study hours. We are committed to fostering a physically, mentally, and intellectually stimulating environment that promotes the holistic development of young children.
        </p>
      </div>

      {/* Why Choose Us Grid */}
      <div className="my-5">
        <h4 className="fw-bold text-dark mb-4 text-center">
          <i className="fas fa-star text-success me-2"></i> Why Choose Aksharaa School?
        </h4>

        <div className="row g-4">
          {aboutData.whyChooseUs.map((item, index) => (
            <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={index}>
              <div className="why-choose-grid-card w-100">
                <div className="why-choose-icon">
                  <i className={item.icon}></i>
                </div>
                <h5 className="why-choose-title">{item.title}</h5>
                <p className="why-choose-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LRPA Approach Callout Banner */}
      <div className="about-lrpa-banner">
        <div>
          <h4 className="fw-bold mb-2">
            <i className="fas fa-lightbulb text-warning me-2"></i> Integrated LRPA Approach
          </h4>
          <p>
            Through the implementation of our Learning-Reinforcement-Practice-Application (LRPA) approach, Aksharaa achieves integrated child development supported by modern educational technology.
          </p>
        </div>

        <Link to="/about-lrpa" className="about-lrpa-btn">
          <span>Explore LRPA Philosophy</span>
          <i className="fas fa-arrow-right"></i>
        </Link>
      </div>
    </div>
  </section>
));

const About = ({ showSEO = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(location.pathname === "/");
  }, [location.pathname]);

  return show ? (
    <>
      {showSEO ? (
        <SEO
          title="Our Philosophy & Approach | LRPA Pedagogy"
          description="Aksharaa School adopts a student-centered, constructivist philosophy fostering autonomous learning, character development, and academic authenticity."
        />
      ) : null}
      <PhilosophySection navigate={navigate} />
    </>
  ) : (
    <>
      {showSEO ? (
        <SEO
          title="About Aksharaa School | Highlights & History"
          description="Established in 2011, Aksharaa School in Kathmandu operates in earthquake-resistant blocks across 23 ropanis, nurturing young minds through value-based progressive education."
          keywords="About Aksharaa School, Aksharaa History, Best Co-Ed School Kathmandu, Progressive Education Nepal"
        />
      ) : null}
      {/* Full Image Display */}
      <div className="w-100 mb-3">
        <img
          src={School2}
          alt="About Aksharaa School"
          className="img-fluid w-100 h-auto"
        />
      </div>

      <AboutContent />
      <PhilosophySection navigate={navigate} />
    </>
  );
};

export default About;
