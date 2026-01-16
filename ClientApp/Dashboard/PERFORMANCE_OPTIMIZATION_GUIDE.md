# Performance Optimization Guide

This guide covers all performance optimizations implemented in the Dashboard application.

## Overview

The Dashboard is optimized for:
- **Fast Initial Load**: < 2 seconds
- **Smooth Interactions**: 60 FPS
- **Low Memory Usage**: < 100 MB
- **Quick API Responses**: < 500ms

## Implemented Optimizations

### 1. Code Splitting & Lazy Loading

#### Route-Based Code Splitting

All routes are lazy-loaded using React.lazy():

```tsx
// App.tsx
const DashboardOverview = React.lazy(() => import('./pages').then(module => ({ default: module.DashboardOverview })));
const PostsManagement = React.lazy(() => import('./pages').then(module => ({ default: module.PostsManagement })));
```

**Benefits**:
- Reduces initial bundle size
- Loads code only when needed
- Faster initial page load

#### Component-Level Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function MyPage() {
  return (
    <Suspense fallback={<Loading />}>
      <HeavyComponent />
    </Suspense>
  );
}
```

### 2. Image Optimization

#### Lazy Image Loading

```tsx
import { LazyImage } from '@/components/shared/LazyImage';

function Gallery() {
  return (
    <LazyImage
      src="/large-image.jpg"
      alt="Description"
      placeholder="/placeholder.jpg"
      className="w-full h-auto"
    />
  );
}
```

**Features**:
- Loads images only when visible
- Shows placeholder while loading
- Smooth fade-in transition
- Reduces initial bandwidth

#### Lazy Background Images

```tsx
import { LazyBackground } from '@/components/shared/LazyImage';

function Hero() {
  return (
    <LazyBackground
      src="/hero-bg.jpg"
      placeholder="/hero-placeholder.jpg"
      className="h-96"
    >
      <h1>Hero Content</h1>
    </LazyBackground>
  );
}
```

### 3. Virtual Scrolling

For large lists (> 100 items), use virtual scrolling:

```tsx
import { VirtualList } from '@/components/shared/VirtualList';

function LargeList({ items }) {
  return (
    <VirtualList
      items={items}
      itemHeight={80}
      containerHeight={600}
      renderItem={(item, index) => (
        <div className="p-4 border-b">
          {item.title}
        </div>
      )}
    />
  );
}
```

**Benefits**:
- Renders only visible items
- Handles 10,000+ items smoothly
- Constant memory usage
- 60 FPS scrolling

#### Virtual Grid

```tsx
import { VirtualGrid } from '@/components/shared/VirtualList';

function ImageGallery({ images }) {
  return (
    <VirtualGrid
      items={images}
      itemWidth={200}
      itemHeight={200}
      containerWidth={1200}
      containerHeight={800}
      gap={16}
      renderItem={(image) => (
        <img src={image.url} alt={image.title} />
      )}
    />
  );
}
```

### 4. Caching Strategy

#### API Response Caching

```tsx
// Automatic caching in API services
async getPosts(params) {
  return this.get('/posts', {
    cache: true,
    cacheTTL: 60000 // 1 minute
  });
}
```

**Cache Configuration**:
- Short-lived: 30s (comments, likes)
- Medium-lived: 2min (posts, reviews)
- Long-lived: 5min (profiles, categories)
- Very long-lived: 15min (system config)

#### Cache Warming

Preloads critical data on app start:

```tsx
// Automatically runs on app start
cacheWarmingService.warmCache();
```

### 5. Memoization

#### React.memo

Prevent unnecessary re-renders:

```tsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Complex rendering logic
  return <div>{/* ... */}</div>;
});
```

#### useMemo

Memoize expensive calculations:

```tsx
import { useMemo } from 'react';

function DataTable({ data }) {
  const sortedData = useMemo(() => {
    return data.sort((a, b) => a.value - b.value);
  }, [data]);

  return <Table data={sortedData} />;
}
```

#### useCallback

Memoize callback functions:

```tsx
import { useCallback } from 'react';

function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={handleClick} />;
}
```

### 6. Debouncing & Throttling

#### Debounced Search

```tsx
import { useDebounce } from '@/hooks/usePerformance';

function SearchInput() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    // API call with debounced value
    fetchResults(debouncedSearch);
  }, [debouncedSearch]);

  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

#### Throttled Scroll

```tsx
import { useThrottle } from '@/hooks/usePerformance';

function InfiniteScroll() {
  const handleScroll = useThrottle((e) => {
    // Handle scroll
  }, 100);

  return <div onScroll={handleScroll}>{/* Content */}</div>;
}
```

### 7. Bundle Optimization

#### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
          'chart-vendor': ['chart.js', 'react-chartjs-2']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
```

#### Tree Shaking

Import only what you need:

```tsx
// ✅ Good
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// ❌ Avoid
import * as React from 'react';
import * as Components from '@/components';
```

### 8. Performance Monitoring

#### Performance Monitor Component

```tsx
import { PerformanceMonitor } from '@/components/admin/PerformanceMonitor';

function App() {
  return (
    <>
      <YourApp />
      {import.meta.env.DEV && <PerformanceMonitor />}
    </>
  );
}
```

**Features**:
- Real-time FPS monitoring
- Memory usage tracking
- Load timing metrics
- Toggle with Ctrl+Shift+P

#### Custom Performance Hooks

```tsx
import { useRenderPerformance, useMountTime } from '@/hooks/usePerformance';

function MyComponent() {
  useRenderPerformance('MyComponent');
  useMountTime('MyComponent');

  return <div>{/* Content */}</div>;
}
```

### 9. Network Optimization

#### Request Batching

```tsx
// Batch multiple requests
const [posts, users, comments] = await Promise.all([
  fetchPosts(),
  fetchUsers(),
  fetchComments()
]);
```

#### Request Cancellation

```tsx
useEffect(() => {
  const controller = new AbortController();

  fetch('/api/data', { signal: controller.signal })
    .then(response => response.json())
    .then(data => setData(data));

  return () => controller.abort();
}, []);
```

#### Compression

All API responses are gzip compressed (handled by backend).

### 10. Rendering Optimization

#### Avoid Inline Functions

```tsx
// ❌ Avoid
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good
const handleButtonClick = useCallback(() => handleClick(id), [id]);
<button onClick={handleButtonClick}>Click</button>
```

#### Avoid Inline Objects

```tsx
// ❌ Avoid
<Component style={{ margin: 10 }} />

// ✅ Good
const style = useMemo(() => ({ margin: 10 }), []);
<Component style={style} />
```

#### Key Prop Optimization

```tsx
// ✅ Use stable, unique keys
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// ❌ Avoid index as key
{items.map((item, index) => (
  <Item key={index} data={item} />
))}
```

### 11. State Management Optimization

#### Local State Over Global

```tsx
// ✅ Good - Local state
function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ❌ Avoid - Global state for local data
// Don't use Redux/Context for component-specific state
```

#### State Colocation

Keep state close to where it's used:

```tsx
// ✅ Good
function Parent() {
  return (
    <>
      <ComponentA />
      <ComponentB />
    </>
  );
}

function ComponentA() {
  const [state, setState] = useState();
  // Use state only in ComponentA
}
```

### 12. CSS Optimization

#### Tailwind CSS Purging

Unused CSS is automatically removed in production build.

#### CSS-in-JS Optimization

Use Tailwind classes instead of inline styles:

```tsx
// ✅ Good
<div className="p-4 bg-primary text-white rounded-lg">

// ❌ Avoid
<div style={{ padding: '1rem', background: 'blue', color: 'white', borderRadius: '0.5rem' }}>
```

## Performance Metrics

### Target Metrics

- **First Contentful Paint (FCP)**: < 1.5s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Time to Interactive (TTI)**: < 3.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Monitoring

Use the Performance Monitor component (Ctrl+Shift+P) to track:
- FPS (target: 60)
- Memory usage (target: < 100 MB)
- Load times
- API response times

## Best Practices Checklist

- [ ] Use React.lazy() for route-based code splitting
- [ ] Implement lazy loading for images
- [ ] Use virtual scrolling for lists > 100 items
- [ ] Enable API response caching
- [ ] Memoize expensive calculations with useMemo
- [ ] Memoize callbacks with useCallback
- [ ] Wrap pure components with React.memo
- [ ] Debounce search inputs
- [ ] Throttle scroll handlers
- [ ] Use stable keys in lists
- [ ] Avoid inline functions and objects
- [ ] Keep state local when possible
- [ ] Use Tailwind classes over inline styles
- [ ] Monitor performance in development
- [ ] Test on low-end devices
- [ ] Measure before and after optimizations

## Tools

### Development

- **React DevTools Profiler**: Identify slow components
- **Chrome DevTools Performance**: Record and analyze performance
- **Lighthouse**: Audit performance, accessibility, SEO
- **Bundle Analyzer**: Visualize bundle size

### Production

- **Web Vitals**: Monitor Core Web Vitals
- **Performance Observer API**: Track real user metrics
- **Error Tracking**: Monitor performance issues

## Common Issues & Solutions

### Issue: Slow Initial Load

**Solutions**:
- Enable code splitting
- Lazy load routes
- Optimize images
- Enable compression
- Use CDN for static assets

### Issue: Janky Scrolling

**Solutions**:
- Use virtual scrolling
- Throttle scroll handlers
- Avoid expensive calculations during scroll
- Use CSS transforms instead of position changes

### Issue: High Memory Usage

**Solutions**:
- Clean up event listeners
- Cancel pending requests
- Clear intervals/timeouts
- Use virtual scrolling
- Implement pagination

### Issue: Slow Re-renders

**Solutions**:
- Use React.memo
- Memoize callbacks and values
- Avoid inline functions/objects
- Split large components
- Use proper keys

## Testing Performance

### Lighthouse Audit

```bash
npm run build
npm run preview
# Open Chrome DevTools > Lighthouse > Run audit
```

### Bundle Analysis

```bash
npm run build:analyze
```

### Load Testing

Test with slow network:
1. Chrome DevTools > Network
2. Select "Slow 3G" or "Fast 3G"
3. Test user flows

## Continuous Optimization

1. **Monitor**: Track metrics regularly
2. **Measure**: Use profiling tools
3. **Optimize**: Apply targeted improvements
4. **Verify**: Measure impact of changes
5. **Iterate**: Repeat the process

## Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Web Vitals](https://web.dev/vitals/)
- [Vite Performance](https://vitejs.dev/guide/performance.html)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)
