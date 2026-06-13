import type { FishSpecies } from './pixelArt';

export type FishPreview = {
  url: string;
  width: number;
  height: number;
};

// 設定UI用に魚のドット絵を dataURL 化する(等倍で描き、表示サイズは別途返す)
export const createFishPreview = (species: FishSpecies): FishPreview => {
  const height = species.rows.length;
  const width = Math.max(...species.rows.map((row) => row.length));
  // pixelScale を掛けて、高解像度ドット絵も水槽内と同じ相対サイズで見せる
  const displayScale = 3 * species.pixelScale;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return { url: '', width: width * displayScale, height: height * displayScale };

  species.rows.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      const color = species.palette[ch];
      if (!color) return;
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 1, 1);
    });
  });

  return { url: canvas.toDataURL(), width: width * displayScale, height: height * displayScale };
};
