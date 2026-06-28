import { test, expect } from '@playwright/test'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

// 힌트 원: circle[role="button"] (기물은 g[role="button"])
// 힌트 aria-label: "(row, col)로 이동"
// 기물 aria-label: "기물 {id}"

// 초기 배치: cha(col:0,row:5), ma(col:2,row:7), po(col:4,row:2), jol(col:4,row:5)

// P2 fix: spec 파일 기준 절대 경로 — process.cwd() CWD 의존 제거
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

test.describe('Story 1.6: 마(馬) 이동 룰', () => {
  // P1 fix: 콘솔 에러 리스너를 beforeEach에서 등록 — 테스트 전 구간 커버
  let consoleErrors: string[]
  test.beforeEach(async ({ page }) => {
    consoleErrors = []
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    await page.goto('/')
    // Story 2.1+: Opening 씬 통과 → ExperienceCha (보드 전체 접근 가능)
    await page.locator('button:has-text("계속하기")').click()
    await page.waitForSelector('[aria-label="기물 ma"]', { timeout: 5000 })
  })

  test('AC1: 비어있는 내부 위치에서 최대 8개 L자 목적지', async ({ page }) => {
    await page.locator('[aria-label="기물 ma"]').click()

    // circle[role="button"] = 힌트 원 (기물은 g 태그)
    const hintCount = await page.locator('circle[role="button"]').count()
    expect(hintCount).toBe(8)
  })

  test('AC2: 인접 칸 막힘 — 우측에 jol 있을 때 2개 목적지 제외', async ({ page }) => {
    // ma(2,7) → (3,5) 이동: L자 (dc:+1,dr:-2)
    await page.locator('[aria-label="기물 ma"]').click()
    await page.locator('[aria-label="(5, 3)로 이동"]').click()

    // ma는 이제 (col:3, row:5)
    // jol은 (col:4, row:5) — ma 오른쪽 block: (row:5,col:4) = jol → 우 방향 막힘
    // 우 방향 2개 목적지: (row:4,col:5),(row:6,col:5) → 제외
    await page.locator('[aria-label="기물 ma"]').click()

    // ma(3,5) 예상 힌트:
    //   상 block(2,3)=empty → (3,2),(3,4) 비어있음 → 2개
    //   하 block(6,3)=empty → (7,2),(7,4) 비어있음 → 2개
    //   좌 block(5,2)=empty → (4,1),(6,1) 비어있음 → 2개
    //   우 block(5,4)=jol   → 막힘 → 0개
    //   합계 = 6개
    const hintCount = await page.locator('circle[role="button"]').count()
    expect(hintCount).toBe(6)
  })

  test('AC3: 보드 경계 근처에서 out-of-bounds 힌트 없음', async ({ page }) => {
    // ma(2,7) → (1,5) → (0,3) 순서로 이동해 col:0 경계 근처로 이동
    await page.locator('[aria-label="기물 ma"]').click()
    await page.locator('[aria-label="(5, 1)로 이동"]').click()

    // ma는 이제 (col:1, row:5)
    await page.locator('[aria-label="기물 ma"]').click()
    await page.locator('[aria-label="(3, 0)로 이동"]').click()

    // ma는 이제 (col:0, row:3) — 왼쪽 경계
    await page.locator('[aria-label="기물 ma"]').click()

    // ma(0,3):
    //   상 block(2,0) = empty → target(1,-1) OOB, (1,1) ✅ → 1개
    //   하 block(4,0) = empty → target(5,-1) OOB, (5,1) ✅ → 1개
    //   좌 block(3,-1) → OOB(bc<0) → 막힘 없음, target(2,-2) OOB, (4,-2) OOB → 0개
    //   우 block(3,1) = empty → target(2,2) ✅, (4,2) ✅ → 2개
    //   합계 = 4개
    const hintCount = await page.locator('circle[role="button"]').count()
    expect(hintCount).toBe(4)

    // P1: 콘솔 에러가 테스트 전 구간(이동 포함)에 걸쳐 없는지 확인
    expect(consoleErrors.length).toBe(0)
  })

  test('AC4: 유효한 목적지 클릭 시 마가 이동', async ({ page }) => {
    await page.locator('[aria-label="기물 ma"]').click()

    const hintsBefore = await page.locator('circle[role="button"]').count()
    expect(hintsBefore).toBeGreaterThan(0)

    await page.locator('[aria-label="(5, 1)로 이동"]').click()

    // 이동 후 힌트 사라짐 (선택 해제)
    const hintsAfter = await page.locator('circle[role="button"]').count()
    expect(hintsAfter).toBe(0)

    // 마를 다시 선택해 새 위치에서 유효 이동 있는지 확인
    await page.locator('[aria-label="기물 ma"]').click()
    const newHints = await page.locator('circle[role="button"]').count()
    expect(newHints).toBeGreaterThan(0)
  })

  test('AC5: ma.ts는 React/DOM import 없는 순수 함수', async () => {
    // P2 fix: spec 파일 위치 기준 경로 — CWD 독립
    const maPath = resolve(__dirname, '../src/pieces/rules/ma.ts')
    const content = readFileSync(maPath, 'utf-8')

    expect(content).not.toMatch(/from ['"]react['"]/)
    expect(content).not.toMatch(/import React/)
    expect(content).not.toMatch(/document\./)
    expect(content).not.toMatch(/window\./)
    expect(content).toContain('getMaValidMoves')
    expect(content).toContain('BOARD')
  })
})
