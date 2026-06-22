---
baseline_commit: fa0afaeb76df5b455118b5586e30bb6d7aa21132
---

# Story 1.4: 기물 SVG 렌더링 및 초기 배치

Status: done

## Story

As a player,
I want to see the 4 janggi pieces displayed on the board at their starting positions,
so that I know which pieces are available and where the game begins.

## Acceptance Criteria

1. **Given** the board is rendered
   **When** the game loads
   **Then** cha(車), ma(馬), po(砲), jol(卒)은 각각 `vite-plugin-svgr`로 import된 SVG React 컴포넌트로 렌더링된다

2. **Given** the rendered pieces
   **When** each piece is visually inspected
   **Then** 각 기물이 올바른 한자 기호(車/馬/砲/卒)를 표시한다

3. **Given** the `GYEBAEK_CHAPTER` config
   **When** pieces are placed on the board
   **Then** 각 기물이 `constants.ts`의 `INITIAL_POSITIONS`에 정의된 시작 위치에 나타난다

4. **Given** each piece SVG element
   **When** its CSS is inspected
   **Then** `will-change: transform`이 적용되어 향후 스토리에서 GPU 가속 GSAP 애니메이션이 가능하다

## Tasks / Subtasks

- [x] Task 1: 기물 SVG 에셋 파일 4개 생성 (AC: 1, 2)
  - [x] `src/assets/svg/piece-cha.svg` 생성 — 수묵화 스타일, 한자 車
  - [x] `src/assets/svg/piece-ma.svg` 생성 — 한자 馬
  - [x] `src/assets/svg/piece-po.svg` 생성 — 한자 砲
  - [x] `src/assets/svg/piece-jol.svg` 생성 — 한자 卒

- [x] Task 2: `src/constants.ts` 업데이트 (AC: 3)
  - [x] `INITIAL_POSITIONS: Record<PieceId, Position>` 추가

- [x] Task 3: GameState에 `board` 필드 추가 및 MOVE_PIECE 수정 (AC: 3)
  - [x] `state/gameTypes.ts`: `board: Board` 필드 추가
  - [x] `state/gameReducer.ts`: `createInitialBoard()` 순수 함수 추가
  - [x] `state/gameReducer.ts`: `initialState.board` = `createInitialBoard()` 설정
  - [x] `state/gameReducer.ts`: `MOVE_PIECE` 케이스에서 board 업데이트 구현

- [x] Task 4: `src/pieces/Piece.tsx` 생성 (AC: 1, 2, 4)
  - [x] 4개 SVGR import (`*.svg?react`)
  - [x] `positionToCoords()` 사용하여 SVG 좌표 계산
  - [x] `<g ref={pieceRef}>` CSS transform으로 초기 위치 지정
  - [x] `Piece.module.css`의 `.piece` 클래스 적용

- [x] Task 5: `src/pieces/Piece.module.css` 생성 (AC: 4)
  - [x] `.piece { will-change: transform; }` 정의

- [x] Task 6: `src/board/PiecesLayer.tsx` 생성 (AC: 1, 3)
  - [x] `useGameState()` — `state.board`에서 기물별 현재 위치 파생
  - [x] Board와 동일한 viewBox로 절대위치 SVG 오버레이 렌더링

- [x] Task 7: `src/board/PiecesLayer.module.css` 생성
  - [x] `.piecesLayer { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }`

- [x] Task 8: `src/App.tsx` 업데이트 (AC: 1, 3)
  - [x] `boardContainer` div로 Board + PiecesLayer 래핑 (position: relative)
  - [x] `App.module.css` 생성 (신규, App.css는 미수정)

- [x] Task 9: 검증 (AC: 1, 2, 3, 4)
  - [x] `npx tsc --noEmit` — 0 errors
  - [x] `npm run build` — 성공 (37 modules, 195.99 kB)
  - [x] 브라우저: 4개 기물이 보드 위 올바른 위치에 표시됨 (Playwright 스크린샷 확인)
  - [x] Playwright DOM 검증: will-change: transform 4개 모두 확인, 좌표 수치 정확

### Review Findings

- [x] [Review][Decision] CSS `px` 단위 SVG transform — 뷰포트 560px 미만에서 기물 위치 어긋남 [Piece.tsx:32] — SVG `transform` 속성으로 교체 완료 (옵션 A 선택)
- [x] [Review][Patch] MOVE_PIECE 경계값 미검증 — `action.to`가 보드 범위 밖일 때 TypeError 크래시 [gameReducer.ts:62] — bounds check guard 추가 완료

- [x] [Review][Defer] MOVE_PIECE piece-not-found fallthrough — 기물 미발견 시 target 셀에 덮어쓰기 [gameReducer.ts:50-61] — deferred, pre-existing
- [x] [Review][Defer] PiecesLayer SVG 포인터 이벤트 차단 — `pointer-events: none` 미설정 [PiecesLayer.module.css] — deferred, Story 1.5에서 처리
- [x] [Review][Defer] boardContainer 명시적 height 없음 — absolute child 0px 수축 가능성 [App.module.css] — deferred, Playwright 검증 통과, 브라우저 SVG aspect-ratio 추론 의존
- [x] [Review][Defer] key={pieceId} 중복 가능성 — 동일 PieceId 중복 시 React 키 충돌 [PiecesLayer.tsx:30] — deferred, 현재 아키텍처에서 불가
- [x] [Review][Defer] NEXT_SCENE에서 board 미초기화 — 씬 전환 시 기물 위치 유지됨 [gameReducer.ts:32] — deferred, Epic 2 씬 전환 스펙에서 처리
- [x] [Review][Defer] VIEWBOX_W/H가 constants.ts에 없음 — Board 뷰박스 변경 시 자동 반영 안 됨 [PiecesLayer.tsx:9-10] — deferred, 공유 상수에서 파생되므로 저위험
- [x] [Review][Defer] config prop 미사용 (Piece.tsx) — Props에 선언만, Story 3.1에서 사용 예정 [Piece.tsx:17-23] — deferred, 의도적 설계

## Dev Notes

### 핵심 설계: 2-레이어 SVG 아키텍처

Board.tsx는 완전 정적 유지 (Story 1.3 원칙). 기물은 Board 위에 겹쳐지는 별도 SVG 레이어로 분리.

```
App.tsx
└── <div className="boardContainer">   ← position: relative, max-width: 560px
    ├── <Board />                       ← 정적 SVG, width: 100%, React.memo
    └── <PiecesLayer />                 ← 절대위치 SVG, 동일 viewBox
```

두 SVG 모두 `viewBox="0 0 560 620"` + `preserveAspectRatio="xMidYMid meet"` → 모든 화면 크기에서 자동 정렬.

**왜 분리된 SVG 레이어인가:** Board.tsx는 props/context를 구독하지 않아 `React.memo`가 완전히 효과적. PiecesLayer는 state를 구독하지만 Board를 리렌더하지 않음.

### INITIAL_POSITIONS 좌표 (constants.ts)

```typescript
// constants.ts에 추가
export const INITIAL_POSITIONS: Record<PieceId, Position> = {
  cha: { col: 0, row: 5 },  // 좌측 중단 — 차: 가로/세로 이동 공간 충분
  ma:  { col: 2, row: 7 },  // 좌측 하단 — 마: L자 이동 여유 공간
  po:  { col: 4, row: 2 },  // 중앙 상단 — 포: col 4에서 jol(row 5) 넘어 착지 가능
  jol: { col: 4, row: 5 },  // 중앙       — 졸: 포의 점프 경유 기물, 전진/횡보 가능
}
// 배치 의도: po(4,2) → 점프 jol(4,5) → 착지 (4,6)~(4,9) — Story 1.7, 2.4 데모 가능
```

### GameState에 board 추가 (deferred-work.md 항목 완결)

**gameTypes.ts 변경 — `board: Board` 추가:**

```typescript
import type { PieceId, Position, Board } from '../types'  // Board import 추가

export type GameState = {
  scene: Scene
  phase: ExperiencePhase | null
  selectedPiece: PieceId | null
  completedPieces: Set<PieceId>
  board: Board  // ← 신규 — (PieceId | null)[][] 10행×9열 행렬
}
```

**gameReducer.ts 변경:**

```typescript
import { INITIAL_POSITIONS, BOARD } from '../constants'
import type { Board, PieceId, Position } from '../types'

// initialState 이전에 추가 (순수 함수, React import 금지)
function createInitialBoard(): Board {
  const board: Board = Array.from(
    { length: BOARD.rows },
    () => Array<PieceId | null>(BOARD.cols).fill(null)
  )
  for (const [id, pos] of Object.entries(INITIAL_POSITIONS) as [PieceId, Position][]) {
    board[pos.row][pos.col] = id
  }
  return board
}

export const initialState: GameState = {
  scene: 'opening',
  phase: null,
  selectedPiece: null,
  completedPieces: new Set(),
  board: createInitialBoard(),  // ← 추가
}

// MOVE_PIECE 케이스 교체:
case 'MOVE_PIECE': {
  if (!state.selectedPiece) return state
  const nextBoard = state.board.map(row => [...row]) as Board
  // 현재 위치 찾아 비우기
  outer: for (let r = 0; r < BOARD.rows; r++) {
    for (let c = 0; c < BOARD.cols; c++) {
      if (nextBoard[r][c] === state.selectedPiece) {
        nextBoard[r][c] = null
        break outer
      }
    }
  }
  // 새 위치에 배치 (기존 기물 포획 포함)
  nextBoard[action.to.row][action.to.col] = state.selectedPiece
  return { ...state, selectedPiece: null, board: nextBoard }
}
```

### 기물 SVG 파일 설계 (수묵화 스타일)

viewBox `0 0 60 60` — CELL_SIZE(60)와 동일. 4개 파일 구조 동일, 한자만 다름:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
  <circle cx="30" cy="30" r="25" fill="#f4e8c1" stroke="#1c1210" stroke-width="2"/>
  <text x="30" y="30" font-size="22" text-anchor="middle" dominant-baseline="central"
        fill="#1c1210" font-family="serif" font-weight="bold">車</text>
</svg>
```

| 파일 | 한자 |
|------|------|
| `piece-cha.svg` | 車 |
| `piece-ma.svg`  | 馬 |
| `piece-po.svg`  | 砲 |
| `piece-jol.svg` | 卒 |

색상: `#f4e8c1` (한지색), `#1c1210` (먹색) — Board.module.css CSS custom properties와 동일 값.

### Piece.tsx 구현 패턴

```tsx
// src/pieces/Piece.tsx
import { useRef } from 'react'
import type { PieceId, Position, PieceConfig } from '../types'
import { positionToCoords } from '../board/gridUtils'
import ChaIcon from '../assets/svg/piece-cha.svg?react'
import MaIcon from '../assets/svg/piece-ma.svg?react'
import PoIcon  from '../assets/svg/piece-po.svg?react'
import JolIcon from '../assets/svg/piece-jol.svg?react'
import styles from './Piece.module.css'

const SVG_MAP = { cha: ChaIcon, ma: MaIcon, po: PoIcon, jol: JolIcon } as const

type Props = {
  pieceId: PieceId
  position: Position
  config: PieceConfig  // Story 3.1에서 config.animation 사용 예정 — 지금은 props 정의만
}

function Piece({ pieceId, position }: Props) {
  const pieceRef = useRef<SVGGElement>(null)
  const { x, y } = positionToCoords(position)
  const SvgIcon = SVG_MAP[pieceId]

  return (
    <g
      ref={pieceRef}                             // Story 3.1에서 useGSAP({ scope: pieceRef }) 연결
      className={styles.piece}                   // will-change: transform
      style={{ transform: `translate(${x}px, ${y}px)` }}  // Story 3.1에서 GSAP set()으로 교체
    >
      <SvgIcon x={-30} y={-30} width={60} height={60} />  {/* 보드 교점 기준 중앙 정렬 */}
    </g>
  )
}

export default Piece
```

**Story 3.1 전환 예고 (dev agent가 알아야 할 것):**
현재 `style={{ transform: ... }}` 는 Story 3.1에서 다음으로 교체됨:
```tsx
const { contextSafe } = useGSAP({ scope: pieceRef })
// effect 내부: gsap.set(pieceRef.current, { x, y })
// 이동 시: contextSafe(() => gsap.to(pieceRef.current, { x, y, ... }))
```
지금 ref를 추가해두는 이유가 바로 이것. ref 없이 구현하면 Story 3.1에서 전면 재작성 필요.

### Piece.module.css

```css
.piece {
  will-change: transform;
  cursor: default; /* Story 1.5에서 pointer로 변경 */
}
```

### PiecesLayer.tsx 구현 패턴

```tsx
// src/board/PiecesLayer.tsx
import { useGameState } from '../state/GameContext'
import { GYEBAEK_CHAPTER } from '../pieces/config/gyebaekChapter'
import Piece from '../pieces/Piece'
import { BOARD } from '../constants'
import { CELL_SIZE, BOARD_PADDING } from './gridUtils'
import type { PieceId, Position } from '../types'
import styles from './PiecesLayer.module.css'

const VIEWBOX_W = (BOARD.cols - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 560
const VIEWBOX_H = (BOARD.rows - 1) * CELL_SIZE + 2 * BOARD_PADDING  // 620

export default function PiecesLayer() {
  const { board } = useGameState()

  const pieces: { pieceId: PieceId; position: Position }[] = []
  board.forEach((row, rowIdx) => {
    row.forEach((cell, colIdx) => {
      if (cell !== null) {
        pieces.push({ pieceId: cell, position: { col: colIdx, row: rowIdx } })
      }
    })
  })

  return (
    <svg
      className={styles.piecesLayer}
      viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"  // Board의 aria-label이 보드 전체를 커버
    >
      {pieces.map(({ pieceId, position }) => (
        <Piece
          key={pieceId}
          pieceId={pieceId}
          position={position}
          config={GYEBAEK_CHAPTER[pieceId]}
        />
      ))}
    </svg>
  )
}
```

### PiecesLayer.module.css

```css
.piecesLayer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
```

### App.tsx 업데이트

```tsx
// src/App.tsx
import { GameProvider } from './state/GameContext'
import Board from './board/Board'
import PiecesLayer from './board/PiecesLayer'
import styles from './App.module.css'

function App() {
  return (
    <GameProvider>
      <div className={styles.boardContainer}>
        <Board />
        <PiecesLayer />
      </div>
    </GameProvider>
  )
}

export default App
```

**App.module.css (신규 생성):**
```css
.boardContainer {
  position: relative;
  max-width: 560px;  /* Board.module.css .board의 max-width와 동일 */
  margin: 0 auto;
}
```

> 기존 `App.css`는 현재 미사용. 이번 스토리에서 `App.module.css`를 신규 생성하고 사용.

### 현재 파일 상태 (Story 1.3 종료 후)

| 파일 | 현재 상태 | 이번 스토리 변경 |
|------|-----------|----------------|
| `src/App.tsx` | `<GameProvider><div><Board /></div></GameProvider>` | boardContainer + PiecesLayer 추가 |
| `src/constants.ts` | `BOARD`, `PIECE_ANIMATION` | `INITIAL_POSITIONS` 추가 |
| `src/types.ts` | `PieceId`, `Position`, `Board`, `PieceConfig`, `ChapterConfig` | 변경 없음 |
| `src/state/gameTypes.ts` | `GameState` (board 없음), `Action` | `board: Board` 추가 |
| `src/state/gameReducer.ts` | `MOVE_PIECE` board 미반영 | `createInitialBoard()`, `MOVE_PIECE` 업데이트 |
| `src/board/Board.tsx` | 정적 SVG, React.memo | **변경 없음** — 반드시 건드리지 않음 |
| `src/board/gridUtils.ts` | `CELL_SIZE`, `BOARD_PADDING`, `positionToCoords` | 변경 없음 |
| `src/pieces/config/gyebaekChapter.ts` | 4기물 config (symbol, animation, sound, moves) | 변경 없음 |
| `src/assets/svg/placeholder.svg` | 車 한자만 있는 임시 파일 | **신규 파일 별도 생성, 이 파일은 삭제하지 않음** |

### Story 1.3 코드 리뷰에서 배운 것 (Story 1.4 적용)

- CSS custom properties (`--color-hanji`, `--color-sumi`)가 Board.module.css `:root`에 전역 선언됨 → Piece SVG 인라인 `fill`, `stroke` 값이 CSS vars와 동일해야 함 (`#f4e8c1`, `#1c1210`)
- `positionToCoords` 범위 검증 없음 — Story 1.4에서 `INITIAL_POSITIONS` 값이 모두 유효 범위(`col: 0–8, row: 0–9`) 내에 있어야 함 (확인 완료: cha(0,5), ma(2,7), po(4,2), jol(4,5) 모두 유효)

### SVGR 중첩 SVG 동작 확인

```tsx
// <svg> 내부에서 SVGR 컴포넌트 사용 시:
<ChaIcon x={-30} y={-30} width={60} height={60} />
// → 실제 렌더: <svg x="-30" y="-30" width="60" height="60" viewBox="0 0 60 60">...</svg>
// SVG 명세: 중첩 <svg>는 x, y, width, height 속성으로 위치/크기 지정 가능 ✓
// vite-plugin-svgr: 컴포넌트에 spread된 props가 root <svg>로 전달됨 ✓
```

### Project Context Rules

- **`useGSAP` + `contextSafe` 필수** — 이 스토리에서 GSAP 미사용. `pieceRef` ref만 준비. Story 3.1에서 추가.
- **`will-change: transform` 필수** — `.piece` 클래스에 반드시 적용
- **GSAP `x`, `y` transform 전용** — `left`/`top` 금지. CSS `transform: translate(xpx, ypx)` 사용 (GSAP과 호환)
- **Board 리렌더 없음** — PiecesLayer가 state 구독해도 Board.tsx는 memo로 보호됨
- **순수 createInitialBoard** — React/DOM import 없는 순수 함수
- **매직 넘버 금지** — VIEWBOX_W/H는 상수에서 파생, 560/620 직접 입력 금지
- **dispatch만으로 상태 변경** — PiecesLayer/Piece는 state 읽기 전용 (Story 1.5에서 onClick dispatch 추가)
- **`?react` suffix 필수** — `import X from '*.svg?react'` 형식

### References

- [Source: _bmad-output/game-architecture.md#신규 패턴 2: GSAP + React SVG 애니메이션]
- [Source: _bmad-output/game-architecture.md#퍼포먼스 패턴 (60fps 보장)]
- [Source: _bmad-output/game-architecture.md#폴더 구조 — pieces/Piece.tsx, pieces/Piece.module.css]
- [Source: _bmad-output/project-context.md#React + GSAP 통합 — useGSAP + contextSafe 필수]
- [Source: _bmad-output/project-context.md#Anti-patterns — GSAP left/top 금지, will-change: transform]
- [Source: _bmad-output/project-context.md#Project Structure]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: 기물 SVG 렌더링 및 초기 배치]
- [Source: _bmad-output/implementation-artifacts/deferred-work.md — MOVE_PIECE payload 무시 해결]
- [Source: _bmad-output/implementation-artifacts/1-3-svg-장기판-렌더링.md#Story 1.2에서 배운 것]
- [Source: _bmad-output/implementation-artifacts/1-3-svg-장기판-렌더링.md#의존성 그래프]

## Dev Agent Record

### Agent Model Used

claude-sonnet-4-6

### Debug Log References

없음 — 구현 중 에러 없음. tsc 0 errors, build 195.99 kB, Playwright AC 전수 검증 통과.

### Completion Notes List

- 2-레이어 SVG 아키텍처 구현: Board(정적 React.memo) + PiecesLayer(절대위치 오버레이). Board는 어떤 state 변경에도 리렌더 없음.
- `createInitialBoard()`: 순수 함수, React/DOM import 없음. `INITIAL_POSITIONS`에서 10×9 Board 행렬 생성.
- `MOVE_PIECE` 리듀서 완전 구현 (deferred-work.md 항목 해결): `outer:` 라벨로 중첩 루프 탈출, 포획 포함.
- po(4,2)와 jol(4,5)의 col 4 배치: Story 1.7/2.4 포 점프 데모 가능한 의도적 배치.
- Playwright DOM 검증 결과: 기물 4개 ✅, 한자 車馬砲卒 ✅, will-change: transform ✅, boardContainer position: relative ✅, PiecesLayer position: absolute ✅
- 각 기물 transform 좌표: 포(280,160), 차(40,340), 졸(280,340), 마(160,460) — INITIAL_POSITIONS × CELL_SIZE 계산 정확.
- ESLint: Story 1.4 신규/수정 파일 0 errors (기존 파일의 pre-existing 에러 10건은 이전 스토리 이슈).

### File List

**NEW:**
- janggi-hwangsanbul/src/assets/svg/piece-cha.svg
- janggi-hwangsanbul/src/assets/svg/piece-ma.svg
- janggi-hwangsanbul/src/assets/svg/piece-po.svg
- janggi-hwangsanbul/src/assets/svg/piece-jol.svg
- janggi-hwangsanbul/src/pieces/Piece.tsx
- janggi-hwangsanbul/src/pieces/Piece.module.css
- janggi-hwangsanbul/src/board/PiecesLayer.tsx
- janggi-hwangsanbul/src/board/PiecesLayer.module.css
- janggi-hwangsanbul/src/App.module.css

**MODIFIED:**
- janggi-hwangsanbul/src/constants.ts (INITIAL_POSITIONS 추가)
- janggi-hwangsanbul/src/state/gameTypes.ts (board: Board 추가)
- janggi-hwangsanbul/src/state/gameReducer.ts (createInitialBoard, initialState.board, MOVE_PIECE 업데이트)
- janggi-hwangsanbul/src/App.tsx (App.module.css import, boardContainer div, PiecesLayer 추가)

### Change Log

| 날짜 | 파일 | 변경 내용 |
|------|------|-----------|
| 2026-06-22 | src/assets/svg/piece-{cha,ma,po,jol}.svg | 신규 생성 — 수묵화 스타일 원형 + 한자 (車馬砲卒) |
| 2026-06-22 | src/constants.ts | INITIAL_POSITIONS 추가 (4기물 초기 배치 좌표) |
| 2026-06-22 | src/state/gameTypes.ts | GameState에 board: Board 필드 추가 |
| 2026-06-22 | src/state/gameReducer.ts | createInitialBoard(), MOVE_PIECE board 업데이트 구현 |
| 2026-06-22 | src/pieces/Piece.tsx | 신규 생성 — SVGR import, positionToCoords, g ref, CSS transform |
| 2026-06-22 | src/pieces/Piece.module.css | 신규 생성 — will-change: transform |
| 2026-06-22 | src/board/PiecesLayer.tsx | 신규 생성 — board state 파생, 절대위치 SVG 오버레이 |
| 2026-06-22 | src/board/PiecesLayer.module.css | 신규 생성 — position: absolute, 100% 크기 |
| 2026-06-22 | src/App.module.css | 신규 생성 — boardContainer (relative, max-width 560px) |
| 2026-06-22 | src/App.tsx | boardContainer div + PiecesLayer 추가 |
