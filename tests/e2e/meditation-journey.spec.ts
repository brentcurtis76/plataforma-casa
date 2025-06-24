import { test, expect } from '@playwright/test';

test.describe('Complete Meditation Journey', () => {
  test('should complete full meditation flow with auto-favorite', async ({ page }) => {
    // Navigate to meditation page
    await page.goto('/dashboard/meditation');
    
    // Wait for page to load and recommendations to appear
    await expect(page.locator('h3:has-text("Sugerencias para ti:")')).toBeVisible();
    
    // Skip onboarding if present
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Select the first recommended emotion (peace - should be highlighted)
    const peaceRecommendation = page.locator('button').filter({ hasText: 'Paz' }).first();
    await expect(peaceRecommendation).toBeVisible();
    await peaceRecommendation.click();
    
    // Context input should appear
    await expect(page.locator('text=Dios tiene una palabra especial para ti')).toBeVisible();
    
    // Add optional context
    const contextTextarea = page.locator('textarea[placeholder*="contexto"]');
    await contextTextarea.fill('Necesito encontrar calma en medio de las dificultades');
    
    // Start meditation
    await page.locator('button:has-text("Comenzar Meditación")').click();
    
    // Should navigate to meditation session
    await expect(page).toHaveURL(/\/dashboard\/meditation\/session/);
    
    // Wait for scripture to load
    await expect(page.locator('[data-testid="scripture-verse"]')).toBeVisible({ timeout: 10000 });
    
    // Complete the meditation by interacting with controls
    const playButton = page.locator('button[aria-label*="play"], button:has-text("Reproducir")');
    if (await playButton.isVisible()) {
      await playButton.click();
    }
    
    // Skip to feedback (meditation session should have controls)
    const endButton = page.locator('button:has-text("Finalizar"), button:has-text("Terminar")');
    if (await endButton.isVisible()) {
      await endButton.click();
    } else {
      // If no end button, look for feedback section directly
      await page.waitForSelector('[data-testid="feedback-section"], text="¿Cómo tocó tu corazón"', { timeout: 15000 });
    }
    
    // Give high rating (4-5 stars) to trigger auto-favorite
    const fourthStar = page.locator('[data-testid="rating-star-4"], .rating-star').nth(3);
    await expect(fourthStar).toBeVisible();
    await fourthStar.click();
    
    // Submit feedback
    const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Guardar")');
    await submitButton.click();
    
    // Should return to dashboard or show completion
    await expect(page).toHaveURL(/\/dashboard\/meditation/);
    
    // Verify auto-favorite behavior - check if "Guardado" indicator appears
    // This might be in a toast, success message, or favorites list
    const savedIndicator = page.locator('text="Guardado", text="añadido a favoritos", [data-testid="auto-favorite-indicator"]');
    
    // Navigate to favorites to confirm it was saved
    await page.locator('a:has-text("Mis favoritos")').click();
    await expect(page).toHaveURL(/\/dashboard\/meditation\/favorites/);
    
    // Should see the completed session in favorites
    await expect(page.locator('text="Paz"')).toBeVisible();
  });

  test('should handle meditation session errors gracefully', async ({ page }) => {
    // Navigate to meditation page
    await page.goto('/dashboard/meditation');
    
    // Mock network error for scripture loading
    await page.route('**/api/meditation/**', route => {
      route.abort('failed');
    });
    
    // Select emotion and start session
    await page.locator('button').filter({ hasText: 'Paz' }).first().click();
    await page.locator('button:has-text("Comenzar Meditación")').click();
    
    // Should show error handling
    await expect(page.locator('text="Error", text="problema", text="intenta"')).toBeVisible({ timeout: 10000 });
    
    // Should have retry button
    const retryButton = page.locator('button:has-text("Reintentar"), button:has-text("Intentar")');
    await expect(retryButton).toBeVisible();
  });

  test('should save session data across page reloads', async ({ page }) => {
    // Start meditation session
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    await page.locator('button').filter({ hasText: 'Paz' }).first().click();
    await page.locator('button:has-text("Comenzar Meditación")').click();
    
    // Wait for session to load
    await expect(page.locator('[data-testid="scripture-verse"]')).toBeVisible({ timeout: 10000 });
    
    // Reload page
    await page.reload();
    
    // Should maintain session state or gracefully handle resumption
    await expect(page.locator('text="Paz", [data-testid="scripture-verse"]')).toBeVisible({ timeout: 10000 });
  });
});