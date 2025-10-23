export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Về Aurora Hotel</h1>
          <p className="text-xl opacity-90">Câu chuyện về sự sang trọng và phong cách phục vụ tận tâm</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Câu chuyện của chúng tôi</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Aurora Hotel được thành lập vào năm 2010 với tầm nhìn trở thành khách sạn hàng đầu 
                  tại Việt Nam. Chúng tôi tin rằng mỗi chuyến đi đều là một trải nghiệm đáng nhớ, 
                  và sứ mệnh của chúng tôi là tạo ra những kỷ niệm tuyệt vời cho mỗi vị khách.
                </p>
                <p>
                  Với hơn 14 năm kinh nghiệm trong ngành khách sạn, Aurora Hotel đã phục vụ hàng triệu 
                  khách hàng từ khắp nơi trên thế giới. Chúng tôi tự hào về dịch vụ chuyên nghiệp, 
                  cơ sở vật chất hiện đại và đội ngũ nhân viên tận tâm.
                </p>
                <p>
                  Từ việc chào đón khách đến tận cửa cho đến những dịch vụ cao cấp, chúng tôi luôn 
                  đặt sự hài lòng của khách hàng lên hàng đầu.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-96 rounded-xl flex items-center justify-center">
              <span className="text-8xl">🏨</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
            <p className="text-xl text-gray-600">Những nguyên tắc định hướng hoạt động của chúng tôi</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Chất lượng</h3>
              <p className="text-gray-600">Cam kết cung cấp dịch vụ chất lượng cao nhất</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tận tâm</h3>
              <p className="text-gray-600">Phục vụ khách hàng với tất cả sự tận tâm</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌟</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Đổi mới</h3>
              <p className="text-gray-600">Không ngừng cải tiến và đổi mới dịch vụ</p>
            </div>

            <div className="text-center p-6 bg-white rounded-xl shadow-md">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">Tin cậy</h3>
              <p className="text-gray-600">Xây dựng lòng tin với khách hàng và đối tác</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thành tựu của chúng tôi</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">14+</div>
              <div className="text-gray-600">Năm kinh nghiệm</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">250+</div>
              <div className="text-gray-600">Phòng nghỉ</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Khách hàng hài lòng</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">Đánh giá tích cực</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Đội ngũ lãnh đạo</h2>
            <p className="text-xl text-gray-600">Những người dẫn dắt Aurora Hotel đến thành công</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Nguyễn Văn Minh", position: "Tổng Giám Đốc", avatar: "👨‍💼" },
              { name: "Trần Thị Lan", position: "Giám Đốc Vận Hành", avatar: "👩‍💼" },
              { name: "Lê Hoàng Nam", position: "Giám Đốc Marketing", avatar: "👨‍💻" }
            ].map((member, index) => (
              <div key={index} className="text-center bg-white p-8 rounded-xl shadow-md">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl">{member.avatar}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
                <p className="text-gray-600">{member.position}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
