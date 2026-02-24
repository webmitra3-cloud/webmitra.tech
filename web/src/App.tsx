import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { LoadingState } from "@/components/shared/loading";
import { ScrollToTop } from "@/components/shared/scroll-to-top";

const AdminLayout = lazy(() => import("@/components/layout/admin-layout").then((module) => ({ default: module.AdminLayout })));
const PublicLayout = lazy(() => import("@/components/layout/public-layout").then((module) => ({ default: module.PublicLayout })));

const AdminBoardPage = lazy(() => import("@/pages/admin/admin-board-page").then((module) => ({ default: module.AdminBoardPage })));
const AdminCollaborationsPage = lazy(() =>
  import("@/pages/admin/admin-collaborations-page").then((module) => ({ default: module.AdminCollaborationsPage })),
);
const AdminDashboardPage = lazy(() =>
  import("@/pages/admin/admin-dashboard-page").then((module) => ({ default: module.AdminDashboardPage })),
);
const AdminInquiriesPage = lazy(() =>
  import("@/pages/admin/admin-inquiries-page").then((module) => ({ default: module.AdminInquiriesPage })),
);
const AdminLoginPage = lazy(() => import("@/pages/admin/admin-login-page").then((module) => ({ default: module.AdminLoginPage })));
const AdminPricingPage = lazy(() => import("@/pages/admin/admin-pricing-page").then((module) => ({ default: module.AdminPricingPage })));
const AdminProjectsPage = lazy(() => import("@/pages/admin/admin-projects-page").then((module) => ({ default: module.AdminProjectsPage })));
const AdminServicesPage = lazy(() => import("@/pages/admin/admin-services-page").then((module) => ({ default: module.AdminServicesPage })));
const AdminSettingsPage = lazy(() => import("@/pages/admin/admin-settings-page").then((module) => ({ default: module.AdminSettingsPage })));
const AdminTeamPage = lazy(() => import("@/pages/admin/admin-team-page").then((module) => ({ default: module.AdminTeamPage })));
const AdminTestimonialsPage = lazy(() =>
  import("@/pages/admin/admin-testimonials-page").then((module) => ({ default: module.AdminTestimonialsPage })),
);
const AdminUsersPage = lazy(() => import("@/pages/admin/admin-users-page").then((module) => ({ default: module.AdminUsersPage })));
const AboutPage = lazy(() => import("@/pages/public/about-page").then((module) => ({ default: module.AboutPage })));
const ContactPage = lazy(() => import("@/pages/public/contact-page").then((module) => ({ default: module.ContactPage })));
const HomePage = lazy(() => import("@/pages/public/home-page").then((module) => ({ default: module.HomePage })));
const PricingPage = lazy(() => import("@/pages/public/pricing-page").then((module) => ({ default: module.PricingPage })));
const PrivacyPage = lazy(() => import("@/pages/public/privacy-page").then((module) => ({ default: module.PrivacyPage })));
const ProjectDetailPage = lazy(() =>
  import("@/pages/public/project-detail-page").then((module) => ({ default: module.ProjectDetailPage })),
);
const ProjectsPage = lazy(() => import("@/pages/public/projects-page").then((module) => ({ default: module.ProjectsPage })));
const ServicesPage = lazy(() => import("@/pages/public/services-page").then((module) => ({ default: module.ServicesPage })));
const TeamPage = lazy(() => import("@/pages/public/team-page").then((module) => ({ default: module.TeamPage })));
const NotFoundPage = lazy(() => import("@/pages/not-found-page").then((module) => ({ default: module.NotFoundPage })));

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingState label="Loading page..." />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<TeamPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="dashboard" element={<Navigate to="/admin" replace />} />
              <Route path="settings" element={<AdminSettingsPage />} />
              <Route path="services" element={<AdminServicesPage />} />
              <Route path="projects" element={<AdminProjectsPage />} />
              <Route path="team" element={<AdminTeamPage />} />
              <Route path="board" element={<AdminBoardPage />} />
              <Route path="collaborations" element={<AdminCollaborationsPage />} />
              <Route path="pricing" element={<AdminPricingPage />} />
              <Route path="testimonials" element={<AdminTestimonialsPage />} />
              <Route path="inquiries" element={<AdminInquiriesPage />} />
              <Route element={<ProtectedRoute roles={["ADMIN"]} />}>
                <Route path="users" element={<AdminUsersPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
