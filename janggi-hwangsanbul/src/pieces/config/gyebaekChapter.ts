import type { ChapterConfig } from '../../types'
import { PIECE_ANIMATION } from '../../constants'
import { AUDIO_KEYS } from '../../audio/audioKeys'
import { getChaValidMoves } from '../rules/cha'
import { getMaValidMoves } from '../rules/ma'
import { getPoValidMoves } from '../rules/po'
import { getJolValidMoves } from '../rules/jol'

export const GYEBAEK_CHAPTER: ChapterConfig = {
  cha: {
    id: 'cha',
    symbol: '車',
    animation: PIECE_ANIMATION.cha,
    sound: AUDIO_KEYS.SFX_CHA,
    moves: getChaValidMoves,
  },
  ma: {
    id: 'ma',
    symbol: '馬',
    animation: PIECE_ANIMATION.ma,
    sound: AUDIO_KEYS.SFX_MA,
    moves: getMaValidMoves,
  },
  po: {
    id: 'po',
    symbol: '砲',
    animation: PIECE_ANIMATION.po,
    sound: AUDIO_KEYS.SFX_PO,
    moves: getPoValidMoves,
  },
  jol: {
    id: 'jol',
    symbol: '卒',
    animation: PIECE_ANIMATION.jol,
    sound: AUDIO_KEYS.SFX_JOL,
    moves: getJolValidMoves,
  },
}
