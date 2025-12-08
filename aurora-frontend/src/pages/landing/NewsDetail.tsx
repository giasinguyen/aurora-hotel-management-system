import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CalendarDays, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchPublicNewsBySlug, clearCurrentNews } from "@/features/slices/newsSlice";
import LoadingScreen from "@/components/custom/LoadingScreen";
import VideoHero from "@/components/custom/VideoHero";

import "@/styles/tiptap-content.scss";
import '@/styles/_variables.scss';
import '@/styles/_keyframe-animations.scss';

export default function NewsDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentNews, loading, error, newsList } = useAppSelector((state) => state.news);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPublicNewsBySlug(slug));
    }
    
    return () => {
      dispatch(clearCurrentNews());
    };
  }, [slug, dispatch]);

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
          <Button onClick={() => navigate("/news")} className="bg-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại danh sách tin tức
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
      {/* Header Video */}
      <VideoHero height="hero" overlayOpacity={0.5} />

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-card rounded-xl shadow-xl p-8 md:p-12">
          <div className="flex items-center gap-2">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate("/news")}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>

            {/* Status Badge */}
            {currentNews.status === "PUBLISHED" && (
              <Badge className="mb-6 bg-primary text-primary-foreground">
                Published
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="text-6xl font-bold text-foreground mb-6">
            {currentNews.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-col gap-6 text-muted-foreground mb-8 pb-8 border-b border-border">
            {/* Description */}
            <p className="text-lg text-foreground leading-relaxed">
              {currentNews.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                <span>{formatDate(currentNews.publishedAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span>{currentNews.createdBy}</span>
              </div>
            </div>
          </div>

          {/* Content HTML */}
          <div
            className="tiptap-content"
            dangerouslySetInnerHTML={{ __html: currentNews.contentHtml }}
          />
        </div>

        {/* Related News Section */}
        {newsList.filter((item) => item.id !== currentNews.id).length > 0 && (
          <div className="mt-12 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Tin tức liên quan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {newsList
                .filter((item) => item.id !== currentNews.id)
                .slice(0, 3)
                .map((relatedNews) => (
                  <div
                    key={relatedNews.id}
                    onClick={() => navigate(`/news/${relatedNews.slug}`)}
                    className="bg-card rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={relatedNews.thumbnailUrl || "/placeholder-news.jpg"}
                      alt={relatedNews.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-2">
                        {relatedNews.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(relatedNews.publishedAt)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
