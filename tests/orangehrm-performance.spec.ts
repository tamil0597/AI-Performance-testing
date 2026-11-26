import { test, expect } from './fixtures';
import { environment } from '../config/env';
import { measureStep } from '../utils/performance';

test('Login reaches the dashboard within the performance budget', async ({ authenticatedPage, dashboardPage }) => {
  await expect(dashboardPage.heading).toBeVisible();
});

test('Dashboard loads its primary widgets within the performance budget', async ({ authenticatedPage, dashboardPage }, testInfo) => {
  await measureStep(authenticatedPage, testInfo, 'Validate dashboard widgets', async () => {
    await dashboardPage.validateDashboard();
  });
});

test('PIM navigation opens the employee information page', async ({ authenticatedPage, dashboardPage, pimPage }, testInfo) => {
  await measureStep(authenticatedPage, testInfo, 'Navigate to PIM', async () => {
    await dashboardPage.openPim();
  });

  await pimPage.validateEmployeeList();
});

test('Employee search returns the configured employee ID', async ({ authenticatedPage, dashboardPage, pimPage }, testInfo) => {
  await measureStep(authenticatedPage, testInfo, 'Navigate to PIM for employee search', async () => {
    await dashboardPage.openPim();
  });

  await pimPage.validateEmployeeList();
  const employeeId = environment.employeeSearchTerm ?? (await pimPage.firstEmployeeId());
  await measureStep(authenticatedPage, testInfo, 'Search employee by ID', async () => {
    await pimPage.searchEmployee(employeeId);
  });
});
