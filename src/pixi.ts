import { Application, Loader, Ticker } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { ECS } from './ecs'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const gameWidth = 800
const gameHeight = 600

export const PixiApp = new Application({
  backgroundColor: 0x012345,
  width: gameWidth,
  height: gameHeight,
})

export const PixiViewport = new Viewport({
  screenWidth: PixiApp.view.width,
  screenHeight: PixiApp.view.height,
})
PixiViewport.setZoom(3)

PixiApp.stage.addChild(PixiViewport)

Ticker.shared.add(() => {
  ECS.runAnim()
  ECS.runRender()
})

export async function onLoad() {
  await loadGameAssets()

  document.body.appendChild(PixiApp.view)
}

async function loadGameAssets(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared
    loader.add('rabbit', './assets/simpleSpriteSheet.json')

    loader.onComplete.once(() => {
      res()
    })

    loader.onError.once(() => {
      rej()
    })

    loader.load()
  })
}
