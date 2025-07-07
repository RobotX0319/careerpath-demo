/**
 * Performance Monitoring Utilities
 * 
 * Simplified version for monitoring Core Web Vitals
 */

// Types for performance metrics
export interface PerformanceMetrics {
  LCP: number | null; // Largest Contentful Paint
  FID: number | null; // First Input Delay
  CLS: number | null; // Cumulative Layout Shift
  FCP: number | null; // First Contentful Paint
  TTFB: number | null; // Time to First Byte
  TTI: number | null; // Time to Interactive
  INP: number | null; // Interaction to Next Paint
}

// Initialize performance metrics object
const metrics: PerformanceMetrics = {
  LCP: null,
  FID: null,
  CLS: null,
  FCP: null,
  TTFB: null,
  TTI: null,
  INP: null
};

/**
 * Start performance monitoring
 */
export function initPerformanceMonitoring(): void {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }
  
  // Monitor LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      metrics.LCP = lastEntry.startTime;
      reportMetricToAnalytics('LCP', lastEntry.startTime);
    });
    
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (e) {
    console.warn('LCP monitoring not supported');
  }
  
  // Monitor FCP (First Contentful Paint)
  try {
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      for (const entry of entries) {
        if (entry.name === 'first-contentful-paint') {
          metrics.FCP = entry.startTime;
          reportMetricToAnalytics('FCP', entry.startTime);
          break;
        }
      }
    });
    
    fcpObserver.observe({ type: 'paint', buffered: true });
  } catch (e) {
    console.warn('FCP monitoring not supported');
  }
  
  // Monitor CLS (Cumulative Layout Shift) - simplified version
  try {
    let clsValue = 0;
    
    const clsObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      
      entries.forEach(entry => {
        // Check if entry has the expected properties (type assertions)
        if ('hadRecentInput' in entry && 'value' in entry) {
          const layoutShiftEntry = entry as any;
          
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
            metrics.CLS = clsValue;
            reportMetricToAnalytics('CLS', clsValue);
          }
        }
      });
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
  } catch (e) {
    console.warn('CLS monitoring not supported');
  }
  
  // Monitor FID (First Input Delay) - simplified version
  try {
    const fidObserver = new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      if (firstInput && 'processingStart' in firstInput) {
        const processingStart = (firstInput as any).processingStart;
        metrics.FID = processingStart - firstInput.startTime;
        reportMetricToAnalytics('FID', metrics.FID);
      }
    });
    
    fidObserver.observe({ type: 'first-input', buffered: true });
  } catch (e) {
    console.warn('FID monitoring not supported');
  }
  
  // Measure TTFB (Time to First Byte)
  try {
    window.addEventListener('load', () => {
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries && navigationEntries.length > 0) {
        const navEntry = navigationEntries[0] as any;
        if (navEntry.responseStart) {
          metrics.TTFB = navEntry.responseStart;
          reportMetricToAnalytics('TTFB', navEntry.responseStart);
        }
      }
    });
  } catch (e) {
    console.warn('TTFB monitoring not supported');
  }
}

/**
 * Send metrics to analytics
 */
function reportMetricToAnalytics(metricName: string, value: number): void {
  // Replace with your actual analytics implementation
  console.log(`[Performance] ${metricName}: ${Math.round(value)}ms`);
  
  // Example of sending to Google Analytics 4
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // @ts-ignore
    window.gtag('event', 'web_vitals', {
      metric_name: metricName,
      metric_value: Math.round(value),
      metric_delta: 0,
    });
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics(): PerformanceMetrics {
  return { ...metrics };
}

/**
 * Log performance metrics to console
 */
export function logPerformanceMetrics(): void {
  console.table({
    'LCP (Largest Contentful Paint)': `${metrics.LCP ? Math.round(metrics.LCP) : 'N/A'} ms`,
    'FID (First Input Delay)': `${metrics.FID ? Math.round(metrics.FID) : 'N/A'} ms`,
    'CLS (Cumulative Layout Shift)': metrics.CLS ? metrics.CLS.toFixed(3) : 'N/A',
    'FCP (First Contentful Paint)': `${metrics.FCP ? Math.round(metrics.FCP) : 'N/A'} ms`,
    'TTFB (Time to First Byte)': `${metrics.TTFB ? Math.round(metrics.TTFB) : 'N/A'} ms`,
  });
}

/**
 * Check if performance meets recommended thresholds
 */
export function checkPerformanceStatus(): {
  status: 'good' | 'needs-improvement' | 'poor';
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check LCP
  if (metrics.LCP !== null) {
    if (metrics.LCP > 4000) {
      issues.push('LCP is poor (>4s)');
    } else if (metrics.LCP > 2500) {
      issues.push('LCP needs improvement (>2.5s)');
    }
  }
  
  // Check FID
  if (metrics.FID !== null) {
    if (metrics.FID > 300) {
      issues.push('FID is poor (>300ms)');
    } else if (metrics.FID > 100) {
      issues.push('FID needs improvement (>100ms)');
    }
  }
  
  // Check CLS
  if (metrics.CLS !== null) {
    if (metrics.CLS > 0.25) {
      issues.push('CLS is poor (>0.25)');
    } else if (metrics.CLS > 0.1) {
      issues.push('CLS needs improvement (>0.1)');
    }
  }
  
  // Determine overall status
  let status: 'good' | 'needs-improvement' | 'poor' = 'good';
  
  if (issues.some(issue => issue.includes('poor'))) {
    status = 'poor';
  } else if (issues.length > 0) {
    status = 'needs-improvement';
  }
  
  return { status, issues };
}