import { addComponent, Changed, defineQuery, Not, removeComponent, System } from 'bitecs'
import { AnimateMovement, DisplayObject, GridPosition, MoveAction, RandomWalk } from './components'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../'
import { Level, TileMap } from '../level'
import { RNG } from 'rot-js'
import { Down, Left, Right, Up } from '../grid'

const randomWalkQuery = defineQuery([GridPosition, RandomWalk])

export const randomWalkSystem: System = (world) => {
  for (const eid of randomWalkQuery(world)) {
    const dir = RNG.getItem([Up, Down, Left, Right])!
    addComponent(world, MoveAction, eid)
    MoveAction.x[eid] = dir.x
    MoveAction.y[eid] = dir.y
  }
  return world
}

const moveQuery = defineQuery([GridPosition, MoveAction])

export const gridMoveSystem: System = (world) => {
  for (const eid of moveQuery(world)) {
    const destX = GridPosition.x[eid] + MoveAction.x[eid]
    const destY = GridPosition.y[eid] + MoveAction.y[eid]
    removeComponent(world, MoveAction, eid)
    if (MoveAction.clip[eid] === 0 && Level.get(TileMap.keyFromXY(destX, destY))) continue
    GridPosition.x[eid] = destX
    GridPosition.y[eid] = destY
    addComponent(world, AnimateMovement, eid)
    AnimateMovement.x[eid] = MoveAction.x[eid]
    AnimateMovement.y[eid] = MoveAction.y[eid]
    AnimateMovement.elapsed[eid] = 0
    AnimateMovement.length[eid] = 120
  }
  return world
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
