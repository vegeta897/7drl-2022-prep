import { System } from 'bitecs'
import { PlayerSprite, TILE_SIZE } from '../index'
import { PixiViewport } from '../pixi'
import { Util } from 'rot-js'

const PADDING = 1.25 / 3 // Portion of screen to pad

export const cameraSystem: System = (world) => {
  const centerX = PlayerSprite.x + TILE_SIZE / 2
  const centerY = PlayerSprite.y + TILE_SIZE / 2
  const xPadding = Math.floor(
    PixiViewport.screenWidthInWorldPixels / 2 - PixiViewport.screenWidthInWorldPixels * PADDING
  )
  const yPadding = Math.floor(
    PixiViewport.screenHeightInWorldPixels / 2 - PixiViewport.screenHeightInWorldPixels * PADDING
  )
  const camOffsetX = centerX - PixiViewport.center.x
  const camOffsetY = centerY - PixiViewport.center.y
  if (Math.abs(camOffsetX) > xPadding || Math.abs(camOffsetY) > yPadding) {
    const moveTo = {
      x: Util.clamp(PixiViewport.center.x, centerX - xPadding, centerX + xPadding),
      y: Util.clamp(PixiViewport.center.y, centerY - yPadding, centerY + yPadding),
    }
    PixiViewport.moveCenter(moveTo)
  }
  return world
}
