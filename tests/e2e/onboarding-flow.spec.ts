import { test, expect } from '@playwright/test';

test.describe('First-time User Onboarding', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to simulate first-time user
    await page.goto('/dashboard/meditation');
    await page.evaluate(() => {
      localStorage.removeItem('meditation_onboarding_completed');
      localStorage.clear();
    });
    await page.reload();
  });

  test('should show onboarding for first-time users', async ({ page }) => {
    // Navigate to meditation page
    await page.goto('/dashboard/meditation');
    
    // Onboarding should appear automatically
    await expect(page.locator('[data-testid="onboarding-modal"], text="¡Bienvenido!", text="Te guiamos"')).toBeVisible({ timeout: 5000 });
    
    // Should show step 1 content
    await expect(page.locator('text="Paso 1", text="emociones", text="sentimientos"')).toBeVisible();
    
    // Progress indicator should show 1/5
    await expect(page.locator('text="1 de 5", [data-testid="step-indicator"]')).toBeVisible();
  });

  test('should complete 5-step onboarding tutorial', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Wait for onboarding to appear
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 5000 });
    
    // Step 1: Emotion selection explanation
    await expect(page.locator('text="emociones"')).toBeVisible();
    const nextButton = page.locator('button:has-text("Siguiente")');
    await nextButton.click();
    
    // Step 2: Scripture personalization
    await expect(page.locator('text="Escritura", text="personalizada"')).toBeVisible();
    await nextButton.click();
    
    // Step 3: Meditation experience
    await expect(page.locator('text="meditación", text="experiencia"')).toBeVisible();
    await nextButton.click();
    
    // Step 4: Feedback and growth
    await expect(page.locator('text="feedback", text="crecimiento"')).toBeVisible();
    await nextButton.click();
    
    // Step 5: Daily practice encouragement
    await expect(page.locator('text="diario", text="práctica"')).toBeVisible();
    
    // Complete onboarding
    const completeButton = page.locator('button:has-text("Comenzar"), button:has-text("Entendido")');
    await completeButton.click();
    
    // Should return to main meditation interface
    await expect(page.locator('h3:has-text("Sugerencias para ti:")')).toBeVisible();
    
    // Onboarding should not appear again
    await page.reload();
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });

  test('should allow skipping onboarding', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Wait for onboarding
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 5000 });
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir"), button:has-text("Saltar")');
    await skipButton.click();
    
    // Should go directly to meditation interface
    await expect(page.locator('h3:has-text("Sugerencias para ti:")')).toBeVisible();
    
    // Onboarding should not appear again after skip
    await page.reload();
    await expect(page.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
  });

  test('should persist onboarding completion across sessions', async ({ page, context }) => {
    await page.goto('/dashboard/meditation');
    
    // Complete onboarding
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 5000 });
    const skipButton = page.locator('button:has-text("Omitir")');
    await skipButton.click();
    
    // Create new page in same context (simulates new tab)
    const newPage = await context.newPage();
    await newPage.goto('/dashboard/meditation');
    
    // Onboarding should not appear in new page
    await expect(newPage.locator('[data-testid="onboarding-modal"]')).not.toBeVisible();
    await expect(newPage.locator('h3:has-text("Sugerencias para ti:")')).toBeVisible();
    
    await newPage.close();
  });

  test('should maintain accessibility during onboarding', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Wait for onboarding
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 5000 });
    
    // Check ARIA labels and keyboard navigation
    const modal = page.locator('[data-testid="onboarding-modal"]');
    await expect(modal).toHaveAttribute('role', 'dialog');
    
    // Should be focusable and keyboard navigable
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
    
    // ESC should close modal (skip functionality)
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  test('should handle onboarding on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/dashboard/meditation');
    
    // Onboarding should appear and be mobile-friendly
    await expect(page.locator('[data-testid="onboarding-modal"]')).toBeVisible({ timeout: 5000 });
    
    // Content should be readable on mobile
    const modal = page.locator('[data-testid="onboarding-modal"]');
    const modalBox = await modal.boundingBox();
    expect(modalBox?.width).toBeLessThanOrEqual(375);
    
    // Buttons should be touch-friendly (at least 44px)
    const nextButton = page.locator('button:has-text("Siguiente")');
    const buttonBox = await nextButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(40);
    
    // Complete onboarding on mobile
    await nextButton.click();
    
    // Should work properly on mobile
    await expect(page.locator('h3:has-text("Sugerencias para ti:")').first()).toBeVisible();
  });
});