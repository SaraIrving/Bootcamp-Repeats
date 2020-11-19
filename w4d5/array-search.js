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
