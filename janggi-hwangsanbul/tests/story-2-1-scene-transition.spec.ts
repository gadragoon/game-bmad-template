import { test, expect, type Page } from '@playwright/test'

// 씬 식별: [data-scene="씬이름"]
// 계속하기 버튼: button:has-text("계속하기")
// 체험 씬 phase: [data-scene="cha"][data-phase="intro"]

// ma/po/jol은 Story 2.1의 단순 스텁(단일 계속하기 버튼)이라 여전히 단일 클릭으로 다음 씬 전환됨
const SIMPLE_SCENES_WITH_NEXT = ['ma', 'po', 'jol'] as const

// Story 2.3: cha 씬은 intro→demo→play→dialogue 4단계를 거쳐야 다음 씬(ma)으로 전환된다.
async function completeChaExperience(page: Page) {
  // intro → demo
  await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
  // demo → play (자동, DEMO_DELAY_MS 경과 후)
  await page.waitForSelector('[data-scene="cha"][data-phase="play"]', { timeout: 5000 })
  // play: 유효한 이동 1회 수행
  await page.locator('[aria-label="기물 cha"]').click()
  await page.getByRole('button', { name: /로 이동/ }).first().click()
  // play → dialogue (자동)
  await page.waitForSelector('[data-scene="cha"][data-phase="dialogue"]', { timeout: 5000 })
  // dialogue → ma
  await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
}

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
    await expect(page.locator('[data-scene="opening"]')).toBeVisible()
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"]')).toBeVisible()

    await completeChaExperience(page)
    await expect(page.locator('[data-scene="ma"]')).toBeVisible()

    for (const scene of SIMPLE_SCENES_WITH_NEXT) {
      await expect(page.locator(`[data-scene="${scene}"]`)).toBeVisible()
      await page.locator(`[data-scene="${scene}"] button:has-text("계속하기")`).click()
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
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await completeChaExperience(page)
    for (const scene of SIMPLE_SCENES_WITH_NEXT) {
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
