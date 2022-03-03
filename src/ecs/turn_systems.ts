import { addComponent, Changed, defineQuery, Not, removeComponent, System } from 'bitecs'
import { AnimateMovement, DisplayObject, GridPosition, MoveAction } from './components'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../index'

export const playerSystem: System = (world) => {
  return world
}

const moveQuery = defineQuery([GridPosition, MoveAction])

export const gridMoveSystem: System = (world) => {
  for (const eid of moveQuery(world)) {
    GridPosition.x[eid] += MoveAction.x[eid]
    GridPosition.y[eid] += MoveAction.y[eid]
    removeComponent(world, MoveAction, eid)
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
    console.log('insta-move', eid)
    SpritesByEID[eid].x = GridPosition.x[eid] * TILE_SIZE
    SpritesByEID[eid].y = GridPosition.y[eid] * TILE_SIZE
  }
  return world
}
