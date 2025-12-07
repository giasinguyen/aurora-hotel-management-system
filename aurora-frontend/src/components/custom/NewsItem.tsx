import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

interface NewsItemProps {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  status: string;
  createdBy: string;
}

export default function NewsItem({
  slug,
  title,
  description,
  thumbnailUrl,
  publishedAt,
  status,
  createdBy,
}: NewsItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/news/${slug}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden bg-muted">
          <img
            src={thumbnailUrl || "/placeholder-news.jpg"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
            }}
          />
          {status === "PUBLISHED" && (
            <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
              Published
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h2>
        <p className="text-muted-foreground line-clamp-3">{description}</p>
      </CardContent>
      <CardFooter className="px-6 pb-6 pt-0 flex justify-between">
        <div className="flex items-center text-sm text-muted-foreground">
          <CalendarDays className="w-4 h-4 mr-2" />
          <span>{formatDate(publishedAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="w-4 h-4" />
          <span className="uppercase font-bold">{createdBy}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
