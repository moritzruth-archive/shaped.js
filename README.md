# shaped.js
> 🍭 Generate cool moving shapes using a canvas element

## Install
```sh
yarn add shaped.js
# or
npm install shaped.js
```

## Usage
You can just copy this example and change the values to your liking.

```js
import { ShapedCanvas } from "shaped.js"

new ShapedCanvas(document.querySelector("#canvas"), {
    // This determines how many lines will be generated.
    // Just play with the value until you're happy with it.
    probability: 1 / 40000,
    minCount: 8,
    colors: [
      "rgba(0, 0, 0, 0.7)",
      "rgba(0, 255, 150, 0.8)",
      "rgba(0, 150, 255, 0.7)"
    ],
    // Use a single value
    height: 50,
    length: 50,
    // Or a range
    speed: [0.2, 0.8],
    // Every line gets a new Y coordinate as soon as it leaves the screen
    randomizeYAfterLeave: true,
    // The width and height of the canvas will be synced with the width and height of the window.
    useWindowSize: true
});
```
