import { createWorld, pipe, registerComponents } from 'bitecs'
import { AnimateMovement, DisplayObject, GridPosition, MoveAction } from './components'
import { inputSystem } from './input_systems'
import { playerSystem, gridMoveSystem, nonAnimatedSystem } from './turn_systems'
import { animatedSystem } from './anim_systems'
// import { ... } from './render_systems'

const world = createWorld()

registerComponents(world, [DisplayObject, GridPosition, MoveAction, AnimateMovement])

const pipelines = {
  input: pipe(inputSystem),
  turn: pipe(playerSystem, gridMoveSystem, nonAnimatedSystem),
  anim: pipe(animatedSystem),
  render: pipe(),
}

export const ECS = {
  world,
  runInput: () => pipelines.input(world),
  runTurn: () => pipelines.turn(world),
  runAnim: () => pipelines.anim(world),
  runRender: () => pipelines.render(world),
}

// Run anim once so changed queries work on first change
ECS.runAnim()