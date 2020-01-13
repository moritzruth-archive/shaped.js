import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import banner from "rollup-plugin-banner";
import dedent from "dedent";
import package_ from "./package.json";

const BANNER = dedent`
shaped.js v<%= pkg.version %>

© 2020 Moritz Ruth

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
`;

const plugins = [
  resolve(),
  commonjs(),
  banner(BANNER),
  babel({
    exclude: ["node_modules/**"]
  })
];

// eslint-disable-next-line import/no-default-export
export default [
  // Browser-friendly UMD build
  {
    input: "src/index.js",
    output: {
      name: "Shaped",
      file: package_.browser.slice(0, -6) + "js",
      format: "umd"
    },
    plugins
  },
  {
    input: "src/index.js",
    output: {
      name: "Shaped",
      file: package_.browser,
      format: "umd"
    },
    plugins: [
      terser(),
      ...plugins
    ]
  }
];
