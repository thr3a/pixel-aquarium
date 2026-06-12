// 魚のドット絵定義をPNGに書き出して目視確認するための開発用スクリプト
// 実行: node --import tsx ./src/scripts/renderFishPreview.ts
import { writeFileSync } from 'node:fs';
import { deflateSync } from 'node:zlib';
import { fishSpeciesList } from '../aquarium/pixelArt';

const makeCrc32 = (): ((buf: Uint8Array) => number) => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return (buf: Uint8Array): number => {
    let c = 0xffffffff;
    for (const b of buf) {
      c = table[(c ^ b) & 0xff] ^ (c >>> 8);
    }
    return (c ^ 0xffffffff) >>> 0;
  };
};

const crc32 = makeCrc32();

const chunk = (type: string, data: Uint8Array): Buffer => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), Buffer.from(data)]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
};

const encodePng = (width: number, height: number, rgba: Uint8Array): Buffer => {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ]);
};

const parseHex = (color: string): [number, number, number, number] => {
  const m = color.match(/^#([0-9a-f]{6})$/i);
  if (!m) return [255, 0, 255, 255];
  const v = Number.parseInt(m[1], 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff, 255];
};

const ZOOM = 6;
const PAD = 4;

const sheets = fishSpeciesList.map((species) => {
  const h = species.rows.length;
  const w = Math.max(...species.rows.map((row) => row.length));
  const lengths = new Set(species.rows.map((row) => row.length));
  if (lengths.size > 1) {
    console.warn(`[警告] ${species.name}: 行の長さが不揃いです -> ${species.rows.map((r) => r.length).join(',')}`);
  }
  return { species, w, h };
});

const sheetW = Math.max(...sheets.map((s) => s.w)) + PAD * 2;
const sheetH = sheets.reduce((acc, s) => acc + s.h + PAD, PAD);

const width = sheetW * ZOOM;
const height = sheetH * ZOOM;
const rgba = new Uint8Array(width * height * 4);

// 水中っぽい背景色で塗る
for (let i = 0; i < width * height; i++) {
  rgba[i * 4] = 0x2c;
  rgba[i * 4 + 1] = 0x83;
  rgba[i * 4 + 2] = 0xbc;
  rgba[i * 4 + 3] = 255;
}

const putPixel = (px: number, py: number, c: [number, number, number, number]): void => {
  for (let dy = 0; dy < ZOOM; dy++) {
    for (let dx = 0; dx < ZOOM; dx++) {
      const idx = ((py * ZOOM + dy) * width + px * ZOOM + dx) * 4;
      rgba[idx] = c[0];
      rgba[idx + 1] = c[1];
      rgba[idx + 2] = c[2];
      rgba[idx + 3] = c[3];
    }
  }
};

let offsetY = PAD;
for (const { species, h } of sheets) {
  species.rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = species.palette[ch];
      if (!color) return;
      putPixel(PAD + x, offsetY + y, parseHex(color));
    });
  });
  offsetY += h + PAD;
}

writeFileSync('fish-preview.png', encodePng(width, height, rgba));
console.log(`fish-preview.png を書き出しました (${width}x${height})`);
for (const { species, w, h } of sheets) {
  console.log(`- ${species.name}: ${w}x${h}`);
}
