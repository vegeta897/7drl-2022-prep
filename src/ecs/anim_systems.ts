// Runs after turn systems, handles tweening and other visuals before next input accepted

import { AnimateMovement, DisplayObject, GridPosition } from './components'
import { Changed, defineQuery, Not, System } from 'bitecs'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../index'
import { wakeInput } from './input_systems'

// If perf is bad with Changed, use a dirty flag
const nonAnimated = defineQuery([Changed(GridPosition), DisplayObject, Not(AnimateMovement)])

export const nonAnimatedSystem: System = (world) => {
  for (const eid of nonAnimated(world)) {
    SpritesByEID[eid].x = GridPosition.x[eid] * TILE_SIZE
    SpritesByEID[eid].y = GridPosition.y[eid] * TILE_SIZE
  }
  wakeInput()
  return world
}
