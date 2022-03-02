import { Application, Loader, Texture, AnimatedSprite } from 'pixi.js'
import './style.css'

declare const VERSION: string

const gameWidth = 800
const gameHeight = 600

console.log(`Welcome from pixi-typescript-boilerplate ${VERSION}`)

const app = new Application({
  backgroundColor: 0x012345,
  width: gameWidth,
  height: gameHeight,
})

window.onload = async (): Promise<void> => {
  await loadGameAssets()

  document.body.appendChild(app.view)

  const birdFromSprite = getBird()
  birdFromSprite.anchor.set(0.5, 0.5)
  birdFromSprite.position.set(gameWidth / 2, 530)

  app.stage.addChild(birdFromSprite)
  app.stage.interactive = true
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
  bird.scale.set(3)

  return bird
}
