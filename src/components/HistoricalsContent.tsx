import { useState, useEffect } from "preact/hooks";
import { fetchHistoricalRuns } from "../services/api";
import type { AsyncState } from "../types";
import type { HistoricalRun } from "../historical.types";
import { HistoricalsDrawer } from "./HistoricalsDrawer";

export function HistoricalsContent() {
  const [historicalRuns, setHistoricalRuns] = useState<
    AsyncState<HistoricalRun[]>
  >({ data: null, loading: true, error: null });
  const [selectedRun, setSelectedRun] = useState<HistoricalRun | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHistoricalRuns();
        setHistoricalRuns({ data, loading: false, error: null });
      } catch (err) {
        setHistoricalRuns({
          data: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    })();
  }, []);

  return (
    <>
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
                    class="run-row"
                    onClick={() => setSelectedRun(run)}
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
      <HistoricalsDrawer
        run={selectedRun}
        onClose={() => setSelectedRun(null)}
      />
    </>
  );
}
