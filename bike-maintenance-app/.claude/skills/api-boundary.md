# API Boundary

## Purpose

All client→server and server→client communication uses a single `ApiResponse<T>` contract. The server (Supabase Edge Functions) and client (`lib/utils/auth.ts`, query hooks) must agree on this shape so errors are handled consistently everywhere.

## Client Contract (`lib/types/api-response.ts`)

```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  error: string | null;
  code?: string | null;
  loading?: boolean;
}

export function okResponse<T>(data: T): ApiResponse<T> {
  return { success: true, data, error: null, code: null, loading: false };
}

export function failResponse<T>(message: string, code?: string): ApiResponse<T> {
  return { success: false, data: null, error: message, code: code ?? null, loading: false };
}
```

## Rule 1: All auth functions return `ApiResponse<T>`

Every function in `lib/utils/auth.ts` follows this pattern:

```ts
export async function signInWithEmail(
  email: string,
  password: string
): Promise<ApiResponse<{ user: User | null; session: Session | null }>> {
  const { data, error } = await getSupabase().auth.signInWithPassword({ email, password });
  if (error) return failResponse(getAuthErrorMessage(error), error.code);
  return okResponse({ user: data.user, session: data.session });
}
```

Do not return `null`, throw errors, or use `Result<>` patterns — use `ApiResponse<T>` everywhere.

## Rule 2: Auth errors are human-readable

Use `getAuthErrorMessage()` from `lib/utils/auth.ts` to map Supabase error codes to user-friendly messages. Never show raw Supabase error messages to users.

```ts
// ✅ Correct
if (error) return failResponse(getAuthErrorMessage(error), error.code);

// ❌ Wrong — raw Supabase message leaks implementation detail
if (error) return failResponse(error.message, error.code);
```

## Rule 3: Auth operations have a timeout

Wrap all `signOut`, `signInWithPassword` calls with a 3-second timeout to prevent the UI from hanging:

```ts
const signOutPromise = signOut();
const timeoutPromise = new Promise<ApiResponse<null>>((resolve) =>
  setTimeout(() => resolve(failResponse('Sign out timed out')), 3000)
);
const res = await Promise.race([signOutPromise, timeoutPromise]);
```

## Rule 4: UI feedback uses `notify()`, never `Alert.alert`

All API errors are surfaced via `notify(message, 'error')` from `useNotification()`. No `Alert.alert` anywhere in the app.

```tsx
// ✅ Correct
const { notify } = useNotification();
const res = await signInWithEmail(email, password);
if (!res.success) { notify(res.error ?? 'Something went wrong', 'error'); return; }

// ❌ Wrong
Alert.alert('Error', res.error ?? 'Something went wrong');
```

## Rule 5: Edge Functions return `ApiResponse<T>`

Every Supabase Edge Function in `supabase/functions/*/` must return:

```ts
Deno.serve(async (req: Request) => {
  // 1. Verify JWT
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return Response.json(
      { success: false, data: null, error: 'Unauthorized', code: 'UNAUTHORIZED' },
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // 2. Return structured response
  try {
    const result = await doSomething();
    return Response.json(
      { success: true, data: result, error: null, code: null },
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return Response.json(
      { success: false, data: null, error: err.message, code: 'INTERNAL_ERROR' },
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
```

Never return raw `{ message }` or throw unhandled errors to the client.

## Rule 6: Payload types are centralized

Request/response payloads are defined in `lib/types/payloads.ts`:

```ts
export interface SignInPayload { email: string; password: string; }
export interface SignUpPayload extends SignInPayload { fullName?: string; }
export interface AddVehiclePayload { user_id: string; make: string; model: string; name: string; year: number; odometer: number; }
// etc.
```

Do not inline anonymous object types in function signatures. Add to `payloads.ts` and export.

## File Checklist

| File | Rule |
|---|---|
| `lib/types/api-response.ts` | Single source of truth for response shape |
| `lib/types/payloads.ts` | All request/response typed payloads |
| `lib/utils/auth.ts` | All auth functions return `ApiResponse<T>`, use `getAuthErrorMessage`, have timeout |
| `supabase/functions/*/index.ts` | Return `{ success, data, error, code }` with correct HTTP status |
| `lib/hooks/*` | Use `okResponse`/`failResponse` for any internal async ops |

## Anti-patterns

- Returning `null` or throwing from an auth function instead of `failResponse`
- Showing `error.message` directly to users
- `Alert.alert` anywhere in the codebase
- Edge function returning non-JSON or throwing unhandled errors
- Inline anonymous types instead of typed payloads
