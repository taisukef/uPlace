# uPlace
JavaScriptで実装した、場所情報コード、論理場所情報コード変換プログラム (ES module for web and Deno)  
[場所情報コード - 国土地理院](https://www.gsi.go.jp/sokuchikijun/uPlace.html)  

## usage
```JavaScript
import { uPlace } from "https://taisukef.github.io/uPlace/uPlace.js";

const pos = uPlace.decode("00001B000000000309DF3925687B1D00");
console.log(pos);

const code = uPlace.encode(35.942729, 136.198835, 8); // めがね会館8F
console.log(code);
```

## apps
緯度経度地図  
https://fukuno.jig.jp/app/map/latlng/  
