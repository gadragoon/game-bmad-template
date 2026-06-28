import { test, expect } from '@playwright/test'

// 씬 식별: [data-scene="씬이름"]
// 계속하기 버튼: button:has-text("계속하기")
// 체험 씬 phase: [data-scene="cha"][data-phase="intro"]

// 씬 순서 (gameReducer.ts SCENE_ORDER와 동일)
const SCENE_ORDER = ['opening', 'cha', 'ma', 'po', 'jol', 'ending'] as const
const SCENES_WITH_NEXT = ['opening', 'cha', 'ma', 'po', 'jol'] as const  // ending 제외

test.describe('Story 2.1: 씬 전환 시스템', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
  })
  test.afterEach(async () => {
    expect(consoleErrors.length, `Console errors: ${consoleErrors.join(', ')}`).toBe(0)
  })

  test('AC1: 초기 씬 opening 렌더 — 보드 미노출', async ({ page }) => {
    await expect(page.locator('[data-scene="opening"]')).toBeVisible()
    // Opening은 내러티브 씬 — 기물(보드)이 없어야 함
    await expect(page.locator('[aria-label="기물 cha"]')).not.toBeVisible()
  })

  test('AC2: 씬 순서 6단계 전체 순회 opening→cha→ma→po→jol→ending', async ({ page }) => {
    for (let i = 0; i < SCENES_WITH_NEXT.length; i++) {
      const current = SCENES_WITH_NEXT[i]
      const next = SCENE_ORDER[i + 1]
      await expect(page.locator(`[data-scene="${current}"]`)).toBeVisible()
      await page.locator(`[data-scene="${current}"] button:has-text("계속하기")`).click()
      await expect(page.locator(`[data-scene="${next}"]`)).toBeVisible()
    }
    // 최종: ending 도달
    await expect(page.locator('[data-scene="ending"]')).toBeVisible()
  })

  test('AC3: 씬 전환 즉시 렌더 — flash 없음', async ({ page }) => {
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    // 즉시 cha 등장 (중간 로딩 상태 없음)
    await expect(page.locator('[data-scene="cha"]')).toBeVisible()
    await expect(page.locator('[data-scene="opening"]')).not.toBeVisible()
  })

  test('AC4: ending에서 계속하기 없음, 씬 변화 없음', async ({ page }) => {
    // ending까지 모든 씬 통과
    for (const scene of SCENES_WITH_NEXT) {
      await page.locator(`[data-scene="${scene}"] button:has-text("계속하기")`).click()
    }
    await expect(page.locator('[data-scene="ending"]')).toBeVisible()
    // 계속하기 버튼 없음
    await expect(page.locator('[data-scene="ending"] button:has-text("계속하기")')).not.toBeVisible()
  })

  test('AC5: 체험 씬 진입 시 phase=intro 자동 설정', async ({ page }) => {
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    // NEXT_SCENE reducer: 체험 씬 진입 시 phase='intro' 자동 설정
    await expect(page.locator('[data-scene="cha"][data-phase="intro"]')).toBeVisible()
  })
})
