import { useState, useEffect, useRef } from 'preact/hooks';
import type { AsyncState } from '../types';
import type { HistoricalRun, EmailRun, OptimaRun } from '../historical.types';
import { fetchEmailRuns, fetchOptimaRuns } from '../services/api';

interface HistoricalsDrawerProps {
  run: HistoricalRun | null;
  onClose: () => void;
}

type Tab = 'email' | 'optima';

export function HistoricalsDrawer({ run, onClose }: HistoricalsDrawerProps) {
  const [activeTab, setActiveTab] = useState<Tab>('email');
  const [emailRuns, setEmailRuns] = useState<AsyncState<EmailRun[]>>({ data: null, loading: false, error: null });
  const [optimaRuns, setOptimaRuns] = useState<AsyncState<OptimaRun[]>>({ data: null, loading: false, error: null });

  const emailLoadedFor = useRef<string | null>(null);
  const optimaLoadedFor = useRef<string | null>(null);

  useEffect(() => {
    emailLoadedFor.current = null;
    optimaLoadedFor.current = null;
    setEmailRuns({ data: null, loading: false, error: null });
    setOptimaRuns({ data: null, loading: false, error: null });
    setActiveTab('email');
  }, [run?.valuationDate]);

  useEffect(() => {
    if (!run || activeTab !== 'email') return;
    if (emailLoadedFor.current === run.valuationDate) return;

    emailLoadedFor.current = run.valuationDate;
    setEmailRuns({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await fetchEmailRuns();
        setEmailRuns({ data, loading: false, error: null });
      } catch (err) {
        emailLoadedFor.current = null;
        setEmailRuns({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, [run?.valuationDate, activeTab]);

  useEffect(() => {
    if (!run || activeTab !== 'optima') return;
    if (optimaLoadedFor.current === run.valuationDate) return;

    optimaLoadedFor.current = run.valuationDate;
    setOptimaRuns({ data: null, loading: true, error: null });

    (async () => {
      try {
        const data = await fetchOptimaRuns();
        setOptimaRuns({ data, loading: false, error: null });
      } catch (err) {
        optimaLoadedFor.current = null;
        setOptimaRuns({ data: null, loading: false, error: (err as Error).message });
      }
    })();
  }, [run?.valuationDate, activeTab]);

  const isOpen = run !== null;

  return (
    <>
      <div
        class={`drawer-backdrop${isOpen ? ' drawer-backdrop--visible' : ''}`}
        onClick={onClose}
      />
      <aside class={`drawer${isOpen ? ' drawer--open' : ''}`}>
        {run && (
          <>
            <div class="drawer-header">
              <div class="drawer-user-info">
                <h2 class="drawer-user-name">Valuation: {run.valuationDate}</h2>
                <p class="drawer-user-email">Counterparties: {run.totalCounterparty}</p>
                <p class="drawer-user-company">{run.startDate} – {run.endDate}</p>
              </div>
              <button class="drawer-close" onClick={onClose} aria-label="Zamknij">
                ×
              </button>
            </div>

            <div class="drawer-tabs">
              <button
                class={`tab-btn${activeTab === 'email' ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                Email Runs
              </button>
              <button
                class={`tab-btn${activeTab === 'optima' ? ' tab-btn--active' : ''}`}
                onClick={() => setActiveTab('optima')}
              >
                Optima Runs
              </button>
            </div>

            <div class="drawer-content">
              {activeTab === 'email' && <EmailRunsTabContent emailRuns={emailRuns} />}
              {activeTab === 'optima' && <OptimaRunsTabContent optimaRuns={optimaRuns} />}
            </div>
          </>
        )}
      </aside>
    </>
  );
}

function EmailRunsTabContent({ emailRuns }: { emailRuns: AsyncState<EmailRun[]> }) {
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

function OptimaRunsTabContent({ optimaRuns }: { optimaRuns: AsyncState<OptimaRun[]> }) {
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
        {optimaRuns.data.map((run, i) => (
          <tr key={i}>
            <td>{run.aging}</td>
            <td>{run.batchStartDate}</td>
            <td>{run.batchEndDate}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
