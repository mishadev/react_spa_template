var _ = require('lodash')

var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var config = require('./config')

var _extract = function(loaders) {
	var loader = config.inlineCss ?
		'style-loader!' + loaders :
		// NOTE: publicPath option use to resolve relative url() is css
		// it's relative to css output filename
		ExtractTextPlugin.extract(loaders,
			{ publicPath: config.outputPublicPath })

	return loader
}

exports.getVueStyleLoaders = function () {
	// NOTE: postcss-loader is unessesery here becouse
	// vue-loader has build in postcss functionality
	var loaders = {
		css: _extract('css-loader!resolve-url-loader'),
		scss: _extract('css-loader!resolve-url-loader!sass-loader?sourceMap'),
		sass: _extract('css-loader!resolve-url-loader!sass-loader?sourceMap&indentedSyntax')
	}

	return loaders
}

exports.getPostCssPlugins = function () {
	// NOTE: autoprefixer is required for Foundation 6
	// http://foundation.zurb.com/sites/docs/sass.html#autoprefixer-required
	var plugins = [
		require('autoprefixer')({
			browsers: [
				'last 2 versions',
				'ie >= 9',
				'and_chr >= 2.3'
			]
		})
	]

	return plugins
}

exports.styleLoaders = [
	{
		test: /\.css$/,
		loader: _extract('css-loader?importLoaders=2!resolve-url-loader!postcss-loader')
	},
	{
		test: /\.scss$/,
		loader: _extract('css-loader!resolve-url-loader!postcss-loader!sass-loader?sourceMap')
	},
	{
		test: /\.sass$/,
		loader: _extract('css-loader!resolve-url-loader!postcss-loader!sass-loader?sourceMap&indentedSyntax')
	}]
