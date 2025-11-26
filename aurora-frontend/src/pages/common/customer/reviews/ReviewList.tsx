import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Search, Filter, User, Calendar, ThumbsUp, MessageCircle, Edit, Trash2 } from "lucide-react";

export default function ReviewListPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  // Mock data
  useEffect(() => {
    const mockReviews = [
      {
        id: 1,
        guestName: "Nguyễn Văn A",
        roomNumber: "305",
        roomType: "Phòng Deluxe",
        rating: 5,
        title: "Trải nghiệm tuyệt vời!",
        comment: "Khách sạn rất sạch sẽ, nhân viên thân thiện. Vị trí đẹp, view nhìn ra biển tuyệt vời. Tôi sẽ quay lại!",
        date: "2025-10-20",
        likes: 12,
        replies: 2,
        status: "published"
      },
      {
        id: 2,
        guestName: "Trần Thị B",
        roomNumber: "512",
        roomType: "Phòng Suite",
        rating: 4,
        title: "Tốt nhưng có thể cải thiện",
        comment: "Phòng rộng rãi, tiện nghi đầy đủ. Tuy nhiên wifi hơi yếu. Nhìn chung vẫn hài lòng với dịch vụ.",
        date: "2025-10-18",
        likes: 8,
        replies: 1,
        status: "published"
      },
      {
        id: 3,
        guestName: "Lê Văn C",
        roomNumber: "208",
        roomType: "Phòng Tiêu Chuẩn",
        rating: 5,
        title: "Đáng đồng tiền bát gạo",
        comment: "Giá cả hợp lý, chất lượng dịch vụ tốt. Bữa sáng ngon, đa dạng món ăn. Nhân viên nhiệt tình.",
        date: "2025-10-15",
        likes: 15,
        replies: 1,
        status: "published"
      },
      {
        id: 4,
        guestName: "Phạm Thị D",
        roomNumber: "701",
        roomType: "Phòng Tổng Thống",
        rating: 3,
        title: "Bình thường",
        comment: "Phòng ổn nhưng không đặc biệt. Dịch vụ chậm một chút. Có thể cải thiện hơn nữa.",
        date: "2025-10-12",
        likes: 3,
        replies: 0,
        status: "pending"
      },
      {
        id: 5,
        guestName: "Đỗ Quang E",
        roomNumber: "410",
        roomType: "Phòng Deluxe",
        rating: 5,
        title: "Hoàn hảo cho kỳ nghỉ",
        comment: "Mọi thứ đều hoàn hảo! Từ check-in đến check-out đều suôn sẻ. Hồ bơi đẹp, phòng gym hiện đại.",
        date: "2025-10-10",
        likes: 20,
        replies: 3,
        status: "published"
      }
    ];
    setReviews(mockReviews);
    setFilteredReviews(mockReviews);
  }, []);

  useEffect(() => {
    let filtered = reviews;

    if (ratingFilter !== "all") {
      filtered = filtered.filter(rev => rev.rating === parseInt(ratingFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(rev =>
        rev.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rev.roomNumber.includes(searchTerm)
      );
    }

    setFilteredReviews(filtered);
  }, [searchTerm, ratingFilter, reviews]);

    const getAverageRating = (): number => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, rev) => acc + rev.rating, 0);
    return sum / reviews.length;
  };

  const getRatingCount = (rating: number) => {
    return reviews.filter(rev => rev.rating === rating).length;
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      setReviews(reviews.filter(rev => rev.id !== id));
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-400 overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <motion.div 
          className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <Star className="w-16 h-16 mb-4 fill-yellow-300 text-yellow-300" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Đánh Giá Khách Hàng</h1>
          <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
            Ý kiến quý báu từ khách hàng
          </p>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-24">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats & Filter Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          {/* Overall Rating */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl">
               <div className="text-5xl font-bold text-yellow-600 mb-2">{getAverageRating().toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(getAverageRating()))}
              </div>
              <p className="text-gray-600">Đánh giá trung bình</p>
              <p className="text-sm text-gray-500 mt-1">{reviews.length} đánh giá</p>
            </div>

            <div className="md:col-span-2 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700 w-12">{rating} sao</span>
                  <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all"
                      style={{
                        width: `${reviews.length > 0 ? (getRatingCount(rating) / reviews.length) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{getRatingCount(rating)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Search & Filter */}
          <div className="grid md:grid-cols-2 gap-4 pt-6 border-t">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo tên, nội dung đánh giá..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Tất cả đánh giá</option>
                <option value="5">5 sao</option>
                <option value="4">4 sao</option>
                <option value="3">3 sao</option>
                <option value="2">2 sao</option>
                <option value="1">1 sao</option>
              </select>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reviews List */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid gap-6">
          {filteredReviews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Không tìm thấy đánh giá nào</p>
            </motion.div>
          ) : (
            filteredReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{review.guestName}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                          <span>Phòng {review.roomNumber} - {review.roomType}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {review.date}
                          </span>
                        </div>
                        {renderStars(review.rating)}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      {review.status === "pending" && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-semibold rounded-full">
                          Chờ duyệt
                        </span>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="ml-16">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{review.title}</h4>
                    <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

                    {/* Actions */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.likes} Hữu ích</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>{review.replies} Phản hồi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}