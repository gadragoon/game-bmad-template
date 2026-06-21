// ⚠️ 이 파일만 Howler.js를 import할 수 있다 — 프로젝트 전체 규칙
// 다른 모든 파일은 audioManager.play(key) 만 사용할 것
import { Howl } from 'howler'
import type { AudioKey } from './audioKeys'

const sounds: Record<string, Howl> = {}

export const audioManager = {
  // Story 3.2에서 실제 사운드 로드/재생 구현
  play(key: AudioKey): Promise<void> {
    const sound = sounds[key]
    if (!sound) return Promise.resolve()
    return new Promise((resolve) => {
      sound.once('end', () => resolve())
      sound.play()
    })
  },
}
