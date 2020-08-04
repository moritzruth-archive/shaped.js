import randomItem from "random-item"
import throttle from "lodash.throttle"
import { getValueOrRange, NumberValueOrRange } from "./get-value-or-range"
import { randomBetween } from "./random-between"

interface Line {
  x: number
  y: number
  color: string
  length: number
  height: number
  speed: number
}

export interface OptionalShapedConfig {
  silent: boolean
  useWindowSize: boolean
}

export interface RequiredShapedConfig {
  colors: string[]
  probability: number
  minCount: number
  length: NumberValueOrRange
  height: NumberValueOrRange
  speed: NumberValueOrRange
  randomizeYAfterLeave: boolean
}

export type ShapedConfig = OptionalShapedConfig & RequiredShapedConfig

export class ShapedCanvas {
  private static nextInstanceID = 0
  private readonly id: number
  private readonly windowListeners: { [key: string]: () => void }
  private readonly config: ShapedConfig
  private readonly element: HTMLCanvasElement
  private readonly ctx: CanvasRenderingContext2D
  private animationFrameRequestID: number | null = null
  private lines: Line[] = []
  private width: number
  private height: number
  private stopped = true

  constructor(element: HTMLCanvasElement, config: Partial<OptionalShapedConfig> & RequiredShapedConfig) {
    this.id = ShapedCanvas.nextInstanceID++

    this.config = {
      ...config,
      silent: config.silent ?? false,
      useWindowSize: config.useWindowSize ?? false
    }

    this.element = element
    this.ctx = element.getContext("2d")!

    this.log("Instance created with this config:", config)

    this.windowListeners = {}
    if (this.config.useWindowSize) {
      this.windowListeners.resize = throttle(() => {
        this.log("Resized -> Reinitializing")
        this.init()
      }, 100)
    }

    this.width = 0
    this.height = 0
    this.init()
    this.start()
  }

  start() {
    if (this.stopped) {
      this.log("Start drawing...")
      this.stopped = false
      Object.entries(this.windowListeners).forEach(([event, listener]) => {
        window.addEventListener(
          event as keyof WindowEventMap,
          listener,
          { passive: true }
        )
      })

      this.loop()
    }
  }

  stop() {
    if (!this.stopped) {
      this.stopped = true
      Object.entries(this.windowListeners).forEach(([event, listener]) => window.removeEventListener(event, listener))
      if (this.animationFrameRequestID !== null) cancelAnimationFrame(this.animationFrameRequestID)
      this.log("Stooped drawing.")
    }
  }

  private init() {
    this.log("Initializing...")

    if (this.config.useWindowSize) {
      this.log("Using height and width of window")

      this.element.width = window.innerWidth
      this.element.height = window.innerHeight
    }

    this.width = this.element.clientWidth
    this.height = this.element.clientHeight

    this.initLines()
    this.start()
  }

  private log(...values: Array<string | object>) {
    if (!this.config.silent) console.log(`[🍭 shaped.js - ${this.id}]`, ...values)
  }

  private initLines() {
    this.lines = []

    while (this.lines.length < this.config.minCount) {
      for (let x = 0; x < this.width; x += 1) {
        for (let y = 0; y < this.height; y += 1) {
          if (Math.random() < this.config.probability) {
            this.lines.push({
              x,
              y,
              color: randomItem(this.config.colors),
              length: getValueOrRange(this.config.length),
              height: getValueOrRange(this.config.height),
              speed: getValueOrRange(this.config.speed, false)
            })
          }
        }
      }
    }

    this.log(`Generated ${this.lines.length} lines.`)
  }

  private loop() {
    this.animationFrameRequestID = null
    this.draw()
    if (!this.stopped) requestAnimationFrame(() => this.loop())
  }

  private draw() {
    this.ctx.clearRect(0, 0, this.width, this.height)

    for (const line of this.lines) {
      this.ctx.fillStyle = line.color
      this.ctx.fillRect(line.x, line.y, line.length, line.height)

      line.x += line.speed

      if (line.x >= this.width) line.x = -line.length
      else if (line.x <= 0 - line.length) line.x = this.width
      else continue

      if (this.config.randomizeYAfterLeave) line.y = randomBetween(0, this.height)
    }
  }
}
