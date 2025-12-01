import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, User, Phone, Mail, CheckCircle, AlertCircle, Search, Filter, Clock, Home, Wrench } from "lucide-react";

export default function IssueReportListPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [filteredReports, setFilteredReports] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Mock data
  useEffect(() => {
    const mockReports = [
      {
        id: 1,
        reportCode: "ISS001",
        guestName: "Trần Văn Minh",
        roomNumber: "305",
        issueType: "Điện nước",
        issueTitle: "Máy lạnh không hoạt động",
        issueDescription: "Máy lạnh trong phòng không lạnh, có tiếng kêu lạ",
        priority: "high",
        phone: "0912345678",
        email: "tranvanminh@email.com",
        reportDate: "2025-10-25 08:30",
        status: "pending"
      },
      {
        id: 2,
        reportCode: "ISS002",
        guestName: "Nguyễn Thị Lan",
        roomNumber: "512",
        issueType: "Vệ sinh",
        issueTitle: "Phòng tắm bị tắc",
        issueDescription: "Bồn cầu bị tắc, nước không thoát",
        priority: "urgent",
        phone: "0987654321",
        email: "nguyenlan@email.com",
        reportDate: "2025-10-25 10:15",
        status: "processing"
      },
      {
        id: 3,
        reportCode: "ISS003",
        guestName: "Lê Hoàng Nam",
        roomNumber: "208",
        issueType: "Tiện nghi",
        issueTitle: "TV không bật được",
        issueDescription: "TV trong phòng không hoạt động, remote hỏng",
        priority: "medium",
        phone: "0901234567",
        email: "lehoangnam@email.com",
        reportDate: "2025-10-24 16:45",
        status: "resolved"
      },
      {
        id: 4,
        reportCode: "ISS004",
        guestName: "Phạm Thu Hà",
        roomNumber: "701",
        issueType: "An ninh",
        issueTitle: "Khóa cửa bị hỏng",
        issueDescription: "Khóa cửa phòng không đóng được, cần thay thế",
        priority: "urgent",
        phone: "0923456789",
        email: "phamthuha@email.com",
        reportDate: "2025-10-25 14:20",
        status: "pending"
      },
      {
        id: 5,
        reportCode: "ISS005",
        guestName: "Đỗ Quang Huy",
        roomNumber: "410",
        issueType: "Tiện nghi",
        issueTitle: "Thiếu khăn tắm",
        issueDescription: "Phòng không có đủ khăn tắm như yêu cầu",
        priority: "low",
        phone: "0945678123",
        email: "doquanghuy@email.com",
        reportDate: "2025-10-24 09:00",
        status: "resolved"
      }
    ];
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  useEffect(() => {
    let filtered = reports;

    if (statusFilter !== "all") {
      filtered = filtered.filter(rep => rep.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(rep => rep.priority === priorityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(rep =>
        rep.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.reportCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rep.roomNumber.includes(searchTerm) ||
        rep.issueTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReports(filtered);
  }, [searchTerm, statusFilter, priorityFilter, reports]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing": return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved": return "bg-green-100 text-green-800 border-green-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <AlertCircle className="w-5 h-5" />;
      case "processing": return <Clock className="w-5 h-5" />;
      case "resolved": return <CheckCircle className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ xử lý";
      case "processing": return "Đang xử lý";
      case "resolved": return "Đã giải quyết";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500 text-white";
      case "high": return "bg-orange-500 text-white";
      case "medium": return "bg-yellow-500 text-white";
      case "low": return "bg-green-500 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "urgent": return "Khẩn cấp";
      case "high": return "Cao";
      case "medium": return "Trung bình";
      case "low": return "Thấp";
      default: return priority;
    }
  };

  const handleProcess = (id: number) => {
    setReports(reports.map(rep =>
      rep.id === id ? { ...rep, status: "processing" } : rep
    ));
  };

  const handleResolve = (id: number) => {
    setReports(reports.map(rep =>
      rep.id === id ? { ...rep, status: "resolved" } : rep
    ));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-80 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 overflow-hidden">
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
            <AlertTriangle className="w-16 h-16 mb-4" />
          </motion.div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-center">Báo Cáo Sự Cố</h1>
          <p className="text-xl md:text-2xl text-white/90 text-center max-w-2xl">
            Quản lý các vấn đề từ khách hàng
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
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm theo tên, mã, số phòng, sự cố..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
              </select>
            </div>

            <div className="relative">
              <AlertTriangle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none appearance-none bg-white"
              >
                <option value="all">Tất cả mức độ</option>
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Cao</option>
                <option value="medium">Trung bình</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">Chờ xử lý</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <p className="text-2xl font-bold text-blue-600">
                {reports.filter(r => r.status === 'processing').length}
              </p>
              <p className="text-sm text-gray-600">Đang xử lý</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
              <p className="text-sm text-gray-600">Đã giải quyết</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <p className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.priority === 'urgent').length}
              </p>
              <p className="text-sm text-gray-600">Khẩn cấp</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Reports List */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid gap-6">
          {filteredReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Không tìm thấy báo cáo nào</p>
            </motion.div>
          ) : (
            filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all overflow-hidden border-2 border-gray-100"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-gray-900">{report.guestName}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(report.priority)}`}>
                              {getPriorityText(report.priority)}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {report.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {report.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl border-2 flex items-center gap-2 ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="font-semibold">{getStatusText(report.status)}</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mã báo cáo</p>
                      <p className="font-bold text-orange-600">{report.reportCode}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phòng</p>
                      <p className="font-bold flex items-center gap-1">
                        <Home className="w-4 h-4" />
                        {report.roomNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Loại sự cố</p>
                      <p className="font-bold">{report.issueType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Thời gian báo cáo</p>
                      <p className="font-bold text-sm">{report.reportDate}</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-orange-50 rounded-xl">
                    <h4 className="font-bold text-gray-900 mb-2">{report.issueTitle}</h4>
                    <p className="text-gray-700">{report.issueDescription}</p>
                  </div>

                  {report.status !== 'resolved' && (
                    <div className="flex gap-3 mt-6">
                      {report.status === 'pending' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleProcess(report.id)}
                          className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
                        >
                          <Wrench className="w-5 h-5" />
                          Bắt đầu xử lý
                        </motion.button>
                      )}
                      {report.status === 'processing' && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleResolve(report.id)}
                          className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-5 h-5" />
                          Đánh dấu hoàn thành
                        </motion.button>
                      )}
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