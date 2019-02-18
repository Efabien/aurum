module.exports = {
	keyWords: {
		'currency': {
			'BTC': [['bitcoin']],
			'ETH': [['ethereum'], ['ether']],
			'EUR': [['euro'], ['eur'], ['l\'euro'], ['€']],
			'MGA': [['ariary'], ['franc malgache'], ['Ar'], ['MGA']],
			'XOF': [['franc cfa'], ['cfa'], ['CFA'], ['XOF'], ['xof']]
		}
	},

	intents: {
		'askRate': {
			'texts': ['donne moi le cours', 'quel est le cour sur le marché',],
			'pondered': ['rate', 'cours']
		},
		'askRelativeRate': {
			'texts': ['what is the current rate of compared to', 'what is the rate of vs', 'what is the rate of versus'],
			'pondered': ['vs', 'versus', 'compared']
		},
		'askTodaysSellsByMArket': {
			'texts': ['donne moi les quantités vendu sur le marché en', 'combien ont été vendu sur le marché de', 'donne moi le volume des vente sur le marché en'],
			'pondered': ['vendu', 'marché', 'volume', 'ventes']
		}
	}
}