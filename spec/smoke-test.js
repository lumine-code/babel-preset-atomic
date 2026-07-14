const assert = require("node:assert/strict")
const { test } = require("node:test")
const babel = require("@babel/core")
const preset = require("../dist")

function transform(source, options = {}, filename = "example.js") {
  return babel.transformSync(source, {
    filename,
    presets: [[preset, options]],
  }).code
}

function evaluateCommonJS(code) {
  const moduleUnderTest = { exports: {} }
  Function("module", "exports", code)(moduleUnderTest, moduleUnderTest.exports)
  return moduleUnderTest.exports
}

test("transforms modern syntax and exposes a default export directly", () => {
  const code = transform(`
    "use babel";
    export default class Example {
      value = 1;
      read(input) {
        return input?.value ?? this.value;
      }
    }
  `)

  assert.doesNotMatch(code, /["']use strict["']/)

  const Example = evaluateCommonJS(code)
  assert.equal(new Example().read(null), 1)
  assert.equal(new Example().read({ value: 2 }), 2)
})

test("uses the classic React runtime so per-file JSX pragmas remain valid", () => {
  const code = transform(
    `
      /** @babel */
      /** @jsx etch.dom */
      const view = <div className="settings-view" />;
    `,
    { flow: false, typescript: false },
    "settings-view.js",
  )

  assert.match(code, /etch\.dom\("div"/)
})

test("supports legacy decorators", () => {
  const code = transform(
    `
      function observer(target) {
        target.observed = true;
      }

      @observer
      class Display {}

      module.exports = Display;
    `,
    { flow: false, typescript: false },
    "display.js",
  )

  assert.doesNotMatch(code, /@observer/)
  assert.equal(evaluateCommonJS(code).observed, true)
})

test("preserves ES modules when keepModules is enabled", () => {
  const code = transform("export const answer = 42;", {
    keepModules: true,
    flow: false,
    react: false,
    typescript: false,
  })

  assert.match(code, /export const answer = 42/)
  assert.doesNotMatch(code, /module\.exports|exports\.answer/)
})

test("can retain Babel's default-export wrapper", () => {
  const code = transform("export default 42;", {
    addModuleExports: false,
    flow: false,
    react: false,
    typescript: false,
  })

  assert.deepEqual(evaluateCommonJS(code), { default: 42 })
})

test("keeps strict mode when no opt-out trigger is present", () => {
  const code = transform('"use strict"; const answer = 42;', {
    flow: false,
    react: false,
    typescript: false,
  })

  assert.match(code, /["']use strict["']/)
})

test("honors custom directive and comment triggers for non-strict files", () => {
  const directiveCode = transform('"legacy file"; "use strict";', {
    flow: false,
    react: false,
    typescript: false,
    notStrictDirectiveTriggers: ["legacy file"],
  })
  const commentCode = transform('"use strict"; /* legacy file */\n"another directive";', {
    flow: false,
    react: false,
    typescript: false,
    notStrictCommentTriggers: ["legacy file"],
  })

  assert.doesNotMatch(directiveCode, /["']use strict["']/)
  assert.doesNotMatch(commentCode, /["']use strict["']/)
})

test("marks every explicitly strict file as non-strict when requested", () => {
  const code = transform('"use strict"; const answer = 42;', {
    flow: false,
    react: false,
    typescript: false,
    removeAllUseStrict: true,
  })

  assert.doesNotMatch(code, /["']use strict["']/)
  assert.match(code, /["']not strict["']/)
})
