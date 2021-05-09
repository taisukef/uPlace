import { fix0 } from "https://code4sabae.github.io/js/fix0.js";

/*
uPlace
https://www.gsi.go.jp/sokuchikijun/uPlace.html

仕様書
https://ucopendb.gsi.go.jp/ucode/document/guideline.pdf
高精度30cm以下、中精度3m以下、低精度30m以下、精度不明

場所情報コード閲覧システム
https://ucopendb.gsi.go.jp/ucode/map.html
*/

const decode = (code) => {
  if (!code || typeof code != "string" || code.length != 32) {
    throw new Error("not a ucode (hex encoded 32byte str)");
  }
  const version = parseInt(code.substring(0, 1), 16);
  const tldcode = parseInt(code.substring(1, 1 + 4), 16);
  const classcode = parseInt(code.substring(1 + 4, 1 + 4 + 1), 16);
  const dc = parseInt(code.substring(1 + 4 + 1, 1 + 4 + 1 + 10), 16);
  const ic1 = parseInt(code.substring(1 + 4 + 1 + 10, 1 + 4 + 1 + 10 + 8), 16);
  const ic2 = parseInt(code.substring(1 + 4 + 1 + 10 + 8), 16);
  //console.log(version, tldcode, classcode, dc, ic1.toString(16), ic2.toString(16)); // .toString(16), ic)
  if (version != 0 || tldcode != 1 || classcode != 11 || dc != 3) {
    throw new Error("not a uPlace");
  }

  const type = ic1 >>> (62 - 32);
  if (type != 0) {
    throw new Error("only supported type is 0");
  }
  const south = (ic1 >> (61 - 32)) & 1;
  const latsec = (ic1 >> (1 + 23 + 8 + 1 + 6 - 32)) & 0x3fffff; // 22bit
  const west = (ic1 >> (23 + 8 + 1 + 6 - 32)) & 1;
  const lngsec = (((ic1 & 0x3f) << 17) | ((ic2 >>> (8 + 1 + 6)))) & 0x7fffff; // 23bit
  const levelx = (ic2 >> (1 + 6)) & 0xff;
  const level = levelx >= 0xfe ? levelx : levelx - 50;
  const levelmid = (ic2 >> 6) & 1;
  const serial = ic2 & 0x3f;
  const lat = latsec / (10 * 60 * 60) * (south ? -1 : 1);
  const lng = lngsec / (10 * 60 * 60) * (west ? -1 : 1);
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("out of the earth");
  }
  // console.log(type, south, latsec, lat, west, lngsec, lng, level, levelmid, serial);
  return { lat, lng, level, levelmid, serial };
};

const encode = (lat, lng, level = 0, levelmid = 0, serial = 0) => {
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error("out of the earth");
  }
  if (level != 0xff && level != 0xfe && (level < -50 || level > 0xfd - 50)) {
    throw new Error("unsupproted level");
  }
  if (levelmid != 0 && levelmid != 1) {
    throw new Error("unsupproted levelmid");
  }
  if (serial < 0 || serial >= (1 << 6)) {
    throw new Error("unsupproted serial");
  }
  const south = lat < 0;
  const west = lng < 0;
  const latsec = (Math.abs(lat) * (60 * 60 * 10)) & 0x3fffff; // 22bit
  const lngsec = (Math.abs(lng) * (60 * 60 * 10)) & 0x7fffff; // 23bit
  const l = level >= 0xfe ? level : level + 50;
  //console.log(latsec, lngsec, lngsec & 0x1ffff);
  const ic1 = ((south ? 1 : 0) << (61 - 32)) +
    (latsec << (1 + 23 + 8 + 1 + 6 - 32)) +
    ((west ? 1 : 0) << (23 + 8 + 1 + 6 - 32)) +
    (lngsec >> 17);
  const ic21 = (lngsec & 0x1ffff) >> 9;
  const ic22 = ((lngsec & 0x1ff) << (8 + 1 + 6)) +
    ((l & 0xff) << (1 + 6)) +
    ((levelmid & 1) << 6) +
    (serial & 0x3f);

  const res = "00001B0000000003" +
    fix0(ic1.toString(16), 8).toUpperCase() +
    fix0(ic21.toString(16), 2).toUpperCase() +
    fix0(ic22.toString(16), 6).toUpperCase();
  return res;
};

const uPlace = { encode, decode };
export { uPlace };
