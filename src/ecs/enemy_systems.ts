import { addComponent, Changed, defineQuery, Not, System } from 'bitecs'
import { ActionTimer, AnimateMovement, DisplayObject, GridPosition, MoveAction, RandomWalk } from './components'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../'
import { RNG } from 'rot-js'
import { Down, Left, Right, Up } from '../grid'
import { runActions, World } from './'
import { runAnimations } from './anim_systems'

const TURN_TIME = 60
let timer = 0

const timerQuery = defineQuery([ActionTimer])

export async function runTimer() {
  while (timer < TURN_TIME) {
    const ready = []
    const waiting = []
    const timerEntities = timerQuery(World) // Run inside loop in case entities are deleted
    let soonestAction = TURN_TIME - timer
    for (const eid of timerEntities) {
      const timeLeft = ActionTimer.timeLeft[eid]
      if (timeLeft === 0) {
        ready.push(eid)
        soonestAction = 0
      } else {
        waiting.push(eid)
        if (timeLeft < soonestAction) soonestAction = timeLeft
      }
    }
    if (ready.length > 0) {
      createEnemyActions(ready)
      runActions()
      await runAnimations(World)
    }
    timer += soonestAction
    for (const eid of waiting) {
      ActionTimer.timeLeft[eid] -= soonestAction
    }
  }
  timer = 0
}

// const randomWalkQuery = defineQuery([ActionTimer, GridPosition, RandomWalk])

function createEnemyActions(entities: number[]) {
  for (const eid of entities) {
    ActionTimer.timeLeft[eid] = 30
    const dir = RNG.getItem([Up, Down, Left, Right])!
    addComponent(World, MoveAction, eid)
    MoveAction.x[eid] = dir.x
    MoveAction.y[eid] = dir.y
    MoveAction.clip[eid] = 0
  }
}

// If perf is bad with Changed, use a dirty flag
const nonAnimated = defineQuery([Changed(GridPosition), DisplayObject, Not(AnimateMovement)])

export const nonAnimatedSystem: System = (world) => {
  for (const eid of nonAnimated(world)) {
    SpritesByEID[eid].x = GridPosition.x[eid] * TILE_SIZE
    SpritesByEID[eid].y = GridPosition.y[eid] * TILE_SIZE
  }
  return world
}
