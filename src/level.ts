import * as ROT from 'rot-js'
import { Sprite, Texture } from 'pixi.js'
import { TILE_SIZE } from './index'
import { PixiViewport } from './pixi'

const MAP_WIDTH = 80
const MAP_HEIGHT = 40

export let Level: Map<string, Tile>

export function createLevel() {
  const cellular = new ROT.Map.Cellular(MAP_WIDTH, MAP_HEIGHT)
  cellular.randomize(0.5)
  for (let i = 0; i < 2; i++) {
    cellular.create()
  }
  Level = new Map()
  cellular.connect((x, y, value) => {
    const isBoundary = x === 0 || x === MAP_WIDTH - 1 || y === 0 || y === MAP_HEIGHT - 1
    if (!isBoundary && value === 1) return
    Level.set(TileMap.keyFromXY(x, y), Tile.Wall)
    const wallSprite = new Sprite(Texture.from('wall'))
    wallSprite.x = x * TILE_SIZE
    wallSprite.y = y * TILE_SIZE
    PixiViewport.addChild(wallSprite)
  }, 1)
}

export enum Tile {
  Floor,
  Wall,
}

export type TileData = {
  sprite?: Sprite
  x: number
  y: number
  type: Tile
  seeThrough: boolean
  solid: boolean
  tint?: number
  ignoreFOV?: boolean
  revealed: number
}

export class TileMap {
  data: Map<string, TileData> = new Map()
  has(x: number, y: number): boolean {
    return this.data.has(TileMap.keyFromXY(x, y))
  }
  get(x: number, y: number): TileData | undefined {
    return this.data.get(TileMap.keyFromXY(x, y))
  }
  set(x: number, y: number, tile: TileData): void {
    this.data.set(TileMap.keyFromXY(x, y), tile)
  }
  addTile(tile: TileData): void {
    this.data.set(TileMap.keyFromXY(tile.x, tile.y), tile)
  }
  static keyFromXY(x: number, y: number) {
    return x + ':' + y
  }
}
