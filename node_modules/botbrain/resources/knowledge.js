module.exports= {
  keyWords:{
    'money':{
      'USD':[['dollar'],['dollar','américain']],
      'HZR':[['dollar','de','singapour']],
      'EUR':[['euro'],['eur']]
    },
    'action':{
      'licenceBadjage':[['licence','de','badjage'],['licence','badjage'],['papiers','de','badjage']]
    },
    'theme':{
      'économie':[['économie'],['économique'],['finance'],['éco']],
      'politique':[['politique']],
      'sport':[['sport']]
    }
  },
  intents:{
    'greating':{
      'texts':[' bonjour',' salut ',' hello',' yo',' hey',' hi',' bonjour bot',' coucou',' salutation']
    },
    'ask_price':{
      'texts':['Pourrais - je avoir les prix ?','Donnez moi les prix','Je souhaiterai avoir les prix',
      'prix','Combien ça coûte?','Donne moi les tarifs','Je voudrai avoir les tarifs','quel est le prix',
      'à combien est','combien on paye','à combien revien','combien on doit  payer pour ?'],
      'pondered':['prix','tarif','paye']
    },
    'ask_proccess':{
      'texts':['comment fait t on pour faire ?','qu est ce qu on doit faire pour ?','quelle est la marche à suivre pour','qu est ce que je dois faire pour',
      'quelle est la procédure pour'],
      'pondered':['procédure','démarche']
    },
    'general_inquery':{
      'texts':['je voudrais avoir une information','peux tu m aider','tu pourrais me fournir une information ?','je souhaiterai demander quelque chose'],
      'exclude':['ask_news']
    },
    'ask_news':{
      'texts':['Quelles sont les dernière nouvelles sur','Donne moi des news','que se passe t il en ','je voudrais avoir les nouvelles sur'],
      'exclude':['general_inquery'],
      'pondered':['news','nouvelles']
    }
  }
 }