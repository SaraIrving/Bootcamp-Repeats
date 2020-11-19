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

// The same array will run in n^2 time while the separate arrays will run in a * b time.

// Linear approach 
function linearArrayContainsSum(array, sum) {

  let i = 0;
  let ii = array.length - 1;

  while(i <= ii) {
    const element1 = array[i];
    const element2 = array[ii];
    const currentSum = element1 + element2 ;

    if(currentSum === sum) {
      return true;
    } else if (currentSum > sum) {
      ii--;
    } else {
      i++;
    }
  }
  return false;

}