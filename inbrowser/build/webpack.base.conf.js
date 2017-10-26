var path = require('path')
var webpack = require('webpack')

var config = require('./config')
var utils = require('./utils')

var projectRoot = path.resolve(__dirname, '../')

module.exports = {
	entry: {
		app: projectRoot + '/src/boot/app.js'
	},
	output: {
		path: config.outputPath,
		publicPath: config.outputPublicPath,
		filename: config.outputFilename,
		chunkFilename: config.outputChunkFilename
	},
	resolve: {
		extensions: [
			'', '.js', '.json',
			'.scss', '.sass',
			'.svg', '.png', '.jpeg', '.gif'
		],
		alias: {
			'@': projectRoot + '/src',
			'@components': projectRoot + '/src/views/components',
			'@pages': projectRoot + '/src/views/pages',
			'@static': projectRoot + '/static',
			'@styles': projectRoot + '/src/styles'
		},
		fallback: projectRoot + '/node_modules'
	},
	resolveLoader: {
		fallback: projectRoot + '/node_modules'
	},
	module: {
		preLoaders: [
			{
				test: /\.(js)$/,
				loader: 'eslint-loader',
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				include: projectRoot,
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: 'img/[name].[hash:7].[ext]'
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: 'fonts/[name].[hash:7].[ext]'
				}
			},
		].concat(utils.styleLoaders)
	},
	eslint: {
		failOnWarning: false,
		failOnError: true
	},
	postcss: utils.getPostCssPlugins(),
	plugins: [
		new webpack.DefinePlugin(config.replaceConfig),
	]
}
