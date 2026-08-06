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

    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });

    await page.routeFromHAR('./tests/hars/orders.har', {
      url: '**/api/orders',
      update: false
    });

    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false
    });

    await page.addInitScript(() => {
      document.cookie = 'accessToken=test-token; path=/';
      localStorage.setItem('refreshToken', 'test-refresh-token');
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

    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-testid="ingredient-card"]', {
      timeout: 30000
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
    const ingredientName = await page
      .locator('[data-testid="ingredient-card"]')
      .first()
      .locator('.text')
      .nth(1)
      .textContent();

    await page
      .locator('[data-testid="ingredient-card"]')
      .first()
      .click({ force: true });
    await expect(page).toHaveURL(/\/ingredients\/.+/);

    const modal = page.locator('[data-testid="modal"]');
    await expect(modal).toBeVisible({ timeout: 10000 });
    await expect(modal).toContainText(ingredientName || '');

    const hasImage = await page.evaluate(() => {
      const img = document.querySelector('[data-testid="modal"] img');
      return img !== null;
    });
    expect(hasImage).toBe(true);

    await page.locator('[data-testid="modal-close"]').click({ force: true });
    await expect(modal).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('Создание заказа', async ({ page }) => {
    const addButtons = page.locator('button:has-text("Добавить")');
    await addButtons.first().click({ force: true });
    await page.waitForTimeout(500);

    await addButtons.nth(2).click({ force: true });
    await page.waitForTimeout(500);

    const constructorStateBefore = await page.evaluate(() => {
      const elements = document.querySelectorAll('.constructor-element');
      return { totalElements: elements.length };
    });
    expect(constructorStateBefore.totalElements).toBeGreaterThan(0);

    const orderButton = page.locator('[data-testid="order-button"]');
    await expect(orderButton).toBeEnabled({ timeout: 5000 });
    await orderButton.click({ force: true });

    const orderModal = page.locator('[data-testid="order-modal"]');
    await orderModal.waitFor({ state: 'visible', timeout: 15000 });
    await expect(orderModal).toBeVisible();

    const orderNumber = await orderModal.locator('h2').textContent();
    expect(orderNumber).not.toBeNull();
    expect(orderNumber?.length).toBeGreaterThan(0);

    const constructorStateAfter = await page.evaluate(() => {
      const elements = document.querySelectorAll('.constructor-element');
      return { totalElements: elements.length };
    });
    expect(constructorStateAfter.totalElements).toBe(0);

    await page.locator('[data-testid="modal-close"]').click({ force: true });
    await expect(orderModal).not.toBeVisible();
  });
});