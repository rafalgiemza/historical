import { useState, useEffect } from "preact/hooks";
import type { AsyncState } from "../types";
import type { HistoricalRun, EmailRun, OptimaRun } from "../historical.types";
import { fetchEmailRuns, fetchOptimaRuns } from "../services/api";

interface HistoricalsDrawerProps {
  run: HistoricalRun | null;
  onClose: () => void;
}

type Tab = "email" | "optima";

const INITIAL_EMAIL_RUNS: AsyncState<EmailRun[]> = { data: null, loading: false, error: null };
const INITIAL_OPTIMA_RUNS: AsyncState<OptimaRun[]> = { data: null, loading: false, error: null };

export function HistoricalsDrawer({ run, onClose }: HistoricalsDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>("email");
  const [emailRuns, setEmailRuns] = useState<AsyncState<EmailRun[]>>(INITIAL_EMAIL_RUNS);
  const [optimaRuns, setOptimaRuns] = useState<AsyncState<OptimaRun[]>>(INITIAL_OPTIMA_RUNS);

  useEffect(() => {
    setEmailRuns(INITIAL_EMAIL_RUNS);
    setOptimaRuns(INITIAL_OPTIMA_RUNS);
    setActiveTab("email");
  }, [run?.valuationDate]);

  useEffect(() => {
    if (!run || activeTab !== "email") return;
    if (emailRuns.data !== null || emailRuns.loading || emailRuns.error !== null) return;

    setEmailRuns({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await fetchEmailRuns(run.valuationDate);
        setEmailRuns({ data, loading: false, error: null });
      } catch (err) {
        setEmailRuns({
          data: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    })();
  }, [run?.valuationDate, activeTab, emailRuns]);

  useEffect(() => {
    if (!run || activeTab !== "optima") return;
    if (optimaRuns.data !== null || optimaRuns.loading || optimaRuns.error !== null) return;

    setOptimaRuns({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await fetchOptimaRuns(run.valuationDate);
        setOptimaRuns({ data, loading: false, error: null });
      } catch (err) {
        setOptimaRuns({
          data: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    })();
  }, [run?.valuationDate, activeTab, optimaRuns]);

  const isOpen = run !== null;

  return (
    <>
      <div
        class={`drawer-backdrop${isOpen ? " drawer-backdrop--visible" : ""}`}
        onClick={onClose}
      />
      <aside class={`drawer${isOpen ? " drawer--open" : ""}`}>
        {run && (
          <>
            <div class="drawer-header">
              <div class="drawer-run-info">
                <h2 class="drawer-run-title">Valuation: {run.valuationDate}</h2>
                <p class="drawer-run-detail">
                  Counterparties: {run.totalCounterparty}
                </p>
                <p class="drawer-run-detail">
                  {run.startDate} – {run.endDate}
                </p>
              </div>
              <button
                class="drawer-close"
                onClick={onClose}
                aria-label="Zamknij"
              >
                ×
              </button>
            </div>

            <div class="drawer-tabs">
              <button
                class={`tab-btn${activeTab === "email" ? " tab-btn--active" : ""}`}
                onClick={() => setActiveTab("email")}
              >
                Email Runs
              </button>
              <button
                class={`tab-btn${activeTab === "optima" ? " tab-btn--active" : ""}`}
                onClick={() => setActiveTab("optima")}
              >
                Optima Runs
              </button>
            </div>

            <div class="drawer-content">
              {activeTab === "email" && (
                <EmailRunsTabContent emailRuns={emailRuns} />
              )}
              {activeTab === "optima" && (
                <OptimaRunsTabContent optimaRuns={optimaRuns} />
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function EmailRunsTabContent({
  emailRuns,
}: {
  emailRuns: AsyncState<EmailRun[]>;
}) {
  if (emailRuns.loading) {
    return (
      <div class="tab-state">
        <div class="spinner" />
        <p>Loading email runs…</p>
      </div>
    );
  }
  if (emailRuns.error) {
    return (
      <div class="tab-state tab-state--error">
        <p>Error: {emailRuns.error}</p>
      </div>
    );
  }
  if (!emailRuns.data || emailRuns.data.length === 0) {
    return (
      <div class="tab-state">
        <p>No email runs.</p>
      </div>
    );
  }
  return (
    <table>
      <thead>
        <tr>
          <th>File ID</th>
          <th>Batch Start</th>
          <th>Batch End</th>
        </tr>
      </thead>
      <tbody>
        {emailRuns.data.map((run) => (
          <tr key={run.fileId}>
            <td>{run.fileId}</td>
            <td>{run.batchStartDate}</td>
            <td>{run.batchEndDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function OptimaRunsTabContent({
  optimaRuns,
}: {
  optimaRuns: AsyncState<OptimaRun[]>;
}) {
  if (optimaRuns.loading) {
    return (
      <div class="tab-state">
        <div class="spinner" />
        <p>Loading optima runs…</p>
      </div>
    );
  }
  if (optimaRuns.error) {
    return (
      <div class="tab-state tab-state--error">
        <p>Error: {optimaRuns.error}</p>
      </div>
    );
  }
  if (!optimaRuns.data || optimaRuns.data.length === 0) {
    return (
      <div class="tab-state">
        <p>No optima runs.</p>
      </div>
    );
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Aging</th>
          <th>Batch Start</th>
          <th>Batch End</th>
        </tr>
      </thead>
      <tbody>
        {optimaRuns.data.map((run) => (
          <tr key={`${run.batchStartDate}-${run.batchEndDate}`}>
            <td>{run.aging}</td>
            <td>{run.batchStartDate}</td>
            <td>{run.batchEndDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
