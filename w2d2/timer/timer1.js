

let input = process.argv.slice(2);

for (let i = 0; i < input.length; i++) {
  let alarm = parseInt(input[i]);


  if (alarm >= 0 && typeof alarm === "number") {

    setTimeout(() => {
      process.stdout.write('\x07');
      
    }, alarm * 1000);

  }
  
}