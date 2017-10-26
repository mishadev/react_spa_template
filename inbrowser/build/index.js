var debug = require('debug')('inbrowser:build');

function startServer(config) {
	var path = require('path');
	var express = require('express');
	var morgan = require('morgan');

	var app = express();

	// NOTE: will log requests
	app.use(morgan('dev'));
	app.use(express.static(path.dirname(config.outputPath)));

	app.listen(config.port, function (err) {
		if (err) {
			debug(err);
			return;
		}
		debug("==============================");
		debug('Listening at http://localhost:' + config.port);
		debug("==============================");
	});
}

function webpackLogging(err, stats) {
	if (err) {
		console.error(err);
	} else {
		debug(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}));
	}
}

function startBuilder(config) {
	var webpack = require('webpack');

	var webpackConfig = require(config.webpackConfigPath);
	var compiler = webpack(webpackConfig);
	if (config.watchFiles) {
		compiler.watch({
			aggregateTimeout: 300,
			poll: true
		}, webpackLogging);

		debug("==============================");
		debug("Watch files and rebuild on each change...");
		debug("==============================");
	} else {
		compiler.run(webpackLogging);
	}

	debug("==============================");
	debug("Building application...");
	debug("==============================");
}

var buildConfig = require('./config');
startBuilder(buildConfig);
if (buildConfig.selfhostApplication) startServer(buildConfig);

