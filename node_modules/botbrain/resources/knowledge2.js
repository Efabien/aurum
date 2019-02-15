module.exports = {
	keyWords: {
		'currency': {
			'BTC': [['bitcoin']],
			'ETH': [['ethereum'], ['ether']]
		}
	},

	intents: {
		'askRate': {
			'texts': ['what is the current rate of', 'at which rate is the', 'would like to know the rate of', 'give me the rate of'],
			'pondered': ['rate']
		},
		'askRelativeRate': {
			'texts': ['what is the current rate of compared to', 'what is the rate of vs', 'what is the rate of versus'],
			'pondered': ['vs', 'versus', 'compared']
		}
	}
}