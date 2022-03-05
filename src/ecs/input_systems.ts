import { addComponent, System } from 'bitecs'
import { ECS } from './'
import { PlayerEntity } from '../'
import { MoveAction } from './components'
import { Down, Left, Right, Up } from '../grid'

let sleep = false // Ignore input if true

export const wakeInput = () => (sleep = false)

export const inputSystem: System = (world) => {
  let action = null
  let wait = false
  switch (currentKey) {
    case 'KeyW':
    case 'KeyK':
    case 'ArrowUp':
      action = Up
      break
    case 'KeyS':
    case 'KeyJ':
    case 'ArrowDown':
      action = Down
      break
    case 'KeyA':
    case 'KeyH':
    case 'ArrowLeft':
      action = Left
      break
    case 'KeyD':
    case 'KeyL':
    case 'ArrowRight':
      action = Right
      break
    case 'Space':
      wait = true
      break
    case 'Enter':
      break
  }
  if (action !== null) {
    sleep = true
    const boost = Keys.has('ControlLeft') || Keys.has('ControlRight')
    addComponent(ECS.world, MoveAction, PlayerEntity)
    MoveAction.x[PlayerEntity] = action.x * (boost ? 10 : 1)
    MoveAction.y[PlayerEntity] = action.y * (boost ? 10 : 1)
    MoveAction.clip[PlayerEntity] = boost ? 1 : 0
    ECS.runTurn()
  } else if (wait) {
    ECS.runTurn()
  }
  return world
}

const Keys: Set<GameKey> = new Set()
let currentKey: null | GameKey = null

const isGameKey = (key: string): key is GameKey => gameKeys.includes(key as GameKey)

window.addEventListener('keydown', (e) => {
  if (e.repeat) return
  if (!isGameKey(e.code)) return
  e.preventDefault()
  Keys.add(e.code)
  currentKey = e.code
  if (!sleep) ECS.runInput()
})
window.addEventListener('keyup', (e) => {
  if (!isGameKey(e.code)) return
  Keys.delete(e.code)
  currentKey = null
})

type GameKey = typeof gameKeys[number]

const gameKeys = [
  'KeyW',
  'KeyA',
  'KeyS',
  'KeyD',
  'KeyK',
  'KeyJ',
  'KeyH',
  'KeyL',
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ShiftLeft',
  'ShiftRight',
  'ControlLeft',
  'ControlRight',
  'Space',
  'Enter',
] as const
