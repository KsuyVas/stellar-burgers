import { test, expect } from '@playwright/test';
import { mockIngredients, mockUser, mockOrderResponse } from './mockData';

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      const overlay = document.getElementById(
        'webpack-dev-server-client-overlay'
      );
      if (overlay) {
        overlay.style.display = 'none';
      }
    });

    await page.route('**/api/ingredients', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: mockIngredients
        })
      });
    });

    await page.route('**/api/auth/user', async (route) => {
      const authHeader = route.request().headers()['authorization'];
      if (authHeader) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            user: mockUser
          })
        });
      } else {
        await route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Unauthorized'
          })
        });
      }
    });

    await page.route('**/api/orders', async (route) => {
      if (route.request().method() === 'POST') {
        const authHeader = route.request().headers()['authorization'];
        if (authHeader) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              ...mockOrderResponse
            })
          });
        } else {
          await route.fulfill({
            status: 401,
            contentType: 'application/json',
            body: JSON.stringify({
              success: false,
              message: 'Unauthorized'
            })
          });
        }
      } else {
        await route.continue();
      }
    });

    await page.context().addCookies([
      {
        name: 'accessToken',
        value: 'test-token',
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }
    ]);

    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 10000
    });
  });

  test('Добавление ингредиента из списка в конструктор', async ({ page }) => {
    await page
      .locator('button:has-text("Добавить")')
      .first()
      .click({ force: true });
    const orderButton = page.locator('[data-testid="order-button"]');
    await expect(orderButton).toBeEnabled({ timeout: 5000 });
  });

  test('Работа модального окна ингредиента', async ({ page }) => {
    await page
      .locator('[data-testid="ingredient-card"]')
      .first()
      .click({ force: true });
    await expect(page).toHaveURL(/\/ingredients\/.+/);

    const hasContent = await page.evaluate(() => {
      const text = document.body.textContent || '';
      const image = document.querySelector('img');
      return text.length > 100 && image !== null;
    });
    expect(hasContent).toBe(true);

    await page.goBack();
    await expect(page).toHaveURL('/');
  });

  test('Создание заказа', async ({ page }) => {
    const addButtons = page.locator('button:has-text("Добавить")');
    const count = await addButtons.count();

    await addButtons.first().click({ force: true });
    await page.waitForTimeout(500);

    if (count > 1) {
      await addButtons.nth(1).click({ force: true });
      await page.waitForTimeout(500);
    }

    if (count > 2) {
      await addButtons.nth(2).click({ force: true });
      await page.waitForTimeout(500);
    }

    const constructorState = await page.evaluate(() => {
      const elements = document.querySelectorAll('.constructor-element');
      return {
        totalElements: elements.length
      };
    });
    expect(constructorState.totalElements).toBeGreaterThan(0);

    const orderButton = page.locator('[data-testid="order-button"]');
    await expect(orderButton).toBeEnabled({ timeout: 5000 });
    await orderButton.click({ force: true });

    const orderModal = page.locator('[data-testid="order-modal"]');
    await orderModal.waitFor({ state: 'visible', timeout: 15000 });
    await expect(orderModal).toBeVisible();
    await expect(orderModal).toContainText('12345');

    await page.locator('[data-testid="modal-close"]').click({ force: true });
    await expect(orderModal).not.toBeVisible();
  });
});
