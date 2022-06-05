export const random_even_number_in_range = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    let randomNum = Math.floor(Math.random() * (max - min + 1)) + min;

    if (randomNum % 2 !== 0) {
        if (randomNum === max) {
          randomNum -= 1
        } else {
          randomNum += 1
        }
      }
    
      return randomNum
}

export const random_odd_number = (max) => { 
    max -= 1

    let rand_num = Math.floor(Math.random() * (max / 2)) + 
                   Math.floor(Math.random() * (max / 2))

    if (rand_num % 2 === 0) {
        if (rand_num === max) {
            rand_num -= 1
        } else {
            rand_num += 1
        }
    }

    return rand_num

}

export const generate_random_num_in_range = (min=0, max=50) => {

  // find diff
  let difference = max - min;

  // generate random number 
  let rand = Math.random();

  // multiply with difference 
  rand = Math.floor( rand * difference);

  // add with min value 
  rand = rand + min;

  return rand;
}