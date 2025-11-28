import VideoHero from "@/components/custom/VideoHero";

export default function ServicePage() {
  const services = [
    {
      id: 1,
      name: 'Spa & Wellness',
      icon: '🧘‍♀️',
      description: 'Thư giãn và chăm sóc sức khỏe với các liệu trình spa chuyên nghiệp',
      features: ['Massage trị liệu', 'Chăm sóc da mặt', 'Yoga & Meditation', 'Sauna & Steam'],
      price: 'Từ 800.000đ',
      hours: '6:00 - 22:00'
    },
    {
      id: 2,
      name: 'Nhà hàng & Bar',
      icon: '🍽️',
      description: 'Ẩm thực 5 sao với các món ăn đặc sắc từ khắp nơi trên thế giới',
      features: ['Ẩm thực Á - Âu', 'Buffet sáng tự chọn', 'Room service 24/7', 'Cocktail bar'],
      price: 'Từ 300.000đ',
      hours: '24/7'
    },
    {
      id: 3,
      name: 'Hồ bơi & Gym',
      icon: '🏊‍♂️',
      description: 'Khu vực thể thao và giải trí với hồ bơi ngoài trời và phòng gym hiện đại',
      features: ['Hồ bơi vô cực', 'Phòng gym 24/7', 'Yoga class', 'Personal trainer'],
      price: 'Miễn phí cho khách lưu trú',
      hours: '5:00 - 23:00'
    },
    {
      id: 4,
      name: 'Dịch vụ xe đưa đón',
      icon: '🚗',
      description: 'Dịch vụ đưa đón sân bay và tham quan thành phố',
      features: ['Đưa đón sân bay', 'Tour thành phố', 'Thuê xe tự lái', 'Xe sang VIP'],
      price: 'Từ 200.000đ',
      hours: '24/7'
    },
    {
      id: 5,
      name: 'Hội nghị & Sự kiện',
      icon: '🎪',
      description: 'Tổ chức hội nghị, tiệc cưới và các sự kiện đặc biệt',
      features: ['Phòng hội nghị', 'Tổ chức tiệc cưới', 'Event planning', 'Thiết bị AV'],
      price: 'Liên hệ báo giá',
      hours: 'Theo yêu cầu'
    },
    {
      id: 6,
      name: 'Kids Club',
      icon: '🎈',
      description: 'Khu vui chơi an toàn và thú vị dành cho trẻ em',
      features: ['Khu vui chơi', 'Hoạt động giáo dục', 'Giữ trẻ', 'Game center'],
      price: 'Miễn phí cho khách lưu trú',
      hours: '8:00 - 20:00'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <VideoHero 
        title="Dịch vụ"
        subtitle="Trải nghiệm những dịch vụ đẳng cấp thế giới"
      />

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ của chúng tôi</h2>
            <p className="text-xl text-gray-600">Đáp ứng mọi nhu cầu của bạn trong chuyến lưu trú</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-4 text-center">{service.description}</p>

                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-700">Điểm nổi bật:</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Giá:</span>
                      <span className="font-medium text-blue-600">{service.price}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-4">
                      <span className="text-gray-500">Giờ hoạt động:</span>
                      <span className="font-medium">{service.hours}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Đặt dịch vụ
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Dịch vụ đặc biệt</h2>
            <p className="text-xl text-gray-600">Những trải nghiệm độc đáo chỉ có tại Aurora Hotel</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🛎️</span>
                <div>
                  <h3 className="text-xl font-semibold">Butler Service</h3>
                  <p className="text-gray-600">Dịch vụ quản gia cá nhân 24/7</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Dành riêng cho khách lưu trú tại Suite và Presidential. Quản gia cá nhân sẽ đáp ứng mọi yêu cầu 
                từ đặt bàn ăn, sắp xếp lịch trình cho đến các dịch vụ cá nhân hóa khác.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Tìm hiểu thêm
              </button>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <span className="text-4xl mr-4">🚁</span>
                <div>
                  <h3 className="text-xl font-semibold">Helicopter Transfer</h3>
                  <p className="text-gray-600">Dịch vụ di chuyển bằng trực thăng</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                Trải nghiệm đẳng cấp với dịch vụ di chuyển bằng trực thăng từ sân bay hoặc các điểm tham quan. 
                Ngắm nhìn thành phố từ trên cao trong hành trình tuyệt vời.
              </p>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Đặt lịch bay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cần hỗ trợ?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Đội ngũ dịch vụ khách hàng của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Liên hệ ngay
            </button>
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-medium">
              Chat trực tuyến
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
