// src/components/Calendar.js

import { useState } from 'react';
import { 
    format, 
    addMonths, 
    subMonths, 
    startOfMonth, 
    endOfMonth, 
    startOfWeek, 
    endOfWeek, 
    eachDayOfInterval, 
    isSameMonth,
    isSameDay
} from 'date-fns';
import { id } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

// Data statis untuk meniru tampilan di gambar
// Di aplikasi nyata, ini akan berasal dari state atau props
const selectedSolidDates = [12, 19];
const selectedRangeDates = [
    [13, 14, 15],
    [16, 17, 18]
];
const underlinedDates = [3, 30];

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date('2028-07-01')); // Set ke Juli 2028 seperti di gambar

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Minggu sebagai hari pertama
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white p-4 rounded-2xl shadow-sm h-full">
            {/* Header Kalender */}
            <div className="flex items-center justify-between mb-4">
                <button className="flex items-center gap-2 text-lg font-bold text-gray-800 hover:text-blue-600">
                    {format(currentDate, 'MMMM yyyy', { locale: id })}
                    <ChevronDown size={20} className="mt-1" />
                </button>
                <div className="flex items-center space-x-1">
                    <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Grid Kalender */}
            <div className="grid grid-cols-7 text-center">
                {/* Header Hari */}
                {daysOfWeek.map(day => (
                    <div key={day} className="text-xs font-semibold text-gray-400 py-2">{day}</div>
                ))}

                {/* Tanggal */}
                {days.map((day, i) => {
                    const dayNumber = parseInt(format(day, 'd'));
                    const isCurrentMonth = isSameMonth(day, currentDate);

                    // Cek tipe styling untuk hari ini
                    const isSolid = isCurrentMonth && selectedSolidDates.includes(dayNumber);
                    const isInRange = isCurrentMonth && selectedRangeDates.flat().includes(dayNumber);
                    const isUnderlined = isCurrentMonth && underlinedDates.includes(dayNumber);
                    
                    // Menentukan kelas styling
                    let dayClasses = 'w-9 h-9 flex items-center justify-center text-sm cursor-pointer relative';
                    
                    if (!isCurrentMonth) {
                        dayClasses += ' text-gray-300';
                    } else if (isSolid) {
                        dayClasses += ' bg-blue-500 text-white font-bold rounded-lg';
                    } else if (isInRange) {
                        dayClasses += ' bg-sky-100 text-gray-800';
                        // Logika untuk sudut membulat pada rentang
                        if (selectedRangeDates.some(range => range[0] === dayNumber - 1)) dayClasses += ' rounded-l-lg';
                        if (selectedRangeDates.some(range => range[range.length - 1] === dayNumber + 1)) dayClasses += ' rounded-r-lg';
                    } else {
                         dayClasses += ' text-gray-700 hover:bg-gray-100 rounded-lg';
                    }

                    return (
                        <div key={i} className="flex justify-center items-center h-9">
                             <div className={dayClasses}>
                                 {format(day, 'd')}
                                 {isUnderlined && (
                                    <span className="absolute bottom-1.5 w-4 h-0.5 bg-blue-400 rounded-full"></span>
                                 )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}