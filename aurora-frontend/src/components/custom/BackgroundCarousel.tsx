import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

interface BackgroundCarouselProps {
  images?: string[];
  autoplayDelay?: number;
  overlayOpacity?: number;
}

const defaultImages = [
  "/src/assets/images/banners/aurora-banner-01.jpg",
  "/src/assets/images/banners/aurora-banner-02.jpg",
  "/src/assets/images/banners/aurora-banner-03.jpg",
  "/src/assets/images/banners/aurora-banner-04.jpg",
  "/src/assets/images/banners/aurora-banner-05.jpg",
];

export default function BackgroundCarousel({
  images = defaultImages,
  autoplayDelay = 4000,
  overlayOpacity = 0.4,
}: BackgroundCarouselProps) {
  const autoplayPlugin = useRef(
    Autoplay({ delay: autoplayDelay, stopOnInteraction: false })
  );

  return (
    <div className="absolute inset-0 z-0">
      <Carousel
        opts={{
          loop: true,
          duration: 30,
        }}
        plugins={[Fade(), autoplayPlugin.current]}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {images.map((image, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <img
                  src={image}
                  alt={`Background ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Dark overlay for better readability */}
                <div 
                  className="absolute inset-0 bg-black"
                  style={{ opacity: overlayOpacity }}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

