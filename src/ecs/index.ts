import { createWorld, pipe, registerComponents } from 'bitecs'
import { AnimateMovement, DisplayObject, GridPosition, MoveAction } from './components'
import { inputSystem } from './input_systems'
import { playerSystem, gridMoveSystem } from './turn_systems'
import { nonAnimatedSystem } from './anim_systems'
// import { ... } from './render_systems'

const world = createWorld()

registerComponents(world, [DisplayObject, GridPosition, MoveAction, AnimateMovement])

export const ECS = {
  world,
  inputPipeLine: pipe(inputSystem),
  turnPipeline: pipe(playerSystem, gridMoveSystem),
  animPipeline: pipe(nonAnimatedSystem),
  renderPipeline: pipe(),
}

// Run anim once so changed queries work on first change
ECS.animPipeline(ECS.world)
