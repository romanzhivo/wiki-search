module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    '@vue/babel-preset-jsx'
  ],
  env: {
    "production": {
      "plugins": ["transform-remove-console"]
    }
  }
}
