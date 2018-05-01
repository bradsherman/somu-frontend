const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devServer: {
    contentBase: './dist',
    host: '0.0.0.0',
    port: 3001,
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        }
      },
      {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
      },
      {
          test: /\.(png|woff|woff2|eot|ttf|svg)$/,
          use: 'url-loader?limit=100000'
      }
    ]
  }
};

