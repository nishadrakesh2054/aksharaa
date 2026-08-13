import React from "react";
import DOMPurify from "dompurify";


const SafeHTML = ({ htmlString }) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString, {
    ADD_ATTR: ["style", "target", "class"],
  });

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />
    </>
  );
};

export default SafeHTML;
