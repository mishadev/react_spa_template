var webpack = require('webpack')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var baseWebpackConfig = require('./webpack.base.conf')
var config = require('./config')

module.exports = merge(baseWebpackConfig, {
	// devtool: '#source-map',
	devtool: false,
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin(config.cssOutputFilename),
		// https://github.com/ampedandwired/html-webpack-plugin
		new HtmlWebpackPlugin({
			filename: config.htmlOutputFilename,
			template: config.htmlTemplatePath,
			favicon: config.faviconPath,
			inject: true
		})
	]
})
