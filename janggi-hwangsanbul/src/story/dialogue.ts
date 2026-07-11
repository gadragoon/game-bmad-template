// 계백 시선(절실함/처절함)의 기물별 등장 서사 + 이동 완료 대사
// Story 2.4~2.6에서 동일 파일에 MA_INTRO/MA_DIALOGUE 등을 추가하는 구조로 확장 예정

export const CHA_INTRO = {
  title: '차(車) — 지휘하는 의지',
  paragraphs: [
    '황산벌, 계백은 진영의 맨 앞에 차를 세운다.',
    '가로세로 거침없이 뻗는 그 길은, 흔들리지 않는 지휘의 의지를 닮았다.',
  ],
} as const

export const CHA_DIALOGUE =
  '차(車)가 곧게 나아가듯, 우리도 물러서지 않는다.' as const

export const MA_INTRO = {
  title: '마(馬) — 전령',
  paragraphs: [
    '황산벌 곳곳으로, 계백은 전령을 띄운다.',
    '한 걸음 내딛고 몸을 트는 그 날렵함은, 다급한 전갈을 실어 나르는 발걸음을 닮았다.',
  ],
} as const

export const MA_DIALOGUE =
  '마(馬)가 몸을 틀어 전장을 내달리니, 전갈은 반드시 닿아야 한다.' as const

export const PO_INTRO = {
  title: '포(砲) — 매복한 저격수',
  paragraphs: [
    '황산벌 능선 너머, 계백은 포를 매복시킨다.',
    '반드시 하나를 넘어야만 나아갈 수 있고, 넘을 것이 없으면 포는 움직이지도 쏘지도 못한다 — 숨죽여 때를 기다리는 저격수의 규율이다.',
  ],
} as const

export const PO_DIALOGUE =
  '포(砲)가 하나를 넘어 명중하듯, 전장의 승부는 순간에 갈린다.' as const
