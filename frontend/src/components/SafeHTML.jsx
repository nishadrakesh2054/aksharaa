// import React from "react";
// import DOMPurify from "dompurify";

// const SafeHTML = ({ htmlString }) => {
//   const cleanHtmlString = DOMPurify.sanitize(htmlString);

//   return <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />;
// };

// export default SafeHTML;

import React from "react";
// import DOMPurify from "dompurify";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.0.3/dist/purify.es.min.js";


const SafeHTML = ({ htmlString }) => {
  const cleanHtmlString = DOMPurify.sanitize(htmlString);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: cleanHtmlString }} />
    </>
  );
};

export default SafeHTML;
