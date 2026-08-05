import React from "react";
import { useLocation } from "react-router-dom";
import SEO from "./SEO";
import { getRouteMeta } from "../config/siteRoutes";

export default function RouteSEO() {
  const { pathname } = useLocation();
  const meta = getRouteMeta(pathname);

  if (!meta) {
    return <SEO />;
  }

  return (
    <SEO
      title={meta.title}
      description={meta.description}
      keywords={meta.keywords}
    />
  );
}
