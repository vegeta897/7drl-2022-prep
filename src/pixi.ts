import { Application, Loader, Ticker } from 'pixi.js'
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { runRender } from './ecs'

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const gameWidth = 940
const gameHeight = 666

export const PixiApp = new Application({
  backgroundColor: 0x012345,
  width: gameWidth,
  height: gameHeight,
})

export const PixiViewport = new Viewport({
  screenWidth: PixiApp.view.width,
  screenHeight: PixiApp.view.height,
})
PixiViewport.setZoom(1)

PixiApp.stage.addChild(PixiViewport)

export async function onLoad() {
  await loadGameAssets()

  document.body.appendChild(PixiApp.view)

  Ticker.shared.add(() => {
    runRender()
  })
}

async function loadGameAssets(): Promise<void> {
  return new Promise((res, rej) => {
    const loader = Loader.shared
    loader.add('sprites', './assets/sprites.json')
    loader.onComplete.once(() => res())
    loader.onError.once(() => rej())
    loader.load()
  })
}

export const promisedFrame = async (): Promise<DOMHighResTimeStamp> =>
  new Promise((res) => requestAnimationFrame((time) => res(time)))
