import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { useTranslation } from "react-i18next";

export default function HomePage() {
  const { t } = useTranslation("home");

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video */}
      <section className="relative h-screen w-full">
        <div className="relative h-full w-full">
          <video
            src="/src/assets/videos/aurora_hotel_2025-11-28_v1.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("about.title")}
              </h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>
              <h3 className="text-2xl md:text-3xl text-gray-700 mb-6 font-light italic">
                {t("about.subtitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t("about.description1")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("about.description2")}
              </p>
              <button className="mt-8 px-8 py-3 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition-all">
                {t("about.learnMore")}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <img
                  src="/src/assets/images/banners/aurora-banner-02.jpg"
                  alt="Hotel Room"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="mt-8">
                <img
                  src="/src/assets/images/banners/aurora-banner-03.jpg"
                  alt="Hotel View"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div className="-mt-8">
                <img
                  src="/src/assets/images/banners/aurora-banner-04.jpg"
                  alt="Hotel Amenity"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
              <div>
                <img
                  src="/src/assets/images/banners/aurora-banner-05.jpg"
                  alt="Hotel Service"
                  className="w-full h-64 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("services.title")}
            </h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm">
              <div className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                <img
                  src="/src/assets/images/rooms/aurora-persident-room.jpg"
                  alt="Luxury Rooms"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.luxuryRooms.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.luxuryRooms.description")}
              </p>
            </div>

            <div className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm">
              <div className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                <img
                  src="/src/assets/images/food/aurora-food-01.jpg"
                  alt="Fine Dining"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.fineDining.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.fineDining.description")}
              </p>
            </div>

            <div className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm">
              <div className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg">
                <img
                  src="/src/assets/images/spa/aurora-spa.jpg"
                  alt="Wellness & Spa"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.wellness.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.wellness.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Container Scroll Section */}
      <div className="flex flex-col overflow-hidden bg-white/95 backdrop-blur-sm">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-semibold text-black dark:text-white">
                {t("luxuryExperience.title1")} <br />
                <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-primary">
                  {t("luxuryExperience.title2")}
                </span>
              </h1>
            </>
          }
        >
          <img
            src="/src/assets/images/rooms/aurora-persident-room.jpg"
            alt="Aurora Beach Hotel Luxury Experience"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-center shadow-2xl"
            draggable={false}
          />
        </ContainerScroll>
      </div>
    </div>
  );
}
