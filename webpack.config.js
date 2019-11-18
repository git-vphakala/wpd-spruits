const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'spruits.js',
    path: path.resolve(__dirname, 'dist'),
    library:'spruits'
  },
  externals: {
    "jquery":"jQuery"
  }
};
