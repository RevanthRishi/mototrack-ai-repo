# Performance & Optimization

## Purpose
Fast initial load, smooth 60fps interactions, low memory. Every screen ships optimized or it doesn't ship.

## 1. Render Performance

### Memoize Heavy Computations
```tsx
// ✅ Use useMemo for derived data
const stats = useMemo(() => {
  if (logs.length === 0) return { avgKmL: 0, totalL: 0 };
  return calculateFuelStats(logs);
}, [logs]);

// ❌ Recompute every render
const stats = calculateFuelStats(logs);
```

### Avoid Inline Functions in Lists
```tsx
// ❌ New function per render, breaks FlatList optimization
<FlatList data={items} renderItem={({ item }) => <Item onPress={() => handlePress(item)} />} />

// ✅ Memoize with useCallback
const renderItem = useCallback(({ item }: { item: Item }) => (
  <Item onPress={() => handlePress(item)} />
), [handlePress]);
```

### List Virtualization
- Always use `FlatList` or `SectionList` for > 20 items.
- Set `keyExtractor`, `getItemLayout` for fixed-height rows.
- For horizontal swipe cards, use `pagingEnabled` + `snapToInterval`.

## 2. Query Optimization

### `staleTime` Per Query
```ts
// Default 5min — adjust by mutation frequency
useQuery({
  queryKey: ['vehicles', userId],
  queryFn: () => getVehicles(userId!),
  staleTime: 5 * 60 * 1000,    // 5min for rarely-changed
  gcTime: 30 * 60 * 1000,        // 30min cache
  retry: 1,                      // fail fast on first try
});
```

### Single Fetch Point
One tab (Garage) fetches. Other tabs read store. No duplicate network calls. (See `store-isolation.md`.)

### `setQueryData` After Mutation
```ts
// ✅ Don't refetch — update cache + store
onSuccess: (newVehicle) => {
  queryClient.setQueryData(['vehicles', userId], (old: VehicleRow[] = []) => [newVehicle, ...old]);
  store.upsertVehicle(newVehicle);
}

// ❌ Forces refetch
onSuccess: () => queryClient.invalidateQueries({ queryKey: ['vehicles'] });
```

## 3. Bundle Size

### Lazy Imports
```tsx
// ✅ Heavy screens loaded on demand
const AIMechanicScreen = lazy(() => import('./ai-mechanic'));

// ❌ All screens loaded upfront
import AIMechanicScreen from './ai-mechanic';
```

### Tree-Shake Lucide Icons
```ts
import { Fuel, Wrench } from 'lucide-react-native'; // named imports only
```

## 4. Animation Performance

### Reanimated 3 Threads
- Use `useSharedValue` + `withTiming` for transforms (not `Animated.timing`).
- Avoid re-renders for animation: use `useAnimatedStyle`.

### Reduce Re-renders During Animation
- Don't put `Animated.View` inside a component that re-renders for data changes.
- Use `entering={FadeIn.duration(700)}` for entry only, not for data updates.

## 5. Image Optimization
- Use `expo-image` (not `Image` from `react-native`) for caching + format conversion.
- Specify `width`/`height` to avoid layout shift.
- Resize images on upload (server-side or via `expo-image-manipulator`).

## 6. Debounce & Throttle

### Search Inputs
```ts
import { useDebounce } from 'use-debounce'; // already in package.json
const [search, setSearch] = useState('');
const [debouncedSearch] = useDebounce(search, 300);
```

### Scroll Events
Throttle `onScroll` to 16ms (60fps).

## 7. Bundle & Build

- Run `npx expo export` before merge to verify bundle size hasn't regressed.
- Reanimated worklets are auto-bundled; no manual config needed.

## Anti-patterns
- `useState` for derived data → `useMemo`
- `useEffect` for computation → `useMemo`
- `FlatList` with `ScrollView` parent → broken virtualization
- Calling `useQuery` in 3+ tab screens for the same data
- `queryClient.invalidateQueries` instead of `setQueryData` in mutations
- `Image` from `react-native` for network images → use `expo-image`

## File Checklist
- [ ] `useMemo` for derived arrays/stats
- [ ] `keyExtractor` on lists > 20 items
- [ ] `staleTime` tuned (not 0)
- [ ] Mutation uses `setQueryData` + `store.upsertX`
- [ ] No `react-native` `Image` for network images
- [ ] Bundle size not regressed
