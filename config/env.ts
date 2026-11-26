export const environment = {
  baseUrl: process.env.ORANGEHRM_BASE_URL ?? 'https://opensource-demo.orangehrmlive.com',
  employeeSearchTerm: process.env.ORANGEHRM_EMPLOYEE_SEARCH_TERM,
  performanceBudgetMs: Number(process.env.PERFORMANCE_BUDGET_MS ?? '12000'),
};

if (!Number.isFinite(environment.performanceBudgetMs) || environment.performanceBudgetMs <= 0) {
  throw new Error('PERFORMANCE_BUDGET_MS must be a positive number.');
}

export function getCredentials(): { username: string; password: string } {
  return {
    username: process.env.ORANGEHRM_USERNAME ?? 'Admin',
    password: process.env.ORANGEHRM_PASSWORD ?? 'admin123',
  };
}
