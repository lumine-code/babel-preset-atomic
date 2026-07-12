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
