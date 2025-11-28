interface VideoHeroProps {
  title: string;
  subtitle?: string;
  videoSrc?: string;
  overlayOpacity?: number;
  className?: string;
}

const defaultVideoSrc = "/src/assets/videos/aurora_hotel_2025-11-28_v1.mp4";

/**
 * Hero section component with video background
 * Dùng cho các trang cần hero section với video background
 */
export default function VideoHero({
  title,
  subtitle,
  videoSrc = defaultVideoSrc,
  overlayOpacity = 0.3,
  className = "",
}: VideoHeroProps) {
  return (
    <section className={`relative h-96 ${className}`}>
      <div className="absolute inset-0 z-0">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        />
      </div>
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          {subtitle && <p className="text-xl opacity-90">{subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

