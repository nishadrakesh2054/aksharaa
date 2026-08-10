import React from "react";
import DOMPurify from "dompurify";
import "../css/ChairmanMsg.css";
import { useChairmanMessages } from "../api/hooks/usePublicContent";
import { getFileUrl } from "../api/media";

const getHeadingText = (position = "") => {
  const normalizedPosition = position.toLowerCase();
  if (normalizedPosition.includes("executive")) return "Executive Director";
  if (normalizedPosition.includes("principal")) return "Principal";
  return `The ${position}`;
};

const ChairmanMsg = () => {
  const { data: messages = [], isLoading } = useChairmanMessages();

  return (
    <>
      <div className="msgperson py-4">
        <div className="container ">
          {isLoading ? (
            <div className="row align-items-start mb-4 shadow-lg  p-4">
              <div className="col-12 text-center py-4">Loading messages...</div>
            </div>
          ) : (
            messages.map((message, index) => {
              const imageBlock = (
                <div className="col-lg-4" key="image">
                  <div className="fancy-border">
                    <img
                      src={getFileUrl(message.image)}
                      loading="lazy"
                      alt="Aksharaa School leadership"
                      className="img-fluid rounded  chairman-image"
                    />

                    <div className="pt-3 ">
                      <h4 className="chairman-name ">{message.name}</h4>
                      <p className="chairman-title">{message.position}</p>
                    </div>
                  </div>
                </div>
              );

              const HeadingTag = message.position?.toLowerCase().includes("principal") ? "h1" : "h3";
              const textBlock = (
                <div className="col-lg-8" key="text">
                  <HeadingTag className="chairman-header text-start">
                    Messsage From <br /> {getHeadingText(message.position)}
                  </HeadingTag>
                  <div className="message-content">
                    <div
                      className="msg-text"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message.description || "", {
                          ADD_ATTR: ["style", "target", "class"],
                        }),
                      }}
                    />
                  </div>
                </div>
              );

              return (
                <div
                  className={`row align-items-start shadow-lg  p-4 ${index === 0 ? "mb-4" : ""}`}
                  key={message._id || `${message.name}-${message.position}`}
                >
                  {index % 2 === 0 ? [textBlock, imageBlock] : [imageBlock, textBlock]}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default ChairmanMsg;
