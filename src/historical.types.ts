export type Holiday = {
  id: number; // e.g. 1
  date: string; // e.g. "05/27/2026"
};

export type HistoricalRun = {
  valuationDate: string; // e.g. "05/27/2026"
  totalCounterparty: number;
  startDate: string; // e.g. "05/27/2026"
  endDate: string; // e.g. "05/27/2026"
};

export type EmailRun = {
  fileId: number;
  batchStartDate: string; // e.g. "05/27/2026"
  batchEndDate: string; // e.g. "05/27/2026"
};

export type OptimaRun = {
  aging: number;
  batchStartDate: string; // e.g. "05/27/2026"
  batchEndDate: string; // e.g. "05/27/2026"
};
