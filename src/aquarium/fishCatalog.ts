import { type FishSpecies, fishSpeciesList } from './pixelArt';

// 魚種ごとの基本性格(速度・遊泳深度・臆病さ・食欲・旋回性能)
export type FishPersonality = {
  scale: number;
  speed: number;
  depthMin: number;
  depthMax: number;
  shyness: number;
  appetite: number;
  turnRate: number;
};

export type FishCatalogEntry = {
  species: FishSpecies;
  // 設定UIに表示する日本語名
  label: string;
  personality: FishPersonality;
};

// 魚種カタログ(同じ種を複数泳がせるときは、この性格に個体差の揺らぎを加える)
export const fishCatalog: FishCatalogEntry[] = [
  {
    species: fishSpeciesList[0],
    label: 'クマノミ',
    personality: { scale: 1.6, speed: 70, depthMin: 0.2, depthMax: 0.55, shyness: 1, appetite: 280, turnRate: 2.2 }
  },
  {
    species: fishSpeciesList[1],
    label: 'ナンヨウハギ',
    personality: { scale: 1.8, speed: 55, depthMin: 0.15, depthMax: 0.5, shyness: 0.8, appetite: 300, turnRate: 1.8 }
  },
  {
    species: fishSpeciesList[2],
    label: 'キイロハギ',
    personality: { scale: 1.7, speed: 40, depthMin: 0.35, depthMax: 0.75, shyness: 0.6, appetite: 260, turnRate: 1.4 }
  },
  {
    species: fishSpeciesList[3],
    label: 'ネオンテトラ',
    personality: { scale: 1.1, speed: 110, depthMin: 0.1, depthMax: 0.45, shyness: 1.6, appetite: 360, turnRate: 3.2 }
  },
  {
    species: fishSpeciesList[4],
    label: 'ベタ',
    personality: { scale: 1.7, speed: 45, depthMin: 0.3, depthMax: 0.7, shyness: 0.7, appetite: 240, turnRate: 1.5 }
  },
  {
    species: fishSpeciesList[5],
    label: '錦鯉',
    personality: { scale: 2, speed: 60, depthMin: 0.4, depthMax: 0.8, shyness: 0.9, appetite: 300, turnRate: 1.6 }
  },
  {
    species: fishSpeciesList[6],
    label: 'エンゼルフィッシュ',
    personality: { scale: 1.7, speed: 50, depthMin: 0.2, depthMax: 0.6, shyness: 0.9, appetite: 280, turnRate: 1.8 }
  },
  {
    species: fishSpeciesList[7],
    label: 'ブダイ',
    personality: { scale: 1.8, speed: 45, depthMin: 0.35, depthMax: 0.75, shyness: 0.6, appetite: 250, turnRate: 1.4 }
  },
  {
    species: fishSpeciesList[8],
    label: 'ツノダシ',
    personality: { scale: 1.7, speed: 55, depthMin: 0.15, depthMax: 0.55, shyness: 1.1, appetite: 290, turnRate: 2 }
  },
  {
    species: fishSpeciesList[9],
    label: 'ミントハギ',
    personality: { scale: 1.6, speed: 50, depthMin: 0.25, depthMax: 0.65, shyness: 0.8, appetite: 270, turnRate: 1.6 }
  },
  {
    species: fishSpeciesList[10],
    label: 'グッピー',
    personality: { scale: 1.1, speed: 95, depthMin: 0.1, depthMax: 0.4, shyness: 1.4, appetite: 340, turnRate: 3 }
  },
  {
    species: fishSpeciesList[11],
    label: 'ハナゴイ',
    personality: { scale: 1.3, speed: 80, depthMin: 0.2, depthMax: 0.5, shyness: 1.3, appetite: 320, turnRate: 2.6 }
  },
  {
    species: fishSpeciesList[12],
    label: 'レインボーフィッシュ',
    personality: { scale: 1.3, speed: 100, depthMin: 0.15, depthMax: 0.45, shyness: 1.5, appetite: 350, turnRate: 3 }
  },
  {
    species: fishSpeciesList[13],
    label: 'ブルーゴビー',
    personality: { scale: 1.4, speed: 65, depthMin: 0.55, depthMax: 0.85, shyness: 1, appetite: 300, turnRate: 2 }
  }
];
