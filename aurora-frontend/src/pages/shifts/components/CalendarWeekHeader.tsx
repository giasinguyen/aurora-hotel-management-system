export function CalendarWeekHeader() {
  const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  return (
    <div className="grid grid-cols-7 gap-2 mb-2">
      {weekDays.map((day, index) => (
        <div
          key={day}
          className={`
            text-center text-sm font-semibold py-2
            ${index === 0 ? 'text-red-600' : 'text-gray-700'}
          `}
        >
          {day}
        </div>
      ))}
    </div>
  );
}
