import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-600 mb-4">Không tìm thấy trang</h2>
          <p className="text-gray-500 mb-8">
            Trang bạn tìm kiếm có thể đã bị di chuyển, xóa hoặc tạm thời không khả dụng.
          </p>
        </div>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}