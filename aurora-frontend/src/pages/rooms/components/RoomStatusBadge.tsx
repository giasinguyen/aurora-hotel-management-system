// ============================================
// Room Status Badge Component
// ============================================

import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle2, 
  UserCheck, 
  Clock, 
  Wrench, 
  Sparkles, 
  XCircle 
} from 'lucide-react';
import type { RoomStatus } from '@/types/room.types';
import { ROOM_STATUS_CONFIG } from '../constants';

const ICONS: Record<string, React.ReactNode> = {
  CheckCircle2: <CheckCircle2 className="h-3.5 w-3.5" />,
  UserCheck: <UserCheck className="h-3.5 w-3.5" />,
  Clock: <Clock className="h-3.5 w-3.5" />,
  Wrench: <Wrench className="h-3.5 w-3.5" />,
  Sparkles: <Sparkles className="h-3.5 w-3.5" />,
  XCircle: <XCircle className="h-3.5 w-3.5" />,
};

interface RoomStatusBadgeProps {
  status: RoomStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function RoomStatusBadge({ 
  status, 
  showIcon = true,
  size = 'md' 
}: RoomStatusBadgeProps) {
  const config = ROOM_STATUS_CONFIG[status];
  
  if (!config) {
    return <Badge variant="outline">{status}</Badge>;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <Badge 
      variant={config.variant}
      className={`${config.className} ${sizeClasses[size]} font-medium gap-1.5 border`}
    >
      {showIcon && ICONS[config.iconName]}
      {config.label}
    </Badge>
  );
}
