import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import {
  fetchStaffCurrentShift,
  checkInToShift,
  checkOutFromShift,
  fetchCurrentCheckIn,
  checkIsCheckedIn,
  checkHasActiveShift,
} from '@/features/slices/shiftSlice';
import { staffShiftApi } from '@/services/shiftApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Clock,
  MapPin,
  AlertCircle,
  Calendar as CalendarIcon,
  Timer,
  LogIn,
  LogOut,
  History,
  TrendingUp,
  CheckCircle2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  format,
  differenceInMinutes,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
} from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const StaffShiftDashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { currentAssignment, currentCheckIn, isCheckedIn, hasActiveShift, loading } = useAppSelector(
    (state) => state.shift
  );

  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState<string>('');
  const [upcomingShifts, setUpcomingShifts] = useState<any[]>([]);
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [calendarShifts, setCalendarShifts] = useState<any[]>([]);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user location (optional)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (_error) => {
          // Silently handle GPS errors - it's optional
          setLocation('Không có GPS');
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      setLocation('Trình duyệt không hỗ trợ GPS');
    }
  }, []);

  // Load all data
  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [dispatch, user?.id, selectedMonth]);

  const loadAllData = () => {
    if (!user?.id) return;
    
    dispatch(fetchStaffCurrentShift(user.id));
    dispatch(checkIsCheckedIn(user.id));
    dispatch(checkHasActiveShift(user.id));
    dispatch(fetchCurrentCheckIn(user.id));
    
    loadUpcomingShifts();
    loadShiftHistory();
    loadMonthlyCalendar();
    loadMonthlyStats();
  };

  const loadUpcomingShifts = async () => {
    if (!user?.id) return;
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const nextWeek = format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const response = await staffShiftApi.getStaffShiftsInRange(user.id, today, nextWeek);
      setUpcomingShifts(response.data.result || []);
    } catch (error) {
      console.error('Failed to load upcoming shifts:', error);
    }
  };

  const loadShiftHistory = async () => {
    if (!user?.id) return;
    try {
      const pastMonth = format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd');
      const today = format(new Date(), 'yyyy-MM-dd');
      const response = await staffShiftApi.getStaffShiftsInRange(user.id, pastMonth, today);
      const completed = (response.data.result || []).filter((s: any) => s.status === 'COMPLETED');
      setShiftHistory(completed.reverse().slice(0, 10)); // Last 10 completed shifts
    } catch (error) {
      console.error('Failed to load shift history:', error);
    }
  };

  const loadMonthlyCalendar = async () => {
    if (!user?.id) return;
    try {
      const monthStart = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
      const response = await staffShiftApi.getStaffShiftsInRange(user.id, monthStart, monthEnd);
      setCalendarShifts(response.data.result || []);
    } catch (error) {
      console.error('Failed to load calendar shifts:', error);
    }
  };

  const loadMonthlyStats = async () => {
    if (!user?.id) return;
    try {
      const monthStart = format(startOfMonth(selectedMonth), 'yyyy-MM-dd');
      const monthEnd = format(endOfMonth(selectedMonth), 'yyyy-MM-dd');
      const response = await staffShiftApi.getStaffShiftsInRange(user.id, monthStart, monthEnd);
      const shifts = response.data.result || [];
      
      const stats = {
        totalShifts: shifts.length,
        completedShifts: shifts.filter((s: any) => s.status === 'COMPLETED').length,
        scheduledShifts: shifts.filter((s: any) => s.status === 'SCHEDULED').length,
        totalHours: shifts.reduce((acc: number, shift: any) => {
          if (shift.status === 'COMPLETED') {
            const [startH, startM] = shift.startTime.split(':').map(Number);
            const [endH, endM] = shift.endTime.split(':').map(Number);
            const hours = (endH * 60 + endM - (startH * 60 + startM)) / 60;
            return acc + hours;
          }
          return acc;
        }, 0),
      };
      
      setMonthlyStats(stats);
    } catch (error) {
      console.error('Failed to load monthly stats:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!currentAssignment) {
      toast.error('Không tìm thấy ca làm việc');
      return;
    }

    try {
      await dispatch(checkInToShift(currentAssignment.id)).unwrap();
      toast.success('Check-in thành công!');
      
      // Chỉ reload shifts và stats, KHÔNG reload check-in status để tránh race condition
      // Redux state từ checkInToShift.fulfilled đã set isCheckedIn=true
      loadUpcomingShifts();
      loadShiftHistory();
      loadMonthlyCalendar();
      loadMonthlyStats();
      
      // Thông báo cho user biết dữ liệu đã được cập nhật
      toast.success('Đã cập nhật lịch sử và thống kê', {
        description: 'Kiểm tra tab Lịch sử và Thống kê để xem chi tiết',
      });
    } catch (err: any) {
      toast.error(err || 'Không thể check-in');
    }
  };

  const handleCheckOut = async () => {
    if (!currentAssignment) {
      toast.error('Không tìm thấy ca làm việc');
      return;
    }

    try {
      await dispatch(checkOutFromShift(currentAssignment.id)).unwrap();
      toast.success('Check-out thành công!');
      
      // Chỉ reload shifts và stats, KHÔNG reload check-in status để tránh race condition
      // Redux state từ checkOutFromShift.fulfilled đã set isCheckedIn=false
      loadUpcomingShifts();
      loadShiftHistory();
      loadMonthlyCalendar();
      loadMonthlyStats();
      
      // Thông báo cho user biết dữ liệu đã được cập nhật
      toast.success('Đã cập nhật lịch sử và thống kê', {
        description: 'Ca làm việc đã hoàn thành. Xem chi tiết trong tab Lịch sử',
      });
    } catch (err: any) {
      toast.error(err || 'Không thể check-out');
    }
  };

  const getShiftStatus = () => {
    if (!currentAssignment) return null;

    const now = new Date();
    const shiftDate = new Date(currentAssignment.shiftDate);
    const [startHour, startMinute] = currentAssignment.startTime.split(':').map(Number);
    const [endHour, endMinute] = currentAssignment.endTime.split(':').map(Number);

    const shiftStart = new Date(shiftDate);
    shiftStart.setHours(startHour, startMinute, 0);

    const shiftEnd = new Date(shiftDate);
    shiftEnd.setHours(endHour, endMinute, 0);

    const minutesUntilStart = differenceInMinutes(shiftStart, now);
    const minutesUntilEnd = differenceInMinutes(shiftEnd, now);

    if (minutesUntilStart > 60) {
      return { type: 'info', message: `Ca làm việc bắt đầu trong ${Math.floor(minutesUntilStart / 60)} giờ` };
    } else if (minutesUntilStart > 0) {
      return { type: 'warning', message: `Ca làm việc bắt đầu trong ${minutesUntilStart} phút` };
    } else if (minutesUntilEnd > 0) {
      return { type: 'success', message: 'Ca làm việc đang diễn ra' };
    } else {
      return { type: 'error', message: 'Ca làm việc đã kết thúc' };
    }
  };

  const getWorkingDuration = () => {
    if (!currentCheckIn?.checkInTime) return 'Chưa check-in';
    
    const checkInTime = new Date(currentCheckIn.checkInTime);
    const now = currentCheckIn.checkOutTime ? new Date(currentCheckIn.checkOutTime) : new Date();
    const minutes = differenceInMinutes(now, checkInTime);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };

  const isShiftActive = () => {
    if (!currentAssignment) return false;

    const now = new Date();
    const shiftDate = new Date(currentAssignment.shiftDate);
    const [startHour, startMinute] = currentAssignment.startTime.split(':').map(Number);
    const [endHour, endMinute] = currentAssignment.endTime.split(':').map(Number);

    const shiftStart = new Date(shiftDate);
    shiftStart.setHours(startHour, startMinute, 0);

    const shiftEnd = new Date(shiftDate);
    shiftEnd.setHours(endHour, endMinute, 0);

    // Ca đang active nếu thời gian hiện tại nằm giữa start và end
    return now >= shiftStart && now <= shiftEnd;
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    const getShiftForDate = (date: Date) => {
      return calendarShifts.find((shift) =>
        isSameDay(parseISO(shift.shiftDate), date)
      );
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {format(selectedMonth, 'MMMM yyyy')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedMonth(subMonths(selectedMonth, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => setSelectedMonth(new Date())}
            >
              Hôm nay
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedMonth(addMonths(selectedMonth, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-gray-500 py-2">
              {day}
            </div>
          ))}
          
          {days.map((day, i) => {
            const shift = getShiftForDate(day);
            const isCurrentMonth = isSameMonth(day, selectedMonth);
            const isCurrentDay = isToday(day);
            
            return (
              <div
                key={i}
                className={`min-h-[80px] border rounded-lg p-2 ${
                  !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                } ${isCurrentDay ? 'border-blue-500 border-2' : ''}`}
              >
                <div className="text-sm font-semibold mb-1">
                  {format(day, dateFormat)}
                </div>
                {shift && isCurrentMonth && (
                  <div
                    className="text-xs p-1 rounded truncate"
                    style={{
                      backgroundColor: shift.shiftColorCode + '20',
                      borderLeft: `3px solid ${shift.shiftColorCode}`,
                    }}
                  >
                    <div className="font-semibold">{shift.workShiftName}</div>
                    <div className="text-gray-600">{shift.startTime}</div>
                    {shift.status === 'COMPLETED' && (
                      <CheckCircle2 className="w-3 h-3 text-green-600 mt-1" />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const status = getShiftStatus();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Ca Làm Việc Của Tôi</h1>
        <p className="text-gray-500">Quản lý thời gian làm việc và check-in/check-out</p>
      </div>

      <Tabs defaultValue="current" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="current">Hiện tại</TabsTrigger>
          <TabsTrigger value="calendar">Lịch</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
          <TabsTrigger value="stats">Thống kê</TabsTrigger>
        </TabsList>

        {/* Current Shift Tab */}
        <TabsContent value="current" className="space-y-6">
          {/* Current Time */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-500 rounded-full">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Thời gian hiện tại</p>
                    <p className="text-4xl font-bold text-blue-900">{format(currentTime, 'HH:mm:ss')}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(currentTime, 'EEEE, dd MMMM yyyy')}
                    </p>
                  </div>
                </div>
                {location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-white rounded-lg px-4 py-2">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Current Shift */}
          {!hasActiveShift ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Bạn không có ca làm việc nào đang hoạt động. Xem các ca sắp tới bên dưới.
              </AlertDescription>
            </Alert>
          ) : (
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-green-600" />
                  Ca Làm Việc Hiện Tại
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {currentAssignment && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Tên ca</p>
                        <p className="text-lg font-semibold">{currentAssignment.workShiftName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Thời gian</p>
                        <p className="text-lg font-semibold">
                          {currentAssignment.startTime} - {currentAssignment.endTime}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Chi nhánh</p>
                        <p className="text-lg font-semibold">{currentAssignment.branchName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-500">Trạng thái ca</p>
                        <Badge
                          className="text-sm"
                          variant={
                            currentAssignment.status === 'IN_PROGRESS'
                              ? 'default'
                              : currentAssignment.status === 'COMPLETED'
                              ? 'secondary'
                              : 'outline'
                          }
                        >
                          {currentAssignment.status === 'SCHEDULED' && 'Đã lên lịch'}
                          {currentAssignment.status === 'IN_PROGRESS' && 'Đang diễn ra'}
                          {currentAssignment.status === 'COMPLETED' && 'Đã hoàn thành'}
                        </Badge>
                      </div>
                    </div>

                    {status && (
                      <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{status.message}</AlertDescription>
                      </Alert>
                    )}

                    {/* Check-In Status */}
                    <div className="border-t pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${isCheckedIn ? 'bg-green-100' : 'bg-gray-100'}`}>
                            <Timer className={`w-5 h-5 ${isCheckedIn ? 'text-green-600' : 'text-gray-400'}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-lg">
                              {isCheckedIn ? 'Đã Check-In' : 'Chưa Check-In'}
                            </p>
                            {isCheckedIn && (
                              <p className="text-sm text-gray-500">
                                Thời gian làm việc: {getWorkingDuration()}
                              </p>
                            )}
                          </div>
                        </div>
                        {isCheckedIn && !currentCheckIn?.checkOutTime && (
                          <Badge variant="default" className="text-base px-4 py-2">
                            Đang làm việc: {getWorkingDuration()}
                          </Badge>
                        )}
                      </div>

                      {currentCheckIn && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-2">
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                              <LogIn className="w-4 h-4" />
                              Thời gian check-in
                            </p>
                            <p className="text-xl font-bold">
                              {format(new Date(currentCheckIn.checkInTime), 'HH:mm:ss')}
                            </p>
                            <p className="text-sm text-gray-600">
                              {format(new Date(currentCheckIn.checkInTime), 'dd/MM/yyyy')}
                            </p>
                            {currentCheckIn.isLate && (
                              <Badge variant="destructive" className="mt-1">
                                Trễ {currentCheckIn.lateMinutes} phút
                              </Badge>
                            )}
                          </div>
                          {currentCheckIn.checkOutTime && (
                            <div className="space-y-2">
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <LogOut className="w-4 h-4" />
                                Thời gian check-out
                              </p>
                              <p className="text-xl font-bold">
                                {format(new Date(currentCheckIn.checkOutTime), 'HH:mm:ss')}
                              </p>
                              <p className="text-sm text-gray-600">
                                {format(new Date(currentCheckIn.checkOutTime), 'dd/MM/yyyy')}
                              </p>
                              {currentCheckIn.earlyDeparture && (
                                <Badge variant="destructive" className="mt-1">
                                  Về sớm {currentCheckIn.earlyMinutes} phút
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex gap-3">
                        {!isCheckedIn ? (
                          <Button
                            onClick={handleCheckIn}
                            disabled={loading || !isShiftActive()}
                            className="flex-1 h-14 text-lg"
                            size="lg"
                          >
                            <LogIn className="w-5 h-5 mr-2" />
                            Check In Ngay
                          </Button>
                        ) : currentCheckIn?.checkOutTime ? (
                          <Alert className="flex-1">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                              Bạn đã hoàn thành ca làm việc này
                            </AlertDescription>
                          </Alert>
                        ) : (
                          <Button
                            onClick={handleCheckOut}
                            disabled={loading}
                            variant="destructive"
                            className="flex-1 h-14 text-lg"
                            size="lg"
                          >
                            <LogOut className="w-5 h-5 mr-2" />
                            Check Out
                          </Button>
                        )}
                      </div>

                      {!isShiftActive() && !isCheckedIn && (
                        <Alert className="mt-4">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Chỉ có thể check-in trong khung giờ làm việc của ca
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Shifts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                Ca Sắp Tới (7 ngày tới)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingShifts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Không có ca làm việc nào được lên lịch</p>
              ) : (
                <div className="space-y-3">
                  {upcomingShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-1 h-16 rounded"
                          style={{ backgroundColor: shift.shiftColorCode }}
                        />
                        <div>
                          <p className="font-semibold text-lg">{shift.workShiftName}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(shift.shiftDate), 'EEEE, dd/MM/yyyy')}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{shift.branchName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {shift.startTime} - {shift.endTime}
                        </p>
                        <Badge variant="outline" className="mt-1">
                          {shift.status === 'SCHEDULED' && 'Đã lên lịch'}
                          {shift.status === 'IN_PROGRESS' && 'Đang diễn ra'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Lịch Ca Làm Việc</CardTitle>
            </CardHeader>
            <CardContent>{renderCalendar()}</CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Lịch Sử Ca Làm (30 ngày gần nhất)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shiftHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">Chưa có lịch sử ca làm việc</p>
              ) : (
                <div className="space-y-3">
                  {shiftHistory.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-1 h-14 rounded"
                          style={{ backgroundColor: shift.shiftColorCode }}
                        />
                        <div>
                          <p className="font-semibold">{shift.workShiftName}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(shift.shiftDate), 'dd/MM/yyyy')}
                          </p>
                          <p className="text-xs text-gray-500">{shift.branchName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">
                          {shift.startTime} - {shift.endTime}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Hoàn thành
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Thống Kê Tháng {format(selectedMonth, 'MM/yyyy')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {monthlyStats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg">
                      <p className="text-sm text-blue-600 mb-2">Tổng số ca</p>
                      <p className="text-4xl font-bold text-blue-900">{monthlyStats.totalShifts}</p>
                    </div>
                    <div className="bg-green-50 p-6 rounded-lg">
                      <p className="text-sm text-green-600 mb-2">Đã hoàn thành</p>
                      <p className="text-4xl font-bold text-green-900">{monthlyStats.completedShifts}</p>
                    </div>
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <p className="text-sm text-yellow-600 mb-2">Đang chờ</p>
                      <p className="text-4xl font-bold text-yellow-900">{monthlyStats.scheduledShifts}</p>
                    </div>
                    <div className="bg-purple-50 p-6 rounded-lg">
                      <p className="text-sm text-purple-600 mb-2">Tổng giờ làm</p>
                      <p className="text-4xl font-bold text-purple-900">
                        {monthlyStats.totalHours.toFixed(1)}h
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Tỷ lệ hoàn thành</span>
                        <span className="font-semibold">
                          {monthlyStats.totalShifts > 0
                            ? Math.round((monthlyStats.completedShifts / monthlyStats.totalShifts) * 100)
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          monthlyStats.totalShifts > 0
                            ? (monthlyStats.completedShifts / monthlyStats.totalShifts) * 100
                            : 0
                        }
                        className="h-3"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Đang tải thống kê...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffShiftDashboard;
