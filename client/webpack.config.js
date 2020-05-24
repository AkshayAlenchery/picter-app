const Path = require('path')
const HtmlWebpack = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: Path.resolve(__dirname, 'dist'),
    filename: 'index_bundle.js'
  },
  module: {
    rules: [
      { test: /\.(js)$/, use: 'babel-loader' },
      { test: /\.(css)$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(png|jpg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'react-svg-loader',
            options: {
              jsx: true
            }
          }
        ]
      }
    ]
  },
  mode: 'development',
  plugins: [
    new HtmlWebpack({
      template: './public/index.html'
    })
  ],
  devServer: {
    proxy: {
      '/picter/api': {
        target: 'http://localhost:5500',
        changeOrigin: true
      }
    },
    historyApiFallback: true
  }
}
