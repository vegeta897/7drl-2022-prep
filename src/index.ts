import './style.css'
import { World } from './ecs'
import { addComponent, addEntity } from 'bitecs'
import { Sprite, Texture } from 'pixi.js'
import { onLoad, PixiViewport } from './pixi'
import { ActionTimer, DisplayObject, GridPosition, RandomWalk } from './ecs/components'
import { SpritesByEID } from './sprites'
import { createLevel } from './level'

export const TILE_SIZE = 16

export const PlayerEntity = addEntity(World)
export let PlayerSprite: Sprite

window.onload = async (): Promise<void> => {
  await onLoad()

  createLevel()

  PlayerSprite = new Sprite(Texture.from('player'))
  SpritesByEID[PlayerEntity] = PlayerSprite
  PixiViewport.addChild(PlayerSprite)
  addComponent(World, DisplayObject, PlayerEntity)
  addComponent(World, GridPosition, PlayerEntity)

  PixiViewport.moveCenter(PlayerSprite)

  addBat(5, 5)
  addBat(7, 5)
  addBat(9, 5)
  addBat(5, 7)
  addBat(5, 9)
}

function addBat(x: number, y: number) {
  const bat = addEntity(World)
  const batSprite = new Sprite(Texture.from('bat'))
  SpritesByEID[bat] = batSprite
  PixiViewport.addChild(batSprite)
  addComponent(World, DisplayObject, bat)
  addComponent(World, GridPosition, bat)
  addComponent(World, RandomWalk, bat)
  addComponent(World, ActionTimer, bat)
  ActionTimer.timeLeft[bat] = 0
  GridPosition.x[bat] = x
  GridPosition.y[bat] = y
}
