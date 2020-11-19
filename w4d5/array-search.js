// linear search function 

function search(array, item) {
  let index = null;

  for(let i = 0; i < array.length; i++) {
    if(item === array[i]) {
      index = i;
      break;
    }
  }

  return index;
}

// worst case scenario here is 3n + 4

console.log(search([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], -1));

// refactor above code to make a binary search
function binarySearch(array, item) {
  let min = 0;
  let max = array.length - 1;


  while(true) {
    let currentMid = Math.floor((min + max) / 2);
    let currentItem = array[currentMid];

    if (currentItem === item) {
      return currentMid;
    }

    if (currentItem > item) {
      max = currentMid - 1;
    }

    if (currentItem < item) {
      min = currentMid + 1;
    }

    if(max < min) {
      return null;
    }
  }
}