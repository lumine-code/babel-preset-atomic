import type { InputOptions } from "@babel/core" with { "resolution-mode": "require"
};
export type Options = {
    targets?: InputOptions["targets"];
    keepModules?: boolean;
    addModuleExports?: boolean;
    addModuleExportsDefaultProperty?: boolean;
    react?: boolean | Record<string, any>;
    flow?: boolean | Record<string, any>;
    typescript?: boolean | Record<string, any>;
    removeAllUseStrict?: boolean;
    notStrictDirectiveTriggers?: string[];
    notStrictCommentTriggers?: string[];
};
