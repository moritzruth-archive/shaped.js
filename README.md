# shaped.js
> 🍭 Generate beautiful moving shapes using a canvas element which can for example be used for backgrounds

<a href="https://npmjs.org/package/shaped.js">![npm](https://img.shields.io/npm/v/shaped.js?style=flat-square)</a>

➡️ [Demo](https://moritz-ruth.de/projects/shaped.js/demo)

## Usage
[Click here to open the interactive configuration generator.](https://moritz-ruth.de/projects/shaped.js/demo)

### Using Webpack or ESM
```js
import { Canvas } from "shaped.js";
```

### Using a link tag
Place this in the head of your HTML document and replace <VERSION> with the required version.

```html
<link href="https://cdn.jsdelivr.net/npm/shaped.js@<VERSION>/dist/shaped.min.js">
```

Then access it like this:

```js
const Canvas = Shaped.Canvas;
```

## Example

```js
const CONFIG = {
  lines: [
    {
      minCount: 8,
      probability: 1 / 50000,
      colors: [
        "rgba(0, 0, 0, 0.8)",
        "rgba(0, 255, 150, 0.8)",
        "rgba(0, 150, 255, 0.7)"
      ],
      height: 50,
      length: 50,
      speed: [0.2, 0.4],
      randomizeYAfterLeave: true
    },
    {
      probability: 1 / 100000,
      colors: [
        "rgba(0, 150, 255, 0.2)",
        "rgba(0, 255, 150, 0.2)"
      ],
      height: 50,
      length: 50,
      speed: 0.2,
      randomizeYAfterLeave: true
    }
  ],
  fillWindowSize: true
};

new Canvas(document.querySelector("#canvas"), CONFIG);
```
