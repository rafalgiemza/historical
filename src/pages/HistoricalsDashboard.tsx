import { useState, useEffect } from "preact/hooks";
import { fetchHolidays } from "../services/api";
import type { AsyncState } from "../types";
import type { Holiday } from "../historical.types";
import {
  HistoricalsHeader,
  type DateRange,
} from "../components/HistoricalsHeader";
import { HistoricalsContent } from "../components/HistoricalsContent";

function formatMDY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${mm}/${dd}/${date.getFullYear()}`;
}

function addBusinessDays(start: Date, days: number, holidays: Holiday[]): Date {
  const holidaySet = new Set(holidays.map((h) => h.date));
  let count = 0;
  const current = new Date(start);
  while (count < days) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (
      dayOfWeek !== 0 &&
      dayOfWeek !== 6 &&
      !holidaySet.has(formatMDY(current))
    ) {
      count++;
    }
  }
  return current;
}

const initialState: AsyncState<never> = {
  data: null,
  loading: true,
  error: null,
};

const initialDateRange: DateRange = {
  startDate: null,
  endDate: null,
};

export function HistoricalsDashboard() {
  const [holidays, setHolidays] = useState<AsyncState<Holiday[]>>(initialState);
  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHolidays();
        setHolidays({ data, loading: false, error: null });
      } catch (err) {
        setHolidays({
          data: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    })();
  }, []);

  useEffect(() => {
    if (holidays.data) {
      setDateRange((prev) => ({
        ...prev,
        startDate: addBusinessDays(new Date(), 14, holidays.data!),
      }));
    }
  }, [holidays.data]);

  if (!holidays.data) {
    return <p>Loading...</p>;
  }

  return (
    <div class="app-layout">
      <HistoricalsHeader
        dateRange={dateRange}
        onSubmit={setDateRange}
        holidays={holidays.data}
      />
      <HistoricalsContent />
    </div>
  );
}
