function arrayContainsSum(array, sum) {

  for(let i = 0; i < array.length; i++) { // 1  n+1  n
    const element1 = array[i]; // n

    for (let ii = 0; ii < array.length; ii++) { // n   n=n^2  n^2
      const element2 = array[ii]; // n^2

      if (element1 + element2 === sum) { //n^2
        return true;
      }
    }
  }
  return false; // 1 
}
// run time: 3 + 5n + 4n^2