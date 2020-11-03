const fs = require('fs');

const returnWhenDone = function (data) {
  return console.log(data);
}

const breedDetailsFromFile = function(breed, callbackFunction) {
  console.log("breedDetailsFromFile: Calling readFile...");
  fs.readFile(`./data/${breed}.txt`, 'utf8', (error, data) => {
    console.log('In readFile\'s Callback: it has the data');
    if (!error) return callbackFunction(data);
  });
};

const bombay = breedDetailsFromFile("Bombay", returnWhenDone);
