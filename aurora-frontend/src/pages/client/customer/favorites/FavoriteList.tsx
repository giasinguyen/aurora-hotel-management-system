import { motion, useInView } from "framer-motion";
import { useRef, useState, type ChangeEvent } from "react";
import { Heart, Star, MapPin, Users, Bed, DollarSign, Trash2, Eye, Search } from "lucide-react";



interface FavoriteRoom {
  id: number;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  price: number;
  bedType: string;
  maxGuests: number;
  description: string;
}

const favoriteRooms: FavoriteRoom[] = [
  {
    id: 1,
    name: "Phòng Deluxe Ocean View",
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 124,
    location: "Vũng Tàu, Việt Nam",
    price: 1500000,
    bedType: "King Bed",
    maxGuests: 2,
    description: "Phòng sang trọng với view biển tuyệt đẹp"
  },
  {
    id: 2,
    name: "Phòng Suite Presidential",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    rating: 5.0,
    reviews: 89,
    location: "Phú Quốc, Việt Nam",
    price: 2500000,
    bedType: "2 King Beds",
    maxGuests: 4,
    description: "Suite cao cấp nhất với đầy đủ tiện nghi"
  },
  {
    id: 3,
    name: "Phòng Garden Villa",
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 156,
    location: "Đà Lạt, Việt Nam",
    price: 1800000,
    bedType: "Queen Bed",
    maxGuests: 2,
    description: "Villa riêng tư giữa vườn xanh mát"
  },
  {
    id: 4,
    name: "Phòng Beach Front",
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 203,
    location: "Nha Trang, Việt Nam",
    price: 2000000,
    bedType: "King Bed",
    maxGuests: 3,
    description: "Phòng mặt biển với ban công rộng"
  }
];

export default function FavoriteListPage() {
  const [favorites, setFavorites] = useState<FavoriteRoom[]>(favoriteRooms);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const listInView = useInView(listRef, { once: true, margin: "-50px" });

  // Gõ rõ kiểu cho id
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((room) => room.id !== id));
  };

  const filteredFavorites = favorites.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-4"
            >
              <Heart className="w-10 h-10 fill-white" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Phòng Yêu Thích</h1>
            <p className="text-green-50 text-lg">
              {favorites.length} phòng trong danh sách của bạn
            </p>
          </motion.div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm phòng yêu thích..."
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-green-500 transition-all"
            />
          </div>
        </motion.div>
      </div>

      {/* Favorites Grid */}
      <div ref={listRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {filteredFavorites.length > 0 ? (
          <motion.div
            initial="hidden"
            animate={listInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredFavorites.map((room) => (
              <motion.div
                key={room.id}
                variants={cardVariants}
                whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Heart Button */}
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => removeFavorite(room.id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all group"
                  >
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </motion.button>

                  {/* Rating Badge */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">{room.rating}</span>
                    <span className="text-gray-600 text-sm">({room.reviews})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                    {room.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-sm">{room.location}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Room Details */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Bed className="w-4 h-4 text-green-500" />
                      <span>{room.bedType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4 text-green-500" />
                      <span>{room.maxGuests} khách</span>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-600">Từ</p>
                      <p className="text-xl font-bold text-green-600">
                        {room.price.toLocaleString('vi-VN')} VNĐ
                      </p>
                      <p className="text-xs text-gray-500">/ đêm</p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFavorite(room.id)}
                        className="bg-red-50 text-red-600 p-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-all flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        Xem
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-12 h-12 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchTerm ? "Không tìm thấy kết quả" : "Chưa có phòng yêu thích"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Thử thay đổi từ khóa tìm kiếm"
                : "Hãy thêm các phòng bạn yêu thích để dễ dàng theo dõi"}
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(34, 197, 94, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-600 transition-all"
            >
              Khám Phá Phòng
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Tips Section */}
      {favorites.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-xl p-8 text-white"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-full">
                <Heart className="w-12 h-12" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold mb-2">Mẹo Hay Cho Bạn!</h3>
                <p className="text-green-50">
                  Đặt phòng sớm từ danh sách yêu thích để nhận được ưu đãi tốt nhất và đảm bảo phòng trống.
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:bg-green-50 transition-all"
              >
                Đặt Ngay
              </motion.button>
            </div>
          </motion.div>
        </div>

      )}

    </div>
  );
}
