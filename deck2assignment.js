const fs = require('fs');
var decks = [
//    'MultiplyingNumbersInScientificNotation',
//    'DividingNumbersInScientificNotation',
    'SolvingEquationsReview',
//    'SystemsOfEquationsIntro',
//    'SystemsOfEquationsSubstitution'
//    'ComparingMeasurementsUsingScientificNotation',
//      'PythagoreanTheorem',
//    'EquationsOfLinesReview',
//    'SystemsOfEquationsIntro',
];

Promise.all(decks.map(async function(deck) {
  var assignmentAsset;
  //console.log(deck);
  //deckAsset = await assets.getAsset('slides/decks/'+deck+'.json', 'json');
  deckAsset = JSON.parse(fs.readFileSync('slides/decks/'+deck+'.json'));
  var tasks = {};
  var taskSources = [];
  var collection = deckAsset.collection;
  //console.log(deckAsset);
  for (var slide of deckAsset['slides']) {
    //slideAsset = await assets.getAsset('slides/slides/'+slide+'.html')
    slideAsset = fs.readFileSync('slides/slides/'+deckAsset.collection+'/'+slide+'.html', "utf8")
    task = {
        "onload": "MathJax.typeset();",
        "background_html": slideAsset,
        "resources": { "slide": "slides/"+collection+"/"+slide+".html" },
        "title": deck.split(/(?=[A-Z])/).join(" "),
    }
    tasks[slide[0]] = task; // I think this was used for some other purpose besides creating the task slides
    taskSources.push('snow-qm:'+collection+':'+slide[0]);
  }
  fs.writeFileSync('tasks/'+collection+".json", JSON.stringify(tasks, null, 4));
  assignmentAsset = taskSources;
  fs.writeFileSync('assignments/'+deck+".json", JSON.stringify(assignmentAsset, null, 4));
  return(assignmentAsset)
})).then(function(assignments) {
  console.log(assignments);
});
