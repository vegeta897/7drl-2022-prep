import { AnimatedSprite, Application, Loader, Texture, Ticker } from 'pixi.js'
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
  ECS.renderPipeline(ECS.world)
})

export async function onLoad() {
  await loadGameAssets()

  document.body.appendChild(PixiApp.view)

  const birdFromSprite = getBird()
  birdFromSprite.anchor.set(0.5, 0.5)
  birdFromSprite.position.set(gameWidth / 6, 100)

  PixiViewport.addChild(birdFromSprite)
  PixiApp.stage.interactive = true
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

function getBird(): AnimatedSprite {
  const bird = new AnimatedSprite([
    Texture.from('birdUp.png'),
    Texture.from('birdMiddle.png'),
    Texture.from('birdDown.png'),
  ])

  bird.loop = true
  bird.animationSpeed = 0.1
  bird.play()

  return bird
}
