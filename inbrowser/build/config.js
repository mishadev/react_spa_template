var _ = require('lodash');
var path = require('path');

var outputRoot = process.env.BUILD_OUTPUT_PATH || path.resolve(__dirname, '../dist');
if (!path.isAbsolute(outputRoot)) {
  throw new Error(`output root path have to be absolute but it: ${outputRoot}`);
}

var appPublicPath = _.padStart(_.trimEnd(process.env.APP_PUBLIC_PATH, '/'), '/');
var projectRoot = path.resolve(__dirname, '../')

var _configs = {
  default: {
    cssOutputFilename: 'css/[name].[contenthash].css',
    htmlOutputFilename: '../index.html',
    htmlTemplatePath: projectRoot + '/build/index.html',
    faviconPath: projectRoot + '/static/images/favicon.ico',
    outputPath: outputRoot + '/static',
    outputPublicPath: appPublicPath + '/static/',
    outputFilename: 'js/[name].[chunkhash].js',
    outputChunkFilename: 'js/[id].[chunkhash].js',
    inlineCss: false,
    watchFiles: false,
    appPublicPath: appPublicPath,

    // use selfhostApplication in case you need to host application
    // in common scenario it's hosted by nginx in dev and prod
    selfhostApplication: true,
    port: process.env.PORT || 80
  },
  development: {
    webpackConfigPath: './webpack.dev.conf',
    // NOTE: this uset to bundle configuration with app.js
    replaceConfig: {
      'process.env': {
        API_URL: `"{process.env.API_URL}"`,
        DEBUG: `"${process.env.DEBUG}"`,
        APP_PUBLIC_PATH: `"${appPublicPath}"`,
        NODE_ENV: '"development"'
      }
    },
    watchFiles: true
  },
  production: {
    webpackConfigPath: './webpack.prod.conf',
    // NOTE: this uset to bundle configuration with app.js
    replaceConfig: {
      'process.env': {
        API_URL: `"{process.env.API_URL}"`,
        NODE_ENV: '"production"',
        APP_PUBLIC_PATH: `"${appPublicPath}"`
      }
    }
  }
}

if (!_configs[process.env.NODE_ENV]) {
  throw new Error(`Could not find configuration for ${process.env.NODE_ENV}`)
}

module.exports = _.defaults({ }, _configs[process.env.NODE_ENV], _configs.default);
