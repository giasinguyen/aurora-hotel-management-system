import VideoHero from "@/components/custom/VideoHero";

export default function ServicePage() {

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
            {/*  */}
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
            {/*  */}
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
          
        </div>
      </section>
    </div>
  );
}
