// 魚や装飾物のドット絵マップ定義(頭は左向きで描く)

export type FishSpecies = {
  name: string;
  rows: string[];
  palette: Record<string, string>;
  tailCols: number;
};

// クマノミ(オレンジに白帯)
const clownfish: FishSpecies = {
  name: 'clownfish',
  rows: [
    '......KKKK......',
    '....KOOWWOK.....',
    '...KOOWWWOOK.O..',
    '..KOEOWWWOOOKOO.',
    '.KOOOOWWWOOWKOOO',
    '..KOEOWWWOOOKOO.',
    '...KOOWWWOOK.O..',
    '....KOOWWOK.....',
    '......KKKK......'
  ],
  palette: {
    O: '#f97f2a',
    W: '#ffffff',
    K: '#2b2118',
    E: '#1a1a1a'
  },
  tailCols: 3
};

// ナンヨウハギ(青い体に黄色い尾)
const blueTang: FishSpecies = {
  name: 'blueTang',
  rows: [
    '.....NNNNNN.....',
    '...NBBBBBBBN....',
    '..NBEBBBNNBBN.Y.',
    '.NBBBBBBBNNBNYY.',
    '.NBBBBBBBBNNNYYY',
    '.NBBBBBBBNNBNYY.',
    '..NBEBBBNNBBN.Y.',
    '...NBBBBBBBN....',
    '.....NNNNNN.....'
  ],
  palette: {
    B: '#2a7fe8',
    N: '#143a8c',
    Y: '#ffd23a',
    E: '#0d0d20'
  },
  tailCols: 3
};

// キイロハギ風(縦に大きいひし形)
const yellowAngel: FishSpecies = {
  name: 'yellowAngel',
  rows: [
    '......Y.....',
    '.....YYY..Y.',
    '....YYYYY.YY',
    '..DYYYYYYYYY',
    '.YEYYYYYDYYY',
    '.YYYYYYYYDYY',
    '..DYYYYYYYYY',
    '....YYYYY.YY',
    '.....YYY..Y.',
    '......Y.....'
  ],
  palette: {
    Y: '#ffd91f',
    D: '#c79a00',
    E: '#1a1a1a'
  },
  tailCols: 2
};

// ネオンテトラ(小さくて青と赤のライン)
const neonTetra: FishSpecies = {
  name: 'neonTetra',
  rows: ['....SSSS....', '..CCCCCCCS..', '.SECCCCCCCSS', '.SRRRRRRRSS.', '..SRRRRRS.S.', '....SSS.....'],
  palette: {
    C: '#3fd9e8',
    R: '#e8413a',
    S: '#cfd8dc',
    E: '#10202a'
  },
  tailCols: 2
};

// ベタ(紫の体に大きなマゼンタの尾)
const betta: FishSpecies = {
  name: 'betta',
  rows: [
    '......PPP..M....',
    '....PPPPPP.MMM..',
    '...PEPPPPPMMMMM.',
    '..PPPPPPPPMMMMMM',
    '..PPPPPPPPMMMMMM',
    '...PPPPPPPMMMMM.',
    '....PPPPPP.MMM..',
    '......PPP..M....'
  ],
  palette: {
    P: '#7a4fd0',
    M: '#e056b8',
    E: '#1a1030'
  },
  tailCols: 4
};

// 紅白の錦鯉風(白地に赤い模様)
const koi: FishSpecies = {
  name: 'koi',
  rows: [
    '......RRRR......',
    '....RWWWWRR.....',
    '...WWRWWWWWW.R..',
    '..GWWWWRRWWWRRR.',
    '.WWEWWWWWWWWWRRR',
    '..GWWWWRRWWWRRR.',
    '...WWRWWWWWW.R..',
    '....RWWWWRR.....'
  ],
  palette: {
    W: '#f8f4ec',
    R: '#e23d2e',
    G: '#c9c2b4',
    E: '#1a1a1a'
  },
  tailCols: 3
};

export const fishSpeciesList: FishSpecies[] = [clownfish, blueTang, yellowAngel, neonTetra, betta, koi];

export type DecorArt = {
  rows: string[];
  palette: Record<string, string>;
};

export const rockArt: DecorArt = {
  rows: [
    '.....GGGGGG.....',
    '...GGGLLGGGGG...',
    '..GGLLGGGGGGGG..',
    '.GGGGGGGGGLLGG..',
    '.GGGGGGGGGGGGGG.',
    'GGDGGGGGGGGGGDGG',
    'GDDDGGGGGGGDDDDG'
  ],
  palette: {
    G: '#6f7a85',
    L: '#9aa6b2',
    D: '#48515c'
  }
};

export const coralArt: DecorArt = {
  rows: [
    '..P...P...P.',
    '..P..PP..PP.',
    '.PP..P..PP..',
    '..PP.P.PP...',
    '...PPPPP....',
    '....PPP.....',
    '....PPP.....'
  ],
  palette: {
    P: '#f06a9a'
  }
};

export const coralOrangeArt: DecorArt = {
  rows: ['.O..O..O.', '.O..O..O.', '.OO.O.OO.', '..OOOOO..', '...OOO...'],
  palette: {
    O: '#f0904a'
  }
};

// 水草の葉セグメント(左右交互に重ねて1本の水草にする)
export const leafLeftArt: DecorArt = {
  rows: ['GG..', 'GGG.', '.GGG'],
  palette: { G: '#3fae5a' }
};

export const leafRightArt: DecorArt = {
  rows: ['..GG', '.GGG', 'GGG.'],
  palette: { G: '#2f8e4a' }
};

export const leafLeftDarkArt: DecorArt = {
  rows: ['GG..', 'GGG.', '.GGG'],
  palette: { G: '#1f6e3a' }
};

export const leafRightDarkArt: DecorArt = {
  rows: ['..GG', '.GGG', 'GGG.'],
  palette: { G: '#196033' }
};

export const bubbleArt: DecorArt = {
  rows: ['.WW.', 'WL.W', 'W..W', '.WW.'],
  palette: {
    W: 'rgba(220,245,255,0.85)',
    L: 'rgba(255,255,255,0.95)'
  }
};

export const bubbleSmallArt: DecorArt = {
  rows: ['.W.', 'W.W', '.W.'],
  palette: {
    W: 'rgba(220,245,255,0.8)'
  }
};

export const foodArt: DecorArt = {
  rows: ['BO', 'OB'],
  palette: {
    O: '#d8893a',
    B: '#a8642a'
  }
};
