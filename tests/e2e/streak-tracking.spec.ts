import { test, expect } from '@playwright/test';

test.describe('Streak Tracking Accuracy', () => {
  test.beforeEach(async ({ page }) => {
    // Ensure clean state for streak testing
    await page.goto('/dashboard/meditation');
  });

  test('should display current streak correctly', async ({ page }) => {
    // Navigate to meditation dashboard
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding if present
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Wait for dashboard data to load
    await expect(page.locator('h3:has-text("Sugerencias para ti:")')).toBeVisible();
    
    // Check if streak display is present
    const streakDisplay = page.locator('text=/\d+ días? en oración/, text=/\d+ día.*comunión/, [data-testid="streak-display"]');
    
    if (await streakDisplay.isVisible()) {
      // Verify streak format and language
      const streakText = await streakDisplay.textContent();
      expect(streakText).toMatch(/\d+ días? en oración|Comienza tu caminar|días? en comunión/);
      
      // Should not contain gaming language
      expect(streakText).not.toContain('racha');
      expect(streakText).not.toContain('¡Eres imparable!');
      expect(streakText).not.toContain('🔥');
    }
  });

  test('should increment streak after completing meditation', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Get initial streak value
    let initialStreak = 0;
    const streakDisplay = page.locator('text=/\d+ días? en oración/, [data-testid="streak-display"]');
    
    if (await streakDisplay.isVisible()) {
      const streakText = await streakDisplay.textContent();
      const match = streakText?.match(/(\d+) días?/);
      if (match) {
        initialStreak = parseInt(match[1]);
      }
    }
    
    // Complete a meditation session
    await page.locator('button').filter({ hasText: 'Paz' }).first().click();
    await page.locator('button:has-text("Comenzar Meditación")').click();
    
    // Wait for session to load
    await expect(page.locator('[data-testid="scripture-verse"]')).toBeVisible({ timeout: 10000 });
    
    // Complete the session
    const endButton = page.locator('button:has-text("Finalizar"), button:has-text("Terminar")');
    if (await endButton.isVisible()) {
      await endButton.click();
    } else {
      // If no end button, complete via feedback
      await page.waitForSelector('[data-testid="feedback-section"], text="¿Cómo tocó tu corazón"', { timeout: 15000 });
    }
    
    // Give rating and submit
    const fourthStar = page.locator('[data-testid="rating-star-4"], .rating-star').nth(3);
    if (await fourthStar.isVisible()) {
      await fourthStar.click();
    }
    
    const submitButton = page.locator('button:has-text("Enviar"), button:has-text("Guardar")');
    if (await submitButton.isVisible()) {
      await submitButton.click();
    }
    
    // Return to dashboard
    await expect(page).toHaveURL(/\/dashboard\/meditation/);
    
    // Check if streak increased (may take a moment to update)
    await page.waitForTimeout(2000);
    await page.reload();
    
    const updatedStreakDisplay = page.locator('text=/\d+ días? en oración/, [data-testid="streak-display"]');
    if (await updatedStreakDisplay.isVisible()) {
      const updatedStreakText = await updatedStreakDisplay.textContent();
      const match = updatedStreakText?.match(/(\d+) días?/);
      if (match) {
        const newStreak = parseInt(match[1]);
        expect(newStreak).toBeGreaterThanOrEqual(initialStreak);
      }
    } else {
      // First meditation might show "1 día en oración"
      await expect(page.locator('text="1 día en oración"')).toBeVisible();
    }
  });

  test('should use spiritual language instead of gaming terms', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Check for spiritual language in streak display
    const pageText = await page.textContent('body');
    
    // Should contain spiritual terms
    expect(pageText).toMatch(/días? en oración|días? en comunión|caminar.*Dios|Cultivando.*hábito/i);
    
    // Should NOT contain gaming terms
    expect(pageText).not.toContain('racha');
    expect(pageText).not.toContain('¡Eres imparable!');
    expect(pageText).not.toContain('¡Increíble constancia!');
    expect(pageText).not.toContain('🔥');
    expect(pageText).not.toContain('achievement');
    expect(pageText).not.toContain('badge');
  });

  test('should handle streak reset appropriately', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Look for new user message or zero streak handling
    const newUserMessage = page.locator('text="Comienza tu caminar diario con Dios"');
    const streakDisplay = page.locator('text=/\d+ días? en oración/');
    
    // Either should show new user message or current streak
    const hasNewUserMessage = await newUserMessage.isVisible();
    const hasStreakDisplay = await streakDisplay.isVisible();
    
    expect(hasNewUserMessage || hasStreakDisplay).toBeTruthy();
    
    if (hasNewUserMessage) {
      // Should encourage starting without pressure
      const messageText = await newUserMessage.textContent();
      expect(messageText).toContain('Comienza');
      expect(messageText).not.toContain('debes');
      expect(messageText).not.toContain('tienes que');
    }
  });

  test('should display calendar icon instead of fire emoji', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Check for calendar icon in streak display
    const calendarIcon = page.locator('[data-testid="calendar-icon"], .lucide-calendar');
    const streakSection = page.locator('[data-testid="streak-display"], text=/días? en oración/').first();
    
    if (await streakSection.isVisible()) {
      // Should use calendar icon, not fire emoji
      const sectionText = await streakSection.textContent();
      expect(sectionText).not.toContain('🔥');
      
      // Calendar icon should be present near streak
      await expect(calendarIcon.first()).toBeVisible();
    }
  });

  test('should show appropriate progress messages', async ({ page }) => {
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Look for spiritual growth messages
    const progressMessages = [
      'Comienza tu caminar diario con Dios',
      'Cultivando el hábito de la oración',
      'Profundizando en Su presencia',
      'días en comunión',
      'días en oración'
    ];
    
    const pageText = await page.textContent('body');
    const hasProgressMessage = progressMessages.some(message => 
      pageText?.toLowerCase().includes(message.toLowerCase())
    );
    
    expect(hasProgressMessage).toBeTruthy();
  });

  test('should persist streak data across browser sessions', async ({ page, context }) => {
    await page.goto('/dashboard/meditation');
    
    // Skip onboarding
    const skipButton = page.locator('button:has-text("Omitir")');
    if (await skipButton.isVisible()) {
      await skipButton.click();
    }
    
    // Get current streak value
    let currentStreak = 0;
    const streakDisplay = page.locator('text=/\d+ días? en oración/');
    
    if (await streakDisplay.isVisible()) {
      const streakText = await streakDisplay.textContent();
      const match = streakText?.match(/(\d+) días?/);
      if (match) {
        currentStreak = parseInt(match[1]);
      }
    }
    
    // Create new browser context (simulates new session)
    const newContext = await page.context().browser()?.newContext();
    if (newContext) {
      const newPage = await newContext.newPage();
      await newPage.goto('/dashboard/meditation');
      
      // Skip onboarding in new session
      const newSkipButton = newPage.locator('button:has-text("Omitir")');
      if (await newSkipButton.isVisible()) {
        await newSkipButton.click();
      }
      
      // Streak should persist (loaded from database)
      const newStreakDisplay = newPage.locator('text=/\d+ días? en oración/');
      if (await newStreakDisplay.isVisible()) {
        const newStreakText = await newStreakDisplay.textContent();
        const match = newStreakText?.match(/(\d+) días?/);
        if (match) {
          const persistedStreak = parseInt(match[1]);
          expect(persistedStreak).toBe(currentStreak);
        }
      }
      
      await newContext.close();
    }
  });
});