import { useState, useEffect } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarWeekHeader } from './CalendarWeekHeader';
import { CalendarDay } from './CalendarDay';
import type { StaffShiftAssignment, WorkShift } from '@/types/shift.types';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, MapPin, AlertCircle, Trash2 } from 'lucide-react';
import { staffShiftApi } from '@/services/shiftApi';
import { toast } from 'sonner';

interface ShiftCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  assignment: StaffShiftAssignment;
}

interface ShiftCalendarViewProps {
  assignments: StaffShiftAssignment[];
  onRefresh: () => void;
}

export function ShiftCalendarView({ assignments, onRefresh }: ShiftCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<ShiftCalendarEvent[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCancelAssignment = async (assignmentId: string, staffName: string) => {
    if (!confirm(`Bạn có chắc chắn muốn huỷ ca làm việc của ${staffName}?`)) {
      return;
    }

    try {
      setDeletingId(assignmentId);
      await staffShiftApi.cancelAssignment(assignmentId, 'Huỷ bởi quản lý');
      toast.success('Đã huỷ ca làm việc thành công');
      onRefresh();
      setSelectedDate(null);
    } catch (error: any) {
      console.error('Failed to cancel assignment:', error);
      toast.error(error?.response?.data?.message || 'Không thể huỷ ca làm việc');
    } finally {
      setDeletingId(null);
    }
  };

  // Convert assignments to calendar events
  useEffect(() => {
    console.log('ShiftCalendarView received assignments:', assignments.length);
    console.log('Raw assignments:', assignments);
    
    const calendarEvents: ShiftCalendarEvent[] = assignments
      .filter(assignment => {
        // Check if assignment has workShift data (either as object or flat fields)
        const hasWorkShift = assignment.workShift || (assignment.workShiftId && assignment.startTime);
        console.log('Assignment check:', {
          id: assignment.id,
          hasWorkShift,
          workShiftId: assignment.workShiftId,
          workShiftName: assignment.workShiftName,
        });
        return hasWorkShift;
      })
      .map(assignment => {
        // Map flat fields to workShift object if needed
        const workShift: WorkShift = assignment.workShift || {
          id: assignment.workShiftId,
          name: assignment.workShiftName,
          startTime: assignment.startTime,
          endTime: assignment.endTime,
          colorCode: assignment.shiftColorCode,
          description: '',
          active: true,
          branchId: assignment.branchId,
          durationHours: 8,
          createdAt: assignment.createdAt,
          updatedAt: assignment.updatedAt,
        };
        
        console.log('Processing assignment:', {
          id: assignment.id,
          shiftDate: assignment.shiftDate,
          workShift: workShift.name,
        });
        
        const shiftDate = new Date(assignment.shiftDate);
        const [startHour, startMin] = workShift.startTime.split(':');
        const [endHour, endMin] = workShift.endTime.split(':');
        
        const start = new Date(shiftDate);
        start.setHours(parseInt(startHour), parseInt(startMin));
        
        const end = new Date(shiftDate);
        end.setHours(parseInt(endHour), parseInt(endMin));

        return {
          id: assignment.id,
          title: workShift.name,
          start,
          end,
          color: workShift.colorCode,
          assignment: { ...assignment, workShift }, // Ensure assignment has workShift object
        };
    });

    console.log('Calendar events created:', calendarEvents.length);
    console.log('Events:', calendarEvents);
    
    setEvents(calendarEvents);
  }, [assignments]);

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // End on Saturday
    
    const days: Date[] = [];
    const current = new Date(startDate);
    
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getCalendarDays();
  
  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };
  
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
  };

  const getEventsForDay = (date: Date): ShiftCalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === currentDate.getMonth();
  };

  return (
    <div className="space-y-4">
      <CalendarHeader
        currentDate={currentDate}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      
      <Card>
        <CardContent className="p-4">
          <CalendarWeekHeader />
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => (
              <CalendarDay
                key={index}
                date={day}
                events={getEventsForDay(day)}
                isCurrentMonth={isCurrentMonth(day)}
                isToday={isToday(day)}
                onClick={handleDayClick}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Day Details Dialog */}
      {selectedDate && (
        <Dialog open={!!selectedDate} onOpenChange={() => setSelectedDate(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Chi tiết ca làm việc</DialogTitle>
              <DialogDescription>
                {new Intl.DateTimeFormat('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }).format(selectedDate)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {getEventsForDay(selectedDate).length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Không có ca làm việc nào trong ngày này</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getEventsForDay(selectedDate).map((event) => {
                    const statusMap: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
                      SCHEDULED: { label: 'Đã lên lịch', variant: 'default' },
                      IN_PROGRESS: { label: 'Đang làm', variant: 'secondary' },
                      COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
                      CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
                      NO_SHOW: { label: 'Vắng mặt', variant: 'destructive' },
                    };
                    const statusConfig = statusMap[event.assignment.status] || { label: event.assignment.status, variant: 'outline' };

                    return (
                      <div
                        key={event.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftWidth: '4px', borderLeftColor: event.color }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{event.title}</h3>
                            <p className="text-sm text-gray-500">
                              {event.assignment.workShift?.description || 'Không có mô tả'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>
                            {event.assignment.status === 'SCHEDULED' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCancelAssignment(event.assignment.id, event.assignment.staffName)}
                                disabled={deletingId === event.assignment.id}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span>
                              {event.assignment.workShift?.startTime} - {event.assignment.workShift?.endTime}
                            </span>
                            <span className="text-gray-500">
                              ({event.assignment.workShift?.durationHours}h)
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
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedDate(null)}>
                Đóng
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
