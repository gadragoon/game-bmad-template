import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 힌트 원: circle[role="button"] (기물은 g[role="button"])
// 힌트 aria-label: "(row, col)로 이동"
// 기물 aria-label: "기물 {id}"

// 초기 배치: cha(col:0,row:5), ma(col:2,row:7), po(col:4,row:2), jol(col:4,row:5)
// po(col:4,row:2) 하방: board[3][4]=null, board[4][4]=null, board[5][4]=jol → platform
// 착지 가능 칸: (row:6~9, col:4) = 4개

// [AC4 deferred] 포끼리 포획 불가(destination=Po) 검증: 단일 Po POC에서 불가 — Po 2개 필요
// [AC5 deferred] 포가 포를 경유 기물로: 단일 Po POC에서 불가 — Po 2개 필요
// → 두 AC 모두 다중 Po 환경에서의 단위 테스트로 연기

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Story 1.7: 포(砲) 이동 룰', () => {
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Story 2.1+: Opening 씬 통과 → ExperienceCha (보드 전체 접근 가능)
    await page.locator('button:has-text("계속하기")').click()
    await page.waitForSelector('[aria-label="기물 po"]', { timeout: 5000 })
  })
  test.afterEach(async () => {
    expect(consoleErrors.length).toBe(0)
  })

  test('AC1: jol을 경유 기물로 하방 4개 목적지', async ({ page }) => {
    // po(4,2) → 하방 jol(5,4) = 경유 기물 → 착지(4,6~9) 4개
    await page.locator('[aria-label="기물 po"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(4)
    // 착지 힌트 4개 모두 aria-label로 실재 확인
    for (const row of [6, 7, 8, 9]) {
      await expect(page.locator(`[aria-label="(${row}, 4)로 이동"]`)).toBeVisible()
    }
  })

  test('AC2: 경유 기물 없는 방향 목적지 = 0 — 방향별 aria-label로 검증', async ({ page }) => {
    // po(4,2): 상/좌/우 경유 기물 없음 → 각 방향 0개. 하 방향만 jol 경유 → 4개
    await page.locator('[aria-label="기물 po"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(4)
    // 상 방향 힌트 없음 (경유 기물 없어 Platform 없음)
    expect(await page.locator('[aria-label="(0, 4)로 이동"]').count()).toBe(0)
    expect(await page.locator('[aria-label="(1, 4)로 이동"]').count()).toBe(0)
    // 하 방향 첫 착지 힌트 존재 (jol이 platform)
    await expect(page.locator('[aria-label="(6, 4)로 이동"]')).toBeVisible()
  })

  test('AC3: 경유 기물 직후 두 번째 기물 — 목적지 0개', async ({ page }) => {
    // 셋업: ma(2,7) → 우 방향 block=(7,3)=empty, target=(6,4) → 유효 이동
    // ma를 (6,4)로 이동: jol(5,4)=platform, ma(6,4)=바로 다음 기물
    // (이 셋업은 ma 이동 룰에 의존 — ma 초기 위치 또는 L자 룰 변경 시 재검토 필요)
    await page.locator('[aria-label="기물 ma"]').click()
    await page.locator('[aria-label="(6, 4)로 이동"]').click()

    // po(4,2) 하방: phase1=jol(5,4)→platform, phase2=ma(6,4)→즉시 break → 0개
    await page.locator('[aria-label="기물 po"]').click()

    expect(await page.locator('circle[role="button"]').count()).toBe(0)
  })

  test('포 이동 + 새 위치 유효 이동 재계산', async ({ page }) => {
    // 이동 인터랙션 + 새 위치에서 재계산 검증
    // (실제 AC4=포끼리 포획 불가, AC5=포 경유 가능은 E2E로 검증 불가 → deferred)
    await page.locator('[aria-label="기물 po"]').click()
    expect(await page.locator('circle[role="button"]').count()).toBe(4)

    await page.locator('[aria-label="(9, 4)로 이동"]').click()
    expect(await page.locator('circle[role="button"]').count()).toBe(0)

    // po가 (9,4)로 이동 후 — 상방: jol(5,4)=platform, rows 0~4 = 5개
    await page.locator('[aria-label="기물 po"]').click()
    expect(await page.locator('circle[role="button"]').count()).toBe(5)
  })

  test('AC6: po.ts는 React/DOM import 없는 순수 함수', async () => {
    const poPath = resolve(__dirname, '../src/pieces/rules/po.ts')
    const content = readFileSync(poPath, 'utf-8')

    expect(content).not.toMatch(/from ['"]react['"]/)
    expect(content).not.toMatch(/import React/)
    expect(content).not.toMatch(/document\./)
    expect(content).not.toMatch(/window\./)
    expect(content).toContain('getPoValidMoves')
    expect(content).toContain('BOARD')
    expect(content).toContain('platformFound')
  })
})
