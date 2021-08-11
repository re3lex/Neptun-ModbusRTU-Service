module.exports = {
	configureWebpack: {
		devtool: 'source-map',
	},

	// outputDir: 'dist/frontEnd',
	productionSourceMap: false,

	pluginOptions: {
		// Required for plugin. Does nothing if not entered
		sourceDir: 'frontEndSrc',
	},
};
