import { useEffect, useRef } from 'react'
import Board from '../board/Board'
import PiecesLayer from '../board/PiecesLayer'
import { useGameState, useGameDispatch } from '../state/GameContext'
import { findPiecePosition } from '../board/gridUtils'
import { getValidMoves } from '../pieces/rules/ruleEngine'
import { PO_INTRO, PO_DIALOGUE } from '../story/dialogue'
import DialogueBox from '../story/DialogueBox'
import type { Position } from '../types'
import styles from './Scene.module.css'

const DEMO_DELAY_MS = 1000

export default function ExperiencePo() {
  const { phase, board } = useGameState()
  const dispatch = useGameDispatch()
  const playStartPos = useRef<Position | null>(null)

  // demo 진입 시점에 목표를 한 번만 계산해 고정 — board를 의존성에 넣지 않아 대기 중
  // 다른 기물 조작으로 board가 바뀌어도 effect가 재실행되지 않는다. fire-time에 다시
  // 계산하면(Story 2.4에서 발견된 결함) 대기 중 플레이어가 포를 직접 옮겼을 때 두 번째
  // 자동 이동이 겹쳐 실행되므로, 데모 시작 시점 값으로 고정한다.
  useEffect(() => {
    if (phase !== 'demo') return
    const currentPos = findPiecePosition('po', board)
    const demoTarget = currentPos ? getValidMoves('po', currentPos, board)[0] : undefined
    const timer = setTimeout(() => {
      if (currentPos && demoTarget) {
        dispatch({ type: 'SELECT_PIECE', id: 'po' })
        dispatch({ type: 'MOVE_PIECE', to: demoTarget })
      }
      dispatch({ type: 'SET_PHASE', phase: 'play' })
    }, DEMO_DELAY_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- board는 demo 진입 시점 값만 필요, 재실행 시 타이머가 리셋되는 문제 방지
  }, [phase, dispatch])

  // play: 포 위치가 play 진입 시점과 달라지면 유효한 이동 완료로 판단하고 dialogue로 전환
  useEffect(() => {
    if (phase !== 'play') {
      playStartPos.current = null
      return
    }
    const pos = findPiecePosition('po', board)
    if (!playStartPos.current) {
      playStartPos.current = pos
      return
    }
    if (pos && (pos.row !== playStartPos.current.row || pos.col !== playStartPos.current.col)) {
      dispatch({ type: 'COMPLETE_PIECE', id: 'po' })
      dispatch({ type: 'SET_PHASE', phase: 'dialogue' })
    }
  }, [phase, board, dispatch])

  // Epic 3 오디오 훅 포인트 — audioKeys.ts에 대사 전용 키 추가 후 실제 재생 연결 예정
  useEffect(() => {
    if (phase === 'dialogue') {
      // Story 3.2: audioManager.play(AUDIO_KEYS.DIALOGUE_PO) 예정
    }
  }, [phase])

  return (
    <div data-scene="po" data-phase={phase ?? undefined} className={styles.scene}>
      <div className={styles.boardContainer}>
        <Board />
        <PiecesLayer />
      </div>
      {phase === 'intro' && (
        <div>
          <h2>{PO_INTRO.title}</h2>
          {PO_INTRO.paragraphs.map((paragraph, index) => (
            <p key={index} className={styles.narrationText}>{paragraph}</p>
          ))}
          <button onClick={() => dispatch({ type: 'SET_PHASE', phase: 'demo' })}>계속하기</button>
        </div>
      )}
      {phase === 'dialogue' && (
        <DialogueBox text={PO_DIALOGUE} onContinue={() => dispatch({ type: 'NEXT_SCENE' })} />
      )}
    </div>
  )
}
