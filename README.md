# uPlace
JavaScriptで実装した、場所情報コード、論理場所情報コード変換プログラム (ES module for web and Deno)

## usage
```JavaScript
import { uPlace } from "https://taisukef.github.io/uPlace/uPlace.js";

const pos = uPlace.decode("00001B000000000309DF3925687B1D00");
console.log(pos);

const code = uPlace.encode(35.942729, 136.198835, 8); // めがね会館8F
console.log(code);
```
