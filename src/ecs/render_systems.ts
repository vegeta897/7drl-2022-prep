import { System } from 'bitecs'
import { PlayerSprite, TILE_SIZE } from '../index'
import { PixiViewport } from '../pixi'
import { Util } from 'rot-js'

const PADDING = 1.25 / 3 // Portion of screen to pad
const PAD_X = Math.floor(PixiViewport.screenWidthInWorldPixels / 2 - PixiViewport.screenWidthInWorldPixels * PADDING)
const PAD_Y = Math.floor(PixiViewport.screenHeightInWorldPixels / 2 - PixiViewport.screenHeightInWorldPixels * PADDING)

export const cameraSystem: System = (world) => {
  const centerX = PlayerSprite.x + TILE_SIZE / 2
  const centerY = PlayerSprite.y + TILE_SIZE / 2
  const camOffsetX = centerX - PixiViewport.center.x
  const camOffsetY = centerY - PixiViewport.center.y
  if (Math.abs(camOffsetX) > PAD_X || Math.abs(camOffsetY) > PAD_Y) {
    PixiViewport.moveCenter({
      x: Util.clamp(PixiViewport.center.x, centerX - PAD_X, centerX + PAD_X),
      y: Util.clamp(PixiViewport.center.y, centerY - PAD_Y, centerY + PAD_Y),
    })
  }
  return world
}
