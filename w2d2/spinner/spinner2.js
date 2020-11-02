
const makeSpinner = () => {
  let animationStages = ['\r|   ', '\r/   ', '\r-   ', '\r\\   ', '\r|   ', '\r/   ', '\r-   ', '\r\\   ', '\r|   '];

  let interval = 100;

  for (let i = 0; i < animationStages.length; i++) {
    setTimeout(() => {
      process.stdout.write(animationStages[i]);
      
    }, interval += 200);
  }

};

makeSpinner();