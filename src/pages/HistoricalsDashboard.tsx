import { useState, useEffect } from 'preact/hooks';
import { fetchHolidays } from '../services/api';
import type { AsyncState } from '../types';
import type { Holiday } from '../historical.types';

export function HistoricalsDashboard() {
  const [holidays, setHolidays] = useState<AsyncState<Holiday[]>>({ data: null, loading: true, error: null });

  // Step 1: Fetch Holidays
  useEffect(() => {
    fetchHolidays()
      .then((data) => setHolidays({ data, loading: false, error: null }))
      .catch((err: Error) => setHolidays({ data: null, loading: false, error: err.message }));
  }, []);

  return (
    <div class="app-layout">
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
