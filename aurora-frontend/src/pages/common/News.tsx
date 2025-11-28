import VideoHero from "@/components/custom/VideoHero";

export default function NewsPage() {
  const news = [
    {
      id: 1,
      title: 'Aurora Hotel nhận giải thưởng "Khách sạn tốt nhất 2024"',
      excerpt: 'Chúng tôi vinh dự nhận giải thưởng danh giá từ Hiệp hội Du lịch Quốc tế...',
      date: '15/10/2024',
      category: 'Thành tích'
    },
    {
      id: 2,
      title: 'Khai trương Spa mới với công nghệ hiện đại nhất',
      excerpt: 'Spa Aurora với thiết bị và liệu trình chăm sóc đẳng cấp thế giới...',
      date: '10/10/2024',
      category: 'Dịch vụ mới'
    },
    {
      id: 3,
      title: 'Chương trình ưu đãi mùa lễ hội cuối năm',
      excerpt: 'Giảm giá lên đến 30% cho các gói lưu trú dài ngày trong tháng 12...',
      date: '5/10/2024',
      category: 'Khuyến mãi'
    },
    {
      id: 4,
      title: 'Aurora Hotel mở rộng với tòa nhà mới',
      excerpt: 'Dự án mở rộng 200 phòng mới dự kiến hoàn thành vào quý 2/2025...',
      date: '1/10/2024',
      category: 'Phát triển'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <VideoHero 
        title="Tin tức"
        subtitle="Cập nhật những thông tin mới nhất từ Aurora Hotel"
      />

      {/* News List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {news.map((article) => (
              <div key={article.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <span className="text-sm text-gray-500">{article.date}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Đọc thêm →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
