import { test, expect } from '@playwright/test'

// 씬 식별: [data-scene="ma"][data-phase="intro|demo|play|dialogue"]

test.describe('Story 2.4: 씬 3 — 마(馬) 체험 장면', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Opening → cha 체험(intro/demo/play/dialogue) → ma 씬 intro phase 진입
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await page.waitForSelector('[data-scene="cha"][data-phase="play"]', { timeout: 5000 })
    await page.locator('[aria-label="기물 cha"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await page.waitForSelector('[data-scene="cha"][data-phase="dialogue"]', { timeout: 5000 })
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"][data-phase="intro"]')).toBeVisible()
  })
  test.afterEach(async () => {
    expect(consoleErrors.length, `Console errors: ${consoleErrors.join(', ')}`).toBe(0)
  })

  test('AC1: intro 단계 — 마 등장 및 서사 텍스트 노출', async ({ page }) => {
    const scene = page.locator('[data-scene="ma"][data-phase="intro"]')
    await expect(scene).toContainText('마')
    await expect(scene).toContainText('전령')
    await expect(scene).toContainText('황산벌')
    await expect(page.locator('[aria-label="기물 ma"]')).toBeVisible()
  })

  test('AC2: demo 단계 — L자 스크립트 이동 후 자동으로 play 전환', async ({ page }) => {
    const maPiece = page.locator('[aria-label="기물 ma"]')
    const beforeBox = await maPiece.boundingBox()

    // intro → demo
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"][data-phase="demo"]')).toBeVisible()

    // demo → play (자동, 스크립트 이동 완료 후)
    await expect(page.locator('[data-scene="ma"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const afterBox = await maPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    // L자 이동은 직교+대각 성분이 항상 함께 있으므로 가로/세로 모두 변경됨
    expect(afterBox!.x).not.toBe(beforeBox!.x)
    expect(afterBox!.y).not.toBe(beforeBox!.y)
  })

  test('AC3: play 단계 — 마 선택 후 유효 칸 클릭으로 이동 가능', async ({ page }) => {
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const maPiece = page.locator('[aria-label="기물 ma"]')
    const beforeBox = await maPiece.boundingBox()

    await maPiece.click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const afterBox = await maPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    expect(afterBox).not.toEqual(beforeBox)
  })

  test('AC4: 유효 이동 완료 후 dialogue 단계 전환 및 계백 대사 노출', async ({ page }) => {
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 ma"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const dialogueScene = page.locator('[data-scene="ma"][data-phase="dialogue"]')
    await expect(dialogueScene).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-dialogue]')).toContainText('마')
  })

  test('AC5: dialogue "계속하기" 클릭 시 po 씬으로 전환', async ({ page }) => {
    await page.locator('[data-scene="ma"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 ma"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await expect(page.locator('[data-scene="ma"][data-phase="dialogue"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[data-dialogue] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="po"]')).toBeVisible()
  })
})
