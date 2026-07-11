import { test, expect } from '@playwright/test'

// 씬 식별: [data-scene="cha"][data-phase="intro|demo|play|dialogue"]
// AC5(오디오 훅 포인트 존재)는 코드 인스펙션 대상 — 자동 테스트 불가, 코드 리뷰로 검증

test.describe('Story 2.3: 씬 2 — 차(車) 체험 장면', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Opening 통과 → cha 씬 intro phase 진입
    await page.locator('[data-scene="opening"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"][data-phase="intro"]')).toBeVisible()
  })
  test.afterEach(async () => {
    expect(consoleErrors.length, `Console errors: ${consoleErrors.join(', ')}`).toBe(0)
  })

  test('AC1: intro 단계 — 차 등장 및 서사 텍스트 노출', async ({ page }) => {
    const scene = page.locator('[data-scene="cha"][data-phase="intro"]')
    await expect(scene).toContainText('차')
    await expect(scene).toContainText('지휘')
    await expect(scene).toContainText('황산벌')
    await expect(page.locator('[aria-label="기물 cha"]')).toBeVisible()
  })

  test('AC2: demo 단계 — 2단계 스크립트 이동(가로+세로) 후 자동으로 play 전환', async ({ page }) => {
    const chaPiece = page.locator('[aria-label="기물 cha"]')
    const beforeBox = await chaPiece.boundingBox()

    // intro → demo
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"][data-phase="demo"]')).toBeVisible()

    // demo → play (자동, 2단계 스크립트 이동 완료 후)
    await expect(page.locator('[data-scene="cha"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const afterBox = await chaPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    // 데모 이동(가로 이동 → 세로 이동)으로 차 기물의 화면상 위치가 가로/세로 모두 변경됨
    expect(afterBox!.x).not.toBe(beforeBox!.x)
    expect(afterBox!.y).not.toBe(beforeBox!.y)
  })

  test('AC3: play 단계 — 차 선택 후 유효 칸 클릭으로 이동 가능', async ({ page }) => {
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    const chaPiece = page.locator('[aria-label="기물 cha"]')
    const beforeBox = await chaPiece.boundingBox()

    await chaPiece.click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const afterBox = await chaPiece.boundingBox()
    expect(beforeBox).not.toBeNull()
    expect(afterBox).not.toBeNull()
    expect(afterBox).not.toEqual(beforeBox)
  })

  test('AC4: 유효 이동 완료 후 dialogue 단계 전환 및 계백 대사 노출', async ({ page }) => {
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 cha"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()

    const dialogueScene = page.locator('[data-scene="cha"][data-phase="dialogue"]')
    await expect(dialogueScene).toBeVisible({ timeout: 5000 })
    await expect(page.locator('[data-dialogue]')).toBeVisible()
    await expect(page.locator('[data-dialogue]')).not.toBeEmpty()
  })

  test('AC6: dialogue "계속하기" 클릭 시 ma 씬으로 전환', async ({ page }) => {
    await page.locator('[data-scene="cha"] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="cha"][data-phase="play"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[aria-label="기물 cha"]').click()
    await page.getByRole('button', { name: /로 이동/ }).first().click()
    await expect(page.locator('[data-scene="cha"][data-phase="dialogue"]')).toBeVisible({ timeout: 5000 })

    await page.locator('[data-dialogue] button:has-text("계속하기")').click()
    await expect(page.locator('[data-scene="ma"]')).toBeVisible()
  })
})
