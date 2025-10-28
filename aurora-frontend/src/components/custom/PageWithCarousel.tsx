import { type ReactNode } from "react";
import BackgroundCarousel from "./BackgroundCarousel";

interface PageWithCarouselProps {
  children: ReactNode;
  images?: string[];
  autoplayDelay?: number;
  overlayOpacity?: number;
  className?: string;
}

/**
 * Layout component with carousel background
 * Có thể dùng cho auth pages, landing pages, hoặc bất kỳ trang nào cần background động
 */
export default function PageWithCarousel({
  children,
  images,
  autoplayDelay = 4000,
  overlayOpacity = 0.4,
  className = "",
}: PageWithCarouselProps) {
  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Background Carousel */}
      <BackgroundCarousel
        images={images}
        autoplayDelay={autoplayDelay}
        overlayOpacity={overlayOpacity}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center pt-32 pb-12 px-4">
        {children}
      </div>
    </div>
  );
}

