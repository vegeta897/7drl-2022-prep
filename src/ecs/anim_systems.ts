// Runs after turn systems, handles tweening and other visuals before next input accepted
import { AnimateMovement, DisplayObject, GridPosition } from './components'
import { defineQuery, IWorld, removeComponent } from 'bitecs'
import { SpritesByEID } from '../sprites'
import { TILE_SIZE } from '../'
import { cubicOut } from '@gamestdio/easing'

export async function runAnimations(world: IWorld) {
  let last = performance.now()
  let done = false
  while (!done) {
    const now = await awaitAnimationFrame()
    done = animateMovement(world, now - last)
    last = now
  }
}

async function awaitAnimationFrame(): Promise<DOMHighResTimeStamp> {
  return new Promise((res) => {
    requestAnimationFrame((time) => res(time))
  })
}

const animated = defineQuery([GridPosition, DisplayObject, AnimateMovement])
const animateMovement = (world: IWorld, delta: number): boolean => {
  const toAnimate = animated(world)
  if (toAnimate.length === 0) return true
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
  return false
}
