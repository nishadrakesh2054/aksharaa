import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Loader from "../components/Loader";
import SafeHTML from "../components/SafeHTML";
import { getFileUrl } from "../api/media";
import {
  useActivities,
  useCalendar,
  useEvents,
  useProjects,
} from "../api/hooks/usePublicContent";
import SectionHeader from "../components/SectionHeader";
import "../css/highlightsTab.css";

const Blog = ({ showSEO = true }) => {
  const { pathname } = useLocation();
  const [filter, setFilter] = useState("Featured News");
  const [showAllActivities, setShowAllActivities] = useState(false);
  const navigate = useNavigate();
  const { data: activities = [], isLoading: activitiesLoading } = useActivities();
  const { data: events = [] } = useEvents();
  const { data: calendar = [] } = useCalendar();
  const { data: projects = [] } = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (activitiesLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  const isHomePage = pathname === "/" || pathname === "";
  const displayedActivities = showAllActivities ? activities : activities.slice(0, 3);




  const responsive = {
    0: { items: 1 },
    568: { items: 2 },
    1024: { items: 3 },
  };

  const displayEvents = events.length ? events : blogData;
  const displayCalendar = calendar.length ? calendar : scheduleData;
  const displayProjects = projects;

  const items = activities.map((item, index) => (
    <div
      className="item p-2"
      key={index}
      onClick={() => navigate(`/newsactivity/${item._id}`)}
    >
      <article className="blog-card">
        <div className="blog-card__background">
          <div className="card__background--wrapper">
            <div
              className="card__background--main"
              style={{
                backgroundImage: `url(${getFileUrl(item.image)})`,
              }}
            >
              <div className="card__background--layer" />
            </div>
          </div>
        </div>
        <div className="blog-card__head">
          <span className="date__box">
            {(() => {
              const date = new Date(item.createdAt);
              const day = date.getDate();
              const month = date
                .toLocaleString("en-US", { month: "short" })
                .toUpperCase();

              return (
                <>
                  <span className="date__day">{day}</span>
                  <span className="date__month">{month}</span>
                </>
              );
            })()}
          </span>
        </div>

        <div className="blog-card__info">
          <h6>{item.title}</h6>
          <p className="card-text">
            <SafeHTML htmlString={(item.description || "").slice(0, 110)} />
          </p>
          <Link to={`/newsactivity/${item._id}`} className="btn btn--with-icon">
            <i className="btn-icon fa fa-long-arrow-right" />
            READ MORE
          </Link>
        </div>
      </article>
    </div>
  ));

  return (
    <>
      {showSEO ? (
        <Helmet>
          <title>Aksharaa Highlights | Aksharaa School</title>
          <meta
            name="description"
            content="Explore Aksharaa Highlights, school activities, events schedule, academic calendar, and long-term student projects."
          />
        </Helmet>
      ) : null}

      <div className="demo section-bg-white py-5">
        <div className="container mx-auto">
          <SectionHeader
            badge="ACTIVITIES & EVENTS"
            title="Aksharaa"
            highlight="Highlights"
          />

          {/* Enhanced Pill Tab Navigation */}
          <div className="highlights-tab-container">
            <button
              className={`highlights-tab-pill ${
                filter === "Featured News" ? "active" : ""
              }`}
              onClick={() => setFilter("Featured News")}
            >
              <i className="fas fa-layer-group me-2"></i>
              <span>Activities</span>
            </button>

            <button
              className={`highlights-tab-pill ${
                filter === "Upcoming Events" ? "active" : ""
              }`}
              onClick={() => setFilter("Upcoming Events")}
            >
              <i className="fas fa-calendar-alt me-2"></i>
              <span>Upcoming Events</span>
            </button>

            <button
              className={`highlights-tab-pill ${
                filter === "Calendar" ? "active" : ""
              }`}
              onClick={() => setFilter("Calendar")}
            >
              <i className="fas fa-calendar-week me-2"></i>
              <span>Calendar</span>
            </button>

            <button
              className={`highlights-tab-pill ${
                filter === "longtermProject" ? "active" : ""
              }`}
              onClick={() => setFilter("longtermProject")}
            >
              <i className="fas fa-project-diagram me-2"></i>
              <span>LongTerm Projects</span>
            </button>
          </div>

          {/* Tab 1: Activities */}
          {filter === "Featured News" && (
            <div className="mt-3">
              <AliceCarousel
                mouseTracking
                items={items}
                infinite={true}
                autoPlay={true}
                animationDuration={1500}
                responsive={responsive}
                disableButtonsControls
                disableDotsControls
                controlsStrategy="responsive"
              />

              {/* Minimalist Cards Grid Below Slider (Hidden on Homepage) */}
              {!isHomePage && (
                <div className="mt-5 pt-3 border-top">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <h4 className="fw-bold text-dark mb-1" style={{ fontSize: "1.25rem" }}>
                        Recent Activities
                      </h4>
                      <p className="text-muted small mb-0">
                        Co-curricular events, student workshops, and achievements
                      </p>
                    </div>
                    <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill">
                      Showing {displayedActivities.length} of {activities.length}
                    </span>
                  </div>

                  <div className="row g-4">
                    {displayedActivities.map((item, index) => {
                      const date = new Date(item.createdAt);
                      const day = date.getDate();
                      const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();

                      return (
                        <div className="col-lg-4 col-md-6 col-12 d-flex" key={item._id || index}>
                          <div className="mini-activity-card w-100">
                            <div className="mini-card-img-wrapper">
                              <img
                                src={getFileUrl(item.image)}
                                alt={item.title}
                                loading="lazy"
                              />
                              <span className="mini-card-date-badge">
                                <span>{day}</span> <span>{month}</span>
                              </span>
                            </div>

                            <div className="mini-card-body">
                              <div>
                                <h5 className="mini-card-title">{item.title}</h5>
                                <div className="mini-card-snippet">
                                  <SafeHTML htmlString={(item.description || "").slice(0, 110)} />
                                </div>
                              </div>

                              <div className="mini-card-footer">
                                <Link
                                  to={`/newsactivity/${item._id}`}
                                  className="mini-card-readmore"
                                >
                                  <span>READ MORE</span>
                                  <i className="fas fa-arrow-right"></i>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {activities.length > 3 && (
                    <div className="text-center mt-4 pt-2">
                      <button
                        type="button"
                        className="highlights-tab-pill border"
                        onClick={() => setShowAllActivities(!showAllActivities)}
                        style={{
                          borderColor: "#196642",
                          color: showAllActivities ? "#ffffff" : "#196642",
                          backgroundColor: showAllActivities ? "#196642" : "#ffffff",
                          fontSize: "0.85rem",
                          letterSpacing: "0.5px",
                          padding: "10px 26px",
                        }}
                      >
                        {showAllActivities ? (
                          <>
                            <span>SHOW LESS ACTIVITIES</span>
                            <i className="fas fa-chevron-up ms-2"></i>
                          </>
                        ) : (
                          <>
                            <span>VIEW ALL ACTIVITIES ({activities.length})</span>
                            <i className="fas fa-arrow-right ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}



          {/* Tab 2: Upcoming Events */}
          {filter === "Upcoming Events" && (
            <div className="mt-4">
              <div className="row g-4">
                {displayEvents.map((item, index) => {
                  const rawDate = item.date || item.eventDate;
                  let month = "EVENT";
                  let day = "--";
                  let year = "";

                  if (rawDate) {
                    const parsedDate = new Date(rawDate);
                    if (!isNaN(parsedDate.getTime())) {
                      month = parsedDate.toLocaleString("en-US", { month: "short" }).toUpperCase();
                      day = String(parsedDate.getDate()).padStart(2, "0");
                      year = parsedDate.getFullYear();
                    } else {
                      const parts = String(rawDate).split("-");
                      if (parts.length >= 3) {
                        year = parts[0];
                        month = parts[1];
                        day = parts[2];
                      } else {
                        day = rawDate;
                      }
                    }
                  }

                  return (
                    <div className="col-lg-6 col-12 d-flex" key={item._id || item.id || index}>
                      <div className="upcoming-event-card w-100">
                        <div className="event-date-block">
                          <span className="event-month">{month}</span>
                          <span className="event-day">{day}</span>
                          {year && <span className="event-year">{year}</span>}
                        </div>

                        <div className="event-info-content">
                          <span className="event-meta-pill">
                            <i className="fas fa-calendar-check me-1"></i> Upcoming Event
                          </span>
                          <h5 className="event-info-title">{item.title}</h5>
                          <p className="event-info-desc">
                            {item.des || item.description || "Student participation and experiential learning event."}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Tab 3: Calendar */}
          {filter === "Calendar" && (
            <div className="mt-4">
              <div className="row g-4">
                {displayCalendar.map((item, index) => {
                  const rawMonth = item.monthYear || item.date || item.title || "";
                  let monthTitle = rawMonth;

                  if (/^\d{4}-\d{2}$/.test(rawMonth)) {
                    const [yr, mo] = rawMonth.split("-");
                    const dObj = new Date(parseInt(yr), parseInt(mo) - 1, 1);
                    if (!isNaN(dObj.getTime())) {
                      monthTitle = `${dObj.toLocaleString("en-US", { month: "long" })} ${yr}`;
                    }
                  }

                  return (
                    <div key={index} className="col-lg-3 col-md-6 col-sm-12 d-flex">
                      <div className="calendar-card-box w-100">
                        <div className="calendar-header-banner">
                          <h5 title={monthTitle}>{monthTitle}</h5>
                          <i className="fas fa-calendar-alt"></i>
                        </div>

                        <div className="calendar-body-list">
                          {(item.event || item.events || []).map((eventItem, eventIndex) => (
                            <div key={eventIndex} className="calendar-event-row">
                              <span className="calendar-event-icon">
                                <i className="fas fa-check"></i>
                              </span>
                              <p className="calendar-event-text">{eventItem}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


          {/* Tab 4: LongTerm Projects */}
          {filter === "longtermProject" && (
            <div className="mt-4">
              <div className="row g-4">
                {displayProjects.length ? (
                  displayProjects.map((project, id) => {
                    const projectImages = project.images || project.image || [];
                    const projectImage = Array.isArray(projectImages)
                      ? projectImages[0]
                      : projectImages;

                    return (
                      <div className="col-lg-4 col-md-6 col-sm-12 d-flex" key={project._id || project.id || id}>
                        <div className="project-card-container w-100">
                          <div className="project-img-wrapper">
                            <img
                              src={getFileUrl(projectImage)}
                              alt={project.title}
                              loading="lazy"
                            />
                            <span className="project-category-badge">
                              <i className="fas fa-folder-open me-1"></i> Project
                            </span>
                          </div>

                          <div className="project-content-body">
                            <div>
                              <h5 className="project-title">{project.title}</h5>
                              <p className="project-desc-snippet">
                                {(project.description || "").replace(/<[^>]*>?/gm, "").trim().slice(0, 110)}...
                              </p>
                            </div>

                            <div className="project-footer-action">
                              <button
                                className="project-action-btn-simple"
                                onClick={() => navigate(`/newsactivity/longterm-project/${project._id || id + 1}`)}
                              >
                                <span>EXPLORE PROJECT</span>
                                <i className="fas fa-arrow-right"></i>
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-12 text-center text-muted py-5">
                    No long term projects found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Blog;
