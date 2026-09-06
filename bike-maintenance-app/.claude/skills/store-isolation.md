# Store Isolation

## Purpose

All tabs read from the Zustand store (`lib/stores/userDataStore.ts`) as a centralized, pre-fetched mirror. Query hooks live exclusively in `lib/hooks/`. This prevents redundant API calls on tab change and keeps mutation state isolated per data type.

## Rules

### 1. Tab screens read from store selectors only

```tsx
// ✅ Correct — reads from store selector
import { useFuelLogs, useUserErrors, useUserLoading } from '@/lib/stores/userDataStore';

export default function FuelScreen() {
  const logs = useFuelLogs();
  const errors = useUserErrors();
  const loadingState = useUserLoading();
  const loading = loadingState.fuelLogs;
```

```tsx
// ❌ Wrong — query hook in tab screen triggers API call on tab change
import { useFuelLogs } from '@/lib/hooks/useFuelLogs'; // not in tabs
```

### 2. Query hooks live only in `lib/hooks/`

Hooks (`useVehicles`, `useFuelLogs`, `useServiceLogs`) go in `lib/hooks/`. Tab screens must not import query hooks directly.

The single exception: the **Garage tab** (`app/(tabs)/index.tsx`) calls all three query hooks once on mount — this is the only place that triggers fetches.

### 3. `useAuth` is for `user` only, not query keys

```tsx
// ✅ Correct — user comes from auth
const { user } = useAuth();
const { refresh } = useVehicles(user?.id ?? null);

// ❌ Wrong — passing user to multiple hooks in a tab screen
const { user } = useAuth();
useVehicles(user?.id ?? null);
useFuelLogs(user?.id ?? null); // duplicate — garage tab already fetched
```

### 4. Mutation hooks update store, then invalidate

Every mutation in `lib/hooks/` must:

```tsx
onSuccess: (result) => {
  // 1. Update store directly so other tabs see it immediately
  store.upsertVehicle(result);
  // 2. Invalidate in background to sync with server
  queryClient.invalidateQueries({ queryKey: ['vehicles'] });
},
onError: (error) => {
  notify(error.message, 'error');
},
```

Mutation actions available on the store: `upsertVehicle`, `removeVehicle`, `upsertFuelLog`, `removeFuelLog`, `upsertServiceLog`, `removeServiceLog`, `setProfile`.

### 5. Loading and error state comes from store

Hooks must mirror state to the store:

```tsx
useEffect(() => {
  store.setLoading('vehicles', query.isLoading);
  if (query.error) store.setError('vehicles', (query.error as Error).message);
  else if (query.data !== undefined) store.setError('vehicles', null);
}, [query.isLoading, query.error, query.data]);

useEffect(() => {
  if (query.data) store.setVehicles(query.data);
}, [query.data]);
```

Tab screens read `loading` and `error` from `useUserLoading()` / `useUserErrors()`.

### 6. Per-type isolation

The store tracks loading/error per data type:

```ts
loading: { vehicles: boolean; fuelLogs: boolean; serviceLogs: boolean; profile: boolean };
errors:  { vehicles: string | null; fuelLogs: string | null; serviceLogs: string | null; profile: string | null };
```

A failure in fuel logs must not affect vehicle or service tabs. Each tab handles its own loading skeleton and error state independently.

## File Checklist

| Pattern | Allowed location |
|---|---|
| `useVehicles`, `useFuelLogs`, `useServiceLogs` hooks | `lib/hooks/` only |
| Store selectors (`useVehicles()`, etc.) | Anywhere |
| `queryClient.invalidateQueries` | `lib/hooks/` mutation `onSuccess` only |
| `store.setLoading`, `store.setError` | Inside query hook `useEffect` |
| `store.upsertX`, `store.removeX` | Inside mutation hook `onSuccess` |

## Anti-patterns

- `useFuelLogs(userId)` in a tab other than Garage
- Calling `queryClient.refetch()` in a tab screen on mount
- Skipping `store.upsertX()` in a mutation `onSuccess` — other tabs will show stale data
- `store.setLoading` / `store.setError` outside of query hooks
