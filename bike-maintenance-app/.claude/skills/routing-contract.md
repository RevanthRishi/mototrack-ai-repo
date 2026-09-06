# Routing Contract

## Purpose

Expo Router uses file-based routing. Navigation must be explicit, typed, and consistent. Route parameters must be handled safely, and navigation must never break between platforms.

## Rule 1: Route parameters are typed and null-checked

Always use `useLocalSearchParams` or `useGlobalSearchParams` for typed access:

```tsx
// ✅ Correct — typed, null-safe
import { useLocalSearchParams } from 'expo-router';

export default function VehicleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useVehicle(id!); // id! after verifying non-null intent
```

```tsx
// ❌ Wrong — params are string | string[] | undefined, not auto-typed
const { id } = useGlobalSearchParams();
const vehicle = useVehicle(id); // id could be string[] or undefined
```

## Rule 2: Use `Link` for in-app navigation, not `TouchableOpacity + router.push`

```tsx
// ✅ Correct — Link handles press state, accessibility, platform differences
import { Link } from 'expo-router';

<Link href={`/vehicle/${vehicle.id}`} asChild>
  <TouchableOpacity data-cy={`vehicle-card-${vehicle.id}`}>
    <Text>{vehicle.name}</Text>
  </TouchableOpacity>
</Link>
```

```tsx
// ⚠️ Acceptable — explicit router.push with data-cy on the trigger
import { useRouter } from 'expo-router';

const router = useRouter();
<TouchableOpacity onPress={() => router.push(`/vehicle/${id}`)} data-cy="edit-vehicle-btn">
```

```tsx
// ❌ Wrong — data-cy on a raw TouchableOpacity with router.push
<TouchableOpacity
  onPress={() => router.push(`/vehicle/${id}`)}
  data-cy="edit-vehicle"
  className="px-4 py-2"
>
  Edit
</TouchableOpacity>
```

## Rule 3: Dynamic routes validate params before use

```tsx
// ✅ Correct — redirect if vehicle ID is missing/invalid
export default function VehicleDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return <Redirect href="/(tabs)" />;
  return <VehicleDetailContent id={id} />;
}
```

```tsx
// ❌ Wrong — using id directly without checking
export default function VehicleDetail() {
  const { id } = useLocalSearchParams();
  const vehicle = useVehicle(id); // id could be undefined
```

## Rule 4: Route groups are explicit in paths

Use full paths when linking between routes. The `(tabs)` group is a layout group, not part of the URL:

```tsx
// ✅ Correct
router.push('/(tabs)');        // → /
router.push('/(tabs)/fuel');    // → /fuel
router.push('/vehicle/add');    // → /vehicle/add
router.push(`/vehicle/${id}`);   // → /vehicle/:id

// ❌ Wrong — unnecessary group in path
router.push('/(tabs)/(tabs)/fuel'); // double group
router.push('/(auth)/login');        // (auth) is not a URL segment
```

## Rule 5: No hardcoded string paths — use route constants

Centralize route paths to prevent typos and drift:

```ts
// lib/routes.ts
export const Routes = {
  tabs: '/(tabs)',
  fuel: '/(tabs)/fuel',
  service: '/(tabs)/service',
  profile: '/(tabs)/profile',
  vehicleDetail: (id: string) => `/vehicle/${id}`,
  vehicleAdd: '/vehicle/add',
  vehicleEdit: (id: string) => `/vehicle/edit/${id}`,
  login: '/(auth)/login',
  register: '/(auth)/register',
} as const;
```

```tsx
// ✅ Correct — uses route constant
import { Routes } from '@/lib/routes';
router.push(Routes.fuel);

// ❌ Wrong — hardcoded string
router.push('/(tabs)/fuel');
```

## Rule 6: Redirect on auth state changes

The root layout (`app/_layout.tsx`) must handle auth redirects:

```tsx
// ✅ On auth change → redirect to correct route
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN' && session) {
    router.replace('/(tabs)');
  }
  if (event === 'SIGNED_OUT') {
    router.replace('/(auth)/login');
  }
});
```

Never mix conditional rendering (`{!user ? <Login /> : <App />}`) with Expo Router navigation. Use redirects consistently.

## Rule 7: `data-cy` on all navigation elements

Every element that navigates to another screen must have `data-cy`:

```tsx
<Link href={Routes.vehicleDetail(vehicle.id)} data-cy={`vehicle-card-${vehicle.id}`}>
```

```tsx
<TouchableOpacity
  onPress={() => router.push(Routes.vehicleEdit(id))}
  data-cy={`vehicle-edit-${id}`}
>
```

## File Structure

```
app/
├── (auth)/              # Auth routes — public
│   ├── login.tsx
│   ├── register.tsx
│   └── onboarding.tsx
├── (tabs)/              # Tab routes — protected, requires session
│   ├── _layout.tsx
│   ├── index.tsx        # Garage
│   ├── fuel.tsx
│   ├── service.tsx
│   ├── ai-mechanic.tsx
│   └── profile.tsx
├── vehicle/             # Stack routes — protected
│   ├── [id].tsx
│   ├── add.tsx
│   └── edit/[id].tsx
├── _layout.tsx          # Root — auth state + redirect logic
└── +not-found.tsx
```

## Anti-patterns

- Using `router.push` without `data-cy` on the trigger
- Unchecked `useLocalSearchParams` leading to runtime crashes
- Mixing `{user ? <Page /> : null}` conditional rendering with routing
- Hardcoded string paths instead of route constants
- Navigating to `(auth)/login` instead of `/(auth)/login` (parentheses are group markers, not URL segments)
