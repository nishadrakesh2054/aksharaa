import React from "react";
import DOMPurify from "dompurify";

const SafeHtml = ({ htmlString }) => {
  // Sanitize the HTML string to remove any malicious code
  const cleanHtmlString = DOMPurify.sanitize(htmlString);

  return <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />;
};

export default SafeHtml;
