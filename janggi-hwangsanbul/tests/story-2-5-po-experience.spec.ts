import { test, expect } from '@playwright/test'

// 씬 식별: [data-scene="po"][data-phase="intro|demo|play|dialogue"]

test.describe('Story 2.5: 씬 4 — 포(砲) 체험 장면', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Opening → cha 체험 → ma 체험 → po 씬 intro phase 진입
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await page.waitForSelector('[data-scene="cha"][data-phase="play"]', { timeout: 5000 })
    await page.locator('[aria-label="기물 cha"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await page.waitForSelector('[data-scene="cha"][data-phase="dialogue"]', { timeout: 5000 })
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await page.waitForSelector('[data-scene="ma"][data-phase="play"]', { timeout: 5000 })
    await page.locator('[aria-label="기물 ma"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await page.waitForSelector('[data-scene="ma"][data-phase="dialogue"]', { timeout: 5000 })
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"][data-phase="intro"]')).toBeVisible()
  })
  test.afterEach(async () => {
    expect(consoleErrors.length, `Console errors: ${consoleErrors.join(', ')}`).toBe(0)
  })

  test('AC1: intro 단계 — 포 등장 및 서사 텍스트 노출', async ({ page }) => {
    const scene = page.locator('[data-scene="po"][data-phase="intro"]')
    await expect(scene).toContainText('포')
    await expect(scene).toContainText('하나')
    await expect(page.locator('[aria-label="기물 po"]')).toBeVisible()
  })

  test('AC2: demo 단계 — 스크립트된 점프 이동 후 자동으로 play 전환', async ({ page }) => {
    const poPiece = page.locator('[aria-label="기물 po"]')
    const beforeBox = await poPiece.boundingBox()

    // intro → demo
    await page.locator('[data-scene="po"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"][data-phase="demo"]')).toBeVisible()

    // demo → play (자동, 스크립트 이동 완료 후)
    await expect(page.locator('[data-scene="po"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const afterBox = await poPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    // 포의 점프는 방향에 따라 가로 또는 세로 중 한 축만 바뀔 수 있으므로 최소 하나만 확인
    const moved = afterBox!.x !== beforeBox!.x || afterBox!.y !== beforeBox!.y
    expect(moved).toBe(true)
  })

  test('AC3: play 단계 — 포 선택 후 유효 칸 클릭으로 이동 가능', async ({ page }) => {
    await page.locator('[data-scene="po"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const poPiece = page.locator('[aria-label="기물 po"]')
    const beforeBox = await poPiece.boundingBox()

    await poPiece.click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const afterBox = await poPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    expect(afterBox).not.toEqual(beforeBox)
  })

  test('AC4: 유효 이동 완료 후 dialogue 단계 전환 및 계백 대사 노출', async ({ page }) => {
    await page.locator('[data-scene="po"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 po"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const dialogueScene = page.locator('[data-scene="po"][data-phase="dialogue"]')
    await expect(dialogueScene).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-dialogue]')).toContainText('포')
  })

  test('AC5: dialogue "계속하기" 클릭 시 jol 씬으로 전환', async ({ page }) => {
    await page.locator('[data-scene="po"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 po"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await expect(page.locator('[data-scene="po"][data-phase="dialogue"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[data-dialogue] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="jol"]')).toBeVisible()
  })
})
