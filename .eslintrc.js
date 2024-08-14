module.exports = {
    "env": {
        "browser": true,
        "commonjs": true
    },
    "plugins": [
        "require-path-exists"
    ],
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 6,
        "requireConfigFile": false
    },
    "globals": {
        "VERSION": true,
        "Gantt": true,
        "LICENSE": true
    },
    "rules": {
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": ["error", { "vars": "all", "args": "none" }],
        "comma-dangle": "error",
        "no-mixed-spaces-and-tabs": "error",
        "no-constant-condition": "off",
        "no-extra-boolean-cast": "off",
        "no-redeclare": "off",
        "no-implicit-globals": "error",
        "no-global-assign": "error",
        "no-restricted-globals": [
            "error",
            {
                "name": "event",
                "message": "window.event is long obsolete, it's better not to use it"
            },
            {
                "name": "Promise",
                "message": "Native 'Promise' is not allowed, use ./utils/promise instead"
            },
            {
                "name": "window",
                "message": "Don't access window directly for node compatibility, use ./utils/global instead"
            },
            {
                "name": "global",
                "message": "Don't access global directly for browser compatibility, use ./utils/global instead"
            }
        ]
    }
};