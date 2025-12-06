import type { StaffShiftAssignment } from '@/types/shift.types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';

interface ShiftCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  assignment: StaffShiftAssignment;
}

interface CalendarDayProps {
  date: Date;
  events: ShiftCalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  onClick: (date: Date) => void;
}

export function CalendarDay({ date, events, isCurrentMonth, isToday, onClick }: CalendarDayProps) {
  return (
    <Card 
      className={`
        min-h-[120px] cursor-pointer transition-all hover:shadow-md
        ${!isCurrentMonth ? 'bg-gray-50 opacity-60' : ''}
        ${isToday ? 'ring-2 ring-blue-500' : ''}
      `}
      onClick={() => onClick(date)}
    >
      <CardContent className="p-2">
        <div className="flex items-center justify-between mb-2">
          <span className={`text-sm font-semibold ${isToday ? 'text-blue-600' : ''}`}>
            {date.getDate()}
          </span>
          {events.length > 0 && (
            <Badge variant="secondary" className="text-xs">
              {events.length}
            </Badge>
          )}
        </div>
        
        <div className="space-y-1">
          {events.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="text-xs p-1 rounded truncate"
              style={{ 
                backgroundColor: event.color + '20',
                borderLeft: `3px solid ${event.color}`
              }}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" style={{ color: event.color }} />
                <span className="font-medium truncate">{event.title}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600 mt-0.5">
                <Users className="h-3 w-3" />
                <span>{event.assignment.staffName}</span>
              </div>
            </div>
          ))}
          {events.length > 3 && (
            <div className="text-xs text-gray-500 pl-1">
              +{events.length - 3} more
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
