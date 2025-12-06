/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { staffShiftApi, shiftCheckInApi } from '@/services/shiftApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Clock,
  MapPin,
  AlertCircle,
  Calendar,
  Timer,
  LogIn,
  LogOut,
  History,
  TrendingUp,
  CheckCircle2,
  XCircle,
  CalendarDays,
} from 'lucide-react';
import { format, differenceInMinutes, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const StaffCheckIn = () => {
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

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // Load shift data
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchStaffCurrentShift(user.id));
      dispatch(checkIsCheckedIn(user.id));
      dispatch(checkHasActiveShift(user.id));
      dispatch(fetchCurrentCheckIn(user.id));
      loadUpcomingShifts();
    }
  }, [dispatch, user?.id]);

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

  const handleCheckIn = async () => {
    if (!currentAssignment) {
      toast.error('No active shift assignment found');
      return;
    }

    try {
      await dispatch(checkInToShift(currentAssignment.id)).unwrap();
      toast.success('Checked in successfully!');
      dispatch(fetchCurrentCheckIn(user?.id || ''));
      dispatch(checkIsCheckedIn(user?.id || ''));
    } catch (err: any) {
      toast.error(err || 'Failed to check in');
    }
  };

  const handleCheckOut = async () => {
    if (!currentAssignment) {
      toast.error('No active shift found');
      return;
    }

    try {
      await dispatch(checkOutFromShift(currentAssignment.id)).unwrap();
      toast.success('Checked out successfully!');
      dispatch(fetchCurrentCheckIn(user?.id || ''));
      dispatch(checkIsCheckedIn(user?.id || ''));
    } catch (err: any) {
      toast.error(err || 'Failed to check out');
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
      return { type: 'info', message: `Shift starts in ${Math.floor(minutesUntilStart / 60)} hours` };
    } else if (minutesUntilStart > 0) {
      return { type: 'warning', message: `Shift starts in ${minutesUntilStart} minutes` };
    } else if (minutesUntilEnd > 0) {
      return { type: 'success', message: 'Shift is active now' };
    } else {
      return { type: 'error', message: 'Shift has ended' };
    }
  };

  const status = getShiftStatus();

  const getWorkingDuration = () => {
    if (!currentCheckIn?.checkInTime) return 'Not checked in';
    
    const checkInTime = new Date(currentCheckIn.checkInTime);
    const now = new Date();
    const minutes = differenceInMinutes(now, checkInTime);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Shift</h1>
        <p className="text-gray-500">Check in and out of your work shifts</p>
      </div>

      {/* Current Time */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Clock className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="text-3xl font-bold">{format(currentTime, 'HH:mm:ss')}</p>
                <p className="text-sm text-gray-500">{format(currentTime, 'EEEE, MMMM d, yyyy')}</p>
              </div>
            </div>
            {location && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
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
            You don't have an active shift at this time. Check your upcoming shifts below.
          </AlertDescription>
        </Alert>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Current Shift
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAssignment && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Shift</p>
                    <p className="font-semibold">{currentAssignment.workShiftName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-semibold">
                      {currentAssignment.startTime} - {currentAssignment.endTime}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Branch</p>
                    <p className="font-semibold">{currentAssignment.branchName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      variant={
                        currentAssignment.status === 'IN_PROGRESS'
                          ? 'default'
                          : currentAssignment.status === 'COMPLETED'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {currentAssignment.status}
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
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Timer className="w-5 h-5" />
                      <span className="font-semibold">
                        {isCheckedIn ? 'Checked In' : 'Not Checked In'}
                      </span>
                    </div>
                    {isCheckedIn && (
                      <Badge variant="default">
                        Working: {getWorkingDuration()}
                      </Badge>
                    )}
                  </div>

                  {currentCheckIn && (
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-500">Check-In Time</p>
                        <p className="font-semibold">
                          {format(new Date(currentCheckIn.checkInTime), 'HH:mm:ss')}
                        </p>
                        {currentCheckIn.isLate && (
                          <Badge variant="destructive" className="mt-1">
                            Late by {currentCheckIn.lateMinutes} min
                          </Badge>
                        )}
                      </div>
                      {currentCheckIn.checkOutTime && (
                        <div>
                          <p className="text-gray-500">Check-Out Time</p>
                          <p className="font-semibold">
                            {format(new Date(currentCheckIn.checkOutTime), 'HH:mm:ss')}
                          </p>
                          {currentCheckIn.earlyDeparture && (
                            <Badge variant="destructive" className="mt-1">
                              Early by {currentCheckIn.earlyMinutes} min
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!isCheckedIn ? (
                      <Button
                        onClick={handleCheckIn}
                        disabled={loading || !currentAssignment.isActiveNow}
                        className="flex-1"
                        size="lg"
                      >
                        <LogIn className="w-4 h-4 mr-2" />
                        Check In
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCheckOut}
                        disabled={loading}
                        variant="outline"
                        className="flex-1"
                        size="lg"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Check Out
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Upcoming Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Shifts (Next 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingShifts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No upcoming shifts scheduled</p>
          ) : (
            <div className="space-y-2">
              {upcomingShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-2 h-12 rounded"
                      style={{ backgroundColor: shift.shiftColorCode }}
                    />
                    <div>
                      <p className="font-semibold">{shift.workShiftName}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(shift.shiftDate), 'EEEE, MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {shift.startTime} - {shift.endTime}
                    </p>
                    <Badge variant="outline">{shift.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffCheckIn;
