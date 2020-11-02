// setTimeout(() => {
//   console.log("4311o th3r3 w0r1d");
// }, 3000)

const words = "4311o th3r3 w0r1d".split(" ");
//console.log(words);

for (let i = 0; i < words.length; i++) {
  setTimeout(() => {
    console.log(words[i]);
  }, 1000 + (i * 1000))
}