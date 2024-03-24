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
  ...commonExportConfig,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
},
{
  ...commonExportConfig,
  entry: './src/options.ts',
  output: {
    filename: 'options.js',
    path: path.resolve(__dirname, 'dist'),
  },
}];