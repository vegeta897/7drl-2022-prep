import './style.css'
import { ECS } from './ecs'
import { addComponent, addEntity } from 'bitecs'
import { Sprite, Texture } from 'pixi.js'
import { onLoad, PixiViewport } from './pixi'
import { DisplayObject, GridPosition, RandomWalk } from './ecs/components'
import { SpritesByEID } from './sprites'
import { createLevel } from './level'

export const TILE_SIZE = 16

export const PlayerEntity = addEntity(ECS.world)
export let PlayerSprite: Sprite

window.onload = async (): Promise<void> => {
  await onLoad()

  createLevel()

  PlayerSprite = new Sprite(Texture.from('player'))
  SpritesByEID[PlayerEntity] = PlayerSprite
  PixiViewport.addChild(PlayerSprite)
  addComponent(ECS.world, DisplayObject, PlayerEntity)
  addComponent(ECS.world, GridPosition, PlayerEntity)

  PixiViewport.moveCenter(PlayerSprite)

  const bat = addEntity(ECS.world)
  const batSprite = new Sprite(Texture.from('bat'))
  SpritesByEID[bat] = batSprite
  PixiViewport.addChild(batSprite)
  addComponent(ECS.world, DisplayObject, bat)
  addComponent(ECS.world, GridPosition, bat)
  addComponent(ECS.world, RandomWalk, bat)
  GridPosition.x[bat] = 5
  GridPosition.y[bat] = 5
}
