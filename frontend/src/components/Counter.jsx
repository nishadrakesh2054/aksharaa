import React from "react";
import CountUp from "react-countup";
import counter from "../Data/CounterData";
import SectionHeader from "./SectionHeader";
import "../css/Counter.css";

const Counter = () => {
  return (
    <section className="counter-section section-bg-alt py-5 my-2">
      <div className="container mx-auto">
        <SectionHeader
          badge="MILESTONES & RECOGNITION"
          title="Our Key"
          highlight="Achievements"
        />

        <div className="row counter-grid-row justify-content-center align-items-center">
          {counter &&
            counter.map((count) => (
              <div
                className={`col-lg-3 col-md-6 col-sm-6 counter ${count.name.toLowerCase()}`}
                key={count.id}
              >
                <div className="counter-icon">
                  <i className={count.icon} />
                </div>

                <h3>{count.name}</h3>

                <span className="counter-value">
                  <CountUp
                    end={count.counterNo}
                    duration={3}
                    enableScrollSpy={true}
                    scrollSpyOnce={true}
                  />
                  +
                </span>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;
