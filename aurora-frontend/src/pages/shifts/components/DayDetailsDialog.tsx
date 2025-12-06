import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MapPin, AlertCircle } from 'lucide-react';
import type { StaffShiftAssignment } from '@/types/shift.types';

interface ShiftCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  assignment: StaffShiftAssignment;
}

interface DayDetailsDialogProps {
  date: Date;
  events: ShiftCalendarEvent[];
  open: boolean;
  onClose: () => void;
}

export function DayDetailsDialog({ 
  date, 
  events, 
  open, 
  onClose
}: DayDetailsDialogProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      SCHEDULED: { label: 'Đã lên lịch', variant: 'default' },
      IN_PROGRESS: { label: 'Đang làm', variant: 'secondary' },
      COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
      NO_SHOW: { label: 'Vắng mặt', variant: 'destructive' },
    };

    const config = statusMap[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            Chi tiết ca làm việc
          </DialogTitle>
          <DialogDescription>
            {formatDate(date)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Không có ca làm việc nào trong ngày này</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {event.assignment.workShift.description || 'Không có mô tả'}
                      </p>
                    </div>
                    {getStatusBadge(event.assignment.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {event.assignment.workShift.startTime} - {event.assignment.workShift.endTime}
                      </span>
                      <span className="text-gray-500">
                        ({event.assignment.workShift.durationHours}h)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span>{event.assignment.staffName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{event.assignment.branchName}</span>
                    </div>

                    {event.assignment.notes && (
                      <div className="col-span-2 mt-2 p-2 bg-gray-50 rounded text-sm">
                        <span className="font-medium">Ghi chú: </span>
                        {event.assignment.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
