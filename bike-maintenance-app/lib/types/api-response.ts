/**
 * Centralized API response interface — every backend/DB/API call returns this.
 * Boolean success flag + optional payload + typed error message.
 */
export interface ApiResponse<T = unknown> {
  /** True when the operation succeeded (data present, error absent). */
  success: boolean;
  /** Payload on success; null when failed. */
  data: T | null;
  /** User-facing error message on failure; null when success. */
  error: string | null;
  /** Raw backend / DB error code for debugging (optional). */
  code?: string | null;
  /** In-flight state (UI only). */
  loading?: boolean;
}

/** Success factory */
export function okResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, code: null, loading: false };
}

/** Failure factory */
export function failResponse<T>(message: string, code?: string): ApiResponse<T> {
  return { success: false, data: null, error: message, code: code ?? null, loading: false };
}
