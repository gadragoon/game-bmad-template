# Deferred Work

## Deferred from: code review of 2-4-씬-3-마-체험-장면 (2026-07-11)

- `getValidMoves('ma', currentPos, board)`가 빈 배열을 반환하면(마가 사방이 막혀 이동 불가) `ExperienceMa.tsx`의 데모가 조용히 스킵되고 `play` 단계로 넘어가지만, play 단계에서도 마가 실제로 이동 불가능하므로 AC3("최소 1회 완료")를 영원히 만족할 수 없는 소프트락 가능성. 마가 4개 기물 중 3개(차/포/졸)에 사방으로 둘러싸여야 하는 매우 좁은 경로. 단순 패치가 아닌 설계 결정(자동 스킵/에러 상태 등) 필요. [janggi-hwangsanbul/src/scenes/ExperienceMa.tsx:24-33]
- `playStartPos.current`가 "미초기화"와 "정상적으로 null을 반환한 위치"를 구분하지 못하는 sentinel 값 모호성 — Story 2.3의 `ExperienceCha.tsx`에서 이미 동일 패턴으로 존재했고 `ExperienceMa.tsx`에 그대로 복사됨. Story 2.5/2.6도 같은 패턴을 재사용할 예정이므로 개별 스토리 패치보다 4개 씬(cha/ma/po/jol)을 한 번에 정리하는 별도 클린업 권장. [janggi-hwangsanbul/src/scenes/ExperienceMa.tsx:35-49, janggi-hwangsanbul/src/scenes/ExperienceCha.tsx 동일 패턴]

## Deferred from: code review of 2-3-씬-2-차-체험-장면 (2026-07-11)

- `findPiecePosition('cha', board)`가 `null`을 반환하면(다른 기물이 정확히 차가 있는 칸으로 이동해 덮어쓰는 경우 — `MOVE_PIECE`의 기존 overwrite 동작, Story 1.2 debt) `ExperienceCha.tsx`의 play→dialogue 전환 감지 effect가 영구적으로 멈춰 씬이 진행 불가능해짐. 이번 스토리의 "PiecesLayer 미게이팅" 결정과 Story 1.2부터 존재하던 overwrite 동작이 결합되어야 트리거되는 좁은 경로. Story 3.4(인터랙션 정제) 또는 룰 엔진 캡처/overwrite 처리 스토리에서 재검토 권장. [janggi-hwangsanbul/src/scenes/ExperienceCha.tsx:36-44]

## Deferred from: code review of 2-2-씬-1-오프닝-내러티브-장면 (2026-07-11)

- `--color-hanji`/`--color-sumi` CSS 커스텀 프로퍼티가 `Board.module.css`의 `:root`에만 정의되어 있고 이번 스토리가 추가한 `Scene.module.css`(`.sceneBackground`, `.narrationText`)에는 폴백값이 없음 — 크로스 모듈 암묵적 의존성. Story 1.3 리뷰에서 이미 `:root` 전역 방출 패턴 자체는 추적 중(향후 `index.css`/`global.css` 이전 고려). 이번 스토리는 그 패턴에 두 번째 소비처를 추가한 것 — Story 3.4 수묵화 비주얼 완성 시 함께 정리 권장.
- `.sceneBackground`의 `aspect-ratio: 16/9` + `max-width: 560px` 조합에 `min-height` 가드가 없음 — 극단적으로 좁은 뷰포트/부모 flex 컨텍스트에서 배경이 과도하게 축소될 이론적 위험. Story 3.4 비주얼 정제 시 재검토.
- `SUMI_E_STYLE`(수묵화 스타일 프롬프트+시드) 재사용 계약이 코드 레벨(타입/테스트)로 강제되지 않고 `narration.ts` 상단 주석에만 명시됨. Story 2.7(Ending 씬 구현) 시 실제로 `SUMI_E_STYLE`을 import하여 사용하는지 확인 필요 — 다른 값으로 재정의되면 감지되지 않음.
- Playwright `afterEach`의 전역 console-error 어서션(`expect(consoleErrors.length).toBe(0)`)이 스토리와 무관한 콘솔 에러(브라우저 확장, HMR 경고 등)에도 반응해 취약함. Story 2.1부터 이어진 기존 테스트 컨벤션이며 이번 스토리에서 새로 도입되지 않음 — 테스트 인프라 정리 시 전역 필터링/allowlist 고려.

## Deferred from: code review of 1-1-프로젝트-초기화-및-개발-환경-설정 (2026-06-21)

- `audioManager.play()` 오류/정지 시 Promise 영원히 pending — Howler `'loaderror'`/`'playerror'` 이벤트 미처리. Story 3.2에서 실제 구현 시 해결 필요.
- `Howl.play()` 반환 사운드 ID 미사용 / `once('end')` 등록 race condition — `play()` 반환 ID를 `once('end', resolve, id)` 에 전달해야 함. Story 3.2 scope.
- 동일 사운드 중복 재생 guard 없음 — BGM 씬 전환 시 `sound.playing()` 체크 필요. Story 3.2 scope.
- `tsconfig.app.json` lib 배열에 `"DOM.Iterable"` 미포함 — `NodeList.forEach` 등 DOM 이터레이션 API 사용 시 타입 에러 발생 가능. 현재 코드 영향 없음.
- `vite.config.ts` base path 하드코딩 — 레포명 변경 또는 다른 환경 배포 시 모든 에셋 경로 오염. 의도된 GitHub Pages 설계 결정.
- `StrictMode` 이중 실행 시 GSAP/Howler 부작용 가능 — GSAP 타임라인, Howler 이벤트 리스너가 이중 등록될 위험. `useGSAP` + `contextSafe` 패턴 준수 시 문제없지만, Story 2.x 구현 시 cleanup 함수 누락 주의.

## Deferred from: code review of 1-3-svg-장기판-렌더링 (2026-06-21)

- `:root` CSS custom properties를 `Board.module.css` 안에 선언 — Vite에서 전역 방출되어 동작하지만 CSS Module 관례 위반. 향후 `index.css` 또는 `global.css`로 이전 고려. Story 3.4 수묵화 완성 시 정리.
- SVG `<title>` 요소 없음 — `role="img" + aria-label` 조합은 현대 브라우저에서 충분하나 구형 스크린리더 폴백 미흡. Story 3.4 접근성 완성 시 `<title>장기판</title>` 추가 고려.
- `positionToCoords` 범위 검증 없음 — `col: 0–8`, `row: 0–9` 범위 외 Position 전달 시 SVG 밖 좌표 반환. Story 1.4에서 `getValidMoves`가 유효 Position 보장 예정이므로 지금은 불필요.

## Deferred from: code review of 1-4-기물-svg-렌더링-및-초기-배치 (2026-06-22)

- MOVE_PIECE piece-not-found fallthrough — 기물 미발견 시 target 셀에 덮어쓰기. `gameReducer.ts:50-61`. state 불변성 가정이 깨질 경우 bug, 현재는 dispatch 전 검증으로 방어됨.
- PiecesLayer SVG 포인터 이벤트 차단 — `pointer-events: none` 미설정으로 Board 클릭 이벤트 차단 가능. `PiecesLayer.module.css`. Story 1.5 클릭 인터랙션 추가 시 처리.
- boardContainer 명시적 height 없음 — absolute child가 브라우저 SVG aspect-ratio 추론에 의존. `App.module.css`. Playwright 검증 완료, 모던 브라우저에서 안전.
- key={pieceId} 중복 가능성 — 동일 PieceId 중복 보드 배치 시 React 키 충돌. `PiecesLayer.tsx:30`. 현재 아키텍처에서 불가, 규칙 구현 후 재검토.
- NEXT_SCENE에서 board 미초기화 — 씬 전환 시 기물 이동 상태 유지됨. `gameReducer.ts:32`. Epic 2 씬 전환 스펙에서 처리.
- VIEWBOX_W/H가 constants.ts에 없음 — PiecesLayer 내 인라인 파생. `PiecesLayer.tsx:9-10`. 공유 상수(BOARD, CELL_SIZE, BOARD_PADDING)에서 계산하므로 저위험.
- config prop 미사용 (Piece.tsx) — Props에 선언만, 본체에서 미사용. `Piece.tsx:17-23`. Story 3.1 useGSAP 통합 시 config.animation 사용 예정, 의도적 설계.

## Deferred from: code review of 1-5-기물-선택-이동-인터랙션-및-차-룰-구현 (2026-06-25)

- board 배열 참조 불변성 계약 — `PiecesLayer.tsx` useMemo deps `[selectedPiece, board]`가 reducer의 불변 배열 생성에 의존. reducer가 in-place 변경 시 stale valid moves 반환. 현재 reducer 규율로 안전.
- MOVE_PIECE 빈 칸 덮어쓰기 — reducer가 대상 칸 선점 여부 미확인. `getChaValidMoves`가 기물 칸 제외로 현재 불가. 다른 기물 룰(마, 포, 졸) 구현 시 해당 기물의 rule engine이 occupied 칸을 반환하지 않는지 확인 필요.
- selectedPiece stale ref — 위 덮어쓰기 발생 시 삭제된 기물 ID를 selectedPiece가 참조, 힌트 미표시. 현재 불가. MOVE_PIECE 덮어쓰기 이슈 해결 시 자동 해소.
- getChaValidMoves 궁성(palace) 대각선 미구현 — 궁성 내 차의 대각선 이동 룰 미처리. 현재 직선 4방향만 지원. 정식 장기 구현 시 palace 좌표 상수 + 대각선 방향 추가 필요.
- Piece handleClick stopPropagation이 부모 키보드 핸들러 차단 — 현재 부모 키보드 핸들러 없으므로 무해. Escape to deselect 등 전역 키보드 단축키 추가 시 Piece에 포커스된 상태에서 차단됨. 해결 시 piece `onKeyDown`에서 특정 키(Escape 등)만 선별 처리.

## Deferred from: code review of 1-6-마-이동-룰-구현 (2026-06-28)

- OOB block 칸 처리: block이 보드 밖일 때 기하학적 불변식으로 올바르게 동작하나, MA_STEPS 오프셋 변경 시 target이 in-bounds로 슬며시 진입할 위험. `ma.ts:16-18`.
- `board[br][bc]` undefined 접근: sparse/malformed board 시 TypeError 가능. `ma.ts:16,23`. cha.ts와 동일한 pre-existing 패턴, POC board 초기화로 현재 안전.
- AC2 테스트: jol 초기 위치(col:4,row:5) 암묵적 가정 — initial board layout 변경 시 테스트 시나리오 불일치. `tests/story-1-6-ma-rule.spec.ts:25-37`.
- AC1 테스트: 힌트 8개 하드코딩 — 초기 board state 명시적 설정 없음. POC scope에서 결정적 초기화로 안전. `tests/story-1-6-ma-rule.spec.ts:17-22`.

## Deferred from: code review of 1-2-핵심-타입-및-상태-머신-구현 (2026-06-21)

- `MOVE_PIECE` `to: Position` payload 무시 — `GameState`에 `board` 필드 없음. `gameReducer.ts:33`. Story 1.4에서 Board를 GameState에 추가할 때 구현 예정.
- `NEXT_SCENE` 시 `completedPieces` 초기화 안 됨 — 씬 재진입("play again") 시 기물이 이미 완료로 표시됨. `gameReducer.ts:18`. "play again" 기능은 현재 스코프 외.
- `COMPLETE_PIECE` 입력 검증 없음 — selectedPiece/씬 무관하게 어떤 PieceId든 완료 마킹 가능. `gameReducer.ts:37`. 게임 로직 레이어(Story 2.x)에서 처리 예정.
- `SCENE_ORDER.indexOf` 반환값 -1 엣지케이스 — 상태 외부 오염(localStorage 등) 시 `'opening'`으로 무음 리셋. `gameReducer.ts:19`. TypeScript strict 하에서 발생 불가, localStorage rehydration은 현재 스코프 외.
