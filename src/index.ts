import './style.css'
import { ECS } from './ecs'
import { addComponent, addEntity } from 'bitecs'
import { Sprite, Texture } from 'pixi.js'
import { onLoad, PixiViewport } from './pixi'
import { DisplayObject, GridPosition } from './ecs/components'
import { SpritesByEID } from './sprites'

export const TILE_SIZE = 16

export const PlayerEntity = addEntity(ECS.world)
export let PlayerSprite: Sprite

window.onload = async (): Promise<void> => {
  await onLoad()
  PlayerSprite = new Sprite(Texture.from('birdUp.png'))
  SpritesByEID[PlayerEntity] = PlayerSprite
  PixiViewport.addChild(PlayerSprite)
  addComponent(ECS.world, DisplayObject, PlayerEntity)
  addComponent(ECS.world, GridPosition, PlayerEntity)
}
