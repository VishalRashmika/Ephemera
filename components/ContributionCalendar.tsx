
import React, { useMemo } from 'react';
import { Bookmark } from '../types';

interface ContributionCalendarProps {
  bookmarks: Bookmark[];
}

const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ bookmarks }) => {
  // Generate actual contribution data based on bookmarks
  const weeks = useMemo(() => {
    const now = new Date();
    const weeksData: number[][] = [];
    
    // Start from 52 weeks ago
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364); // 52 weeks * 7 days
    
    // Adjust to start on Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    // Generate 52 weeks of data
    for (let week = 0; week < 52; week++) {
      const weekData: number[] = [];
      
      for (let day = 0; day < 7; day++) {
        // Calculate the current day we're processing
        const dayOffset = (week * 7) + day;
        const currentDate = new Date(startDate.getTime());
        currentDate.setDate(currentDate.getDate() + dayOffset);
        
        // Get start and end of this day
        const dayStart = new Date(currentDate);
        dayStart.setHours(0, 0, 0, 0);
        
        const dayEnd = new Date(currentDate);
        dayEnd.setHours(23, 59, 59, 999);
        
        // Count bookmarks created on this day
        const count = bookmarks.filter(b => {
          const bookmarkDate = b.createdAt;
          return bookmarkDate >= dayStart.getTime() && bookmarkDate <= dayEnd.getTime();
        }).length;
        
        weekData.push(count);
      }
      
      weeksData.push(weekData);
    }
    
    return weeksData;
  }, [bookmarks]);

  const getColor = (level: number) => {
    if (level === 0) return 'bg-gold/10 dark:bg-steel/10';
    if (level === 1) return 'bg-sage/40 dark:bg-teal/40';
    if (level === 2) return 'bg-sage/60 dark:bg-teal/60';
    if (level === 3) return 'bg-sage/80 dark:bg-teal/80';
    if (level >= 4) return 'bg-navy dark:bg-teal';
    return 'bg-gold/10';
  };

  const getDateForCell = (weekIndex: number, dayIndex: number): Date => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - 364);
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);
    
    const dayOffset = (weekIndex * 7) + dayIndex;
    const cellDate = new Date(startDate.getTime());
    cellDate.setDate(cellDate.getDate() + dayOffset);
    return cellDate;
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-gold/20 dark:bg-deepslate dark:border-steel/30">
      <h3 className="text-sm font-semibold mb-6">Activity Timeline</h3>
      <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {week.map((level, di) => {
              const cellDate = getDateForCell(wi, di);
              const dateStr = cellDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              return (
                <div 
                  key={di} 
                  className={`w-3 h-3 rounded-sm ${getColor(level)} transition-colors hover:ring-1 hover:ring-gold dark:hover:ring-teal`} 
                  title={`${dateStr}: ${level} bookmark${level !== 1 ? 's' : ''}`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-end gap-2 text-[10px] text-slate/60 dark:text-lightgrey/60">
        <span>Less</span>
        <div className="w-2 h-2 rounded-sm bg-gold/10 dark:bg-steel/10" />
        <div className="w-2 h-2 rounded-sm bg-sage/40 dark:bg-teal/40" />
        <div className="w-2 h-2 rounded-sm bg-sage/60 dark:bg-teal/60" />
        <div className="w-2 h-2 rounded-sm bg-sage/80 dark:bg-teal/80" />
        <div className="w-2 h-2 rounded-sm bg-navy dark:bg-teal" />
        <span>More</span>
      </div>
    </div>
  );
};

export default ContributionCalendar;
