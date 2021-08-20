module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-strongly-recommended',
		'@vue/airbnb',
	],
	rules: {
		indent: [
			'error',
			'tab',
			{
				SwitchCase: 1,
			},
		],
		"no-unused-vars": ["warn", { "vars": "all", "args": "none", "ignoreRestSiblings": true }],
		'line-comment-position': [
			'error',
			{
				position: 'above',
			},
		],
		'lines-around-comment': [
			'error',
			{
				beforeBlockComment: true,
				beforeLineComment: true,
				allowBlockStart: true,
				allowObjectStart: true,
			},
		],
		'linebreak-style': [
			'error',
			'unix',
		],
		'multiline-comment-style': [
			'warn',
			'bare-block',
		],
		'class-methods-use-this': 'off',
		'radix': 'off',
		'no-tabs': 'off',
		'max-len': ['warn', { "code": 130 }],
		'vue/no-v-model-argument': 'off',
		'vue/html-self-closing': [
			'error',
			{
				html: {
					void: 'always',
					normal: 'never',
					component: 'always',
				},
			},
		],
		'vue/no-multi-spaces': 'error',
		'vue/html-indent': [
			'error',
			'tab',
			{
				baseIndent: 1,
			},
		],
		'no-plusplus': 0,
		'no-debugger': 1,
		'no-param-reassign': 0,
		'consistent-return': 0,
		curly: [2, 'all'],
		'brace-style': [2, '1tbs'],
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
};
