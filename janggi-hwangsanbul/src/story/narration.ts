// 씬별 내레이션 텍스트 및 배경 일러스트 스타일 메타데이터
// SUMI_E_STYLE은 모든 배경 일러스트(오프닝/결말)가 동일 화풍을 유지하도록 공유하는 표준 — Story 2.7(결말 씬)에서 재사용

export const SUMI_E_STYLE = {
  prompt:
    'sumi-e ink wash painting, Korean historical battlefield, minimal negative space, ' +
    'muted ink black and hanji cream palette, single dancheong accent color, Kim Hong-do genre painting style',
  seed: 660660,
} as const

export const OPENING_NARRATION = {
  title: '황산벌, 660년',
  paragraphs: [
    '660년, 나당연합군이 백제를 향해 진격한다.',
    '계백은 5천 결사대와 함께 황산벌에 최후의 방어선을 세운다.',
    '살아 돌아갈 길은 없다. 오직 지켜야 할 것이 있을 뿐이다.',
  ],
} as const
