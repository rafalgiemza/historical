import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { Holiday } from '../historical.types';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface HistoricalsHeaderProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
  holidays: Holiday[] | null;
}

function parseHolidayDate(dateStr: string): Date {
  const [month, day, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
}

function isWeekday(date: Date): boolean {
  const day = date.getDay();
  return day !== 0 && day !== 6;
}

export function HistoricalsHeader({ dateRange, onChange, holidays }: HistoricalsHeaderProps) {
  const excludedDates = (holidays ?? []).map((h) => parseHolidayDate(h.date));

  return (
    <header class="header">
      <div class="header-left">
        <span class="header-title">Historicals</span>
      </div>
      <div class="header-right">
        <label class="filter-label">
          <span class="filter-label-text">Start Date</span>
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => onChange({ ...dateRange, startDate: date })}
            excludeDates={excludedDates}
            filterDate={isWeekday}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
          />
        </label>
        <label class="filter-label">
          <span class="filter-label-text">End Date</span>
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => onChange({ ...dateRange, endDate: date })}
            excludeDates={excludedDates}
            filterDate={isWeekday}
            dateFormat="MM/dd/yyyy"
            placeholderText="MM/dd/yyyy"
          />
        </label>
      </div>
    </header>
  );
}
