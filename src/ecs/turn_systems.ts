import { defineQuery, removeComponent, System } from 'bitecs'
import { GridPosition, MoveAction } from './components'
import { ECS } from './index'

export const playerSystem: System = (world) => {
  return world
}

const moveQuery = defineQuery([GridPosition, MoveAction])

export const gridMoveSystem: System = (world) => {
  for (const eid of moveQuery(world)) {
    GridPosition.x[eid] += MoveAction.x[eid]
    GridPosition.y[eid] += MoveAction.y[eid]
    removeComponent(world, MoveAction, eid)
  }
  ECS.animPipeline(world)
  return world
}
