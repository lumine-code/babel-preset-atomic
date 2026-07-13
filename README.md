# @lumine-code/babel-preset

This package contains the Babel configuration used for JavaScript packages in Lumine.

## Installation

```
npm install --save-dev @lumine-code/babel-preset
```

<details>
<summary> This package also needs `@babel/core` and/or `@babel/cli`. </summary>

If using `npm`, the bundled babel is hoisted automatically.

If using `pnpm`, either add the following to your `.npmrc` to hoist the prettier bundled with the config

```
public-hoist-pattern[]=*
```

Or install these yourself in your `devDependencies`.

```
pnpm install -save-dev "@babel/core"
pnpm install -save-dev "@babel/cli"
```

</details>

## Usage

Create a `babel.config.json` file at the root of the project with the following content:

```json
{
  "presets": ["@lumine-code/babel-preset"],
  "plugins": [],
  "exclude": "node_modules/**",
  "sourceMap": "inline"
}
```

Use `babel.config.js` if you need more control over the config.

<details>
<summary>babel.config.js version</summary>

```js
let presets = ["@lumine-code/babel-preset"]

let plugins = []

module.exports = {
  presets: presets,
  plugins: plugins,
  exclude: "node_modules/**",
  sourceMap: "inline",
}
```

</details>

## Options

1. `keepModules`

If you want to keep the ES modules as they are (not transforming `import` to `require`), set `BABEL_KEEP_MODULES` environment variable to `true`. This is useful with bundlers which need you to keep ES6 modules intact. By default the ES6 modules are transformed to ES5 (the value is `false`)

```
cross-env BABEL_KEEP_MODULES=true
```

To permanently set this option, you can add it to your babel config (which disables environment variable effectiveness):

```js
{
  "presets": [
    [
      "babel-preset-atomic",
      {
        "keepModules": true,
      },
    ],
  ]
}
```

<details>
<summary>babel.config.js version</summary>

```js
let presets = [
  [
    "babel-preset-atomic",
    {
      keepModules: true,
    },
  ],
]
```

</details>

2. `targets`

To change the target of `preset-env` plugin. By default this is configured for Electron 11.

```json
{
  "presets": [
    [
      "babel-preset-atomic",
      {
        "targets": {
          "electron": 9
        }
      }
    ]
  ]
}
```

<details>
<summary>babel.config.js version</summary>

```js
let presets = [
  [
    "babel-preset-atomic",
    {
      targets: {
        electron: 9,
      },
    },
  ],
]
```

</details>

3. `addModuleExports`:

Allows to `require` a ES6 module that has exported a single thing as `default`, in a ES5 fashion without `require().default`. This is `true` by default for backward compatibility with Atom packages.

```json
{
  "presets": [
    [
      "babel-preset-atomic",
      {
        "addModuleExports": false
      }
    ]
  ]
}
```

<details>
<summary>babel.config.js version</summary>

```js
let presets = [
  [
    "babel-preset-atomic",
    {
      addModuleExports: false,
    },
  ],
]
```

</details>

4. `addModuleExportsDefaultProperty`:

```json
{
  "presets": [
    [
      "babel-preset-atomic",
      {
        "addModuleExports": true,
        "addModuleExportsDefaultProperty": true
      }
    ]
  ]
}
```

<details>
<summary>babel.config.js version</summary>

```js
let presets = [
  [
    "babel-preset-atomic",
    {
      addModuleExports: true,
      addModuleExportsDefaultProperty: true,
    },
  ],
]
```

</details>

Adds `default` property to `module.exports` so the ES6 module can be required in the ES6 fashion as well (by `require().default`). This is `false` by default.

6. `react`

Enable `"@babel/preset-react"`. `true` by default. You can also pass an object to provide more options for this plugin.

7. `flow`

Enable `"@babel/preset-flow"`. `true` by default. You can also pass an object to provide more options for this plugin.

7. `typescript`

Enable `"@babel/preset-typescript"`. `true` by default. You can also pass an object to provide more options for this plugin.

9. `removeAllUseStrict`

Remove all `'use strict'` from all files. Passed to [`babel-plugin-transform-not-strict`](https://github.com/atom-ide-community/babel-plugin-transform-not-strict#usage-remove-all). This is `false` by default.

10. `notStrictDirectiveTriggers` and `notStrictCommentTriggers`

These specify `"not strict"` triggers. Passed to [`babel-plugin-transform-not-strict`](https://github.com/atom-ide-community/babel-plugin-transform-not-strict#usage-extra-directive-or-comment-triggers).

## Behind the scenes

It includes the following presets:

- `"@babel/preset-env"` (configured for `electron`)
- `"@babel/preset-react"`
- `"@babel/preset-flow"`
- `"@babel/preset-typescript"`

It also includes all the proposal plugins such as:

- `"@babel/plugin-proposal-optional-chaining"`
- `"@babel/plugin-proposal-nullish-coalescing-operator"`
- `"@babel/plugin-proposal-export-default-from"`
- `"@babel/plugin-proposal-export-namespace-from"`
- ...

It includes the plugins for compile time code generation:

- `"babel-plugin-codegen"`
- `"babel-plugin-preval"`

It has the preset that automatically adds default export for older Node versions (so no `require().default` is needed).

- `"babel-plugin-add-module-exports"`

It has the plugin for removing `'use strict'`:

- `"babel-plugin-transform-not-strict"`
