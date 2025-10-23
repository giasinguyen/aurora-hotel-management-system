import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import LazyImage from "@/components/custom/LazyImage";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useInView, type Variants } from "framer-motion";

const bannerImages = [
  "src/assets/images/banners/aurora-banner-01.jpg",
  "src/assets/images/banners/aurora-banner-02.jpg",
  "src/assets/images/banners/aurora-banner-03.jpg",
  "src/assets/images/banners/aurora-banner-04.jpg",
  "src/assets/images/banners/aurora-banner-05.jpg",
];

export default function HomePage() {
  const { t } = useTranslation("home");
  const autoplayPlugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false })
  );

  // Refs for intersection observer
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if elements are in view
  const aboutInView = useInView(aboutRef, { once: true, margin: "-100px" });
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Animation variants
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 }
    }
  };

  const fadeInLeft: Variants = {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.8 }
    }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Carousel */}
      <section className="relative h-screen w-full">
        <Carousel
          opts={{
            loop: true,
            duration: 30,
          }}
          plugins={[Fade(), autoplayPlugin.current]}
          className="w-full h-full"
        >
          <CarouselContent className="h-screen">
            {bannerImages.map((image, index) => (
              <CarouselItem key={index} className="h-screen">
                <div className="relative h-full w-full">
                  <img
                    src={image}
                    alt={t("hero.banner") + " " + (index + 1)}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 bg-white/20 border-white text-white hover:bg-white hover:text-primary" />
          <CarouselNext className="right-4 bg-white/20 border-white text-white hover:bg-white hover:text-primary" />
        </Carousel>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <motion.div 
            className="flex flex-col items-center text-white"
            animate={{ 
              y: [0, -15, 0],
            }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
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
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              variants={fadeInLeft}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {t("about.title")}
              </h2>
              <motion.div 
                className="w-16 h-1 bg-primary mb-6"
                initial={{ width: 0 }}
                animate={aboutInView ? { width: 64 } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              ></motion.div>
              <h3 className="text-2xl md:text-3xl text-gray-700 mb-6 font-light italic">
                {t("about.subtitle")}
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t("about.description1")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("about.description2")}
              </p>
              <motion.button 
                className="mt-8 px-8 py-3 bg-primary text-white rounded font-semibold hover:bg-primary/90 transition-all transform hover:scale-105"
                whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
              >
                {t("about.learnMore")}
              </motion.button>
            </motion.div>
            <motion.div 
              className="grid grid-cols-2 gap-4"
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
              variants={staggerContainer}
            >
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src="src/assets/images/banners/aurora-banner-02.jpg"
                  alt="Hotel Room"
                  className="w-full h-64 object-cover"
                  containerClassName="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <LazyImage
                  src="src/assets/images/banners/aurora-banner-03.jpg"
                  alt="Hotel View"
                  className="w-full h-64 object-cover"
                  containerClassName="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.3 }}
                className="-mt-8"
              >
                <LazyImage
                  src="src/assets/images/banners/aurora-banner-04.jpg"
                  alt="Hotel Amenity"
                  className="w-full h-64 object-cover"
                  containerClassName="rounded-lg shadow-lg"
                />
              </motion.div>
              <motion.div
                variants={scaleIn}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src="src/assets/images/banners/aurora-banner-05.jpg"
                  alt="Hotel Service"
                  className="w-full h-64 object-cover"
                  containerClassName="rounded-lg shadow-lg"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 bg-gray-50/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInUp}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t("services.title")}
            </h2>
            <motion.div 
              className="w-16 h-1 bg-primary mx-auto mb-6"
              initial={{ width: 0 }}
              animate={featuresInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("services.subtitle")}
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
          >
            <motion.div 
              className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src="src/assets/images/rooms/aurora-persident-room.jpg"
                  alt="Luxury Rooms"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.luxuryRooms.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.luxuryRooms.description")}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src="src/assets/images/food/aurora-food-01.jpg"
                  alt="Fine Dining"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.fineDining.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.fineDining.description")}
              </p>
            </motion.div>

            <motion.div 
              className="bg-white/95 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow backdrop-blur-sm"
              variants={scaleIn}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <motion.div 
                className="w-full h-48 mx-auto mb-4 overflow-hidden rounded-lg"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <LazyImage
                  src="src/assets/images/spa/aurora-spa.jpg"
                  alt="Wellness & Spa"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <h3 className="text-xl font-semibold mb-3 text-center">
                {t("services.wellness.title")}
              </h3>
              <p className="text-gray-600 text-center">
                {t("services.wellness.description")}
              </p>
            </motion.div>
          </motion.div>
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
            src="src/assets/images/rooms/aurora-persident-room.jpg"
            alt="Aurora Beach Hotel Luxury Experience"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full object-center shadow-2xl"
            draggable={false}
          />
        </ContainerScroll>
      </div>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 bg-gradient-to-r from-primary via-primary to-primary/80 text-white">
        <motion.div 
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t("cta.title")}
          </h2>
          <p className="text-xl mb-8 opacity-90">{t("cta.subtitle")}</p>
          <motion.button 
            className="px-10 py-4 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-all text-lg"
            whileHover={{ 
              scale: 1.1, 
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            {t("cta.button")}
          </motion.button>
        </motion.div>
      </section>
    </div>
  );
}
