import { Navigation } from "lucide-react";

type AppHeaderProps = {
  onHomeClick?: () => void;
};

export function AppHeader({ onHomeClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/20 backdrop-blur-md">
      <div className="flex h-12 items-center px-6">
        <button
          type="button"
          onClick={onHomeClick}
          className="flex items-center gap-2 rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
          aria-label="Go to first step"
        >
          <Navigation className="size-5 text-black" strokeWidth={2.25} aria-hidden />
          <span className="text-lg font-bold text-black">Waypoint</span>
        </button>
      </div>
    </header>
  );
}
