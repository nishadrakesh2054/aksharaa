import React, { useEffect, useState } from "react";
import SEO from "../components/SEO";
import { useLocation } from "react-router-dom";
import Learning from "../components/Learning";
import Blog from "./Blog";
import Brand from "../components/Brand";
import Testimonial from "../components/Testimonial";
import Banner from "../components/Banner";
import Contact from "./Contact";
import Counter from "../components/Counter";
import About from "./About";
import CreativeWeek from "../components/CreativeWeek";
import HomeBlog from "../components/HomeBlog";
import Mission from "./../components/Mission";
import Infochek from "../components/Infochek";
import Pic from "../components/HomePicRotate";
import Mobilecheck from "../components/Mobilecheck";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <SEO
        title="Best School in Kathmandu, Nepal | Admissions Open"
        description="Aksharaa School is a premier progressive co-educational school in Kathmandu (PG to Grade 10). Offering child-centric learning, modern infrastructure, and our innovative LRPA framework."
        keywords="Aksharaa School, Best School in Kathmandu, Top School in Nepal, Admissions Open Kathmandu, LRPA Education, Kindergarten Kathmandu, Grade 1 to 10"
      />
      <Banner />
      <Mission />
      {isMobile ? <Mobilecheck /> : <Learning />}
      <Infochek />
      <About />
      <Blog />
      <Counter />
      <Testimonial />
      <HomeBlog />
      <CreativeWeek />
      <Pic />
      <Contact />
      <Brand />
    </>
  );
};

export default Home;
