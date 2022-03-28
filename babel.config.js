module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all']
      }
    ],
    [
      '@babel/preset-react',
      {
        development: process.env.BABEL_ENV === 'development'
      }
    ]
  ],
  plugins: [
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false
      }
    ],
    '@babel/plugin-transform-react-constant-elements'
  ],
  env: {
    test: {
      presets: [['@babel/preset-env', { modules: 'commonjs' }]],
      plugins: ['@babel/plugin-transform-runtime']
    }
  }
}
