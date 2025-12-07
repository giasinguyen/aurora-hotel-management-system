import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import VideoHero from "@/components/custom/VideoHero";
import { roomCategoryApi } from '@/services/roomApi';
import type { RoomCategory, RoomType } from '@/types/room.types';
import fallbackImage from '@/assets/images/commons/fallback.png';
import { toast } from 'sonner';
import { Loader2, ChevronLeft, Users, Maximize, Bed } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Fallback image for broken image URLs
const FALLBACK_IMAGE = fallbackImage;

export default function AccommodationCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<RoomCategory | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const [categoryRes, roomTypesRes] = await Promise.all([
          roomCategoryApi.getById(categoryId),
          roomCategoryApi.getByIdWithRoomTypes(categoryId)
        ]);
        
        if (categoryRes.result) {
          setCategory(categoryRes.result);
        }
        
        if (roomTypesRes.result?.roomTypes) {
          setRoomTypes(roomTypesRes.result.roomTypes);
        }
      } catch (error) {
        console.error('Failed to fetch category data:', error);
        toast.error('Không thể tải thông tin hạng phòng');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [categoryId]);

  const handleBookRoom = (roomTypeId: string) => {
    navigate(`/booking?categoryId=${categoryId}&roomTypeId=${roomTypeId}`);
  };

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  // Handle image load errors with fallback
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== FALLBACK_IMAGE) {
      img.src = FALLBACK_IMAGE;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-xl text-gray-500 mb-4">Không tìm thấy hạng phòng</p>
        <Button onClick={() => navigate('/accommodation')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <VideoHero>
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">{category.description}</p>
          </div>
        </div>
      </VideoHero>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Trang chủ</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/accommodation">Hạng phòng</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{category.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Room Types Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Các Loại Phòng ({roomTypes.length})
          </h2>
          
          {roomTypes.length === 0 ? (
            <p className="text-center text-gray-500">Không có loại phòng nào trong hạng này.</p>
          ) : (
            <div className="space-y-6">
              {roomTypes.map((roomType) => (
                <Card 
                  key={roomType.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-80 h-64 flex-shrink-0">
                      <img 
                        src={roomType.imageUrl || fallbackImage} 
                        alt={roomType.name}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 p-6 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">
                            {roomType.name}
                          </h3>
                          <Badge variant="secondary" className="text-xs">{roomType.code}</Badge>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-4 flex-grow">
                        {roomType.shortDescription || roomType.description}
                      </p>
                      
                      {/* Details */}
                      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Maximize className="h-4 w-4" />
                          <span>{roomType.sizeM2}m²</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{roomType.maxOccupancy} người</span>
                        </div>
                        {roomType.bedType && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{roomType.bedType}</span>
                            {roomType.numberOfBeds && <span> x{roomType.numberOfBeds}</span>}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-end justify-between mt-auto">
                        {/* Price */}
                        <div>
                          <p className="text-sm text-gray-500">Giá từ</p>
                          <p className="text-3xl font-bold text-amber-600">
                            {formatCurrency(roomType.priceFrom)}
                            <span className="text-base text-gray-500 font-normal">/đêm</span>
                          </p>
                        </div>
                        
                        <Button 
                          onClick={() => handleBookRoom(roomType.id)}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          Chọn phòng
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

