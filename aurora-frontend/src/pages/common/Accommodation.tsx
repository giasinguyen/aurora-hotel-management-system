import VideoHero from "@/components/custom/VideoHero";

export default function AccommodationPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <VideoHero 
        title="Phòng tiêu biểu"
        subtitle="Khám phá các loại phòng đặc biệt và nổi bật của Aurora Hotel"
      />

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* TODO: Implement accommodation showcase */}
        </div>
      </section>
    </div>
  );
}
