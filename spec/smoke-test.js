const assert = require("node:assert/strict")
const babel = require("@babel/core")
const preset = require("../dist")

const source = `
  "use babel";
  export default class Example {
    value = 1;
    read(input) {
      return input?.value ?? this.value;
    }
  }
`

const { code } = babel.transformSync(source, {
  filename: "example.js",
  presets: [[preset, { keepModules: false }]],
})

assert.doesNotMatch(code, /["']use strict["']/)

const moduleUnderTest = { exports: {} }
Function("module", "exports", code)(moduleUnderTest, moduleUnderTest.exports)
const Example = moduleUnderTest.exports

assert.equal(new Example().read(null), 1)
assert.equal(new Example().read({ value: 2 }), 2)

const jsxSource = `
  /** @babel */
  /** @jsx etch.dom */
  const view = <div className="settings-view" />;
`

const { code: jsxCode } = babel.transformSync(jsxSource, {
  filename: "settings-view.js",
  presets: [[preset, { keepModules: false, flow: false, typescript: false }]],
})

assert.match(jsxCode, /etch\.dom\("div"/)

const decoratorSource = `
  function observer(target) {
    target.observed = true;
  }

  @observer
  class Display {}

  module.exports = Display;
`

const { code: decoratorCode } = babel.transformSync(decoratorSource, {
  filename: "display.js",
  presets: [[preset, { keepModules: false, flow: false, typescript: false }]],
})

assert.doesNotMatch(decoratorCode, /@observer/)
const decoratedModule = { exports: {} }
Function("module", "exports", decoratorCode)(decoratedModule, decoratedModule.exports)
assert.equal(decoratedModule.exports.observed, true)
