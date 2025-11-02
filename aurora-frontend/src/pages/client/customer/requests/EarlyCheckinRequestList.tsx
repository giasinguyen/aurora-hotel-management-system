import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Calendar, User, Phone, Mail, CheckCircle, XCircle, AlertCircle, Search, Filter, Sunrise } from "lucide-react";

export default function EarlyCheckinRequestListPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        bookingCode: "ECH7X9K2L",
        guestName: "Hoàng Minh Tuấn",
        roomNumber: "402",
        roomType: "Phòng Deluxe",
        checkInDate: "2025-10-26",
        originalCheckin: "14:00",
        requestedCheckin: "10:00",
        reason: "Chuyến bay đến sớm, muốn nghỉ ngơi ngay",
        phone: "0918765432",
        email: "hoangtuan@email.com",
        requestDate: "2025-10-25",
        status: "pending"
      },
      {
        id: 2,
        bookingCode: "ECH3M5P8Q",
        guestName: "Đỗ Thu Hà",
        roomNumber: "615",
        roomType: "Phòng Suite",
        checkInDate: "2025-10-27",
        originalCheckin: "14:00",
        requestedCheckin: "09:00",
        reason: "Có họp quan trọng buổi sáng",
        phone: "0976543210",
        email: "dothuha@email.com",
        requestDate: "2025-10-24",
        status: "approved"
      },
      {
        id: 3,
        bookingCode: "ECH1K7N4M",
        guestName: "Vũ Đức Anh",
        roomNumber: "309",
        roomType: "Phòng Tiêu Chuẩn",
        checkInDate: "2025-10-26",
        originalCheckin: "14:00",
        requestedCheckin: "08:00",
        reason: "Tham gia sự kiện từ sáng sớm",
        phone: "0965432109",
        email: "vuducanh@email.com",
        requestDate: "2025-10-23",
        status: "rejected"
      },
      {
        id: 4,
        bookingCode: "ECH9P2T6R",
        guestName: "Mai Thanh Bình",
        roomNumber: "801",
        roomType: "Phòng Tổng Thống",
        checkInDate: "2025-10-28",
        originalCheckin: "14:00",
        requestedCheckin: "11:00",
        reason: "Khách VIP, yêu cầu đặc biệt",
        phone: "0932165487",
        email: "maibinhvip@email.com",
        requestDate: "2025-10-25",
        status: "pending"
      },
      {
        id: 5,
        bookingCode: "ECH5L8M3N",
        guestName: "Phạm Quốc Huy",
        roomNumber: "210",
        roomType: "Phòng Deluxe",
        checkInDate: "2025-10-27",
        originalCheckin: "14:00",
        requestedCheckin: "12:00",
        reason: "Có trẻ nhỏ cần nghỉ ngơi sớm",
        phone: "0945678123",
        email: "phamhuy@email.com",
        requestDate: "2025-10-25",
        status: "pending"
      }
    ];
    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, []);

  useEffect(() => {
    let filtered = requests;

    if (statusFilter !== "all") {
      filtered = filtered.filter(req => req.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(req =>
        req.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.roomNumber.includes(searchTerm)
      );
    }

    setFilteredRequests(filtered);
  }, [searchTerm, statusFilter, requests]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "approved": return "bg-green-100 text-green-800 border-green-300";
      case "rejected": return "bg-red-100 text-red-800 border-red-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-5 h-5" />;
      case "approved": return <CheckCircle className="w-5 h-5" />;
      case "rejected": return <XCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ duyệt";
      case "approved": return "Đã duyệt";
      case "rejected": return "Đã từ chối";
      default: return status;
    }
  };

  const handleApprove = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: "approved" } : req
    ));
  };

  const handleReject = (id: number) => {
    setRequests(requests.map(req =>
      req.id === id ? { ...req, status: "rejected" } : req
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-400 overflow-hidden">
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
            <Sunrise className="w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Yêu Cầu Nhận Phòng Sớm</h1>
          <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
            Quản lý các yêu cầu check-in sớm
          </p>
        </motion.div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-24">
            <path fill="#ffffff" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã booking, số phòng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã duyệt</option>
                <option value="rejected">Đã từ chối</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-2xl font-bold text-yellow-600">
                {requests.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Chờ duyệt</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {requests.filter(r => r.status === 'approved').length}
              </p>
              <p className="text-sm text-gray-600">Đã duyệt</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">
                {requests.filter(r => r.status === 'rejected').length}
              </p>
              <p className="text-sm text-gray-600">Đã từ chối</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Requests List */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid gap-6">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Không tìm thấy yêu cầu nào</p>
            </motion.div>
          ) : (
            filteredRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{request.guestName}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {request.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {request.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="font-semibold">{getStatusText(request.status)}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mã booking</p>
                      <p className="font-bold text-purple-600">{request.bookingCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phòng</p>
                      <p className="font-bold">{request.roomNumber} - {request.roomType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Ngày nhận phòng</p>
                      <p className="font-bold">{request.checkInDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Thời gian yêu cầu</p>
                      <p className="font-bold text-orange-600">{request.requestedCheckin} ← {request.originalCheckin}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Lý do:</p>
                    <p className="text-gray-800">{request.reason}</p>
                  </div>

                  {request.status === 'pending' && (
                    <div className="flex gap-3 mt-6">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleApprove(request.id)}
                        className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Chấp nhận
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleReject(request.id)}
                        className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Từ chối
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}