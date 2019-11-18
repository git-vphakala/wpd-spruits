const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: [
    './src/app.index.js'
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, './dist')
  },
  module:{
    rules:[
      {
	test: /.css$/,
	use:[
	  'style-loader', 'css-loader'
	]
      }
    ]
  },
  plugins:[
    new CopyPlugin([
      { from:'./src/index.html', to:'index.html', toType:'file' },
      { from:'./src/jquery.js', to: 'jquery.js', toType:'file' }
    ])
  ]
};
