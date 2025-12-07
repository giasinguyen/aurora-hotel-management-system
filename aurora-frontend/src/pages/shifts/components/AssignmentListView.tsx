import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, Calendar, Trash2 } from 'lucide-react';
import type { StaffShiftAssignment, WorkShift } from '@/types/shift.types';
import { staffShiftApi } from '@/services/shiftApi';
import { toast } from 'sonner';
import { useState } from 'react';

interface AssignmentListViewProps {
  assignments: StaffShiftAssignment[];
  selectedDate?: Date;
  onRefresh?: () => void;
}

interface ShiftGroup {
  shift: WorkShift;
  date: string;
  assignments: StaffShiftAssignment[];
}

export function AssignmentListView({ assignments, selectedDate, onRefresh }: AssignmentListViewProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCancelAssignment = async (assignmentId: string, staffName: string) => {
    if (!confirm(`Bạn có chắc muốn huỷ ca làm việc của ${staffName}?`)) {
      return;
    }

    setDeletingId(assignmentId);
    try {
      await staffShiftApi.cancelAssignment(assignmentId, 'Huỷ từ danh sách ca làm việc');
      toast.success('Đã huỷ ca làm việc thành công');
      onRefresh?.();
    } catch (error) {
      console.error('Lỗi khi huỷ ca làm việc:', error);
      toast.error('Không thể huỷ ca làm việc');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter out assignments without workShift data and group by shift
  const groupedByShift = assignments
    .filter(assignment => assignment.workShift || (assignment.workShiftId && assignment.startTime))
    .reduce((acc, assignment) => {
      // Map flat fields to workShift object if needed
      const workShift = assignment.workShift || {
        id: assignment.workShiftId,
        name: assignment.workShiftName,
        startTime: assignment.startTime,
        endTime: assignment.endTime,
        colorCode: assignment.shiftColorCode,
        description: '',
        active: true,
        branchId: assignment.branchId,
        createdAt: assignment.createdAt,
        updatedAt: assignment.updatedAt,
      };
      
      const key = `${workShift.id}-${assignment.shiftDate}`;
      if (!acc[key]) {
        acc[key] = {
          shift: workShift,
          date: assignment.shiftDate,
          assignments: [],
        };
      }
      acc[key].assignments.push({ ...assignment, workShift });
      return acc;
  }, {} as Record<string, ShiftGroup>);

  const groups = Object.values(groupedByShift);

  // Filter by selected date if provided
  const filteredGroups = selectedDate
    ? groups.filter(g => {
        const groupDate = new Date(g.date);
        return (
          groupDate.getDate() === selectedDate.getDate() &&
          groupDate.getMonth() === selectedDate.getMonth() &&
          groupDate.getFullYear() === selectedDate.getFullYear()
        );
      })
    : groups;

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

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('vi-VN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr));
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (filteredGroups.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có phân công nào</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {filteredGroups.map((group, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.shift.colorCode }}
                />
                <div>
                  <CardTitle className="text-lg">{group.shift.name}</CardTitle>
                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(group.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {group.shift.startTime} - {group.shift.endTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {group.assignments.length} nhân viên
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {group.assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="text-xs font-semibold">
                      {getInitials(assignment.staffName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {assignment.staffName}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{assignment.branchName}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-shrink-0">
                      {getStatusBadge(assignment.status)}
                    </div>
                    {assignment.status === 'SCHEDULED' && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancelAssignment(assignment.id, assignment.staffName)}
                        disabled={deletingId === assignment.id}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
