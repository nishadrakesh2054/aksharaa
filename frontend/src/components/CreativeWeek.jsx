import React from "react";
import "../css/Creative.css";
import { useNotices } from "../api/hooks/usePublicContent";
import { firstImage } from "../api/media";
import LoadingState from "./states/LoadingState";
import EmptyState from "./states/EmptyState";
import ErrorState from "./states/ErrorState";
import SectionHeader from "./SectionHeader";

const CreativeWeek = () => {
  const {
    data: notices = [],
    isLoading: noticesLoading,
    error: noticesError,
  } = useNotices();

  return (
    <section className="creative-section-wrapper section-bg-white py-5 my-2">
      <div className="container mx-auto">
        <div className="notice-only-card">
          <SectionHeader
            badge="ANNOUNCEMENTS"
            title="Important"
            highlight="Notices"
          />

          <div className="notice-image-wrapper mt-3">
            {noticesLoading && <LoadingState label="Loading notice..." />}
            {noticesError && <ErrorState message={noticesError.message} />}
            {!noticesLoading && !noticesError && notices.length > 0 && (
              <img
                src={firstImage(notices[0].images)}
                alt="Important Notice"
                loading="lazy"
              />
            )}
            {!noticesLoading && !noticesError && notices.length === 0 && (
              <EmptyState message="No important notice found." />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreativeWeek;
