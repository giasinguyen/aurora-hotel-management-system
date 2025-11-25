export default function GalleryPage() {
  const galleries = [
    { category: 'Phòng nghỉ', images: ['🛏️', '🏨', '🛋️', '🚿', '🪟', '📺'] },
    { category: 'Nhà hàng', images: ['🍽️', '🥂', '🍾', '👨‍🍳', '🍰', '☕'] },
    { category: 'Tiện ích', images: ['🏊‍♂️', '🧘‍♀️', '💆‍♀️', '🏋️‍♂️', '🎪', '🎈'] },
    { category: 'Không gian chung', images: ['🏛️', '🌸', '🌴', '⛲', '🚗', '🎭'] }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Thư viện ảnh</h1>
          <p className="text-xl opacity-90">Khám phá vẻ đẹp của Aurora Hotel</p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {galleries.map((gallery, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{gallery.category}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {gallery.images.map((image, imgIndex) => (
                  <div 
                    key={imgIndex} 
                    className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    <span className="text-4xl">{image}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
