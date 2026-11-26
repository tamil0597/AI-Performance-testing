import { test, expect } from './fixtures';
import { environment } from '../config/env';

test('Browser contexts keep cookies isolated', async ({ createBrowserContext }) => {
  const firstContext = await createBrowserContext();
  const secondContext = await createBrowserContext();

  await firstContext.addCookies([
    {
      name: 'context-marker',
      value: 'first',
      url: environment.baseUrl,
    },
  ]);

  expect(await firstContext.cookies(environment.baseUrl)).toHaveLength(1);
  expect(await secondContext.cookies(environment.baseUrl)).toHaveLength(0);
});
