import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoHero from "@/components/custom/VideoHero";
import { roomCategoryApi } from '@/services/roomApi';
import type { RoomCategory } from '@/types/room.types';
import { toast } from 'sonner';
import { Loader2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import fallbackImage from '@/assets/images/commons/fallback.png';

export default function AccommodationPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<RoomCategory[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Get branchId from localStorage
  const branchId = localStorage.getItem('branchId') || 'branch-hcm-001';
  
  console.log('Branch ID:', branchId);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories for branch:', branchId);
        const response = await roomCategoryApi.getByBranch(branchId);
        console.log('Categories response:', response);
        if (response.result) {
          setCategories(response.result);
        }
      } catch (error) {
        console.error('Failed to fetch room categories:', error);
        toast.error('Không thể tải danh sách hạng phòng');
      } finally {
        setLoading(false);
      }
    };
    
    if (branchId) {
      fetchCategories();
    }
  }, [branchId]);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/accommodation/${categoryId}`);
  };

  return (
    <div className="min-h-screen">
      <VideoHero 
        title="Hạng Phòng"
        subtitle="Khám phá các hạng phòng đặc biệt và nổi bật của Aurora Hotel"
      />

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-800">
            Chọn Hạng Phòng
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Từ phòng tiêu chuẩn đến suite tổng thống, chúng tôi có đầy đủ các hạng phòng phù hợp với nhu cầu của bạn
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-gray-500">Không có hạng phòng nào để hiển thị.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={category.imageUrl || fallbackImage} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => { e.currentTarget.src = fallbackImage; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {category.totalRoomTypes || 0} loại phòng
                      </p>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {category.description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      Xem chi tiết
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
