import { Texture } from 'pixi.js';

// 文字列の行列(ドット絵マップ)とパレットから Pixi のテクスチャを生成する
// '.' とパレット未定義の文字は透明として扱う
export const createPixelTexture = (rows: string[], palette: Record<string, string>): Texture => {
  const height = rows.length;
  const width = Math.max(...rows.map((row) => row.length));
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Texture.WHITE;

  rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = palette[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });

  const texture = Texture.from(canvas);
  texture.source.scaleMode = 'nearest';
  return texture;
};

// 尾びれ部分(右端 tailCols 列)を 1px 下にずらした「尾を振った」フレームを作る
export const makeTailFlapRows = (rows: string[], tailCols: number): string[] => {
  const height = rows.length;
  const width = Math.max(...rows.map((row) => row.length));
  const grid = rows.map((row) => {
    const padded = row.padEnd(width, '.');
    return [...padded];
  });

  for (let x = width - tailCols; x < width; x++) {
    for (let y = height - 1; y >= 1; y--) {
      grid[y][x] = grid[y - 1][x];
    }
    grid[0][x] = '.';
  }

  return grid.map((row) => row.join(''));
};

// 砂地用のノイズテクスチャを生成する
export const createSandTexture = (width: number, height: number): Texture => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Texture.WHITE;

  const baseColors = ['#e8d49a', '#e0c98c', '#d9c184', '#ecdaa6'];
  const speckles = ['#c4a86a', '#f5e8c0', '#b89a5e'];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const r = Math.random();
      if (r < 0.06) {
        ctx.fillStyle = speckles[Math.floor(Math.random() * speckles.length)];
      } else {
        ctx.fillStyle = baseColors[Math.floor(Math.random() * baseColors.length)];
      }
      ctx.fillRect(x, y, 1, 1);
    }
  }

  const texture = Texture.from(canvas);
  texture.source.scaleMode = 'nearest';
  return texture;
};
