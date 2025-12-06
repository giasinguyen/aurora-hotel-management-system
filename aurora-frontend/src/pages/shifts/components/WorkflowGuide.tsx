import { ArrowRight, Calendar, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function WorkflowGuide() {
  const steps = [
    {
      icon: Calendar,
      title: 'Bước 1: Tạo ca làm việc',
      description: 'Tạo các ca làm việc (sáng, chiều, tối) với thời gian và màu sắc phù hợp',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Bước 2: Phân công nhân viên',
      description: 'Chọn ca làm việc và phân công nhân viên vào ca đó',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      icon: CheckCircle,
      title: 'Bước 3: Xem lịch tổng quát',
      description: 'Theo dõi toàn bộ ca làm việc trên lịch và quản lý chấm công',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <Card className="mb-6 border-2 border-blue-100">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">
          Quy trình quản lý ca làm việc
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative">
                <div className={`${step.bgColor} rounded-lg p-4 h-full`}>
                  <div className="flex items-start gap-3">
                    <div className={`${step.color} mt-1`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <div className="bg-white rounded-full p-1 shadow">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
