import { uPlace } from "./uPlace.js";

const code = "00001B0000000003099BF424A8637FC1";
const pos = uPlace.decode(code);
console.log(pos);
const code2 = uPlace.encode(
  pos.lat,
  pos.lng,
  pos.level,
  pos.levelmid,
  pos.serial,
);
console.log(code2);
console.log(code2 == code);
