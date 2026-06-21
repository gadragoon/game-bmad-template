// Story 3.2에서 실제 오디오 파일 경로 및 로드 로직 추가
export const AUDIO_KEYS = {
  BGM_AMBIENT: 'bgm-ambient',
  SFX_CHA: 'sfx-cha',
  SFX_MA: 'sfx-ma',
  SFX_PO: 'sfx-po',
  SFX_JOL: 'sfx-jol',
} as const

export type AudioKey = (typeof AUDIO_KEYS)[keyof typeof AUDIO_KEYS]
