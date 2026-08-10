import apiClient from "../client";

const listFrom = (response, keys) => {
  for (const key of keys) {
    if (Array.isArray(response?.[key])) return response[key];
    if (Array.isArray(response?.data?.[key])) return response.data[key];
  }
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const itemFrom = (response, keys) => {
  for (const key of keys) {
    if (response?.[key] && !Array.isArray(response[key])) return response[key];
    if (response?.data?.[key] && !Array.isArray(response.data[key])) return response.data[key];
  }
  if (response?.data && !Array.isArray(response.data)) return response.data;
  return null;
};

export const publicContentService = {
  getNotices: async () => {
    const response = await apiClient.get("/notice/getallnotice");
    return listFrom(response, ["notices"]).reverse();
  },

  getHeroSlides: async () => {
    const response = await apiClient.get("/hero/getallheroimg");
    return listFrom(response, ["Heros", "heros", "data"]);
  },

  getTestimonials: async () => {
    const response = await apiClient.get("/testimonial");
    return listFrom(response, ["testimonial", "testimonials"]);
  },

  getFaqs: async (params = {}) => {
    const response = await apiClient.get("/faqs", { params });
    return listFrom(response, ["faqs"]);
  },

  getBlogs: async (params = {}) => {
    const response = await apiClient.get("/blog/", { params });
    return listFrom(response, ["blogs"]);
  },

  getBlogById: async (id) => {
    const response = await apiClient.get(`/blog/${id}`);
    return response.blog || response.data || null;
  },

  getBlogCategories: async () => {
    const response = await apiClient.get("/category");
    return listFrom(response, ["categories"]);
  },

  getChairmanMessages: async () => {
    const response = await apiClient.get("/chairman-messages");
    return listFrom(response, ["messages"]);
  },

  getVisionMission: async () => {
    const response = await apiClient.get("/vision-mission");
    return listFrom(response, ["items", "visionMission"]);
  },

  getActivities: async (params = {}) => {
    const response = await apiClient.get("/activity/", { params });
    return listFrom(response, ["activities"]);
  },

  getCreativePosts: async (params = {}) => {
    const response = await apiClient.get("/creative/getallcreativeweek", { params });
    return listFrom(response, ["creative", "notices"]);
  },

  getActivityById: async (id) => {
    const response = await apiClient.get(`/activity/${id}`);
    return response.activity || response.data || null;
  },

  getActivityCategories: async () => {
    const response = await apiClient.get("/activityCategory/");
    return listFrom(response, ["categories"]);
  },

  getThreeDImages: async () => {
    const response = await apiClient.get("/three/getallthreedimg");
    return listFrom(response, ["gallery", "data", "threeDImages", "threeD"]);
  },

  getGalleries: async () => {
    const response = await apiClient.get("/getallgallery");
    return listFrom(response, ["gallery", "galleries", "Galleries", "items", "docs", "data"]);
  },

  getGalleryById: async (id) => {
    const response = await apiClient.get(`/getallgallery/${id}`);
    return itemFrom(response, ["gallery", "galleries", "Gallery"]);
  },

  getDownloads: async () => {
    const response = await apiClient.get("/getallpdf");
    return listFrom(response, ["pdfs", "pdf", "data"]);
  },

  getEvents: async () => {
    const response = await apiClient.get("/events");
    return listFrom(response, ["events"]);
  },

  getCalendar: async () => {
    const response = await apiClient.get("/calendar");
    return listFrom(response, ["calendar"]);
  },

  getProjects: async () => {
    const response = await apiClient.get("/projects");
    return listFrom(response, ["projects"]);
  },

  getProjectById: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.project || response.data || null;
  },

  getInfrastructure: async (params = {}) => {
    const response = await apiClient.get("/infrastructure", { params });
    return listFrom(response, ["infrastructure"]);
  },

  getInfrastructureById: async (id) => {
    const response = await apiClient.get(`/infrastructure/${id}`);
    return response.infrastructure || response.data || null;
  },

  getPartners: async (params = {}) => {
    const response = await apiClient.get("/partners", { params });
    return listFrom(response, ["partners"]);
  },

  getAcademics: async () => {
    const response = await apiClient.get("/academic");
    return listFrom(response, ["academics"]);
  },

  getAcademicByCategory: async (category) => {
    const response = await apiClient.get(`/academic/${category}`);
    return response.data || response.academic || response || null;
  },

  getMun: async () => {
    const response = await apiClient.get("/mun");
    return response.mun || response.data || null;
  },

  getTeamBanners: async (params = {}) => {
    const response = await apiClient.get("/teambanners", { params });
    return listFrom(response, ["banners"]);
  },

  getStaffProfiles: async (params = {}) => {
    const response = await apiClient.get("/getallprofile", { params });
    return listFrom(response, ["profiles"]);
  },
};
