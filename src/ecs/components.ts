import { defineComponent, Types } from 'bitecs'

export const DisplayObject = defineComponent()

export const GridPosition = defineComponent({
  x: Types.i32,
  y: Types.i32,
})

export const MoveAction = defineComponent({
  x: Types.i32,
  y: Types.i32,
})

export const AnimateMovement = defineComponent({
  x: Types.i32,
  y: Types.i32,
  elapsed: Types.f32,
  length: Types.f32,
})
