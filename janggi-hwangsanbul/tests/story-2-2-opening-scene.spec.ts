import { test, expect } from '@playwright/test'

// 씬 식별: [data-scene="opening"]
// 배경 일러스트 플레이스홀더: [data-scene="opening"] [data-scene-bg]
// 스타일 메타데이터: data-style-prompt, data-style-seed 속성

test.describe('Story 2.2: 씬 1 — 오프닝 내러티브 장면', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
  })
  test.afterEach(async () => {
    expect(consoleErrors.length, `Console errors: ${consoleErrors.join(', ')}`).toBe(0)
  })

  test('AC1: 배경 일러스트 플레이스홀더 표시', async ({ page }) => {
    await expect(page.locator('[data-scene="opening"] [data-scene-bg]')).toBeVisible()
  })

  test('AC2: 내레이션 제목/텍스트에 황산벌/계백/660년 키워드 포함', async ({ page }) => {
    await expect(page.locator('[data-scene="opening"] h1')).toHaveText(/660년/)
    const sceneText = await page.locator('[data-scene="opening"]').innerText()
    expect(sceneText).toContain('황산벌')
    expect(sceneText).toContain('계백')
    expect(sceneText).toContain('660')
  })

  test('AC3: 계속하기 클릭 시 cha 씬으로 전환', async ({ page }) => {
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"]')).toBeVisible()
  })

  test('AC3: 계속하기 버튼 키보드(Enter) 트리거 시 cha 씬으로 전환', async ({ page }) => {
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-scene="cha"]')).toBeVisible()
  })

  test('AC4: 배경 일러스트 스타일 프롬프트/시드 메타데이터 문서화', async ({ page }) => {
    const bg = page.locator('[data-scene="opening"] [data-scene-bg]')
    await expect(bg).toHaveAttribute('data-style-prompt', /.+/)
    await expect(bg).toHaveAttribute('data-style-seed', /.+/)
  })
})
