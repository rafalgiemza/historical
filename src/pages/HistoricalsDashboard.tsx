import { useState, useEffect } from 'preact/hooks';
import { fetchHolidays, fetchHistoricalRuns } from '../services/api';
import type { AsyncState } from '../types';
import type { Holiday, HistoricalRun } from '../historical.types';
import { HistoricalsHeader, type DateRange } from '../components/HistoricalsHeader';
import { HistoricalsDrawer } from '../components/HistoricalsDrawer';

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
  const [historicalRuns, setHistoricalRuns] = useState<AsyncState<HistoricalRun[]>>({ data: null, loading: true, error: null });
  const [selectedRun, setSelectedRun] = useState<HistoricalRun | null>(null);

  // Step 1: Fetch Holidays
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHolidays();
        setHolidays({ data, loading: false, error: null });
      } catch (err) {
        setHolidays({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, []);

  const holidaysReady = !holidays.loading;

  // Step 2: Set startDate to 14 business days from today after holidays are loaded
  useEffect(() => {
    if (holidays.data) {
      setDateRange((prev) => ({ ...prev, startDate: addBusinessDays(new Date(), 14, holidays.data!) }));
    }
  }, [holidays.data]);

  // Step 2: Fetch historical runs after holidays are loaded
  useEffect(() => {
    if (!holidaysReady) return;
    (async () => {
      try {
        const data = await fetchHistoricalRuns();
        setHistoricalRuns({ data, loading: false, error: null });
      } catch (err) {
        setHistoricalRuns({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, [holidaysReady]);

  return (
    <div class="app-layout">
      <HistoricalsHeader dateRange={dateRange} onChange={setDateRange} holidays={holidays.data} />
      <main class="app-main">
        {historicalRuns.loading && <p>Loading...</p>}
        {historicalRuns.error && <p>Error: {historicalRuns.error}</p>}
        {historicalRuns.data && (
          <>
            <p class="results-count">
              Wyświetlanie {historicalRuns.data.length} runów
            </p>
            <table>
              <thead>
                <tr>
                  <th>Valuation Date</th>
                  <th>Total Counterparty</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                </tr>
              </thead>
              <tbody>
                {historicalRuns.data.map((run) => (
                  <tr
                    key={run.valuationDate}
                    onClick={() => setSelectedRun(run)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>{run.valuationDate}</td>
                    <td>{run.totalCounterparty}</td>
                    <td>{run.startDate}</td>
                    <td>{run.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </main>
      <HistoricalsDrawer run={selectedRun} onClose={() => setSelectedRun(null)} />
    </div>
  );
}
