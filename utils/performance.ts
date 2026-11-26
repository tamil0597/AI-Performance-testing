import { performance as nodePerformance } from 'node:perf_hooks';
import { expect, type Page, type TestInfo } from '@playwright/test';
import { environment } from '../config/env';

interface NavigationMetrics {
  timeToFirstByteMs: number;
  domContentLoadedMs: number;
  loadEventMs: number;
  transferSizeBytes: number;
  resourceCount: number;
}

export async function measureStep(
  page: Page,
  testInfo: TestInfo,
  label: string,
  action: () => Promise<void>,
): Promise<number> {
  const startedAt = nodePerformance.now();
  await action();
  const elapsedMs = Math.round(nodePerformance.now() - startedAt);
  const navigation = await readNavigationMetrics(page);
  const result = {
    label,
    elapsedMs,
    budgetMs: environment.performanceBudgetMs,
    navigation,
  };

  await testInfo.attach(`${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-performance`, {
    body: Buffer.from(JSON.stringify(result, null, 2)),
    contentType: 'application/json',
  });

  expect(elapsedMs, `${label} should complete within the performance budget`).toBeLessThanOrEqual(
    environment.performanceBudgetMs,
  );
  return elapsedMs;
}

export async function recordNavigationMetrics(page: Page, testInfo: TestInfo): Promise<void> {
  const navigation = await readNavigationMetrics(page);
  expect(navigation, 'A browser navigation timing entry should be available').not.toBeNull();

  await testInfo.attach('initial-page-navigation-performance', {
    body: Buffer.from(JSON.stringify(navigation, null, 2)),
    contentType: 'application/json',
  });

  expect(
    navigation!.loadEventMs,
    'Initial page load should complete within the performance budget',
  ).toBeLessThanOrEqual(environment.performanceBudgetMs);
}

async function readNavigationMetrics(page: Page): Promise<NavigationMetrics | null> {
  return page.evaluate(() => {
    const entry = performance
      .getEntries()
      .find((candidate) => candidate.constructor.name === 'PerformanceNavigationTiming');
    if (!entry) {
      return null;
    }

    const navigation = entry as PerformanceNavigationTiming;
    return {
      timeToFirstByteMs: Math.round(navigation.responseStart - navigation.startTime),
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd - navigation.startTime),
      loadEventMs: Math.round(navigation.loadEventEnd - navigation.startTime),
      transferSizeBytes: navigation.transferSize,
      resourceCount: performance.getEntriesByType('resource').length,
    };
  });
}
