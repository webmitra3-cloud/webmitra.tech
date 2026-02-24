import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > 320);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={cn(
        "fixed bottom-20 right-4 z-40 h-10 w-10 rounded-full border border-border bg-primary text-primary-foreground shadow-glass transition-all hover:brightness-110 md:bottom-5 md:right-5",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
      aria-label="Back to top"
    >
      <span className="inline-flex h-full w-full items-center justify-center">
        <ArrowUp className="h-4 w-4" />
      </span>
    </button>
  );
}
