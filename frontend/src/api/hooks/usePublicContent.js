import { useQuery } from "@tanstack/react-query";
import { publicContentService } from "../services/publicContentService";

export const queryKeys = {
  notices: ["notices"],
  heroSlides: ["hero-slides"],
  testimonials: ["testimonials"],
  blogs: (params = {}) => ["blogs", params],
  blog: (id) => ["blog", id],
  blogCategories: ["blog-categories"],
  activities: (params = {}) => ["activities", params],
  activity: (id) => ["activity", id],
  activityCategories: ["activity-categories"],
  creativePosts: (params = {}) => ["creative-posts", params],
  threeDImages: ["three-d-images"],
  galleries: ["galleries"],
  gallery: (id) => ["gallery", id],
  downloads: ["downloads"],
  events: ["events"],
  calendar: ["calendar"],
  projects: ["projects"],
  project: (id) => ["project", id],
  infrastructure: (params = {}) => ["infrastructure", params],
  infrastructureItem: (id) => ["infrastructure-item", id],
  partners: (params = {}) => ["partners", params],
  academics: ["academics"],
  academic: (category) => ["academic", category],
  mun: ["mun"],
  teamBanners: (params = {}) => ["team-banners", params],
};

export const useNotices = () =>
  useQuery({ queryKey: queryKeys.notices, queryFn: publicContentService.getNotices });

export const useHeroSlides = () =>
  useQuery({ queryKey: queryKeys.heroSlides, queryFn: publicContentService.getHeroSlides });

export const useTestimonials = () =>
  useQuery({ queryKey: queryKeys.testimonials, queryFn: publicContentService.getTestimonials });

export const useBlogs = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.blogs(params),
    queryFn: () => publicContentService.getBlogs(params),
    ...options,
  });

export const useBlog = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.blog(id),
    queryFn: () => publicContentService.getBlogById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });

export const useBlogCategories = (options = {}) =>
  useQuery({ queryKey: queryKeys.blogCategories, queryFn: publicContentService.getBlogCategories, ...options });

export const useActivities = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.activities(params),
    queryFn: () => publicContentService.getActivities(params),
    ...options,
  });

export const useActivity = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.activity(id),
    queryFn: () => publicContentService.getActivityById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });

export const useActivityCategories = (options = {}) =>
  useQuery({ queryKey: queryKeys.activityCategories, queryFn: publicContentService.getActivityCategories, ...options });

export const useCreativePosts = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.creativePosts(params),
    queryFn: () => publicContentService.getCreativePosts(params),
    ...options,
  });

export const useThreeDImages = () =>
  useQuery({ queryKey: queryKeys.threeDImages, queryFn: publicContentService.getThreeDImages });

export const useGalleries = () =>
  useQuery({ queryKey: queryKeys.galleries, queryFn: publicContentService.getGalleries });

export const useGallery = (id) =>
  useQuery({ queryKey: queryKeys.gallery(id), queryFn: () => publicContentService.getGalleryById(id), enabled: Boolean(id) });

export const useDownloads = () =>
  useQuery({ queryKey: queryKeys.downloads, queryFn: publicContentService.getDownloads });

export const useEvents = () =>
  useQuery({ queryKey: queryKeys.events, queryFn: publicContentService.getEvents });

export const useCalendar = () =>
  useQuery({ queryKey: queryKeys.calendar, queryFn: publicContentService.getCalendar });

export const useProjects = () =>
  useQuery({ queryKey: queryKeys.projects, queryFn: publicContentService.getProjects });

export const useProject = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => publicContentService.getProjectById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });

export const useInfrastructure = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.infrastructure(params),
    queryFn: () => publicContentService.getInfrastructure(params),
    ...options,
  });

export const useInfrastructureItem = (id, options = {}) =>
  useQuery({
    queryKey: queryKeys.infrastructureItem(id),
    queryFn: () => publicContentService.getInfrastructureById(id),
    enabled: Boolean(id) && options.enabled !== false,
    ...options,
  });

export const usePartners = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.partners(params),
    queryFn: () => publicContentService.getPartners(params),
    ...options,
  });

export const useAcademics = () =>
  useQuery({ queryKey: queryKeys.academics, queryFn: publicContentService.getAcademics });

export const useAcademic = (category, options = {}) =>
  useQuery({
    queryKey: queryKeys.academic(category),
    queryFn: () => publicContentService.getAcademicByCategory(category),
    enabled: Boolean(category) && options.enabled !== false,
    ...options,
  });

export const useMun = () =>
  useQuery({ queryKey: queryKeys.mun, queryFn: publicContentService.getMun });

export const useTeamBanners = (params = {}, options = {}) =>
  useQuery({
    queryKey: queryKeys.teamBanners(params),
    queryFn: () => publicContentService.getTeamBanners(params),
    ...options,
  });
