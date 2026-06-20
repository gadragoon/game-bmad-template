---
title: 'Game Architecture'
project: '장기: 황산벌의 기억'
date: '2026-06-20'
author: 'GD'
version: '1.0'
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9]
status: 'complete'
engine: 'React + Vite + GSAP'
platform: 'Web'

# Source Documents
gdd: '_bmad-output/planning-artifacts/gdds/gdd-game-bmad-template-2026-06-20/gdd.md'
epics: '_bmad-output/planning-artifacts/gdds/gdd-game-bmad-template-2026-06-20/epics.md'
brief: '_bmad-output/planning-artifacts/briefs/brief-game-bmad-template-2026-06-14/brief.md'
---

# Game Architecture

## Executive Summary

**장기: 황산벌의 기억** 아키텍처는 React v19.2.7 + Vite v8.0.9 + GSAP v3.13 스택으로 Web 브라우저를 대상으로 설계되었다.

**핵심 아키텍처 결정:**
- **TypeScript + useReducer** — 타입 안전한 씬 상태 머신으로 6장면 선형 흐름 관리
- **데이터 중심 기물 config** — ChapterConfig 패턴으로 v1.0 관창 챕터 감정 스펙을 config 교체만으로 확장
- **SVGR + GSAP(useGSAP)** — SVG 에셋 분리와 메모리 누수 없는 애니메이션 통합
- **Howler.js** — SFX 4종 + BGM 동시 재생, 모바일 Safari 호환

**프로젝트 구조:** 기능 단위(Feature-based) 조직, 9개 핵심 시스템.

**구현 패턴:** 7개 패턴(표준 5 + 신규 2) 정의 — AI 에이전트 일관성 보장.

**구현 준비 상태:** 에픽 구현 단계 진입 가능.

---

## Document Status

**Steps Completed:** 9 of 9 (Complete) ✅

---

## 프로젝트 컨텍스트

### 게임 개요

**장기: 황산벌의 기억** — 황산벌 전투(660년)의 영웅 계백의 시선으로 장기를 처음 만나는 문화적 몰입 경험. 비주얼 노벨 + 턴제 전술 하이브리드 튜토리얼 POC.

### 기술 범위

- **플랫폼:** Web (Chrome / Safari / Firefox 최신)
- **장르:** Turn-Based Tactics / Visual Novel Hybrid (튜토리얼 전용 POC)
- **프로젝트 레벨:** 솔로 개발, 2주 POC

### 핵심 시스템

| 시스템 | 복잡도 | GDD 참조 |
|--------|--------|---------|
| SVG 보드/그리드 렌더링 | 낮음 | Technical Specs — SVG 9×10 |
| 장기 룰 엔진 (4기물) | 중간 | Game Mechanics — 포의 점프 규칙 |
| 클릭/탭 입력 시스템 | 낮음 | Controls and Input |
| 이동 힌트 표시 시스템 | 낮음 | Grid System — 이동 가능 칸 흐리게 표시 |
| 애니메이션 시스템 | 중간 | Game Mechanics — 4기물 각각 다른 ms/이징 |
| 씬/내러티브 상태 머신 | 중간 | Level Design — 6장면 선형 진행 |
| 계백 대사 트리거 시스템 | 낮음 | Core Gameplay Loop — 이동 완료 시 대사 재생 |
| 오디오 시스템 (SFX+BGM) | 낮음 | Audio and Music — 4종 SFX + 국악 앰비언트 |
| 에셋 관리 (SVG+이미지) | 낮음 | Asset Requirements |

### 기술 요구사항 요약

- **렌더링:** SVG
- **애니메이션:** CSS transitions / GSAP
- **퍼포먼스:** 60fps 유지, 입력 응답 < 16ms
- **씬 구조:** 선형 상태 머신 (6장면 — 내러티브 2 + 체험 4)
- **룰 엔진:** 장기 이동 규칙 4기물 (차/마/포/졸)
- **오디오:** 이벤트 기반 SFX 트리거 + 앰비언트 BGM
- **멀티플레이:** 없음 (POC 범위 외)

### 복잡도 드라이버

**중간 복잡도 항목:**
- **포(砲) 이동 규칙:** 기물 1개를 반드시 넘어야 이동/공격, 포끼리 불가 — 룰 엔진 중 가장 까다로운 케이스
- **감정 기반 애니메이션 시스템:** 같은 기물이 챕터(시선)에 따라 다른 감정으로 재정의 — v1.0 확장 고려한 데이터 구조 필요
- **씬 상태 머신:** 내러티브 ↔ 체험 전환, 기물 이동 완료 시 자동 씬 진행 트리거

**신규 패턴 (표준 없음):**
- 스토리 기반 튜토리얼 플로우 — 규칙 설명이 아닌 드라마로 경험 설계
- 시선(perspective) 기반 기물 감정 스펙 확장 구조

### 기술 리스크

| 리스크 | 영향 | 대응 |
|--------|------|------|
| SVG 애니메이션 60fps 유지 (특히 모바일 Safari) | 중간 | POC 착수 전 기술 스파이크 권장 |
| AI 생성 이미지 화풍 일관성 | 낮음 | 스타일 프롬프트 표준화 + 시드 고정 |
| 국악기 사운드 에셋 라이선스 | 낮음 | 저작권 무료 소스 사전 확보 |
| 포 이동 규칙 엣지 케이스 | 중간 | 모든 경우의 수 수동 테스트 (성공 기준) |

---

## 엔진 & 프레임워크

### 선택 스택

**React v19.2.7 + Vite v8.0.9 + GSAP v3.13**

**선택 이유:** GDD 명세(SVG 렌더링, GSAP 애니메이션)를 그대로 채택하며 스펙에 맞는 빠른 개발을 위해 선택.

### 프로젝트 초기화

```bash
npm create vite@latest janggi-hwangsanbul -- --template react
cd janggi-hwangsanbul
npm install
npm install gsap
```

### 프레임워크 제공 아키텍처

| 항목 | 솔루션 | 제공처 |
|------|--------|--------|
| 빌드 시스템 | Vite 8 (번들링, HMR, 에셋 처리) | Vite |
| 컴포넌트 시스템 | React 19 JSX | React |
| 상태 관리 기반 | useState / useReducer | React |
| SVG 에셋 핸들링 | Vite SVG import | Vite |
| 오디오 에셋 로딩 | Vite 정적 에셋 import | Vite |
| 애니메이션 트위닝 | GSAP 3.13 (useGSAP hook) | GSAP |
| 이징 함수 | GSAP Ease (ease-in/ease-out/linear) | GSAP |
| 개발 서버 | Vite Dev Server | Vite |

### 남은 아키텍처 결정 사항

다음 항목들은 4단계에서 명시적으로 결정합니다:
- TypeScript vs JavaScript
- 씬 상태 머신 패턴 (useState vs useReducer)
- SVG 구현 방식 (인라인 JSX vs 파일 import)
- 오디오 라이브러리 선택
- CSS 방식
- 기물 데이터 구조 및 룰 엔진 설계
- 컴포넌트/폴더 구조
- 배포 방식

### 개발 환경 MCP 설정

**Context7** — React/GSAP/Vite 최신 API 문서 실시간 조회

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

AI가 학습 데이터 기반의 오래된 API 대신 React 19, GSAP 3.13, Vite 8 현재 버전 문서를 직접 참조합니다.

---

## 아키텍처 결정

### 결정 요약

| 카테고리 | 결정 | 이유 |
|---------|------|------|
| 언어 | TypeScript | 기물 타입/룰 엔진 타입 안전 → AI 에이전트 구현 오류 감소 |
| 씬 상태 관리 | useReducer | 체험 장면 내 서브 상태(미이동/이동완료)가 있어 명시적 전환 필요 |
| 기물 데이터 구조 | 데이터 중심 (config + 순수 함수) | v1.0 관창 챕터 감정 스펙 교체 시 config만 변경 |
| SVG 구현 | SVG 파일 → SVGR React 컴포넌트 | 에셋 파일 분리 + GSAP ref 연결 가능 |
| 오디오 | Howler.js | SFX 4종 + BGM 동시 재생, 모바일 Safari 이슈 내부 처리 |
| 폴더 구조 | 기능 단위 (Feature-based) | 씬/보드/기물/스토리가 에픽(E1/E2/E3)과 자연스럽게 매핑 |
| CSS | CSS Modules | 컴포넌트 스코프 격리, React와 자연스러운 조합 |
| 배포 | GitHub Pages | 무료, Vite 연동 간단, POC 공유 용이 |

### 상태 관리 — useReducer 씬 상태 머신

씬 진행과 체험 장면 내부 상태를 명시적으로 관리:

```typescript
type Scene = 'opening' | 'cha' | 'ma' | 'po' | 'jol' | 'ending'
type ExperiencePhase = 'intro' | 'demo' | 'play' | 'dialogue'

type GameState = {
  scene: Scene
  phase: ExperiencePhase | null  // 내러티브 장면은 null
  selectedPiece: PieceId | null
  completedPieces: Set<PieceId>
}

type Action =
  | { type: 'NEXT_SCENE' }
  | { type: 'SET_PHASE'; phase: ExperiencePhase }
  | { type: 'SELECT_PIECE'; id: PieceId }
  | { type: 'MOVE_PIECE'; to: Position }
  | { type: 'COMPLETE_PIECE'; id: PieceId }
```

### 기물 데이터 구조 — 데이터 중심

챕터(시선)별 감정 스펙을 교체 가능한 config 구조:

```typescript
type PieceConfig = {
  id: PieceId                          // '차' | '마' | '포' | '졸'
  symbol: string
  animation: {
    duration: number                   // ms
    ease: 'ease-in' | 'ease-out' | 'linear'
    sound: string                      // Howler key
  }
  moves: (pos: Position, board: Board) => Position[]  // 순수 함수
}

// 챕터별 감정 스펙 — 기물 타입이 아닌 시선이 결정
const GYEBAEK_CHAPTER: Record<PieceId, PieceConfig> = { ... }
const GWANCHANG_CHAPTER: Record<PieceId, PieceConfig> = { ... }  // v1.0
```

### 폴더 구조

```
src/
├── scenes/       # 씬 컴포넌트 (Opening, Cha, Ma, Po, Jol, Ending)
├── board/        # SVG 보드, 그리드 유틸리티
├── pieces/       # 기물 SVG 컴포넌트, 기물 config, 룰 엔진
├── story/        # 내레이션 텍스트, 대사 데이터
├── audio/        # Howler.js 초기화, 오디오 매니저
├── state/        # useReducer + 타입 정의
└── assets/       # SVG 파일, 이미지, 사운드
```

### 에셋 파이프라인

- **SVG:** `vite-plugin-svgr` → SVG 파일을 React 컴포넌트로 import
- **이미지:** Vite 정적 에셋 import (배경 일러스트)
- **오디오:** `/public/audio/` 폴더 → Howler.js가 URL로 로드

### 배포

- **플랫폼:** GitHub Pages
- **빌드:** `npm run build` → `vite build` → `dist/`
- **배포:** `gh-pages` 패키지 또는 GitHub Actions
- **base path:** `vite.config.ts`에 `base: '/repo-name/'` 설정 필요

---

## 횡단 관심사 (Cross-cutting Concerns)

모든 시스템에 적용되는 필수 패턴. AI 에이전트는 이 규칙을 반드시 따른다.

### 에러 처리

**전략:** 방어적 조기 반환 — 플레이어에게 에러 노출 없음, 개발 중 `console.error`로 기록.

```typescript
// 잘못된 이동: 조용히 무시 (GDD 명시)
const validMoves = getValidMoves(piece, board)
if (!validMoves.includes(targetPos)) return

// 오디오 실패: 게임 중단 없이 로깅만
audioManager.play('cha').catch(e => console.error('[Audio]', e))
```

**규칙:**
- 기물 이동 불가: 에러 없이 조용히 무시 (GDD 명시)
- 에셋 로드 실패: console.error 후 게임 계속 진행
- 예외를 절대 플레이어에게 노출하지 않는다

### 로깅

**형식:** `[태그] 메시지` — 개발 환경에서만 활성화

```typescript
const log = (tag: string, ...args: unknown[]) => {
  if (import.meta.env.DEV) console.log(`[${tag}]`, ...args)
}

// 사용 예
log('Scene', 'NEXT_SCENE → cha')
log('Piece', 'cha moved to (3, 4)')
log('Audio', 'playing cha-sfx')
```

**규칙:** `import.meta.env.DEV` 가드 필수. 프로덕션 빌드에서 자동 비활성화.

### 설정 관리

**단일 `src/constants.ts`** — GDD 명세값을 코드 곳곳에 하드코딩 금지.

```typescript
export const PIECE_ANIMATION = {
  cha:  { duration: 500, ease: 'ease-in'  as const },
  ma:   { duration: 300, ease: 'ease-out' as const },
  po:   { duration: 150, ease: 'linear'   as const },
  jol:  { duration: 400, ease: 'ease-in'  as const },
} satisfies Record<PieceId, AnimationSpec>

export const BOARD = { cols: 9, rows: 10 } as const
```

### 이벤트 시스템

**별도 이벤트 버스 없음** — `dispatch`가 이벤트 시스템 역할을 한다.

```typescript
dispatch({ type: 'MOVE_PIECE', to: targetPos })
dispatch({ type: 'COMPLETE_PIECE', id: 'cha' })
dispatch({ type: 'NEXT_SCENE' })
```

시스템 간 상태 변화 감지는 `useEffect` 사용:

```typescript
useEffect(() => {
  if (state.phase === 'dialogue') audioManager.play(`${state.scene}-dialogue`)
}, [state.phase, state.scene])
```

### 디버그 도구

- `?debug=true` URL 파라미터로 씬 점프 활성화 (개발 전용)
- 개발 환경에서 보드 격자 좌표 오버레이 표시
- 별도 외부 도구 없음 — 브라우저 DevTools + console 로그로 충분

---

## 프로젝트 구조

### 조직 패턴

**기능 단위 (Feature-based)** — 씬/보드/기물/스토리/오디오가 에픽(E1/E2/E3)과 자연스럽게 매핑됨.

### 완전한 디렉토리 구조

```
janggi-hwangsanbul/
├── public/
│   └── audio/
│       ├── bgm-ambient.mp3
│       ├── sfx-cha.mp3
│       ├── sfx-ma.mp3
│       ├── sfx-po.mp3
│       └── sfx-jol.mp3
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── constants.ts
│   ├── types.ts
│   ├── state/
│   │   ├── gameReducer.ts
│   │   ├── gameTypes.ts
│   │   └── GameContext.tsx
│   ├── scenes/
│   │   ├── Opening.tsx
│   │   ├── ExperienceCha.tsx
│   │   ├── ExperienceMa.tsx
│   │   ├── ExperiencePo.tsx
│   │   ├── ExperienceJol.tsx
│   │   └── Ending.tsx
│   ├── board/
│   │   ├── Board.tsx
│   │   ├── Board.module.css
│   │   ├── HintOverlay.tsx
│   │   └── gridUtils.ts
│   ├── pieces/
│   │   ├── config/
│   │   │   ├── gyebaekChapter.ts
│   │   │   └── pieceTypes.ts
│   │   ├── rules/
│   │   │   ├── cha.ts
│   │   │   ├── ma.ts
│   │   │   ├── po.ts
│   │   │   ├── jol.ts
│   │   │   └── ruleEngine.ts
│   │   ├── Piece.tsx
│   │   └── Piece.module.css
│   ├── story/
│   │   ├── narration.ts
│   │   ├── dialogue.ts
│   │   └── Dialogue.tsx
│   ├── audio/
│   │   ├── audioManager.ts
│   │   └── audioKeys.ts
│   └── assets/
│       ├── svg/
│       │   ├── board.svg
│       │   ├── piece-cha.svg
│       │   ├── piece-ma.svg
│       │   ├── piece-po.svg
│       │   └── piece-jol.svg
│       └── images/
│           ├── opening-bg.webp
│           └── ending-bg.webp
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### 시스템 위치 매핑

| 시스템 | 위치 | 책임 |
|--------|------|------|
| 씬 상태 머신 | `src/state/` | GameState, Action 타입, 리듀서 |
| 씬 렌더링 | `src/scenes/` | 각 씬 컴포넌트 |
| SVG 보드 | `src/board/` | 9×10 격자, 이동 힌트 오버레이 |
| 기물 룰 엔진 | `src/pieces/rules/` | getValidMoves() 순수 함수 |
| 기물 감정 스펙 | `src/pieces/config/` | 챕터별 애니메이션/사운드 config |
| 기물 렌더링 | `src/pieces/Piece.tsx` | SVG 컴포넌트 + GSAP 애니메이션 |
| 스토리 텍스트 | `src/story/` | 내레이션, 계백 대사 데이터 |
| 오디오 | `src/audio/` | Howler.js 래퍼, 키 상수 |
| GDD 명세 상수 | `src/constants.ts` | 애니메이션 ms/이징, 보드 크기 |

### 네이밍 컨벤션

| 요소 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `ExperienceCha.tsx` |
| 비컴포넌트 파일 | camelCase | `ruleEngine.ts` |
| CSS Modules | `*.module.css` | `Board.module.css` |
| SVG/오디오 에셋 | kebab-case | `piece-cha.svg`, `sfx-cha.mp3` |
| 타입/인터페이스 | PascalCase | `PieceConfig`, `GameState` |
| 상수 | UPPER_SNAKE | `PIECE_ANIMATION`, `BOARD` |
| 함수 | camelCase | `getValidMoves()`, `playSound()` |
| dispatch Action type | UPPER_SNAKE | `NEXT_SCENE`, `MOVE_PIECE` |

### 아키텍처 경계

1. `pieces/rules/` — 순수 함수만. React import 금지, 사이드이펙트 없음.
2. `state/` → `scenes/`, `board/`, `pieces/` 단방향 의존. 역방향 import 금지.
3. `constants.ts` — GDD 명세 숫자값은 반드시 여기서만 정의. 매직 넘버 금지.
4. `audio/audioManager.ts` — Howler.js 직접 호출은 이 파일 외부 금지.

---

## 구현 패턴

모든 AI 에이전트가 일관된 코드를 작성하도록 강제하는 패턴.

### 신규 패턴 1: 감정 기반 기물 애니메이션 (ChapterConfig)

**목적:** 같은 기물이 챕터(시선)에 따라 다른 감정 스펙으로 동작. v1.0 확장 시 코드 변경 최소화.

**구성 요소:** `ChapterConfig` 타입, `gyebaekChapter.ts`, 기물 컴포넌트 (config 소비만)

**데이터 흐름:** `App.tsx`가 챕터 config 주입 → 씬 컴포넌트 → 기물 컴포넌트 (config 소비)

```typescript
// pieces/config/gyebaekChapter.ts
export const GYEBAEK_CHAPTER: ChapterConfig = {
  cha: {
    id: 'cha',
    symbol: '車',
    animation: PIECE_ANIMATION.cha,   // constants.ts에서 참조
    sound: AUDIO_KEYS.SFX_CHA,
    moves: getChaValidMoves,           // 순수 함수 참조
  },
  // ma, po, jol 동일 구조
}

// v1.0: config만 교체, 룰 함수 재사용
export const GWANCHANG_CHAPTER: ChapterConfig = {
  cha: { ...GYEBAEK_CHAPTER.cha, animation: { duration: 500, ease: 'ease-out' } },
}
```

**사용 시점:** 기물 생성 및 애니메이션 스펙 조회 시 항상 ChapterConfig를 통한다.

### 신규 패턴 2: GSAP + React SVG 애니메이션

**목적:** useGSAP hook으로 GSAP 타임라인과 React 라이프사이클을 올바르게 연결. 메모리 누수 방지.

```typescript
// pieces/Piece.tsx
import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'

function Piece({ config, position, onMoveComplete }: PieceProps) {
  const pieceRef = useRef<SVGGElement>(null)
  const { contextSafe } = useGSAP({ scope: pieceRef })

  const animateMove = contextSafe((targetPos: Position) => {
    const { x, y } = positionToCoords(targetPos)
    gsap.to(pieceRef.current, {
      x, y,
      duration: config.animation.duration / 1000,
      ease: config.animation.ease,
      onComplete: onMoveComplete,
    })
  })

  return <g ref={pieceRef}>...</g>
}
```

**규칙:** GSAP 애니메이션은 반드시 `useGSAP` + `contextSafe`로 감싼다. 직접 `gsap.to()` 호출 금지.

### 표준 패턴

**룰 엔진 단일 진입점:**

```typescript
// pieces/rules/ruleEngine.ts
export function getValidMoves(pieceId: PieceId, pos: Position, board: Board): Position[] {
  const rules = { cha: getChaValidMoves, ma: getMaValidMoves, po: getPoValidMoves, jol: getJolValidMoves }
  return rules[pieceId](pos, board)
}
```

**기물 생성:** `GYEBAEK_CHAPTER[pieceId]` config 객체 직접 조회

**데이터 접근:** 모듈 직접 import — `import { PIECE_ANIMATION } from '../constants'`

### 일관성 규칙

| 패턴 | 규칙 | 강제 방법 |
|------|------|-----------|
| GSAP 애니메이션 | useGSAP + contextSafe 필수 | 코드 리뷰 |
| 기물 룰 조회 | getValidMoves()만 사용 | ruleEngine.ts 단일 진입점 |
| 상수 참조 | constants.ts import 필수 | 매직 넘버 금지 |
| 오디오 재생 | audioManager.play()만 사용 | Howler 직접 호출 금지 |
| 상태 변경 | dispatch만 사용 | 직접 setState 금지 |

### 입력 처리 패턴

클릭과 탭은 동일하게 처리 (GDD 명시 — 별도 처리 없음):

```typescript
// 기물 클릭 → 선택
<PieceSvg onClick={() => dispatch({ type: 'SELECT_PIECE', id: pieceId })} />

// 이동 가능 칸 클릭 → 이동
<HintCell onClick={() => dispatch({ type: 'MOVE_PIECE', to: pos })} />

// 빈 칸 / 동일 기물 재클릭 → 선택 취소
<BoardCell onClick={() => dispatch({ type: 'DESELECT_PIECE' })} />
```

### 퍼포먼스 패턴 (60fps 보장)

SVG + GSAP 조합에서 60fps 유지 규칙:

```typescript
// ✅ GSAP CSS transform 사용 (GPU 가속)
gsap.to(pieceRef.current, { x: targetX, y: targetY, duration: 0.5 })

// ❌ 금지 — layout reflow 발생
gsap.to(pieceRef.current, { left: targetX, top: targetY })
```

- 보드 SVG는 정적 (`board/Board.tsx`) — 기물 이동마다 리렌더 없음
- 기물 SVG에 `will-change: transform` CSS 적용
- GSAP이 기물 위치 관리 → React state는 논리 위치만 추적

---

## 아키텍처 검증

### 검증 요약

| 체크 | 결과 | 비고 |
|------|------|------|
| 결정 호환성 | ✅ PASS | React 19 + GSAP + useGSAP 정식 조합 |
| GDD 커버리지 | ✅ PASS | 9개 시스템 전체 커버, 갭 2개 보완 |
| 패턴 완성도 | ✅ PASS | 6개 시나리오 모두 패턴 정의됨 |
| 에픽 매핑 | ✅ PASS | E1/E2/E3 전체 아키텍처 위치 매핑 |
| 문서 완성도 | ✅ PASS | 플레이스홀더 없음, 버전 명시됨 |

### 커버리지 리포트

- **커버된 시스템:** 9/9
- **정의된 패턴:** 7개 (표준 5 + 신규 2)
- **확정된 결정:** 8개
- **보완된 갭:** 2개 (입력 처리, 퍼포먼스)

### 검증일

2026-06-20

---

## 개발 환경

### 사전 요구사항

- Node.js 20 LTS 이상
- npm 10 이상
- 브라우저: Chrome / Safari / Firefox 최신

### AI 개발 도구 (MCP)

| MCP 서버 | 용도 | 설치 방식 |
|---------|------|---------|
| Context7 (upstash/context7) | React 19 / GSAP 3.13 / Vite 8 최신 API 문서 실시간 조회 | npx |

```bash
claude mcp add context7 -- npx -y @upstash/context7-mcp
```

### 프로젝트 초기화 명령어

```bash
# 1. 프로젝트 생성
npm create vite@latest janggi-hwangsanbul -- --template react-ts
cd janggi-hwangsanbul

# 2. 의존성 설치
npm install
npm install gsap @gsap/react
npm install howler
npm install -D vite-plugin-svgr
npm install -D @types/howler

# 3. GitHub Pages 배포 도구
npm install -D gh-pages

# 4. 개발 서버 시작
npm run dev
```

### vite.config.ts 필수 설정

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
  base: '/janggi-hwangsanbul/',  // GitHub Pages base path
})
```

### 첫 번째 실행 순서

1. 위 초기화 명령어 실행
2. `src/` 하위에 `board/`, `pieces/`, `scenes/`, `story/`, `audio/`, `state/`, `assets/` 폴더 생성
3. Context7 MCP 설정
4. `src/constants.ts` 생성 — GDD 명세 애니메이션 스펙 입력
5. E1 (기반 구현) 스토리부터 구현 시작
