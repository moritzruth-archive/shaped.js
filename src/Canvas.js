import randomItem from "random-item";
import _throttle from "lodash.throttle";
import { getConfigValue } from "./utils/getConfigValue";
import { randomBetween } from "./utils/randomBetween";
import { invokeFor } from "./utils/invokeFor";

let nextInstanceID = 0;

export class Canvas {
  constructor (element, config) {
    this._id = nextInstanceID;
    nextInstanceID += 1;

    this._config = config;
    this._element = element;
    this._ctx = element.getContext("2d");
    this._destroyed = false;
    this._animationFrameRequestID = null;
    this._lines = null;
    this._width = null;
    this._height = null;
    this._isTouch = false;

    this._log("Instance created with following config:", config);

    this._windowListeners = {
      touchstart: () => {
        this._isTouch = true;
      },
      resize: _throttle(() => {
        this._log("Resized -> Reinitializing");
        this._init();
      }, 100)
    };

    this._log("Registering window listeners...");
    Object.entries(this._windowListeners)
      .forEach(([event, listener]) => window.addEventListener(event, listener, { passive: true }));

    this._init();

    this._log("Starting looping...");
    this._loop();
  }

  destroy() {
    this._log("Trying to destroy...");
    if (this._destroyed) {
      this._log("Instance is already destroyed.");
      throw new Error("Instance is already destroyed.");
    }

    this._destroyed = true;
    this._element = null;
    this._ctx = null;

    this._log("Unregistering window listeners...");
    Object.entries(this._windowListeners)
      .forEach(([event, listener]) => window.removeEventListener(event, listener));

    if (this._animationFrameRequestID !== null) {
      cancelAnimationFrame(this._animationFrameRequestID);
    }
  }

  get destroyed() {
    return this._destroyed;
  }

  _log(...arguments_) {
    if (!this._config.silent) {
      console.log(`[🍭 shaped.js - ${this._id}]`, ...arguments_);
    }
  }

  _init() {
    this._log("Initializing...");

    if (this._config.fillWindowSize) {
      this._log("Matching height and width with window...");

      this._element.width = window.innerWidth;
      this._element.height = window.innerHeight;
    }

    this._width = this._element.clientWidth;
    this._height = this._element.clientHeight;

    this._lines = [];
    invokeFor(config => this._initLines(config), this._config.lines);
    this._log(`Count of all lines: ${this._lines.length}`);
  }

  _initLines(config) {
    const lines = [];

    do {
      for (let x = 0; x < this._width; x += 1) {
        for (let y = 0; y < this._height; y += 1) {
          if (Math.random() < config.probability) {
            lines.push({
              x, y,
              color: randomItem(config.colors),
              length: getConfigValue(config.length),
              height: getConfigValue(config.height),
              speed: getConfigValue(config.speed, false)
            });
          }
        }
      }
    } while (lines.length < config.minCount);

    this._log(`Generated ${this._lines.length} lines: `, lines.length);
    this._lines.push(...lines);
  }

  _loop() {
    this._animationFrameRequestID = null;

    this._draw();

    if (!this._destroyed) {
      requestAnimationFrame(() => this._loop());
    }
  }

  _draw() {
    const ctx = this._ctx;
    if (ctx === null) return;

    // Clear canvas
    ctx.clearRect(0, 0, this._width, this._height);

    invokeFor(config => this._drawLines(config), this._config.lines);
  }

  _drawLines(config) {
    const ctx = this._ctx;

    for (const line of this._lines) {
      ctx.fillStyle = line.color;
      ctx.fillRect(line.x, line.y, line.length, line.height);

      line.x += line.speed;

      if (line.x >= this._width) {
        line.x = -line.length;
        this._randomizeY(line);
        if (config.randomizeYAfterLeave) this._randomizeY(line);
      } else if (line.x <= 0 - line.length) {
        line.x = this._width;
        if (config.randomizeYAfterLeave) this._randomizeY(line);
      }
    }
  }

  _randomizeX(line) {
    line.x = randomBetween(0, this._width);
  }

  _randomizeY(line) {
    line.y = randomBetween(0, this._height);
  }
}
