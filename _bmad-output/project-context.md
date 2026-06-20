---
project_name: '장기: 황산벌의 기억'
user_name: 'GD'
date: '2026-06-20'
sections_completed: ['technology_stack', 'engine_rules', 'performance', 'structure', 'anti_patterns']
status: 'complete'
rule_count: 18
optimized_for_llm: true
---

# Project Context for AI Agents

_이 파일은 AI 에이전트가 게임 코드 구현 시 반드시 따라야 하는 핵심 규칙과 패턴을 담는다. 에이전트가 놓치기 쉬운 비자명적 세부사항에 집중한다._

---

## Technology Stack & Versions

- **React** 19.2.7 (JSX, hooks — class components 사용 금지)
- **Vite** 8.0.9 (빌드, HMR, SVGR 통합)
- **TypeScript** (strict mode)
- **GSAP** 3.13 + `@gsap/react` (useGSAP hook 필수)
- **Howler.js** + `@types/howler` (오디오)
- **vite-plugin-svgr** (SVG → React 컴포넌트)
- **CSS Modules** (`*.module.css`)
- **배포:** GitHub Pages (`base: '/janggi-hwangsanbul/'` in vite.config.ts)

---

## Critical Implementation Rules

### React + GSAP 통합 (가장 중요)

- **`useGSAP` + `contextSafe` 필수** — 직접 `gsap.to()` 호출 시 언마운트 후 메모리 누수 발생

  ```typescript
  // ✅ 항상 이렇게
  const { contextSafe } = useGSAP({ scope: pieceRef })
  const animate = contextSafe(() => gsap.to(pieceRef.current, { x, y }))

  // ❌ 절대 금지
  gsap.to(pieceRef.current, { x, y })
  ```

- GSAP은 반드시 `x`, `y` CSS transform 속성 사용 — `left`/`top` 금지 (layout reflow 발생)
- 기물 SVG에 `will-change: transform` CSS 적용

### 장기 룰 엔진

- **`getValidMoves(pieceId, pos, board)`만 사용** — 기물별 함수 직접 호출 금지
- **포(砲) 엣지 케이스 3가지 — 반드시 구현:**
  1. 이동 경로에 기물이 정확히 1개 있어야 이동/공격 가능 (0개 또는 2개+ → 불가)
  2. 포로 포를 잡을 수 없음 (넘는 기물과 목적지 기물 모두 포이면 불가)
  3. 포가 넘는 기물은 아군이어도 가능 (넘기만 함, 잡지 않음)
- 룰 엔진 함수는 **순수 함수만** — React/DOM import 금지, 사이드이펙트 없음

### 씬 상태 머신

- **`dispatch`만으로 상태 변경** — `useState` 직접 설정 금지
- 씬 진행 트리거: `dispatch({ type: 'NEXT_SCENE' })`
- 기물 이동 완료 후 대사 트리거: `useEffect`로 `state.phase === 'dialogue'` 감지

  ```typescript
  useEffect(() => {
    if (state.phase === 'dialogue') audioManager.play(`${state.scene}-dialogue`)
  }, [state.phase, state.scene])
  ```

### 오디오

- **`audioManager.play(key)`만 사용** — Howler 직접 import/호출 금지
- 오디오 실패는 게임 중단 없이 `.catch(e => console.error('[Audio]', e))`

### 기물 애니메이션 스펙

`constants.ts`에서만 참조 — 매직 넘버 금지:

```typescript
// constants.ts
cha: { duration: 500, ease: 'ease-in'  }
ma:  { duration: 300, ease: 'ease-out' }
po:  { duration: 150, ease: 'linear'   }
jol: { duration: 400, ease: 'ease-in'  }
```

### 퍼포먼스

- 목표: 60fps, 입력 응답 < 16ms
- 보드 SVG는 정적 — 기물 이동 시 보드 리렌더 없음
- 기물 위치: GSAP이 시각적 위치 관리, React state는 논리적 위치만 추적

### 에러 처리

- 잘못된 기물 이동 → 조용히 무시 (`return` only, 에러 없음) — GDD 명시
- 예외를 절대 플레이어에게 노출하지 않는다
- 개발 로그: `if (import.meta.env.DEV) console.log('[태그]', ...)`

---

## Project Structure (핵심)

```
src/
├── constants.ts           ← GDD 명세 숫자의 유일한 위치
├── state/                 ← GameState, Action 타입, gameReducer
├── pieces/rules/          ← 순수 함수만 (React import 금지)
├── pieces/config/         ← ChapterConfig (gyebaekChapter.ts)
├── audio/audioManager.ts  ← Howler 유일한 진입점
└── scenes/                ← 씬 컴포넌트 (ExperienceCha 등)
```

---

## Anti-patterns (절대 금지)

- `gsap.to()` without `useGSAP` scope — 메모리 누수
- Howler 직접 import — `audioManager`를 통해서만
- `pieces/rules/`에 React/DOM import — 순수 함수 원칙 위반
- `state/` 외부에서 GameState 직접 변경 — `dispatch` 전용
- constants.ts 외 매직 넘버 (500, 300, 150, 400 등)
- 에러/예외를 UI에 표시
- GSAP `left`/`top` 속성 — `x`/`y` transform 사용

---

## Usage Guidelines

**AI 에이전트에게:**

- 게임 코드 구현 전 이 파일을 반드시 읽는다
- 모든 규칙을 문서 그대로 따른다
- 불확실한 경우 더 제한적인 옵션을 선택한다
- 새 패턴이 생기면 이 파일을 업데이트한다

**개발자(GD)에게:**

- 기술 스택 변경 시 버전 업데이트
- 에이전트가 자주 틀리는 패턴 발견 시 추가
- 자명해진 규칙은 제거하여 파일을 린하게 유지

Last Updated: 2026-06-20
