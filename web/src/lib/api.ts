import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  clearSession,
  getAccessToken,
  getCsrfToken,
  setAccessToken,
  setCsrfToken,
} from "./auth-storage";
import { API_BASE_URL } from "./constants";
import {
  Collaboration,
  DashboardStats,
  HomepageData,
  Inquiry,
  PaginatedResponse,
  PricingPlan,
  Project,
  Service,
  SiteSettings,
  TeamMember,
  Testimonial,
  User,
} from "@/types";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

api.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  const csrfToken = getCsrfToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  if (csrfToken && ["post", "put", "patch", "delete"].includes((config.method || "").toLowerCase())) {
    config.headers["x-csrf-token"] = csrfToken;
  }

  return config;
});

async function refreshSession(): Promise<string | null> {
  try {
    const response = await api.post<{ accessToken: string; csrfToken: string }>("/auth/refresh");
    setAccessToken(response.data.accessToken);
    setCsrfToken(response.data.csrfToken);
    return response.data.accessToken;
  } catch (error) {
    clearSession();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = error.config as RetryConfig | undefined;

    if (!originalConfig || originalConfig._retry) {
      return Promise.reject(error);
    }

    const isUnauthorized = error.response?.status === 401;
    const authRoute = originalConfig.url?.includes("/auth/login") || originalConfig.url?.includes("/auth/refresh");
    if (!isUnauthorized || authRoute) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) {
            reject(error);
          } else {
            originalConfig.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalConfig));
          }
        });
      });
    }

    originalConfig._retry = true;
    isRefreshing = true;

    const newToken = await refreshSession();
    isRefreshing = false;
    flushQueue(newToken);

    if (!newToken) {
      return Promise.reject(error);
    }

    originalConfig.headers.Authorization = `Bearer ${newToken}`;
    return api(originalConfig);
  },
);

export async function getCsrfTokenFromServer() {
  const response = await api.get<{ csrfToken: string }>("/auth/csrf");
  setCsrfToken(response.data.csrfToken);
  return response.data.csrfToken;
}

export async function loginRequest(payload: { email: string; password: string }) {
  const response = await api.post<{ user: User; accessToken: string; csrfToken: string }>("/auth/login", payload);
  setAccessToken(response.data.accessToken);
  setCsrfToken(response.data.csrfToken);
  return response.data.user;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
  clearSession();
}

export async function meRequest() {
  const response = await api.get<{ user: User }>("/auth/me");
  return response.data.user;
}

export const publicApi = {
  getHomepage: async () => (await api.get<HomepageData>("/public/homepage")).data,
  getSettings: async () => (await api.get<SiteSettings | null>("/public/settings")).data,
  getServices: async () => (await api.get<Service[]>("/public/services")).data,
  getProjects: async (params?: Record<string, string | number | boolean>) =>
    (await api.get<PaginatedResponse<Project>>("/public/projects", { params })).data,
  getProjectBySlug: async (slug: string) => (await api.get<Project>(`/public/projects/${slug}`)).data,
  getTeam: async (type?: "TEAM" | "BOARD") => (await api.get<TeamMember[]>("/public/team", { params: { type } })).data,
  getCollaborations: async () => (await api.get<Collaboration[]>("/public/collaborations")).data,
  getPricing: async () => (await api.get<PricingPlan[]>("/public/pricing")).data,
  getTestimonials: async () => (await api.get<Testimonial[]>("/public/testimonials")).data,
  submitTestimonial: async (payload: {
    name: string;
    roleCompany?: string;
    message: string;
    rating?: number;
    honeypot?: string;
  }) => (await api.post<{ message: string }>("/public/testimonials", payload)).data,
  submitInquiry: async (payload: Record<string, string>) =>
    (await api.post<{ message: string }>("/contact", payload)).data,
};

export const adminApi = {
  getDashboard: async () => (await api.get<DashboardStats>("/admin/dashboard")).data,
  getSettings: async () => (await api.get<SiteSettings | null>("/admin/settings")).data,
  updateSettings: async (payload: Partial<SiteSettings>) => (await api.put<SiteSettings>("/admin/settings", payload)).data,

  getServices: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<Service>>("/admin/services", { params })).data,
  createService: async (payload: Partial<Service>) => (await api.post<Service>("/admin/services", payload)).data,
  updateService: async (id: string, payload: Partial<Service>) => (await api.put<Service>(`/admin/services/${id}`, payload)).data,
  deleteService: async (id: string) => (await api.delete(`/admin/services/${id}`)).data,

  getProjects: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<Project>>("/admin/projects", { params })).data,
  createProject: async (payload: Partial<Project>) => (await api.post<Project>("/admin/projects", payload)).data,
  updateProject: async (id: string, payload: Partial<Project>) => (await api.put<Project>(`/admin/projects/${id}`, payload)).data,
  deleteProject: async (id: string) => (await api.delete(`/admin/projects/${id}`)).data,

  getTeamMembers: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<TeamMember>>("/admin/team", { params })).data,
  createTeamMember: async (payload: Partial<TeamMember>) => (await api.post<TeamMember>("/admin/team", payload)).data,
  updateTeamMember: async (id: string, payload: Partial<TeamMember>) =>
    (await api.put<TeamMember>(`/admin/team/${id}`, payload)).data,
  deleteTeamMember: async (id: string) => (await api.delete(`/admin/team/${id}`)).data,

  getBoardMembers: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<TeamMember>>("/admin/board", { params })).data,

  getCollaborations: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<Collaboration>>("/admin/collaborations", { params })).data,
  createCollaboration: async (payload: Partial<Collaboration>) =>
    (await api.post<Collaboration>("/admin/collaborations", payload)).data,
  updateCollaboration: async (id: string, payload: Partial<Collaboration>) =>
    (await api.put<Collaboration>(`/admin/collaborations/${id}`, payload)).data,
  deleteCollaboration: async (id: string) => (await api.delete(`/admin/collaborations/${id}`)).data,

  getPricing: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<PricingPlan>>("/admin/pricing", { params })).data,
  upsertPricing: async (payload: Partial<PricingPlan>) => (await api.post<PricingPlan>("/admin/pricing", payload)).data,
  updatePricing: async (id: string, payload: Partial<PricingPlan>) =>
    (await api.put<PricingPlan>(`/admin/pricing/${id}`, payload)).data,
  deletePricing: async (id: string) => (await api.delete(`/admin/pricing/${id}`)).data,

  getInquiries: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<Inquiry>>("/admin/inquiries", { params })).data,
  updateInquiryStatus: async (id: string, status: string) =>
    (await api.put<Inquiry>(`/admin/inquiries/${id}/status`, { status })).data,
  deleteInquiry: async (id: string) => (await api.delete(`/admin/inquiries/${id}`)).data,

  getUsers: async (params?: Record<string, unknown>) => (await api.get<PaginatedResponse<User>>("/admin/users", { params })).data,
  createUser: async (payload: Partial<User> & { password: string }) => (await api.post<User>("/admin/users", payload)).data,
  updateUser: async (id: string, payload: Partial<User> & { password?: string }) =>
    (await api.put<User>(`/admin/users/${id}`, payload)).data,
  deleteUser: async (id: string) => (await api.delete(`/admin/users/${id}`)).data,

  getTestimonials: async (params?: Record<string, unknown>) =>
    (await api.get<PaginatedResponse<Testimonial>>("/admin/testimonials", { params })).data,
  createTestimonial: async (payload: Partial<Testimonial>) => (await api.post<Testimonial>("/admin/testimonials", payload)).data,
  updateTestimonial: async (id: string, payload: Partial<Testimonial>) =>
    (await api.put<Testimonial>(`/admin/testimonials/${id}`, payload)).data,
  deleteTestimonial: async (id: string) => (await api.delete(`/admin/testimonials/${id}`)).data,

  uploadImage: async (image: string, folder = "webmitra", options?: { removeBackground?: boolean }) =>
    (await api.post<{ url: string }>("/admin/upload", { image, folder, removeBackground: options?.removeBackground })).data.url,
};
