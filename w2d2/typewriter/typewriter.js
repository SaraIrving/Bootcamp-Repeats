const sentence = "hello there from lighthouse labs";

for (let i = 0; i < sentence.length; i++) {

  if (i === sentence.length - 1) {
    setTimeout(() => {
      process.stdout.write(sentence[i] + "\n");
    }, 50 * i);
  } else {
    setTimeout(() => {
      process.stdout.write(sentence[i]);
    }, 50 * i);
  }
}
