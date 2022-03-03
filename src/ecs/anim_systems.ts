// Runs after turn systems, handles tweening and other visuals before next input accepted
import { AnimateMovement, DisplayObject, GridPosition } from './components'
import { defineQuery, removeComponent, System } from 'bitecs'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../index'
import { wakeInput } from './input_systems'
import { cubicOut } from '@gamestdio/easing'

let last = performance.now()
let delta: number

const animated = defineQuery([GridPosition, DisplayObject, AnimateMovement])
export const animatedSystem: System = (world) => {
  const now = performance.now()
  delta = now - last
  last = now
  const toAnimate = animated(world)
  if (toAnimate.length === 0) {
    wakeInput()
    return world
  }
  for (const eid of toAnimate) {
    const elapsed = (AnimateMovement.elapsed[eid] += delta)
    const animLength = AnimateMovement.length[eid]
    const inverseProgress = Math.max(0, 1 - cubicOut(elapsed / animLength))
    SpritesByEID[eid].x = (GridPosition.x[eid] - AnimateMovement.x[eid] * inverseProgress) * TILE_SIZE
    SpritesByEID[eid].y = (GridPosition.y[eid] - AnimateMovement.y[eid] * inverseProgress) * TILE_SIZE
    if (inverseProgress === 0) {
      removeComponent(world, AnimateMovement, eid)
    }
  }
  return world
}
