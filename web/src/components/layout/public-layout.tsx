import { Outlet, useLocation } from "react-router-dom";
import { BackToTop } from "@/components/shared/back-to-top";
import { MobileQuickActions } from "@/components/shared/mobile-quick-actions";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

export function PublicLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <PublicHeader />
      <main key={location.pathname} className="page-enter bg-grid-soft pb-24 md:pb-16">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileQuickActions />
      <BackToTop />
    </div>
  );
}
