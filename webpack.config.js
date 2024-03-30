const path = require('path');

const commonExportConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          /__tests__/
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  }
}

// Two exports: main bundle and options
module.exports = [{
  // Main extension bundle
  ...commonExportConfig,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
},
{
  // Script for the "options" page
  ...commonExportConfig,
  entry: './src/options.ts',
  output: {
    filename: 'options.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // Popup stript
  ...commonExportConfig,
  entry: './src/popup.ts',
  output: {
    filename: 'popup.js',
    path: path.resolve(__dirname, 'dist'),
  },
}];