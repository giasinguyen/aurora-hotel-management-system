import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User, Eye, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchAllNews, clearCurrentNews } from "@/features/slices/newsSlice";
import LoadingScreen from "@/components/custom/LoadingScreen";

import "@/styles/tiptap-content.scss";
import '@/styles/_variables.scss';
import '@/styles/_keyframe-animations.scss';

export default function NewsPreview() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { allNewsList, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (allNewsList.length === 0) {
      dispatch(fetchAllNews());
    }

    return () => {
      dispatch(clearCurrentNews());
    };
  }, [dispatch, allNewsList.length]);

  const currentNews = allNewsList.find((news) => news.slug === slug);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !currentNews) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Không tìm thấy tin tức
          </h1>
          <p className="text-muted-foreground mb-8">
            Tin tức bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => navigate("/admin/news")}
            className="bg-primary"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Preview Mode Alert */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert className="border-yellow-300 bg-yellow-50">
            <Lock className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">
              Chế độ xem trước
            </AlertTitle>
            <AlertDescription className="text-yellow-700">
              Đây là bản xem trước cho tin tức không công khai. Người dùng thông
              thường không thể xem bài viết này.
            </AlertDescription>
            <Button variant="link" onClick={() => navigate(-1)}>Quay Lại</Button>
          </Alert>
        </div>
      </div>

      {/* Header Image */}
      <div className="relative h-96 w-full overflow-hidden">
        <img
          src={currentNews.thumbnailUrl || "/placeholder-news.jpg"}
          alt={currentNews.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src =
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-card rounded-xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-2 mb-6">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/news")}
              className="-ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>

            {/* Status Badge */}
            <Badge
              variant={
                currentNews.status === "PUBLISHED" ? "default" : "secondary"
              }
              className="ml-2"
            >
              {currentNews.status === "PUBLISHED" ? "Đã xuất bản" : "Nháp"}
            </Badge>

            {/* Public Badge */}
            <Badge variant={currentNews.isPublic ? "default" : "secondary"}>
              {currentNews.isPublic ? "Công khai" : "Riêng tư"}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-foreground mb-6">
            {currentNews.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5" />
              <span>{formatDate(currentNews.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span>{currentNews.createdBy}</span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <p className="text-lg text-foreground leading-relaxed">
              {currentNews.description}
            </p>
          </div>

          {/* Notice for non-public news */}
          {!currentNews.isPublic && (
            <Alert className="mb-8">
              <Eye className="h-4 w-4" />
              <AlertTitle>Bài viết chưa công khai</AlertTitle>
              <AlertDescription>
                Bài viết này chưa được công khai và chỉ có thể xem trong chế độ
                xem trước. Để người dùng có thể xem, vui lòng đặt trạng thái
                thành "Công khai".
              </AlertDescription>
            </Alert>
          )}

          {/* Content would be rendered here if available in the list response */}
          <div className="tiptap-content">
            <Alert>
              <AlertDescription>
                Nội dung chi tiết chỉ có sẵn trong API chi tiết. Vui lòng chỉnh
                sửa bài viết để xem toàn bộ nội dung.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
