import { useEffect, useRef } from 'react'
import Board from '../board/Board'
import PiecesLayer from '../board/PiecesLayer'
import { useGameState, useGameDispatch } from '../state/GameContext'
import { findPiecePosition } from '../board/gridUtils'
import { CHA_INTRO, CHA_DIALOGUE } from '../story/dialogue'
import Dialogue from '../story/DialogueBox'
import type { Position } from '../types'
import styles from './Scene.module.css'

const DEMO_DELAY_MS = 1200
const DEMO_TARGET_CHA: Position = { row: 2, col: 0 }

export default function ExperienceCha() {
  const { phase, board } = useGameState()
  const dispatch = useGameDispatch()
  const playStartPos = useRef<Position | null>(null)

  // demo: 스크립트된 이동으로 차의 직선 이동 규칙을 시연 (플레이어 입력 없음)
  useEffect(() => {
    if (phase !== 'demo') return
    dispatch({ type: 'SELECT_PIECE', id: 'cha' })
    const timer = setTimeout(() => {
      dispatch({ type: 'MOVE_PIECE', to: DEMO_TARGET_CHA })
      dispatch({ type: 'SET_PHASE', phase: 'play' })
    }, DEMO_DELAY_MS)
    return () => clearTimeout(timer)
  }, [phase, dispatch])

  // play: 차 위치가 play 진입 시점과 달라지면 유효한 이동 완료로 판단하고 dialogue로 전환
  useEffect(() => {
    if (phase !== 'play') {
      playStartPos.current = null
      return
    }
    const pos = findPiecePosition('cha', board)
    if (!playStartPos.current) {
      playStartPos.current = pos
      return
    }
    if (pos && (pos.row !== playStartPos.current.row || pos.col !== playStartPos.current.col)) {
      dispatch({ type: 'COMPLETE_PIECE', id: 'cha' })
      dispatch({ type: 'SET_PHASE', phase: 'dialogue' })
    }
  }, [phase, board, dispatch])

  // Epic 3 오디오 훅 포인트 — audioKeys.ts에 대사 전용 키 추가 후 실제 재생 연결 예정
  useEffect(() => {
    if (phase === 'dialogue') {
      // Story 3.2: audioManager.play(AUDIO_KEYS.DIALOGUE_CHA) 예정
    }
  }, [phase])

  return (
    <div data-scene="cha" data-phase={phase ?? undefined} className={styles.scene}>
      <div className={styles.boardContainer}>
        <Board />
        <PiecesLayer />
      </div>
      {phase === 'intro' && (
        <div>
          <h2>{CHA_INTRO.title}</h2>
          {CHA_INTRO.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.narrationText}>{paragraph}</p>
          ))}
          <button onClick={() => dispatch({ type: 'SET_PHASE', phase: 'demo' })}>계속하기</button>
        </div>
      )}
      {phase === 'dialogue' && (
        <Dialogue text={CHA_DIALOGUE} onContinue={() => dispatch({ type: 'NEXT_SCENE' })} />
      )}
    </div>
  )
}
