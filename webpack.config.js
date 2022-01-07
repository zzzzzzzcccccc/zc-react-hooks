const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
}
