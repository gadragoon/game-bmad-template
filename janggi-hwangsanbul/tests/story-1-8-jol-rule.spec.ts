import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 힌트 원: circle[role="button"] (기물은 g[role="button"])
// 힌트 aria-label: "(row, col)로 이동"
// 기물 aria-label: "기물 {id}"

// 초기 배치: cha(col:0,row:5), ma(col:2,row:7), po(col:4,row:2), jol(col:4,row:5)
// jol(5,4) 전진=row+1, 좌=col-1, 우=col+1, 후퇴(row-1) 절대 없음

// Tab 순서(DOM 렌더 순서 = board 순회): po(2,4) → cha(5,0) → jol(5,4) → ma(7,2)
// 힌트 등장 시 DOM 순서: hint들 → po → cha → jol → ma

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Story 1.8: 졸(卒) 이동 룰 및 키보드 접근성', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Story 2.1+: Opening 씬 통과 → ExperienceCha (보드 전체 접근 가능)
    await page.locator('button:has-text("계속하기")').click()
    await page.waitForSelector('[aria-label="기물 jol"]', { timeout: 5000 })
  })
  test.afterEach(async () => {
    expect(consoleErrors.length).toBe(0)
  })

  test('AC1: 내부 위치에서 전진+좌+우 최대 3개 목적지', async ({ page }) => {
    // jol(col:4, row:5) — 전진(6,4), 좌(5,3), 우(5,5) = 3개
    await page.locator('[aria-label="기물 jol"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(3)
    // 전진 힌트 aria-label 실재 확인 (후퇴 버그 시 count=3이더라도 여기서 실패)
    await expect(page.locator('[aria-label="(6, 4)로 이동"]')).toBeVisible()
    // 후퇴(row:4) 힌트 없음 — 행동 기반 후퇴 불가 검증
    expect(await page.locator('[aria-label="(4, 4)로 이동"]').count()).toBe(0)
  })

  test('AC3: 우측 경계(col:8)에서 우 목적지 제외 — 힌트 2개', async ({ page }) => {
    // jol(5,4) → 우로 4번: (5,5)→(5,6)→(5,7)→(5,8)
    for (const targetCol of [5, 6, 7, 8]) {
      await page.locator('[aria-label="기물 jol"]').click()
      await page.locator(`[aria-label="(5, ${targetCol})로 이동"]`).click()
    }

    // jol은 (row:5, col:8) — 전진(6,8)✅, 좌(5,7)✅, 우(5,9)=OOB❌ → 2개
    await page.locator('[aria-label="기물 jol"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(2)
    expect(await page.locator('[aria-label="(5, 9)로 이동"]').count()).toBe(0)
  })

  test('AC2: 하단 경계(row:9)에서 전진 목적지 제외 — 힌트 2개', async ({ page }) => {
    // jol(5,4) → 전진 4번: (6,4)→(7,4)→(8,4)→(9,4)
    for (const targetRow of [6, 7, 8, 9]) {
      await page.locator('[aria-label="기물 jol"]').click()
      await page.locator(`[aria-label="(${targetRow}, 4)로 이동"]`).click()
    }

    // jol은 (row:9, col:4) — 전진(10,4)=OOB❌, 좌(9,3)✅, 우(9,5)✅ → 2개
    await page.locator('[aria-label="기물 jol"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(2)
    expect(await page.locator('[aria-label="(10, 4)로 이동"]').count()).toBe(0)
  })

  test('AC4: Tab 키 내비게이션 — 기물과 힌트가 Tab 대상', async ({ page }) => {
    // Tab 3번 → jol 포커스 (DOM 순서: po→cha→jol)
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    const focusedPiece = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    expect(focusedPiece).toBe('기물 jol')

    // Enter로 jol 선택 → 힌트 등장 (focus still on jol)
    await page.keyboard.press('Enter')
    expect(await page.locator('circle[role="button"]').count()).toBe(3)

    // 힌트들도 Tab 대상 — Shift+Tab 역방향으로 확인 (forward wrap은 브라우저 크롬에 막힐 수 있음)
    // DOM 순서 after 힌트 삽입: hint(6,4)→hint(5,3)→hint(5,5)→po→cha→jol→ma
    // Shift+Tab from jol (6): jol←cha←po←hint(5,5)
    await page.keyboard.press('Shift+Tab')  // jol → cha
    await page.keyboard.press('Shift+Tab')  // cha → po
    await page.keyboard.press('Shift+Tab')  // po → hint(5,5)

    const focusedHint = await page.evaluate(() => document.activeElement?.getAttribute('aria-label'))
    expect(focusedHint).toBe('(5, 5)로 이동')
  })

  test('AC5: Enter/Space 이벤트 — 클릭과 동일 동작', async ({ page }) => {
    // focus + Enter → SELECT_PIECE (클릭과 동일)
    await page.locator('[aria-label="기물 jol"]').focus()
    await page.keyboard.press('Enter')

    expect(await page.locator('circle[role="button"]').count()).toBe(3)

    // focus + Space → MOVE_PIECE (클릭과 동일)
    await page.locator('[aria-label="(6, 4)로 이동"]').focus()
    await page.keyboard.press(' ')

    expect(await page.locator('circle[role="button"]').count()).toBe(0)

    // 새 위치에서 Enter 재확인
    await page.locator('[aria-label="기물 jol"]').focus()
    await page.keyboard.press('Enter')
    expect(await page.locator('circle[role="button"]').count()).toBeGreaterThan(0)
  })

  test('AC6: jol.ts는 React/DOM import 없는 순수 함수', async () => {
    const jolPath = resolve(__dirname, '../src/pieces/rules/jol.ts')
    const content = readFileSync(jolPath, 'utf-8')

    expect(content).not.toMatch(/from ['"]react['"]/)
    expect(content).not.toMatch(/import React/)
    expect(content).not.toMatch(/document\./)
    expect(content).not.toMatch(/window\./)
    expect(content).toContain('getJolValidMoves')
    expect(content).toContain('BOARD')
    // 후퇴 불가: 소스에 row-1 패턴 없음 (lint-style 보조 확인 — 행동 기반 검증은 AC1에서 수행)
    expect(content).not.toMatch(/row\s*-\s*1/)
  })
})
