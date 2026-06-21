# Deferred Work

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

## Deferred from: code review of 1-2-핵심-타입-및-상태-머신-구현 (2026-06-21)

- `MOVE_PIECE` `to: Position` payload 무시 — `GameState`에 `board` 필드 없음. `gameReducer.ts:33`. Story 1.4에서 Board를 GameState에 추가할 때 구현 예정.
- `NEXT_SCENE` 시 `completedPieces` 초기화 안 됨 — 씬 재진입("play again") 시 기물이 이미 완료로 표시됨. `gameReducer.ts:18`. "play again" 기능은 현재 스코프 외.
- `COMPLETE_PIECE` 입력 검증 없음 — selectedPiece/씬 무관하게 어떤 PieceId든 완료 마킹 가능. `gameReducer.ts:37`. 게임 로직 레이어(Story 2.x)에서 처리 예정.
- `SCENE_ORDER.indexOf` 반환값 -1 엣지케이스 — 상태 외부 오염(localStorage 등) 시 `'opening'`으로 무음 리셋. `gameReducer.ts:19`. TypeScript strict 하에서 발생 불가, localStorage rehydration은 현재 스코프 외.
