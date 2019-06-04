// serverless-webpack allows you to build Lambda functions
// with webpack (so we can use ES6)
const slsw = require("serverless-webpack");
// nodeExternals defines modules that should not be bundled
const nodeExternals = require("webpack-node-externals");

module.exports = {
	// Allows the plugin to determine the correct handler entry
	// points at build time
	entry: slsw.lib.entries,
	target: "node",
	// Generate sourcemaps for proper error messages
	devtool: "source-map",
	// "aws-sdk" is not compatible with webpack, so exclude
	// all node dependencies
	externals: [nodeExternals()],
	mode: slsw.lib.webpack.isLocal ? "development" : "production",
	optimization: {
		minimize: false
	},
	performance: {
		hints: false
	},
	// Run babel on all .js files and skip those in node_modules
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				include: __dirname,
				exclude: /node_modules/
			}
		]
	}
};
