import * as t from "https://deno.land/std/testing/asserts.ts";
import { uPlace } from "./uPlace.js";

const chk = (code, poschk) => {
  const pos = uPlace.decode(code);
  //console.log(pos);
  t.assertEquals(pos, poschk);
  const code2 = uPlace.encode(
    pos.lat,
    pos.lng,
    pos.level,
    pos.levelmid,
    pos.serial,
  );
  t.assertEquals(code2, code);
};

Deno.test("encode / decode", () => {
  chk("00001B0000000003099BF424A8637FC1", {
    lat: 34.986,
    lng: 133.46683333333334,
    level: 255,
    levelmid: 1,
    serial: 1,
  });
});

Deno.test("west", () => {
  chk("00001B000000000313E252CB082C1980", {
    lat: 72.39569444444444,
    lng: -40.166,
    level: 1,
    levelmid: 0,
    serial: 0,
  });
});

Deno.test("undersea", () => {
  chk("00001B000000000313E252CB082C7F40", {
    lat: 72.39569444444444,
    lng: -40.166,
    level: 254,
    levelmid: 1,
    serial: 0,
  });
});
Deno.test("ground", () => {
  chk("00001B000000000313E252CB082C1900", {
    lat: 72.39569444444444,
    lng: -40.166,
    level: 0,
    levelmid: 0,
    serial: 0,
  });
});
Deno.test("1F", () => {
  chk("00001B000000000313E252CB082C1980", {
    lat: 72.39569444444444,
    lng: -40.166,
    level: 1,
    levelmid: 0,
    serial: 0,
  });
});
Deno.test("B1F", () => {
  chk("00001B000000000313E252CB082C1880", {
    lat: 72.39569444444444,
    lng: -40.166,
    level: -1,
    levelmid: 0,
    serial: 0,
  });
});
Deno.test("decode null", () => {
  t.assertThrows(() => uPlace.decode(null));
});
Deno.test("decode number", () => {
  t.assertThrows(() => uPlace.decode(3));
});
Deno.test("decode short", () => {
  t.assertThrows(() => uPlace.decode("001"));
});
Deno.test("decode not uPlace", () => {
  t.assertThrows(() => uPlace.decode("00001B000000000413E252CB082C1880"));
});
Deno.test("decode unsupported type", () => {
  t.assertThrows(() => uPlace.decode("00001B000000000393E252CB082C1880"));
});

Deno.test("encode 0, 0", () => {
  t.assertEquals(uPlace.encode(0, 0), "00001B00000000030000000000001900");
});
Deno.test("encode null", () => {
  t.assertEquals(uPlace.encode(null), "00001B00000000030000000000001900");
});
Deno.test("encode 100, 200", () => {
  t.assertThrows(() => uPlace.encode(100, 200));
});
Deno.test("decode 100, 200", () => {
  t.assertThrows(() => uPlace.decode("00001B00000000031B774036EE801900"));
});
/*
> (1<<22)/(10*60*60) // 22bit
116.50844444444444
> (1<<23)/(10*60*60) // 23bit
233.0168888888889
*/
Deno.test("encode level=256", () => {
  t.assertThrows(() => uPlace.encode(0, 0, 256));
});
Deno.test("encode level=255", () => {
  const level = 255;
  const code = uPlace.encode(0, 0, level);
  t.assertEquals(uPlace.decode(code).level, level);
});
Deno.test("encode level=254", () => {
  const level = 254;
  const code = uPlace.encode(0, 0, level);
  t.assertEquals(uPlace.decode(code).level, level);
});
Deno.test("encode level=0", () => {
  const level = 0;
  const code = uPlace.encode(0, 0, level);
  t.assertEquals(uPlace.decode(code).level, level);
});
Deno.test("encode level=-50", () => {
  const level = -50;
  const code = uPlace.encode(0, 0, level);
  t.assertEquals(uPlace.decode(code).level, level);
});
Deno.test("encode level=203", () => {
  const level = 203;
  const code = uPlace.encode(0, 0, level);
  t.assertEquals(uPlace.decode(code).level, level);
});
Deno.test("encode level=-51", () => {
  t.assertThrows(() => uPlace.encode(0, 0, -51));
});
Deno.test("encode level=204", () => {
  t.assertThrows(() => uPlace.encode(0, 0, 204));
});
Deno.test("encode levelmid=2", () => {
  t.assertThrows(() => uPlace.encode(0, 0, 0, 2));
});
Deno.test("encode levelmid=-1", () => {
  t.assertThrows(() => uPlace.encode(0, 0, 0, -1));
});
Deno.test("encode levelmid=0", () => {
  const code = uPlace.encode(0, 0, 0, 0);
  t.assertEquals(uPlace.decode(code).levelmid, 0);
});
Deno.test("encode levelmid=1", () => {
  const code = uPlace.encode(0, 0, 0, 1);
  t.assertEquals(uPlace.decode(code).levelmid, 1);
});
