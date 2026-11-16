/* Thin fetch wrapper over the FastAPI backend. Calls go to /api/*, which next.config.ts
   proxies to the backend, so the browser never needs the backend URL. */
import type {
  ComparisonResponse,
  DistributionRequest,
  DistributionResponse,
  EncryptResponse,
  ExperimentResponse,
  HealthResponse,
  TeachingRequest,
  TeachingResponse,
  ThresholdRecoverResponse,
  ThresholdSplitResponse,
  UnlockRequest,
  UnlockResponse,
} from "./types";

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(`API ${status}`);
  }

  /** 501 = the backend route exists but the logic is still a stub. */
  get notImplemented() {
    return this.status === 501;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body);
  return body as T;
}

const post = <T>(path: string, data: unknown) => request<T>(path, { method: "POST", body: JSON.stringify(data) });

export const api = {
  health: () => request<HealthResponse>("/health", { cache: "no-store" }),

  // 1–2. Setup + Distribute
  teaching: (body: TeachingRequest) => post<TeachingResponse>("/distribution/teaching", body),
  distribute: (body: DistributionRequest) => post<DistributionResponse>("/distribution/run", body),

  // 3–4. Encrypt + Unlock
  encrypt: (sessionId: string, file: File) => {
    const form = new FormData();
    form.set("session_id", sessionId);
    form.set("file", file);
    return request<EncryptResponse>("/vault/encrypt", { method: "POST", body: form });
  },
  unlock: (body: UnlockRequest) => post<UnlockResponse>("/vault/unlock", body),

  // 5. Classical vs quantum
  compare: (body: { n_participants: number; eve: boolean; rounds?: number }) =>
    post<ComparisonResponse>("/comparison", body),

  // 6. Experiments
  noiseSweep: (body: { n_participants: number; levels?: number[]; rounds?: number; eve?: boolean }) =>
    post<ExperimentResponse>("/experiments/noise-sweep", body),
  scaling: (body: { sizes?: number[]; rounds?: number; depolarizing?: number }) =>
    post<ExperimentResponse>("/experiments/scaling", body),

  // 7. K-of-N
  thresholdSplit: (body: { k: number; n: number; secret_hex?: string }) =>
    post<ThresholdSplitResponse>("/threshold/split", body),
  thresholdRecover: (body: { session_id: string; holders: number[] }) =>
    post<ThresholdRecoverResponse>("/threshold/recover", body),
};
