module.exports = {
  presets: [
    ["@babel/env", {
      targets: {
        node: "current"
      }
    }],
    "@babel/preset-typescript"
  ],
  plugins: [
    "@babel/proposal-class-properties",
    "@babel/plugin-proposal-object-rest-spread"
  ],
  env: {
    "development": {
      "ignore": [
        "**/*.test.ts"
      ]
    }
  }
};
