module.exports = {
    "root": true,
    "extends": [
        "guard/optimum-next",
        "guard/node"
    ],
    "parserOptions": {
        "sourceType": "module"
    },
    "overrides": [
        {
            "files": ["src/**/*.test.js"],
            "extends": [
                "guard/test-jest"
            ]
        }
    ]
};
