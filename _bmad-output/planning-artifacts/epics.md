---
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - '_bmad-output/planning-artifacts/gdds/gdd-game-bmad-template-2026-06-20/gdd.md'
  - '_bmad-output/planning-artifacts/gdds/gdd-game-bmad-template-2026-06-20/epics.md'
  - '_bmad-output/game-architecture.md'
  - '_bmad-output/planning-artifacts/briefs/brief-game-bmad-template-2026-06-14/brief.md'
---

# 장기: 황산벌의 기억 - Epic Breakdown

## Overview

이 문서는 GDD, 아키텍처 결정을 구현 가능한 스토리로 분해한 에픽 및 스토리 명세다.

---

## Requirements Inventory

### Functional Requirements

FR1: SVG로 9×10 장기판 렌더링 (가로 9줄, 세로 10줄, 수묵화 스타일 선)
FR2: 4개 기물(차, 마, 포, 졸) SVG 렌더링 및 초기 위치 배치
FR3: 기물 클릭 시 선택 상태 표시 및 이동 가능 칸 흐리게 표시
FR4: 이동 가능 칸 클릭 시 기물 이동 실행
FR5: 동일 기물 재클릭 또는 빈 칸 클릭 시 선택 취소
FR6: 차(車) 이동 룰 — 가로/세로 직선, 거리 무제한, 기물에 막힘
FR7: 마(馬) 이동 룰 — 직선 1칸 후 대각선 1칸 (L자), 인접 칸 막힘
FR8: 포(砲) 이동 룰 — 직선 이동, 기물 1개 반드시 넘어야 이동/공격, 포끼리 불가
FR9: 졸(卒) 이동 룰 — 전진 1칸 또는 횡보 1칸, 후퇴 불가
FR10: 잘못된 이동 조용히 막기 (에러 메시지 없음, 조용히 무시)
FR11: 탭 입력이 클릭과 동일하게 동작
FR12: 6개 장면 선형 진행 시스템
FR13: 내러티브 장면 — 내레이션 텍스트 + 배경 일러스트 + "계속하기" 입력
FR14: 체험 장면 — 기물 등장 소개 + 이동 시연 + 직접 체험 + 계백 대사
FR15: 기물 이동 완료 시 계백 대사 텍스트 표시
FR16: 씬 1 오프닝 — 황산벌 전투 배경 설정, 계백의 결의 내레이션
FR17: 씬 2~5 체험 — 차/마/포/졸 체험 장면 순서대로 진행
FR18: 씬 6 결말 — 황산벌 전투 결말 내레이션
FR19: 기물 이동 감정 애니메이션 — 차: 500ms ease-in / 마: 300ms ease-out / 포: 150ms linear / 졸: 400ms ease-in
FR20: 기물 이동 SFX — 차: 목재 미끄러짐 / 마: 가벼운 타격 / 포: 날카로운 타격 / 졸: 둔탁한 타격
FR21: 국악기 앰비언트 BGM 재생 (가야금, 해금, 대금)
FR22: 이동 가능 칸 힌트 시각 정제 (흐림 강도, 색상 조율)

### NonFunctional Requirements

NFR1: 60fps 유지 (기물 이동 애니메이션 포함)
NFR2: 기물 이동 입력 후 애니메이션 시작 < 16ms
NFR3: 지원 브라우저 — Chrome, Safari, Firefox 최신 버전
NFR4: 수묵화 여백미 비주얼 스타일 — 먹색/한지색, 단청 포인트 1색
NFR5: AI 생성 이미지 화풍 일관성 — 스타일 프롬프트 표준화 + 시드 고정
NFR6: 예상 플레이 시간 10~15분 (완주 기준)
NFR7: 완주율 및 이탈 지점 측정 가능 (이벤트 로깅)

### Additional Requirements

AR1: React 19.2.7 + Vite 8.0.9 + TypeScript (strict) + GSAP 3.13 프로젝트 초기화
AR2: vite-plugin-svgr 설정 — SVG 파일을 React 컴포넌트로 import
AR3: Howler.js + @types/howler 오디오 시스템 설정
AR4: useReducer 씬 상태 머신 구현 (GameState, Action 타입, gameReducer)
AR5: ChapterConfig 패턴 — 기물별 데이터 중심 config (계백 챕터: 차/마/포/졸)
AR6: Feature-based 폴더 구조 생성 (scenes, board, pieces, story, audio, state, assets)
AR7: constants.ts — GDD 명세 애니메이션 스펙 (ms/이징) 중앙 정의
AR8: GitHub Pages 배포 설정 (vite.config.ts base path, gh-pages 패키지)

### UX Design Requirements

해당 없음 (POC 범위 외, v1.0에서 별도 UX 문서 작성 예정)

### FR Coverage Map

```
FR1:  Epic 1 — SVG 9×10 장기판 렌더링
FR2:  Epic 1 — 4개 기물 SVG 렌더링 및 초기 배치
FR3:  Epic 1 — 기물 선택 상태 및 이동 가능 칸 하이라이트
FR4:  Epic 1 — 이동 가능 칸 클릭 시 기물 이동 실행
FR5:  Epic 1 — 동일 기물 재클릭/빈 칸 클릭 시 선택 취소
FR6:  Epic 1 — 차(車) 이동 룰 (직선, 거리 무제한, 기물에 막힘)
FR7:  Epic 1 — 마(馬) 이동 룰 (L자, 인접 칸 막힘)
FR8:  Epic 1 — 포(砲) 이동 룰 (점프 필수, 포끼리 불가 포함)
FR9:  Epic 1 — 졸(卒) 이동 룰 (전진/횡보, 후퇴 불가)
FR10: Epic 1 — 잘못된 이동 조용히 차단 (에러 표시 없음)
FR11: Epic 1 — 탭 입력 = 클릭 동등 처리
FR12: Epic 2 — 6개 장면 선형 진행 시스템
FR13: Epic 2 — 내러티브 장면 (텍스트 + 일러스트 + "계속하기")
FR14: Epic 2 — 체험 장면 (기물 소개 + 시연 + 직접 체험 + 대사)
FR15: Epic 2 — 기물 이동 완료 시 계백 대사 텍스트 표시
FR16: Epic 2 — 씬 1 오프닝 (황산벌 배경, 계백 결의 내레이션)
FR17: Epic 2 — 씬 2~5 차/마/포/졸 체험 장면
FR18: Epic 2 — 씬 6 결말 내레이션
FR19: Epic 3 — 기물별 감정 애니메이션 스펙 적용 (차500/마300/포150/졸400ms)
FR20: Epic 3 — 기물별 이동 SFX 4종 적용
FR21: Epic 3 — 국악기 앰비언트 BGM (가야금/해금/대금)
FR22: Epic 3 — 이동 가능 칸 힌트 시각 정제

AR1:  Epic 1 — React+Vite+TypeScript 프로젝트 초기화
AR2:  Epic 1 — vite-plugin-svgr 설정
AR3:  Epic 1 — Howler.js audioManager 구조 설정 (실제 오디오는 E3)
AR4:  Epic 1 — useReducer 씬 상태 머신 (GameState, Action, gameReducer)
AR5:  Epic 1 — ChapterConfig 패턴 (계백 챕터 데이터)
AR6:  Epic 1 — Feature-based 폴더 구조 생성
AR7:  Epic 1 — constants.ts 애니메이션 스펙 중앙 정의
AR8:  Epic 1 — GitHub Pages 배포 설정

NFR1: Epic 3 — 60fps 유지 목표
NFR2: Epic 3 — 입력 응답 < 16ms
NFR3: Epic 1~3 — 브라우저 지원 (Chrome/Safari/Firefox 최신) — 전 에픽 적용
NFR4: Epic 3 — 수묵화 비주얼 스타일 (먹색/한지색/단청)
NFR5: Epic 2 — AI 생성 일러스트 화풍 일관성
NFR6: Epic 2 — 예상 완주 시간 10~15분
NFR7: Epic 3 — 완주율 및 이탈 지점 이벤트 로깅
```

## Epic List

### Epic 1: 장기 기반 — 기물이 룰에 맞게 움직이는 플레이어블 상태

플레이어가 4개 장기 기물을 실제 장기 룰에 맞게 선택하고 이동할 수 있다. 이야기나 효과음 없이도 게임 메커닉 자체가 완전히 작동하는 상태.

**FRs covered:** FR1, FR2, FR3, FR4, FR5, FR6, FR7, FR8, FR9, FR10, FR11
**ARs covered:** AR1, AR2, AR3, AR4, AR5, AR6, AR7, AR8
**NFRs covered:** NFR3 (브라우저 지원 — 전 에픽 적용 시작)

### Epic 2: 이야기 경험 — 황산벌 내러티브를 완주할 수 있는 씬 시스템

플레이어가 오프닝부터 결말까지 6개 장면을 순서대로 완주할 수 있다. Epic 1의 플레이어블 기판 위에 내러티브 래퍼가 씌워져 완주 가능한 경험이 완성된다.

**FRs covered:** FR12, FR13, FR14, FR15, FR16, FR17, FR18
**NFRs covered:** NFR5 (AI 일러스트 에셋 일관성), NFR6 (10~15분 완주 시간)

### Epic 3: 감각 완성 — 기물마다 감정이 느껴지는 최종 POC

플레이어가 기물별로 다른 애니메이션과 사운드로 감정 차이를 체험하고, 수묵화 비주얼 팔레트가 완성된 최종 POC를 경험할 수 있다.

**FRs covered:** FR19, FR20, FR21, FR22
**NFRs covered:** NFR1 (60fps), NFR2 (입력 < 16ms), NFR4 (수묵화 비주얼), NFR7 (이벤트 로깅)

---

## Epic 1: 장기 기반 — 기물이 룰에 맞게 움직이는 플레이어블 상태

플레이어가 4개 장기 기물을 실제 장기 룰에 맞게 선택하고 이동할 수 있다. 이야기나 효과음 없이도 게임 메커닉 자체가 완전히 작동하는 상태.

### Story 1.1: 프로젝트 초기화 및 개발 환경 설정

As a developer,
I want a fully configured project environment with all dependencies installed and folder structure in place,
So that I can immediately begin implementing game features without setup friction.

**Acceptance Criteria:**

**Given** the terminal is open in the project directory
**When** `npm run dev` is executed
**Then** the Vite dev server starts and the app is accessible at localhost without errors

**Given** an SVG file in `src/assets/`
**When** it is imported as `import Piece from './piece.svg?react'`
**Then** it renders as a React component without TypeScript compilation errors

**Given** `src/audio/audioManager.ts`
**When** the file is inspected
**Then** it is the only file that imports Howler.js directly — all other files use `audioManager.play(key)` only

**Given** `vite.config.ts`
**When** `npm run build` is executed
**Then** the output is generated with `/janggi-hwangsanbul/` as the base path, compatible with GitHub Pages deployment

**Given** the `src/` directory
**When** a developer navigates it
**Then** the following folders exist: `scenes/`, `board/`, `pieces/rules/`, `pieces/config/`, `story/`, `audio/`, `state/`, `assets/`

---

### Story 1.2: 핵심 타입 및 상태 머신 구현

As a developer,
I want the core GameState types, gameReducer, ChapterConfig, and constants to be implemented,
So that all game state changes flow through a single type-safe reducer and all magic numbers are centralized.

**Acceptance Criteria:**

**Given** `state/gameReducer.ts` with initial scene `'opening'`
**When** `dispatch({ type: 'NEXT_SCENE' })` is called repeatedly
**Then** scenes advance in order: `opening → cha → ma → po → jol → ending`

**Given** `state/gameReducer.ts`
**When** `dispatch({ type: 'SELECT_PIECE', id: 'cha' })` is called
**Then** `state.selectedPiece === 'cha'`

**Given** `constants.ts`
**When** `PIECE_ANIMATION` is imported
**Then** it contains `cha: { duration: 500, ease: 'ease-in' }`, `ma: { duration: 300, ease: 'ease-out' }`, `po: { duration: 150, ease: 'linear' }`, `jol: { duration: 400, ease: 'ease-in' }` and no raw numbers appear in any other file

**Given** `pieces/config/gyebaekChapter.ts`
**When** `GYEBAEK_CHAPTER` is imported
**Then** it contains config entries for `cha`, `ma`, `po`, `jol`, each with `id`, `symbol`, `animation` (from `PIECE_ANIMATION`), `sound` key, and `moves` function reference

**Given** TypeScript strict mode is enabled
**When** the project compiles
**Then** zero TypeScript errors exist in `state/` and `pieces/config/`

---

### Story 1.3: SVG 장기판 렌더링

As a player,
I want to see the janggi board when the game loads,
So that I have a clear visual space to play on.

**Acceptance Criteria:**

**Given** the app loads in a browser
**When** the Board component renders
**Then** a 9×10 grid SVG is displayed (9 columns × 10 rows of intersection points)

**Given** the Board SVG
**When** the visual style is inspected
**Then** grid lines are rendered in sumi-e ink style (먹색 dark lines on 한지색 background)

**Given** the game is running and a piece is moved
**When** the Board component's render count is observed
**Then** the Board does not rerender — it is fully static after initial mount

**Given** the app on different screen sizes
**When** the viewport is resized
**Then** the board scales proportionally while maintaining the 9×10 aspect ratio

---

### Story 1.4: 기물 SVG 렌더링 및 초기 배치

As a player,
I want to see the 4 janggi pieces displayed on the board at their starting positions,
So that I know which pieces are available and where the game begins.

**Acceptance Criteria:**

**Given** the board is rendered
**When** the game loads
**Then** cha(車), ma(馬), po(砲), jol(卒) are each rendered as SVG React components imported via `vite-plugin-svgr`

**Given** the rendered pieces
**When** each piece is visually inspected
**Then** each displays its correct Chinese character symbol: 車/馬/砲/卒

**Given** the `GYEBAEK_CHAPTER` config
**When** pieces are placed on the board
**Then** each piece appears at its GDD-specified starting position

**Given** each piece SVG element
**When** its CSS is inspected
**Then** `will-change: transform` is applied to enable GPU-accelerated GSAP animation in future stories

---

### Story 1.5: 기물 선택·이동 인터랙션 및 차(車) 룰 구현

As a player,
I want to click a piece to select it, see where it can move, and click a valid square to move it there,
So that I can play the game using the Cha piece with correct janggi rules.

**Acceptance Criteria:**

**Given** pieces are rendered on the board
**When** a player clicks the Cha piece
**Then** the Cha is visually highlighted as selected and all valid destination squares are dimly highlighted

**Given** the Cha is selected and valid squares are highlighted
**When** a player clicks a highlighted valid square
**Then** the Cha moves to that square and the selection/highlights clear

**Given** the Cha is selected
**When** a player clicks the Cha piece again
**Then** selection is cancelled and all highlights disappear — no error is shown

**Given** the Cha is selected
**When** a player clicks an empty non-valid square
**Then** selection is cancelled silently — no error message, alert, or console error appears (FR10)

**Given** the Cha at any position
**When** `getValidMoves('cha', pos, board)` is called
**Then** it returns all reachable squares along horizontal and vertical lines, stopping before (not including) the first blocking piece in each direction

**Given** `pieces/rules/getChaValidMoves.ts`
**When** the file is inspected
**Then** it has zero React or DOM imports — it is a pure function with no side effects

---

### Story 1.6: 마(馬) 이동 룰 구현

As a player,
I want to move the Ma piece using its L-shaped movement rule with adjacent-square blocking,
So that I experience the horse's distinctive movement pattern.

**Acceptance Criteria:**

**Given** the Ma piece on an unobstructed interior square
**When** `getValidMoves('ma', pos, board)` is called
**Then** it returns up to 8 L-shaped destinations (1 orthogonal step + 1 diagonal step in each of 4 directions)

**Given** a piece occupying a square orthogonally adjacent to the Ma
**When** valid moves are calculated for the Ma
**Then** the 2 diagonal destinations in that blocked direction are excluded (인접 칸 막힘 rule)

**Given** the Ma piece near a board edge
**When** valid moves are calculated
**Then** only in-bounds destinations are returned — no out-of-bounds positions

**Given** a valid Ma destination
**When** the player selects the Ma and clicks that destination
**Then** the Ma moves to that square

**Given** `pieces/rules/getMaValidMoves.ts`
**When** the file is inspected
**Then** it has zero React or DOM imports — pure function only

---

### Story 1.7: 포(砲) 이동 룰 구현

As a player,
I want to move the Po piece using its cannon jump rule including all three edge cases,
So that I experience the unique mechanic that defines the cannon piece.

**Acceptance Criteria:**

**Given** the Po piece and a line with exactly 1 intervening piece (of any type except Po)
**When** `getValidMoves('po', pos, board)` is called
**Then** all squares beyond that piece along the same line are returned as valid destinations

**Given** a line with 0 intervening pieces between Po and a destination
**When** Po valid moves are calculated
**Then** no destinations in that direction are returned (cannot move without jumping)

**Given** a line with 2 or more intervening pieces
**When** Po valid moves are calculated
**Then** no destinations beyond the second piece in that direction are returned

**Given** a destination square occupied by another Po piece
**When** Po valid moves are calculated
**Then** that square is excluded — Po cannot capture a Po (포끼리 포획 불가)

**Given** an intervening piece that is an ally Po
**When** Po valid moves are calculated
**Then** the jump is permitted — Po can jump over a Po, it just cannot capture one

**Given** `pieces/rules/getPoValidMoves.ts`
**When** the file is inspected
**Then** it has zero React or DOM imports — pure function only

---

### Story 1.8: 졸(卒) 이동 룰 및 키보드 접근성 구현

As a player,
I want to move the Jol piece forward or sideways and use keyboard navigation to play,
So that I experience the soldier's constrained movement and can play without a mouse.

**Acceptance Criteria:**

**Given** the Jol piece on any interior square
**When** `getValidMoves('jol', pos, board)` is called
**Then** it returns only the square directly forward and the squares directly left and right (maximum 3 squares)

**Given** the Jol piece at the forward-most edge of its movement range
**When** valid moves are calculated
**Then** the forward square is not returned — Jol cannot retreat or advance past this edge (후퇴 불가)

**Given** the Jol piece at a side edge
**When** valid moves are calculated
**Then** only in-bounds lateral and forward moves are returned

**Given** the board is rendered in the browser
**When** a player presses Tab
**Then** keyboard focus cycles through interactive elements (selectable pieces and, when a piece is selected, its valid destination squares)

**Given** a piece or valid square has keyboard focus
**When** the player presses Enter or Space
**Then** the same action fires as a mouse click — selection, move, or deselection (FR11)

**Given** `pieces/rules/getJolValidMoves.ts`
**When** the file is inspected
**Then** it has zero React or DOM imports — pure function only

---

## Epic 2: 이야기 경험 — 황산벌 내러티브를 완주할 수 있는 씬 시스템

플레이어가 오프닝부터 결말까지 6개 장면을 순서대로 완주할 수 있다. Epic 1의 플레이어블 기판 위에 내러티브 래퍼가 씌워져 완주 가능한 경험이 완성된다.

### Story 2.1: 씬 전환 시스템 구현

As a player,
I want the game to progress through 6 scenes in a fixed linear order,
So that I experience the complete narrative journey from opening to ending without getting lost.

**Acceptance Criteria:**

**Given** the game loads
**When** the initial state is inspected
**Then** `state.scene === 'opening'` and `state.phase === null`

**Given** any narrative scene is displayed
**When** the player triggers "계속하기"
**Then** `dispatch({ type: 'NEXT_SCENE' })` advances the scene in order: `opening → cha → ma → po → jol → ending`

**Given** any experience scene
**When** the player completes the piece interaction and the scene advances
**Then** the correct next scene component renders immediately without visible flash

**Given** the game is on the ending scene
**When** the scene state is inspected
**Then** `state.scene === 'ending'` and no further NEXT_SCENE action changes the scene

**Given** `state/gameReducer.ts`
**When** `dispatch({ type: 'SET_PHASE', phase: 'intro' })` is called
**Then** `state.phase === 'intro'` — phases (intro/demo/play/dialogue) drive sub-state within experience scenes

---

### Story 2.2: 씬 1 — 오프닝 내러티브 장면

As a player,
I want to read the opening narration about the Battle of Hwangsanbul with a background illustration and a "계속하기" button,
So that I'm immersed in the historical context and Gyebaek's resolve before gameplay begins.

**Acceptance Criteria:**

**Given** `state.scene === 'opening'`
**When** the OpeningScene component renders
**Then** a background illustration of the Hwangsanbul battlefield is displayed

**Given** the opening scene
**When** the illustration and text content are inspected
**Then** narrative text conveying Gyebaek's resolve and the 660 AD historical context is shown

**Given** the opening scene is fully rendered
**When** the player clicks or presses "계속하기"
**Then** `dispatch({ type: 'NEXT_SCENE' })` is called and the scene advances to `state.scene === 'cha'`

**Given** the background illustration asset
**When** its style prompt metadata is inspected
**Then** the sumi-e style prompt and seed value are documented (NFR5 — AI illustration consistency)

**Given** the opening scene text
**When** a Korean-speaking user reads it
**Then** the narration is historically grounded with no factual errors about the Battle of Hwangsanbul

---

### Story 2.3: 씬 2 — 차(車) 체험 장면

As a player,
I want to be introduced to the Cha piece, watch a demonstration, move it myself, and receive Gyebaek's dialogue after my move,
So that I learn the Cha's movement through a guided experience embedded in the narrative.

**Acceptance Criteria:**

**Given** `state.scene === 'cha'` and `state.phase === 'intro'`
**When** the ChaExperienceScene renders
**Then** the Cha piece appears with a narrative introduction text describing its role at Hwangsanbul

**Given** `state.phase === 'demo'`
**When** the scene enters the demonstration phase
**Then** the Cha piece moves along a pre-scripted path on the board to show its straight-line movement

**Given** `state.phase === 'play'`
**When** the player has control
**Then** the Cha piece is selectable and movable using the rules from Story 1.5 — the player must make at least one valid move to advance

**Given** the player makes a valid Cha move and `state.phase` transitions to `'dialogue'`
**When** the dialogue phase renders
**Then** Gyebaek's dialogue text appears, referencing the Cha's movement in the context of the battle (FR15)

**Given** the dialogue is displayed
**When** `useEffect` detects `state.phase === 'dialogue'` and `state.scene === 'cha'`
**Then** it is prepared to call `audioManager.play('cha-dialogue')` in Epic 3 — the hook point exists in code

**Given** the player reads the dialogue and triggers "계속하기"
**When** the action fires
**Then** `dispatch({ type: 'NEXT_SCENE' })` advances to `state.scene === 'ma'`

---

### Story 2.4: 씬 3 — 마(馬) 체험 장면

As a player,
I want to be introduced to the Ma piece and experience its L-shaped movement through the same guided structure as the Cha scene,
So that I learn the horse's distinctive movement within the continuing narrative.

**Acceptance Criteria:**

**Given** `state.scene === 'ma'` and `state.phase === 'intro'`
**When** the MaExperienceScene renders
**Then** the Ma piece appears with narrative introduction text describing its role at Hwangsanbul

**Given** `state.phase === 'demo'`
**When** the demo plays
**Then** the Ma piece executes a pre-scripted L-shaped move to illustrate its movement pattern

**Given** `state.phase === 'play'`
**When** the player has control
**Then** the Ma piece is selectable and movable using the rules from Story 1.6 — the player must make at least one valid move to advance

**Given** the player makes a valid Ma move and phase transitions to `'dialogue'`
**When** the dialogue phase renders
**Then** Gyebaek's dialogue text appears referencing the Ma (FR15)

**Given** the player reads the dialogue and triggers "계속하기"
**When** the action fires
**Then** `dispatch({ type: 'NEXT_SCENE' })` advances to `state.scene === 'po'`

---

### Story 2.5: 씬 4 — 포(砲) 체험 장면

As a player,
I want to be introduced to the Po piece and experience its unique jump mechanic through the guided scene structure,
So that I understand the cannon's distinctive rule before trying it myself.

**Acceptance Criteria:**

**Given** `state.scene === 'po'` and `state.phase === 'intro'`
**When** the PoExperienceScene renders
**Then** the Po piece appears with narrative introduction text, emphasizing the "must jump exactly one piece" rule

**Given** `state.phase === 'demo'`
**When** the demo plays
**Then** the Po piece executes a pre-scripted jump over one intervening piece to clearly illustrate the mechanic

**Given** `state.phase === 'play'`
**When** the player has control
**Then** the Po piece is selectable and movable using the rules from Story 1.7 (including all 3 edge cases) — the player must make at least one valid move to advance

**Given** the player makes a valid Po move and phase transitions to `'dialogue'`
**When** the dialogue phase renders
**Then** Gyebaek's dialogue text appears referencing the Po (FR15)

**Given** the player reads the dialogue and triggers "계속하기"
**When** the action fires
**Then** `dispatch({ type: 'NEXT_SCENE' })` advances to `state.scene === 'jol'`

---

### Story 2.6: 씬 5 — 졸(卒) 체험 장면

As a player,
I want to be introduced to the Jol piece and experience its constrained movement through the guided scene structure,
So that I feel the soldier's limited but resolute role in the battle.

**Acceptance Criteria:**

**Given** `state.scene === 'jol'` and `state.phase === 'intro'`
**When** the JolExperienceScene renders
**Then** the Jol piece appears with narrative introduction text emphasizing the soldier's determination despite limited movement

**Given** `state.phase === 'demo'`
**When** the demo plays
**Then** the Jol piece executes a pre-scripted forward and lateral move sequence to show its movement constraints

**Given** `state.phase === 'play'`
**When** the player has control
**Then** the Jol piece is selectable and movable using the rules from Story 1.8 — the player must make at least one valid move to advance

**Given** the player makes a valid Jol move and phase transitions to `'dialogue'`
**When** the dialogue phase renders
**Then** Gyebaek's dialogue text appears referencing the Jol (FR15)

**Given** the player reads the dialogue and triggers "계속하기"
**When** the action fires
**Then** `dispatch({ type: 'NEXT_SCENE' })` advances to `state.scene === 'ending'`

---

### Story 2.7: 씬 6 — 결말 내러티브 장면

As a player,
I want to read the ending narration of the Battle of Hwangsanbul with a concluding illustration,
So that I complete the historical narrative and feel the weight of Gyebaek's final stand.

**Acceptance Criteria:**

**Given** `state.scene === 'ending'`
**When** the EndingScene component renders
**Then** a background illustration of the battle conclusion is displayed with ending narrative text

**Given** the ending scene text
**When** a Korean-speaking user reads it
**Then** the narration concludes Gyebaek's story and the Battle of Hwangsanbul with historical accuracy

**Given** the ending illustration asset
**When** its style prompt metadata is inspected
**Then** the sumi-e style prompt and seed value match the documented standard from Story 2.2 (NFR5)

**Given** a player who completes the full game (opening → 4 experience scenes → ending) at a normal reading pace
**When** total elapsed time is measured
**Then** completion time is within 10~15 minutes (NFR6)

**Given** the ending scene is reached
**When** the scene is displayed
**Then** there is no "계속하기" button that would advance further — the experience concludes gracefully

---

## Epic 3: 감각 완성 — 기물마다 감정이 느껴지는 최종 POC

플레이어가 기물별로 다른 애니메이션과 사운드로 감정 차이를 체험하고, 수묵화 비주얼 팔레트가 완성된 최종 POC를 경험할 수 있다.

### Story 3.1: GSAP 기물별 감정 애니메이션 적용

As a player,
I want each janggi piece to move with its own distinct animation timing and easing,
So that I feel the emotional personality of each piece through its movement.

**Acceptance Criteria:**

**Given** the Cha piece moves to a valid destination
**When** the GSAP animation plays
**Then** it uses `duration: 500ms` and `ease: 'ease-in'` as defined in `constants.ts PIECE_ANIMATION.cha`

**Given** the Ma piece moves to a valid destination
**When** the GSAP animation plays
**Then** it uses `duration: 300ms` and `ease: 'ease-out'` as defined in `constants.ts PIECE_ANIMATION.ma`

**Given** the Po piece moves to a valid destination
**When** the GSAP animation plays
**Then** it uses `duration: 150ms` and `ease: 'linear'` as defined in `constants.ts PIECE_ANIMATION.po`

**Given** the Jol piece moves to a valid destination
**When** the GSAP animation plays
**Then** it uses `duration: 400ms` and `ease: 'ease-in'` as defined in `constants.ts PIECE_ANIMATION.jol`

**Given** any piece animation
**When** the implementation is inspected
**Then** it uses `useGSAP({ scope: pieceRef })` with `contextSafe` wrapper — direct `gsap.to()` calls outside this pattern are absent (memory leak prevention)

**Given** any piece animation
**When** the CSS properties being animated are inspected
**Then** only `x` and `y` transform properties are used — `left` and `top` are absent (no layout reflow)

**Given** a piece is moved during animation
**When** browser DevTools Performance panel records the interaction
**Then** the animation maintains 60fps (NFR1) and input-to-animation-start latency is under 16ms (NFR2)

**Given** a piece component is unmounted during an active animation
**When** the GSAP context is cleaned up
**Then** no "Can't perform a React state update on an unmounted component" warnings appear in console

---

### Story 3.2: 기물별 이동 SFX 연결

As a player,
I want to hear a distinct sound effect for each piece when it moves,
So that the audio reinforces the emotional character of each piece's movement.

**Acceptance Criteria:**

**Given** the Cha piece completes a move
**When** the move animation finishes
**Then** `audioManager.play(AUDIO_KEYS.SFX_CHA)` is called — a wood-sliding sound effect plays

**Given** the Ma piece completes a move
**When** the move animation finishes
**Then** `audioManager.play(AUDIO_KEYS.SFX_MA)` is called — a light strike sound effect plays

**Given** the Po piece completes a move
**When** the move animation finishes
**Then** `audioManager.play(AUDIO_KEYS.SFX_PO)` is called — a sharp strike sound effect plays

**Given** the Jol piece completes a move
**When** the move animation finishes
**Then** `audioManager.play(AUDIO_KEYS.SFX_JOL)` is called — a dull strike sound effect plays

**Given** an audio playback error occurs (e.g., browser autoplay policy blocks the sound)
**When** the error is caught
**Then** `.catch(e => console.error('[Audio]', e))` is called — the game continues without interruption, no error is shown to the player

**Given** any SFX call in game code
**When** the implementation is inspected
**Then** no file imports Howler.js directly — all audio goes through `audioManager.play(key)` only

---

### Story 3.3: 국악기 앰비언트 BGM 재생

As a player,
I want to hear Korean traditional instrument ambient music throughout the experience,
So that the audio atmosphere enhances the historical immersion of the game.

**Acceptance Criteria:**

**Given** the game loads and the first scene renders
**When** the audio context is unlocked by the player's first interaction
**Then** ambient BGM featuring gayageum (가야금), haegeum (해금), or daegeum (대금) begins playing in a loop

**Given** the BGM is playing
**When** the player progresses through scenes
**Then** the BGM continues without interruption or restart between scene transitions

**Given** the BGM playback
**When** the implementation is inspected
**Then** `audioManager.play(AUDIO_KEYS.BGM_AMBIENT)` is used — no direct Howler call exists outside `audioManager.ts`

**Given** a BGM load or playback error
**When** the error is caught
**Then** `.catch(e => console.error('[Audio]', e))` is called — the game continues without BGM rather than crashing

**Given** the BGM and SFX playing simultaneously during a piece move
**When** both play together
**Then** SFX is audible over BGM without the BGM being stopped or restarted

---

### Story 3.4: 수묵화 비주얼 완성 및 힌트 UI 정제

As a player,
I want the complete visual experience to feel cohesive in the sumi-e aesthetic with refined move hint styling,
So that the visual atmosphere matches the historical and artistic intent of the game.

**Acceptance Criteria:**

**Given** the entire game UI
**When** a visual design review is conducted
**Then** the color palette consistently uses only: 먹색 (ink black) for text and outlines, 한지색 (hanji off-white/cream) for backgrounds, and a single 단청 (dancheong) accent color for interactive highlights

**Given** a piece is selected and valid move squares are highlighted
**When** the hint styling is inspected
**Then** the highlight opacity and color have been tuned so valid squares are clearly visible but do not overpower the sumi-e aesthetic (FR22)

**Given** the valid move hints
**When** a player with no prior janggi knowledge looks at the board during selection
**Then** the highlighted squares are immediately recognizable as clickable destinations without additional instruction

**Given** all background illustrations (opening, ending) and piece SVGs
**When** they are displayed together
**Then** the visual style is consistent — same ink weight, same wash style, same level of detail across all assets (NFR4)

**Given** the board and pieces at rest (no interaction)
**When** a first-time player sees the screen
**Then** the composition reads as sumi-e art — negative space (여백미) is intentional and prominent

---

### Story 3.5: 이벤트 로깅 구현

As a developer,
I want key player actions and scene transitions to be logged as events,
So that completion rates and dropoff points can be measured after release.

**Acceptance Criteria:**

**Given** the player starts the game (first scene loads)
**When** the opening scene renders
**Then** a `scene_start` event is logged with `{ scene: 'opening', timestamp }` (NFR7)

**Given** the player advances from any scene
**When** `dispatch({ type: 'NEXT_SCENE' })` fires
**Then** a `scene_complete` event is logged with `{ scene: currentScene, timestamp }`

**Given** the player completes a piece move in an experience scene
**When** a valid move is executed
**Then** a `piece_moved` event is logged with `{ scene: currentScene, piece: pieceId, timestamp }`

**Given** the player reaches the ending scene and it renders fully
**When** the EndingScene mounts
**Then** a `game_complete` event is logged with `{ timestamp }` — this enables completion rate calculation

**Given** all event logging calls
**When** the implementation is inspected
**Then** logging uses `if (import.meta.env.DEV) console.log('[Event]', ...)` in development and a pluggable analytics hook in production — no sensitive data is logged

**Given** an event logging failure
**When** the error occurs
**Then** the game continues without interruption — logging is non-blocking fire-and-forget
