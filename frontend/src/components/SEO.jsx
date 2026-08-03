import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

const DEFAULT_TITLE = "Aksharaa School | Best School in Kathmandu, Nepal";
const DEFAULT_DESCRIPTION =
  "Aksharaa School is a leading progressive co-educational school in Kathmandu, Nepal (PG to Grade 10). Offering child-centric learning, modern infrastructure, and our innovative LRPA framework.";
const DEFAULT_KEYWORDS =
  "Aksharaa School, Best School in Kathmandu, Top School in Nepal, Progressive School Kathmandu, LRPA Methodology, Kindergarten Kathmandu, Primary School Kathmandu, High School Nepal";
const DEFAULT_IMAGE = "https://www.aksharaaschool.edu.np/akasharalogo.png";
const SITE_NAME = "Aksharaa School";
const SITE_URL = "https://www.aksharaaschool.edu.np";

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  image = DEFAULT_IMAGE,
  type = "website",
  schema,
}) => {
  const location = useLocation();
  const canonicalUrl = `${SITE_URL}${location.pathname}`;
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;

  // Default Organization JSON-LD Schema for Google Search
  const defaultSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Aksharaa School",
    url: SITE_URL,
    logo: DEFAULT_IMAGE,
    description: DEFAULT_DESCRIPTION,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kandaghari, Kageshwori Manohara - 9",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+977-01-4993031",
      contactType: "admissions",
      email: "info@aksharaaschool.edu.np",
    },
    sameAs: [
      "https://www.facebook.com/aksharaaschool",
      "https://www.instagram.com/aksharaaschool",
    ],
  };

  const jsonLd = schema || defaultSchema;

  return (
    <Helmet>
      {/* Standard Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Aksharaa School" />
      {/* Favicon & Touch Icons for Google Search Results & Mobile Browsers */}
      <link rel="icon" type="image/png" sizes="32x32" href="/akasharalogo.png" />
      <link rel="icon" type="image/png" sizes="192x192" href="/akasharalogo.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/akasharalogo.png" />
      <link rel="shortcut icon" href="/akasharalogo.png" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data / JSON-LD */}
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Helmet>
  );
};

export default SEO;
