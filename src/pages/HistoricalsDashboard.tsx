import { useState, useEffect } from 'preact/hooks';
import { fetchHolidays } from '../services/api';
import type { AsyncState } from '../types';
import type { Holiday } from '../historical.types';
import { HistoricalsHeader, type DateRange } from '../components/HistoricalsHeader';

function addBusinessDays(start: Date, days: number, holidays: Holiday[]): Date {
  const holidaySet = new Set(holidays.map((h) => h.date));
  let count = 0;
  const current = new Date(start);
  while (count < days) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = `${String(current.getMonth() + 1).padStart(2, '0')}/${String(current.getDate()).padStart(2, '0')}/${current.getFullYear()}`;
      if (!holidaySet.has(dateStr)) {
        count++;
      }
    }
  }
  return current;
}

export function HistoricalsDashboard() {
  const [holidays, setHolidays] = useState<AsyncState<Holiday[]>>({ data: null, loading: true, error: null });
  const [dateRange, setDateRange] = useState<DateRange>({ startDate: null, endDate: null });

  // Step 1: Fetch Holidays
  useEffect(() => {
    fetchHolidays()
      .then((data) => setHolidays({ data, loading: false, error: null }))
      .catch((err: Error) => setHolidays({ data: null, loading: false, error: err.message }));
  }, []);

  // Step 2: Set startDate to 14 business days from today after holidays are loaded
  useEffect(() => {
    if (holidays.data) {
      setDateRange((prev) => ({ ...prev, startDate: addBusinessDays(new Date(), 14, holidays.data!) }));
    }
  }, [holidays.data]);

  return (
    <div class="app-layout">
      <HistoricalsHeader dateRange={dateRange} onChange={setDateRange} holidays={holidays.data} />
      <main class="app-main">
        <h1>Holidays</h1>
        {holidays.loading && <p>Loading...</p>}
        {holidays.error && <p>Error: {holidays.error}</p>}
        {holidays.data && (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {holidays.data.map((holiday) => (
                <tr key={holiday.id}>
                  <td>{holiday.id}</td>
                  <td>{holiday.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
