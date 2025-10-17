import { Link } from 'react-router-dom';

export default function ClientFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-lg font-bold">Aurora Hotel</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Khách sạn Aurora - Nơi mang đến những trải nghiệm tuyệt vời nhất cho khách hàng với dịch vụ 5 sao.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C23.004 5.367 17.637.001 12.017.001zM8.449 16.988c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348zm7.718 0c-1.297 0-2.348-1.051-2.348-2.348 0-1.297 1.051-2.348 2.348-2.348 1.297 0 2.348 1.051 2.348 2.348 0 1.297-1.051 2.348-2.348 2.348z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-gray-400 hover:text-white transition-colors text-sm">Trang chủ</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors text-sm">Giới thiệu</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Liên hệ</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Dịch vụ</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-400 text-sm">Spa & Wellness</span></li>
              <li><span className="text-gray-400 text-sm">Nhà hàng</span></li>
              <li><span className="text-gray-400 text-sm">Hồ bơi</span></li>
              <li><span className="text-gray-400 text-sm">Gym & Fitness</span></li>
              <li><span className="text-gray-400 text-sm">Dịch vụ xe đưa đón</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-start space-x-2">
                <span>📍</span>
                <span>123 Đường Lê Lợi, Quận 1, TP.HCM</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <span>(+84) 28 3822 5678</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>✉️</span>
                <span>info@aurorahotel.vn</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>🕐</span>
                <span>24/7 - Phục vụ tận tình</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Aurora Hotel. Tất cả quyền được bảo lưu.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Chính sách bảo mật
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Điều khoản sử dụng
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
