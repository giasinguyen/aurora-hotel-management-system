import { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if all images are loaded
    const checkImagesLoaded = () => {
      const images = document.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        // No images, just wait for window load
        if (document.readyState === 'complete') {
          setTimeout(() => setIsLoading(false), 500);
        } else {
          window.addEventListener('load', () => {
            setTimeout(() => setIsLoading(false), 500);
          });
        }
        return;
      }

      const imageLoadHandler = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          // All images loaded, wait a bit more for rendering
          setTimeout(() => setIsLoading(false), 500);
        }
      };

      images.forEach((img) => {
        if ((img as HTMLImageElement).complete) {
          loadedCount++;
        } else {
          img.addEventListener('load', imageLoadHandler);
          img.addEventListener('error', imageLoadHandler); // Count errors as loaded too
        }
      });

      // If all images are already loaded
      if (loadedCount === totalImages) {
        setTimeout(() => setIsLoading(false), 500);
      }

      // Fallback: also listen to window load event
      const windowLoadHandler = () => {
        setTimeout(() => setIsLoading(false), 500);
      };

      if (document.readyState === 'complete') {
        windowLoadHandler();
      } else {
        window.addEventListener('load', windowLoadHandler);
      }

      // Cleanup
      return () => {
        images.forEach((img) => {
          img.removeEventListener('load', imageLoadHandler);
          img.removeEventListener('error', imageLoadHandler);
        });
        window.removeEventListener('load', windowLoadHandler);
      };
    };

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      checkImagesLoaded();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="w-32 h-32 flex items-center justify-center">
          <img
            src="/src/assets/images/commons/aurora-logo.png"
            alt="Aurora Hotel"
            className="h-full w-auto object-contain"
          />
        </div>
        
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
}

