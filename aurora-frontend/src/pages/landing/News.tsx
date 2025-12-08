import { useEffect } from "react";
import VideoHero from "@/components/custom/VideoHero";
import NewsItem from "@/components/custom/NewsItem";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { fetchPublicNews } from "@/features/slices/newsSlice";
import LoadingScreen from "@/components/custom/LoadingScreen";

export default function NewsPage() {
  const dispatch = useAppDispatch();
  const { newsList, loading, error } = useAppSelector((state) => state.news);

  useEffect(() => {
    dispatch(fetchPublicNews());
  }, [dispatch]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <VideoHero 
        title="Tin tức"
        subtitle="Cập nhật những thông tin mới nhất từ Aurora Hotel"
      />

      {/* News List */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading && <LoadingScreen />}
          
          {error && (
            <div className="text-center text-red-500 py-8">
              <p>Có lỗi xảy ra khi tải tin tức. Vui lòng thử lại sau.</p>
            </div>
          )}

          {!loading && !error && newsList.length === 0 && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <svg
                  className="mx-auto h-24 w-24 text-muted-foreground/50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  Chưa có tin tức nào
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Hiện tại chưa có tin tức nào được công bố. Vui lòng quay lại sau.
                </p>
              </div>
            </div>
          )}

          {!loading && !error && newsList.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsList.map((news) => (
                <NewsItem
                  key={news.id}
                  id={news.id}
                  slug={news.slug}
                  title={news.title}
                  description={news.description}
                  thumbnailUrl={news.thumbnailUrl || ""}
                  publishedAt={news.publishedAt}
                  status={news.status}
                  createdBy={news.createdBy}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
