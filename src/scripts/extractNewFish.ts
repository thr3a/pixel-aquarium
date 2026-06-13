// new.png から魚ごとのドット格子を推定し、FishSpecies 形式の rows / palette を生成する開発用スクリプト
// 抽出結果の目視確認用に extracted-preview.png も書き出す
// 実行: node --import tsx ./src/scripts/extractNewFish.ts > /tmp/newFish.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const png = PNG.sync.read(readFileSync('new.png'));
const { width, height, data } = png;

type Rgba = [number, number, number, number];

const colorAt = (x: number, y: number): Rgba => {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2], data[i + 3]];
};

const dist = (a: Rgba, b: Rgba): number =>
  Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) + Math.abs(a[3] - b[3]);

// --- 連結成分で魚の外接矩形を求める ---
const labels = new Int32Array(width * height).fill(-1);
type Box = { minX: number; minY: number; maxX: number; maxY: number; count: number };
const boxes: Box[] = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (colorAt(x, y)[3] < 32 || labels[y * width + x] >= 0) continue;
    const label = boxes.length;
    const box: Box = { minX: x, minY: y, maxX: x, maxY: y, count: 0 };
    const stack = [y * width + x];
    labels[y * width + x] = label;
    while (stack.length > 0) {
      const idx = stack.pop();
      if (idx === undefined) break;
      const cx = idx % width;
      const cy = (idx - cx) / width;
      box.count++;
      box.minX = Math.min(box.minX, cx);
      box.maxX = Math.max(box.maxX, cx);
      box.minY = Math.min(box.minY, cy);
      box.maxY = Math.max(box.maxY, cy);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const nidx = ny * width + nx;
          if (colorAt(nx, ny)[3] < 32 || labels[nidx] >= 0) continue;
          labels[nidx] = label;
          stack.push(nidx);
        }
      }
    }
    boxes.push(box);
  }
}
const fishBoxes = boxes.filter((b) => b.count > 500).sort((a, b) => a.minY - b.minY || a.minX - b.minX);

// --- 格子ピッチ推定: 強エッジ位置が格子線に集まるピッチ・オフセットを探す ---
const estimateGrid = (edges: number[], min: number, max: number): { pitch: number; offset: number; cells: number } => {
  let best = { pitch: 7.5, offset: 0, score: -1 };
  for (let pitch = 6; pitch <= 9.5; pitch += 0.01) {
    // 円周統計でエッジ位置 mod pitch の集中度を測る
    let sx = 0;
    let sy = 0;
    for (const e of edges) {
      const theta = ((e % pitch) / pitch) * Math.PI * 2;
      sx += Math.cos(theta);
      sy += Math.sin(theta);
    }
    const score = Math.hypot(sx, sy) / edges.length;
    if (score <= best.score) continue;
    const offset = ((Math.atan2(sy, sx) / (Math.PI * 2)) * pitch + pitch) % pitch;
    best = { pitch, offset, score };
  }
  const start = best.offset + Math.floor((min - best.offset) / best.pitch) * best.pitch;
  const cells = Math.ceil((max + 1 - start) / best.pitch);
  return { pitch: best.pitch, offset: start, cells };
};

// --- 色のクラスタリング(出現数の多い色を代表にした貪欲法) ---
const PALETTE_CHARS = [
  'A',
  'B',
  'C',
  'D',
  'F',
  'G',
  'H',
  'I',
  'J',
  'L',
  'M',
  'N',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c'
];

const toHex = (c: Rgba): string =>
  `#${c[0].toString(16).padStart(2, '0')}${c[1].toString(16).padStart(2, '0')}${c[2].toString(16).padStart(2, '0')}`;

const extracted: { rows: string[]; palette: Record<string, Rgba> }[] = [];

for (const [fi, box] of fishBoxes.entries()) {
  // エッジ収集
  const xEdges: number[] = [];
  const yEdges: number[] = [];
  for (let y = box.minY; y <= box.maxY; y++) {
    for (let x = box.minX + 1; x <= box.maxX; x++) {
      if (dist(colorAt(x - 1, y), colorAt(x, y)) >= 150) xEdges.push(x);
    }
  }
  for (let x = box.minX; x <= box.maxX; x++) {
    for (let y = box.minY + 1; y <= box.maxY; y++) {
      if (dist(colorAt(x, y - 1), colorAt(x, y)) >= 150) yEdges.push(y);
    }
  }
  const gx = estimateGrid(xEdges, box.minX, box.maxX);
  const gy = estimateGrid(yEdges, box.minY, box.maxY);

  // 各セルの代表色(セル中央域の多数決)を取る
  const cellColors: (Rgba | null)[][] = [];
  for (let cy = 0; cy < gy.cells; cy++) {
    const row: (Rgba | null)[] = [];
    for (let cx = 0; cx < gx.cells; cx++) {
      const x0 = gx.offset + cx * gx.pitch;
      const y0 = gy.offset + cy * gy.pitch;
      const samples: Rgba[] = [];
      let total = 0;
      for (let sy = 0.25; sy <= 0.75; sy += 0.25) {
        for (let sx = 0.25; sx <= 0.75; sx += 0.25) {
          const px = Math.round(x0 + gx.pitch * sx);
          const py = Math.round(y0 + gy.pitch * sy);
          if (px < 0 || py < 0 || px >= width || py >= height) continue;
          total++;
          const c = colorAt(px, py);
          if (c[3] >= 128) samples.push(c);
        }
      }
      if (samples.length === 0 || samples.length < total / 2) {
        row.push(null);
        continue;
      }
      // 多数決: 互いに近い色をまとめて最大グループの平均
      const groups: { sum: [number, number, number]; n: number; rep: Rgba }[] = [];
      for (const s of samples) {
        const g = groups.find((gr) => dist(gr.rep, s) < 90);
        if (g) {
          g.sum[0] += s[0];
          g.sum[1] += s[1];
          g.sum[2] += s[2];
          g.n++;
          continue;
        }
        groups.push({ sum: [s[0], s[1], s[2]], n: 1, rep: s });
      }
      groups.sort((a, b) => b.n - a.n);
      const g = groups[0];
      row.push([Math.round(g.sum[0] / g.n), Math.round(g.sum[1] / g.n), Math.round(g.sum[2] / g.n), 255]);
    }
    cellColors.push(row);
  }

  // 魚単位でパレットをクラスタリング
  const clusters: { sum: [number, number, number]; n: number; rep: Rgba }[] = [];
  for (const row of cellColors) {
    for (const c of row) {
      if (!c) continue;
      const g = clusters.find((cl) => dist(cl.rep, c) < 70);
      if (g) {
        g.sum[0] += c[0];
        g.sum[1] += c[1];
        g.sum[2] += c[2];
        g.n++;
        continue;
      }
      clusters.push({ sum: [c[0], c[1], c[2]], n: 1, rep: c });
    }
  }
  clusters.sort((a, b) => b.n - a.n);

  // 出現数の少ないノイズ色は、十分近い主要色があればそちらへ統合する
  // (目のハイライトのようにどの主要色からも遠い少数色はそのまま残す)
  const major = clusters.filter((cl) => cl.n >= 4);
  const kept = clusters.filter((cl) => {
    if (cl.n >= 4) return true;
    const nearest = major.reduce((acc, m) => Math.min(acc, dist(m.rep, cl.rep)), Number.POSITIVE_INFINITY);
    return nearest >= 170;
  });

  // 既存定義の慣習に合わせて、最も暗い主要色(輪郭)に 'K' を割り当てる
  const luminance = (cl: (typeof clusters)[number]): number => cl.sum[0] / cl.n + cl.sum[1] / cl.n + cl.sum[2] / cl.n;
  const outline = kept.reduce((acc, cl) => (cl.n >= 10 && luminance(cl) < luminance(acc) ? cl : acc), kept[0]);
  let charIdx = 0;
  const palette = kept.map((cl) => ({
    char: cl === outline ? 'K' : (PALETTE_CHARS[charIdx++] ?? '?'),
    color: [
      Math.round(cl.sum[0] / cl.n),
      Math.round(cl.sum[1] / cl.n),
      Math.round(cl.sum[2] / cl.n),
      255
    ] satisfies Rgba
  }));

  const rows = cellColors.map((row) =>
    row
      .map((c) => {
        if (!c) return '.';
        let bestIdx = 0;
        let bestD = Number.POSITIVE_INFINITY;
        palette.forEach((p, i) => {
          const d = dist(p.color, c);
          if (d >= bestD) return;
          bestD = d;
          bestIdx = i;
        });
        return palette[bestIdx].char;
      })
      .join('')
  );

  // 空行・空列を刈り取る
  const trimmed = rows.filter((r) => /[^.]/.test(r));
  const left = Math.min(...trimmed.map((r) => r.search(/[^.]/)));
  const right = Math.max(...trimmed.map((r) => r.length - 1 - [...r].reverse().join('').search(/[^.]/)));
  const finalRows = trimmed.map((r) => r.slice(left, right + 1));

  console.log(
    `// --- fish${fi} bbox(${box.minX},${box.minY}) pitch x=${gx.pitch.toFixed(2)} y=${gy.pitch.toFixed(2)} grid ${finalRows[0]?.length}x${finalRows.length}`
  );
  console.log(`const fish${fi}: FishSpecies = {`);
  console.log(`  name: 'fish${fi}',`);
  console.log('  rows: [');
  console.log(finalRows.map((r) => `    '${r}'`).join(',\n'));
  console.log('  ],');
  console.log('  palette: {');
  console.log(palette.map((p, i) => `    ${p.char}: '${toHex(p.color)}' /* n=${kept[i].n} */`).join(',\n'));
  console.log('  },');
  console.log('  tailCols: 6,');
  console.log('  pixelScale: 0.5');
  console.log('};');
  console.log('');

  const paletteMap: Record<string, Rgba> = {};
  for (const p of palette) paletteMap[p.char] = p.color;
  extracted.push({ rows: finalRows, palette: paletteMap });
}

// --- 抽出結果を拡大描画して PNG に書き出す(目視確認用) ---
const ZOOM = 8;
const PAD = 3;
const outW = (Math.max(...extracted.map((e) => Math.max(...e.rows.map((r) => r.length)))) + PAD * 2) * ZOOM;
const outH = extracted.reduce((acc, e) => acc + e.rows.length + PAD, PAD) * ZOOM;
const out = new PNG({ width: outW, height: outH });
for (let i = 0; i < outW * outH; i++) {
  out.data[i * 4] = 0x2c;
  out.data[i * 4 + 1] = 0x83;
  out.data[i * 4 + 2] = 0xbc;
  out.data[i * 4 + 3] = 255;
}
let offY = PAD;
for (const e of extracted) {
  e.rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const c = e.palette[ch];
      if (!c) return;
      for (let dy = 0; dy < ZOOM; dy++) {
        for (let dx = 0; dx < ZOOM; dx++) {
          const idx = (((offY + y) * ZOOM + dy) * outW + (PAD + x) * ZOOM + dx) * 4;
          out.data[idx] = c[0];
          out.data[idx + 1] = c[1];
          out.data[idx + 2] = c[2];
          out.data[idx + 3] = 255;
        }
      }
    });
  });
  offY += e.rows.length + PAD;
}
writeFileSync('extracted-preview.png', PNG.sync.write(out));
console.error(`extracted-preview.png を書き出しました (${outW}x${outH})`);
