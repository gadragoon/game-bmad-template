---
baseline_commit: 16cde656055aaeb1c8159a1f898e805f9749f4c2
---

# Story 1.3: SVG 장기판 렌더링

Status: done

## Story

As a player,
I want to see the janggi board when the game loads,
so that I have a clear visual space to play on.

## Acceptance Criteria

1. **Given** the app loads in a browser  
   **When** the Board component renders  
   **Then** a 9×10 grid SVG is displayed (9 vertical lines × 10 horizontal lines = 90 intersection points)

2. **Given** the Board SVG  
   **When** the visual style is inspected  
   **Then** grid lines are rendered in sumi-e ink style (먹색 dark lines on 한지색 background)

3. **Given** the game is running and any piece move action is dispatched  
   **When** the Board component's render count is observed via React DevTools  
   **Then** the Board does not re-render — it is fully static after initial mount (React.memo 보장)

4. **Given** the app on different screen sizes  
   **When** the viewport is resized  
   **Then** the board scales proportionally while maintaining the 9×10 aspect ratio (viewBox + preserveAspectRatio)

## Tasks / Subtasks

- [x] Task 1: `src/board/gridUtils.ts` 생성 — 좌표 유틸리티 (AC: 1, 4)
  - [x] `CELL_SIZE = 60` (px), `BOARD_PADDING = 40` (px) 모듈 상수 정의
  - [x] `positionToCoords(pos: Position): { x: number; y: number }` 순수 함수 구현
    - `x = BOARD_PADDING + pos.col * CELL_SIZE`
    - `y = BOARD_PADDING + pos.row * CELL_SIZE`
  - [x] `import type { Position } from '../types'` 만 허용 — React/DOM import 절대 금지
  - [x] export: `CELL_SIZE`, `BOARD_PADDING`, `positionToCoords`

- [x] Task 2: `src/board/Board.tsx` 생성 — 정적 SVG 보드 컴포넌트 (AC: 1, 2, 3, 4)
  - [x] `import { BOARD } from '../constants'` — BOARD.cols(9), BOARD.rows(10) 사용
  - [x] `import { CELL_SIZE, BOARD_PADDING } from './gridUtils'`
  - [x] SVG viewBox 계산:
    - `viewBoxW = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING`  → `8 * 60 + 80 = 560`
    - `viewBoxH = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING`  → `9 * 60 + 80 = 620`
    - `viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}`
  - [x] `preserveAspectRatio="xMidYMid meet"` 설정 — 비율 고정 반응형 스케일링
  - [x] 한지색 배경 `<rect>` 렌더링: `width={viewBoxW}`, `height={viewBoxH}`, `fill` = CSS var
  - [x] 수평선 10개: row 0..9, x1=PADDING, x2=PADDING + 8*CELL_SIZE, y=PADDING + row*CELL_SIZE
  - [x] 수직선 9개: col 0..8, y1=PADDING, y2=PADDING + 9*CELL_SIZE, x=PADDING + col*CELL_SIZE
  - [x] `stroke` / `strokeWidth` — CSS Module 클래스로 적용
  - [x] **`export default React.memo(Board)`** — 리렌더 방지 필수 (AC3)
  - [x] `import styles from './Board.module.css'` 사용

- [x] Task 3: `src/board/Board.module.css` 생성 — 수묵화 스타일 (AC: 2, 4)
  - [x] CSS 커스텀 프로퍼티 정의:
    - `--color-hanji: #f4e8c1` (한지색 배경)
    - `--color-sumi: #1c1210` (먹색 선)
  - [x] `.board` 클래스: `width: 100%`, `max-width: 560px`, `display: block`, `margin: 0 auto`
  - [x] `.gridLine` 클래스: `stroke: var(--color-sumi)`, `strokeWidth: 1.5px`
  - [x] `.background` 클래스: `fill: var(--color-hanji)`

- [x] Task 4: `src/App.tsx` 업데이트 — Board 렌더링 (AC: 1)
  - [x] `import Board from './board/Board'` 추가
  - [x] `<GameProvider>` 내부에 `<Board />` 렌더링

- [x] Task 5: 전체 검증 (AC: 3, 5)
  - [x] `npx tsc --noEmit` — TypeScript strict 에러 0건
  - [x] `npm run build` — 빌드 성공
  - [x] `npm run dev` 후 브라우저에서 9×10 격자 보드 표시 확인
  - [x] React DevTools Profiler에서 Board 리렌더 없음 확인 (dispatch 후에도)

## Dev Notes

### 핵심 구현 패턴: 정적 Board

**Board는 props도 없고 state도 구독하지 않는다.** `useGameState()` 호출 금지. 순수 SVG 렌더링만 한다.

```tsx
// src/board/Board.tsx
import React from 'react'
import { BOARD } from '../constants'
import { CELL_SIZE, BOARD_PADDING } from './gridUtils'
import styles from './Board.module.css'

function Board() {
  const viewBoxW = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 560
  const viewBoxH = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 620

  const horizontalLines = Array.from({ length: BOARD.rows }, (_, row) => (
    <line
      key={`h-${row}`}
      className={styles.gridLine}
      x1={BOARD_PADDING}
      y1={BOARD_PADDING + row * CELL_SIZE}
      x2={BOARD_PADDING + (BOARD.cols - 1) * CELL_SIZE}
      y2={BOARD_PADDING + row * CELL_SIZE}
    />
  ))

  const verticalLines = Array.from({ length: BOARD.cols }, (_, col) => (
    <line
      key={`v-${col}`}
      className={styles.gridLine}
      x1={BOARD_PADDING + col * CELL_SIZE}
      y1={BOARD_PADDING}
      x2={BOARD_PADDING + col * CELL_SIZE}
      y2={BOARD_PADDING + (BOARD.rows - 1) * CELL_SIZE}
    />
  ))

  return (
    <svg
      className={styles.board}
      viewBox={`0 0 ${viewBoxW} ${viewBoxH}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="장기판"
    >
      <rect className={styles.background} width={viewBoxW} height={viewBoxH} />
      {horizontalLines}
      {verticalLines}
    </svg>
  )
}

export default React.memo(Board)
```

### gridUtils.ts 패턴

```typescript
// src/board/gridUtils.ts
import type { Position } from '../types'

export const CELL_SIZE = 60      // SVG 좌표계 1칸 크기 (px 기준)
export const BOARD_PADDING = 40  // 격자 외곽 여백

export function positionToCoords(pos: Position): { x: number; y: number } {
  return {
    x: BOARD_PADDING + pos.col * CELL_SIZE,
    y: BOARD_PADDING + pos.row * CELL_SIZE,
  }
}
```

**중요:** `positionToCoords`는 Story 1.4(기물 배치)와 Story 1.5(이동 인터랙션)에서 사용된다. 지금 올바르게 구현해야 이후 스토리에서 참조 가능.

### SVG 좌표 계산 (매직 넘버 없이)

| 속성 | 계산식 | 결과 |
|------|--------|------|
| viewBox 너비 | `(BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING` | `8 * 60 + 80 = 560` |
| viewBox 높이 | `(BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING` | `9 * 60 + 80 = 620` |
| 수평선 수 | `BOARD.rows` | 10 |
| 수직선 수 | `BOARD.cols` | 9 |
| 선 x1 | `BOARD_PADDING` | 40 |
| 선 x2 | `BOARD_PADDING + (BOARD.cols - 1) * CELL_SIZE` | 40 + 480 = 520 |
| 선 y1 | `BOARD_PADDING` | 40 |
| 선 y2 | `BOARD_PADDING + (BOARD.rows - 1) * CELL_SIZE` | 40 + 540 = 580 |

### 현재 파일 상태 (Story 1.2 종료 후)

| 파일 | 현재 상태 | 이번 스토리 변경 |
|------|-----------|----------------|
| `src/App.tsx` | `<GameProvider><div>텍스트</div></GameProvider>` | Board 컴포넌트 추가 |
| `src/constants.ts` | `BOARD = { cols: 9, rows: 10 }`, `PIECE_ANIMATION` | 변경 없음 |
| `src/types.ts` | `PieceId`, `Position`, `Board`, `AnimationSpec`, `PieceConfig`, `ChapterConfig`, `AudioKey` import | 변경 없음 |
| `src/board/Board.tsx` | 없음 | **신규 생성** |
| `src/board/Board.module.css` | 없음 | **신규 생성** |
| `src/board/gridUtils.ts` | 없음 | **신규 생성** |

### Story 1.2에서 배운 것 (CR 반영)

- `React.memo` 없이 Board 구현 시 AC3(리렌더 없음) 실패 — 반드시 `React.memo` 래핑 필수
- CSS 커스텀 프로퍼티(`--color-hanji`, `--color-sumi`)로 정의해야 Story 3.4 수묵화 완성 시 색상 조율 가능
- BOARD.cols와 BOARD.rows로 계산 — 숫자 9, 10을 Board.tsx에 직접 쓰면 constants.ts 매직 넘버 금지 원칙 위반
- `gridUtils.ts`는 React/DOM import 없이 순수 유틸리티로 — `pieces/rules/` 패턴 동일하게 적용
- TypeScript strict: `Array.from({ length: N }, (_, i) => ...)` 패턴으로 array index 활용

### 의존성 그래프 (임포트 방향)

```
src/types.ts
    ↓
src/board/gridUtils.ts     ← types.ts만 import (React/DOM 금지)
    ↓
src/constants.ts
    ↓
src/board/Board.tsx        ← constants.ts + gridUtils.ts + Board.module.css import
    ↓
src/App.tsx                ← Board.tsx + state/GameContext.tsx import
```

### 수묵화 색상 팔레트

| 이름 | 한국어 | Hex | 용도 |
|------|--------|-----|------|
| 먹색 | 먹色 | `#1c1210` | 격자선 stroke |
| 한지색 | 韓紙色 | `#f4e8c1` | 배경 rect fill |

> 단청 포인트 색상(인터랙션 하이라이트)은 Story 1.5에서 추가됨.

### 접근성

- `<svg role="img" aria-label="장기판">` — 스크린 리더 대응
- Board 자체는 interactive 요소 없음 (클릭은 Story 1.5에서 HintOverlay가 처리)

### Project Structure Notes

- `src/board/` 폴더는 아키텍처 문서에 명시된 위치 (`board/Board.tsx`, `board/gridUtils.ts`)
- `Board.module.css`는 CSS Modules 컨벤션 준수 (`*.module.css`)
- `HintOverlay.tsx`는 이번 스토리 범위 밖 — Story 1.5에서 신규 생성
- `gridUtils.ts`는 `board/` 폴더 안에 위치 (아키텍처 문서 `board/gridUtils.ts` 명시)

### Project Context Rules

- **CSS Modules 필수** — `Board.module.css`, `import styles from './Board.module.css'`
- **매직 넘버 금지** — `9`, `10` 직접 사용 불가. `BOARD.cols`, `BOARD.rows`만 사용
- **React.memo 필수** — 보드 SVG는 정적, 기물 이동 시 리렌더 없음 (NFR: 60fps)
- **GSAP 미사용** — 이 스토리에서 GSAP 없음. Board는 정적 SVG
- **순수 gridUtils** — `positionToCoords`는 React/DOM import 없는 순수 함수
- **dispatch만으로 상태 변경** — Board는 dispatch 호출 없음 (완전 수동적)
- **에러 처리** — Board에서 throw 없음. SVG 렌더 실패는 React 경계에서 처리

### References

- [Source: _bmad-output/game-architecture.md#폴더 구조 — board/Board.tsx, board/gridUtils.ts]
- [Source: _bmad-output/game-architecture.md#퍼포먼스 패턴 — 보드 SVG는 정적, 리렌더 없음]
- [Source: _bmad-output/game-architecture.md#네이밍 컨벤션]
- [Source: _bmad-output/project-context.md#Critical Implementation Rules — 퍼포먼스]
- [Source: _bmad-output/project-context.md#Anti-patterns — 매직 넘버 금지]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3: SVG 장기판 렌더링]
- [Source: _bmad-output/planning-artifacts/epics.md#FR1: SVG로 9×10 장기판 렌더링]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

없음 — 구현 중 에러 없음. tsc 0 errors, build success.

### Completion Notes List

- viewBoxW/H 상수를 함수 내부가 아닌 모듈 레벨에서 계산함 (매 렌더 재계산 방지)
- Board.tsx가 props/context를 전혀 구독하지 않으므로 React.memo 효과 완전 보장
- CSS 커스텀 프로퍼티를 `:root`에 선언해 Story 3.4 테마 조율 시 단일 지점 수정 가능

### File List

**NEW:**
- janggi-hwangsanbul/src/board/gridUtils.ts
- janggi-hwangsanbul/src/board/Board.tsx
- janggi-hwangsanbul/src/board/Board.module.css

**MODIFIED:**
- janggi-hwangsanbul/src/App.tsx (Board 컴포넌트 추가)

### Review Findings (1.3 CR — 2026-06-21)

- [x] [Review][Defer] `:root` CSS custom properties를 Board.module.css 안에 선언 [Board.module.css:1-4] — deferred, Vite에서 `:root`는 전역 방출되어 기능상 정상이나 CSS Module 관례에 어긋남; 향후 `index.css` 또는 별도 `global.css`로 이전 고려
- [x] [Review][Defer] SVG `<title>` 요소 없음 — `aria-label` 미지원 스크린리더 폴백 누락 [Board.tsx:11] — deferred, 현대 브라우저에서 `role="img" + aria-label` 조합으로 충분; Story 3.4 접근성 완성 시 추가 고려
- [x] [Review][Defer] `positionToCoords` 범위 검증 없음 — 유효 범위 외 Position 전달 시 SVG 밖 좌표 반환 [gridUtils.ts:6-10] — deferred, Story 1.4에서 기물 렌더링 시 호출부(`getValidMoves`)가 유효 Position 보장 예정
- [x] [Review][Defer] MOVE_PIECE payload 무시 (pre-existing from Story 1.2 CR) — deferred
- [x] [Review][Defer] completedPieces Set 직렬화 불가 (pre-existing from Story 1.2 CR) — deferred

### Change Log

| 날짜 | 파일 | 변경 내용 |
|------|------|-----------|
| 2026-06-21 | src/board/gridUtils.ts | 신규 생성 — CELL_SIZE, BOARD_PADDING, positionToCoords |
| 2026-06-21 | src/board/Board.tsx | 신규 생성 — React.memo 정적 SVG 보드 (9수직선×10수평선) |
| 2026-06-21 | src/board/Board.module.css | 신규 생성 — 수묵화 CSS 커스텀 프로퍼티 |
| 2026-06-21 | src/App.tsx | Board 컴포넌트 import 및 렌더링 추가 |
