"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let keepModulesEnv = false; // false by default
if (process.env.BABEL_KEEP_MODULES === "true") {
    keepModulesEnv = true;
}
function handleOptions(options) {
    let { targets, keepModules, addModuleExports, addModuleExportsDefaultProperty, react, flow, typescript, removeAllUseStrict, notStrictDirectiveTriggers, notStrictCommentTriggers, } = options;
    // Use Lumine's Electron runtime as the default target.
    if (targets === undefined) {
        targets = {
            electron: "43",
        };
    }
    // if not provided in the options, use the environment variable
    if (keepModules === undefined) {
        keepModules = keepModulesEnv;
    }
    // add module exports by default
    if (addModuleExports === undefined) {
        addModuleExports = true;
    }
    // do not add default property by default
    if (addModuleExportsDefaultProperty === undefined) {
        addModuleExportsDefaultProperty = false;
    }
    if (react === undefined) {
        react = true;
    }
    if (flow === undefined) {
        flow = true;
    }
    if (typescript === undefined) {
        typescript = true;
    }
    if (removeAllUseStrict === undefined) {
        removeAllUseStrict = false;
    }
    if (notStrictDirectiveTriggers === undefined) {
        notStrictDirectiveTriggers = ["use babel"];
    }
    if (notStrictCommentTriggers === undefined) {
        notStrictCommentTriggers = ["@babel", "@flow", "* @babel", "* @flow"];
    }
    return {
        targets,
        keepModules,
        addModuleExports,
        addModuleExportsDefaultProperty,
        react,
        flow,
        typescript,
        removeAllUseStrict,
        notStrictDirectiveTriggers,
        notStrictCommentTriggers,
    };
}
function transformNotStrict({ types }) {
    return {
        name: "transform-not-strict",
        visitor: {
            Directive(path, state) {
                var _a, _b, _c;
                if (path.node.value.value !== "use strict")
                    return;
                if (state.opts.removeAll) {
                    path.node.value.value = "not strict";
                    return;
                }
                for (const sibling of path.container) {
                    if (types.isDirective(sibling) &&
                        (sibling.value.value === "not strict" ||
                            ((_a = state.opts.directiveTriggers) === null || _a === void 0 ? void 0 : _a.includes(sibling.value.value)))) {
                        path.remove();
                        return;
                    }
                    const comments = [...((_b = sibling.leadingComments) !== null && _b !== void 0 ? _b : []), ...((_c = sibling.trailingComments) !== null && _c !== void 0 ? _c : [])];
                    if (comments.some((comment) => { var _a; return (_a = state.opts.commentTriggers) === null || _a === void 0 ? void 0 : _a.includes(comment.value.trim()); })) {
                        path.remove();
                        return;
                    }
                }
            },
        },
    };
}
// eslint-disable-next-line no-unused-vars
module.exports = (_api, options, _dirname) => {
    const { targets, keepModules, addModuleExports, addModuleExportsDefaultProperty, react, flow, typescript, removeAllUseStrict, notStrictDirectiveTriggers, notStrictCommentTriggers, } = handleOptions(options);
    const presets = [
        [
            require("@babel/preset-env"),
            {
                targets,
                modules: keepModules ? false : "commonjs",
            },
        ],
    ];
    if (react !== false) {
        const presetReact = require("@babel/preset-react");
        presets.push(typeof react === "object" ? [presetReact, react] : presetReact);
    }
    if (flow !== false) {
        const presetFlow = require("@babel/preset-flow");
        presets.push(typeof flow === "object" ? [presetFlow, flow] : presetFlow);
    }
    if (typescript !== false) {
        const presetTypeScript = require("@babel/preset-typescript");
        presets.push(typeof typescript === "object" ? [presetTypeScript, typescript] : presetTypeScript);
    }
    const plugins = [
        require("@babel/plugin-transform-logical-assignment-operators"),
        require("@babel/plugin-transform-optional-chaining"),
        require("@babel/plugin-transform-nullish-coalescing-operator"),
        require("@babel/plugin-transform-export-namespace-from"),
        require("@babel/plugin-transform-numeric-separator"),
        require("@babel/plugin-transform-class-properties"),
        require("@babel/plugin-transform-private-methods"),
        require("@babel/plugin-transform-private-property-in-object"), // #38
        require("@babel/plugin-transform-json-strings"),
        // not strict
        [
            transformNotStrict,
            {
                removeAll: removeAllUseStrict,
                directiveTriggers: notStrictDirectiveTriggers,
                commentTriggers: notStrictCommentTriggers,
            },
        ],
        // reserved keywords
        require("@babel/plugin-transform-reserved-words"),
    ];
    // transform modules (e.g when without Rollup)
    if (!keepModules) {
        plugins.push(require("@babel/plugin-transform-modules-commonjs"));
        if (addModuleExports) {
            plugins.push([
                require("babel-plugin-add-module-exports"),
                { addDefaultProperty: addModuleExportsDefaultProperty },
            ]); // Atom needs this.
        }
    }
    return {
        presets,
        plugins,
        assumptions: {
            setPublicClassFields: true,
            privateFieldsAsProperties: true,
        },
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUEsQ0FBQyxtQkFBbUI7QUFFOUMsSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixLQUFLLE1BQU0sRUFBRSxDQUFDO0lBQzlDLGNBQWMsR0FBRyxJQUFJLENBQUE7QUFDdkIsQ0FBQztBQWVELFNBQVMsYUFBYSxDQUFDLE9BQWdCO0lBQ3JDLElBQUksRUFDRixPQUFPLEVBQ1AsV0FBVyxFQUNYLGdCQUFnQixFQUNoQiwrQkFBK0IsRUFDL0IsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1Ysa0JBQWtCLEVBQ2xCLDBCQUEwQixFQUMxQix3QkFBd0IsR0FDekIsR0FBRyxPQUFPLENBQUE7SUFFWCx1REFBdUQ7SUFDdkQsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDMUIsT0FBTyxHQUFHO1lBQ1IsUUFBUSxFQUFFLElBQUk7U0FDZixDQUFBO0lBQ0gsQ0FBQztJQUVELCtEQUErRDtJQUMvRCxJQUFJLFdBQVcsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUM5QixXQUFXLEdBQUcsY0FBYyxDQUFBO0lBQzlCLENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsSUFBSSxnQkFBZ0IsS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUNuQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUE7SUFDekIsQ0FBQztJQUVELHlDQUF5QztJQUN6QyxJQUFJLCtCQUErQixLQUFLLFNBQVMsRUFBRSxDQUFDO1FBQ2xELCtCQUErQixHQUFHLEtBQUssQ0FBQTtJQUN6QyxDQUFDO0lBRUQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFLENBQUM7UUFDeEIsS0FBSyxHQUFHLElBQUksQ0FBQTtJQUNkLENBQUM7SUFFRCxJQUFJLElBQUksS0FBSyxTQUFTLEVBQUUsQ0FBQztRQUN2QixJQUFJLEdBQUcs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