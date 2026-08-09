import React, { useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import LoadingState from "./states/LoadingState";
import ErrorState from "./states/ErrorState";
import EmptyState from "./states/EmptyState";
import { useFaqs } from "../api/hooks/usePublicContent";
import "../css/faqSection.css";

const FAQ_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "general", label: "General" },
  { value: "admission", label: "Admission" },
  { value: "academics", label: "Academics" },
  { value: "facilities", label: "Facilities" },
];

const FAQSection = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [openFaqId, setOpenFaqId] = useState(null);

  const params = useMemo(() => {
    const baseParams = { isActive: true, sortBy: "order", sortOrder: "asc" };
    return activeCategory === "all" ? baseParams : { ...baseParams, category: activeCategory };
  }, [activeCategory]);

  const { data: faqs = [], isLoading, isError, error, refetch } = useFaqs(params);

  const selectedLabel = FAQ_CATEGORIES.find((item) => item.value === activeCategory)?.label || "All";

  return (
    <section className="faq-section">
      <div className="container mx-auto">
        <SectionHeader
          badge="QUICK ANSWERS"
          title="Frequently Asked"
          highlight="Questions"
        />

        <div className="faq-shell">
          <div className="faq-side-panel">
            <span className="faq-mini-label">Aksharaa Help Desk</span>
            <h3>Find the answer that fits your next step.</h3>
            <p>
              Browse practical details about admissions, academics, facilities, and daily school life.
            </p>
            <div className="faq-current-chip">
              <i className="fas fa-layer-group"></i>
              <span>{selectedLabel}</span>
            </div>
          </div>

          <div className="faq-content-panel">
            <div className="faq-filter-row" aria-label="FAQ category filters">
              {FAQ_CATEGORIES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`faq-filter-btn ${activeCategory === item.value ? "active" : ""}`}
                  onClick={() => {
                    setActiveCategory(item.value);
                    setOpenFaqId(null);
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {isLoading ? (
              <LoadingState label="Loading FAQs..." />
            ) : isError ? (
              <ErrorState message={error?.message || "Unable to load FAQs."} onRetry={refetch} />
            ) : faqs.length === 0 ? (
              <EmptyState message="No FAQs found for this category." />
            ) : (
              <div className="faq-list">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqId === faq._id;

                  return (
                    <article className={`faq-item ${isOpen ? "open" : ""}`} key={faq._id}>
                      <button
                        type="button"
                        className="faq-question-btn"
                        onClick={() => setOpenFaqId(isOpen ? null : faq._id)}
                        aria-expanded={isOpen}
                      >
                        <span className="faq-number">{String(index + 1).padStart(2, "0")}</span>
                        <span className="faq-question-text">{faq.question}</span>
                        <span className="faq-toggle-icon">
                          <i className={`fas ${isOpen ? "fa-minus" : "fa-plus"}`}></i>
                        </span>
                      </button>

                      <div className="faq-answer-wrap">
                        <p>{faq.answer}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
