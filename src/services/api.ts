import type { User, Post, Comment } from "../types";
import type {
  Holiday,
  HistoricalRun,
  EmailRun,
  OptimaRun,
} from "../historical.types";

const BASE_URL = "https://jsonplaceholder.typicode.com";

export async function fetchAllUsers(): Promise<User[]> {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
  return res.json() as Promise<User[]>;
}

export async function fetchPostsByUser(userId: number): Promise<Post[]> {
  const res = await fetch(`${BASE_URL}/posts?userId=${userId}`);
  if (!res.ok) throw new Error(`Failed to fetch posts: ${res.status}`);
  return res.json() as Promise<Post[]>;
}

const MOCK_HOLIDAYS: Holiday[] = [
  { id: 1, date: "01/01/2026" },
  { id: 2, date: "02/16/2026" },
  { id: 3, date: "04/06/2026" },
  { id: 4, date: "05/01/2026" },
  { id: 5, date: "05/25/2026" },
  { id: 6, date: "12/25/2026" },
  { id: 7, date: "12/26/2026" },
];

export async function fetchHolidays(): Promise<Holiday[]> {
  console.log("👊: fetchHolidays ");
  return Promise.resolve(MOCK_HOLIDAYS);
}

const MOCK_HISTORICAL_RUNS: HistoricalRun[] = [
  {
    valuationDate: "01/15/2026",
    totalCounterparty: 42,
    startDate: "01/01/2026",
    endDate: "01/15/2026",
  },
  {
    valuationDate: "02/15/2026",
    totalCounterparty: 38,
    startDate: "02/01/2026",
    endDate: "02/15/2026",
  },
  {
    valuationDate: "03/15/2026",
    totalCounterparty: 55,
    startDate: "03/01/2026",
    endDate: "03/15/2026",
  },
];

export async function fetchHistoricalRuns(): Promise<HistoricalRun[]> {
  return Promise.resolve(MOCK_HISTORICAL_RUNS);
}

const MOCK_EMAIL_RUNS: EmailRun[] = [
  { fileId: 101, batchStartDate: "01/01/2026", batchEndDate: "01/15/2026" },
  { fileId: 102, batchStartDate: "02/01/2026", batchEndDate: "02/15/2026" },
  { fileId: 103, batchStartDate: "03/01/2026", batchEndDate: "03/15/2026" },
];

export async function fetchEmailRuns(): Promise<EmailRun[]> {
  return Promise.resolve(MOCK_EMAIL_RUNS);
}

const MOCK_OPTIMA_RUNS: OptimaRun[] = [
  { aging: 5, batchStartDate: "01/01/2026", batchEndDate: "01/15/2026" },
  { aging: 12, batchStartDate: "02/01/2026", batchEndDate: "02/15/2026" },
  { aging: 3, batchStartDate: "03/01/2026", batchEndDate: "03/15/2026" },
];

export async function fetchOptimaRuns(): Promise<OptimaRun[]> {
  return Promise.resolve(MOCK_OPTIMA_RUNS);
}

export async function fetchCommentsByPostIds(
  postIds: number[],
): Promise<Comment[]> {
  const results = await Promise.all(
    postIds.map(async (postId) => {
      const res = await fetch(`${BASE_URL}/comments?postId=${postId}`);
      if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
      return res.json() as Promise<Comment[]>;
    }),
  );
  return results.flat();
}
