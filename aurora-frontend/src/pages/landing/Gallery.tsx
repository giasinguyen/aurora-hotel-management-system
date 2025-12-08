import { useState, useEffect } from "react";
import VideoHero from "@/components/custom/VideoHero";
import { galleryApi, type GalleryImage } from "@/services/galleryApi";
import { toast } from "sonner";
import { Loader2, ImageIcon, Camera } from "lucide-react";
import { Card } from "@/components/ui/card";
import fallbackImage from "@/assets/images/commons/fallback.png";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const response = await galleryApi.getImages(24);
        if (response.result) {
          console.log("Gallery images fetched:", response.result.length);
          // Filter out images with empty or invalid URLs
          const validImages = response.result.filter((img: GalleryImage) =>
            img.imageUrl && img.imageUrl.trim() !== "" && img.imageUrl !== "null"
          );
          console.log("Valid images:", validImages.length);
          setImages(validImages);
        }
      } catch (error) {
        console.error("Failed to fetch gallery images:", error);
        toast.error("Không thể tải ảnh thư viện");
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const handleImageClick = (image: GalleryImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <VideoHero 
        title="Thư viện ảnh"
        subtitle="Khám phá vẻ đẹp của Aurora Hotel"
      />

      {/* Gallery Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-gray-600">Đang tải ảnh...</p>
            </div>
          ) : images.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-gray-100 rounded-full mb-4">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Chưa có ảnh
                </h3>
                <p className="text-gray-600 max-w-md">
                  Hiện tại chưa có ảnh trong thư viện. Vui lòng quay lại sau.
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* Stats */}
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Thư viện ảnh
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Camera className="h-4 w-4" />
                </div>
              </div>

              {/* Masonry Grid */}
              <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                {images.map((image, index) => (
                  <div
                    key={`${image.sourceId}-${index}`}
                    className="break-inside-avoid mb-4 group cursor-pointer"
                    onClick={() => handleImageClick(image)}
                  >
                    <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-105 bg-gradient-to-br from-gray-100 to-gray-200 min-h-[200px] flex items-center justify-center">
                      {image.imageUrl ? (
                        <img
                          src={image.imageUrl}
                          alt={image.sourceName}
                          className="w-full h-auto object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            console.error('Image load error:', image.imageUrl);
                            if (target.src !== fallbackImage) {
                              target.src = fallbackImage;
                            }
                          }}
                          onLoad={(e) => {
                            const target = e.target as HTMLImageElement;
                            const parent = target.parentElement;
                            if (parent) {
                              parent.classList.remove('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                              parent.classList.add('bg-transparent');
                            }
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center p-8">
                          <ImageIcon className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/30 bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center px-4">
                          <p className="font-semibold text-lg mb-1">
                            {image.sourceName}
                          </p>
                          <p className="text-sm capitalize">
                            {image.sourceType === "ROOM" ? "Phòng nghỉ" : "Dịch vụ"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10 bg-black/30 bg-opacity-50 rounded-full p-2 transition-colors"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage.imageUrl || fallbackImage}
              alt={selectedImage.sourceName}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = fallbackImage;
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 rounded-b-lg">
              <p className="text-white font-semibold text-xl mb-1">
                {selectedImage.sourceName}
              </p>
              <p className="text-gray-300 text-sm capitalize">
                {selectedImage.sourceType === "ROOM" ? "Phòng nghỉ" : "Dịch vụ"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
