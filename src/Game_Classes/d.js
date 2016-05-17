function d(dice, type, x) {
  //  console.log("---------------------------------------");
  //  console.log("Rolling " + this + "d" + num);
  let ifZero = 1;
  type === 0 ? ifZero = 0 : ifZero = 1;
  let output = 0;
  for (let i = 0; i < dice; i++) {
    console.log(`Rolling ${dice}d${type}`);
    const roll = Math.floor((Math.random() * type) + 1);
    output += roll * (ifZero);
    if (x && roll === type) {
      console.log('The die explodes!');
      output += d(1, type, 1) * (ifZero);
    }
  }
  return output;
};

export default d;
