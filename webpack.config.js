const path = require('path');

const commonExportConfig = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
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
  // Background stripts
  ...commonExportConfig,
  entry: './src/background.ts',
  output: {
    filename: 'background.js',
    path: path.resolve(__dirname, 'dist'),
  },
}];