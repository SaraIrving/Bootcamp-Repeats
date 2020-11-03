const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let answers = [];



rl.question("What's your nickname? ", (answer) => {
  answers.push(answer);

  rl.question("What activity do you like? ", (answer) => {
    answers.push(answer);

    console.log(`Your name is: ${answers[0]} and you like ${answers[1]}!`)
    rl.close();
  })
});

  

