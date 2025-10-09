const path = require('path');

module.exports = {
  entry: './src/content.tsx',
  output: {
    path: path.resolve(__dirname, 'scripts'),
    filename: 'content.js'
  },
  devtool: 'cheap-source-map', // Chrome extension CSP compatible
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              '@babel/preset-typescript'
            ]
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
};
