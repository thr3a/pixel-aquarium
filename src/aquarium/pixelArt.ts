// 魚や装飾物のドット絵マップ定義(頭は左向きで描く)

export type FishSpecies = {
  name: string;
  rows: string[];
  palette: Record<string, string>;
  tailCols: number;
  // ドット密度の補正係数(高解像度ドット絵を従来と同じ画面サイズで表示するための倍率)
  pixelScale: number;
};

// クマノミ(オレンジに白帯)
const clownfish: FishSpecies = {
  name: 'clownfish',
  rows: [
    '..........KOOOOK................',
    '.........KoooooK................',
    '......KKKWWWKooKKK..........KK..',
    '....KKooKWWWKOOKWWKK.......KOOK.',
    '...KWEOOKWWWKOOKWWWKK.....KOOOOK',
    '..KOEEOOKWWWKOOKWWWKOK....KOOOOK',
    '.KOOOOOOKWWWKOOKWWWKOOKKKKOOOOK.',
    'KoOOOOOOKWWWKOOKWWWKOOKWWKOOOK..',
    'KOOOOOOOKWWWKOOKWWWKOOKWWKOOOK..',
    '.KddddddKwwwKddKwwwKddKKKKddddK.',
    '..KdddddKwwwKddKwwwKdK....KddddK',
    '...KddddKwwwKddKwwwKK.....KddddK',
    '....KKddKwwwKddKwwKK.......KddK.',
    '......KKKwwwKddKKK..........KK..',
    '.........KKKKKK.................',
    '..........KdK...................'
  ],
  palette: {
    O: '#f4772b',
    o: '#ffa14f',
    d: '#d35f1c',
    W: '#ffffff',
    w: '#cfdde4',
    K: '#26190e',
    E: '#141414'
  },
  tailCols: 7,
  pixelScale: 0.5
};

// ナンヨウハギ(青い体に黒の模様と黄色い尾)
const blueTang: FishSpecies = {
  name: 'blueTang',
  rows: [
    '.........KnnnnnnnnK.............',
    '.........KnnnnnnnK..............',
    '.......KKKbbbbbbbKK..........KK.',
    '.....KKbbBBBBBBBBBBKK......KKYYK',
    '....KEEBBBMMMMMMMMMBBK....KYYYYK',
    '...KBEEBBBMMMMMMMMMBBBK..KYYYYYK',
    '..KBBBBBBBBBBBBBMMMMMMMKKYYYYYYK',
    '.KBBBBBBBBBBBBBBBBMMMMMMKYYYYYYK',
    '.KBBBBBBBBBBBBBBBBBBMMMMKYYYYYYK',
    '..KBBBBBBBBBBBBBBBBBBBBKKYYYYYYK',
    '...KnnnnnnnnnnnnnnnnnnK..KYYYYYK',
    '....KnnnnnnnnnnnnnnnnK....KyyyyK',
    '.....KKnnnnnnnnnnnnKK......KKyy.',
    '.......KKKnnnnnnnKK..........KK.',
    '..........KMMMMMK...............',
    '...........KMMK.................'
  ],
  palette: {
    B: '#2f7fe6',
    b: '#5fa8f0',
    n: '#1d4fae',
    M: '#10142e',
    Y: '#ffd23a',
    y: '#c79f17',
    K: '#0a1026',
    E: '#05060f'
  },
  tailCols: 7,
  pixelScale: 0.5
};

// キイロハギ(縦に大きいひし形)
const yellowAngel: FishSpecies = {
  name: 'yellowAngel',
  rows: [
    '.........KKKKKK...........',
    '........KyyyyyyK..........',
    '.......KyyyyyyyyK.........',
    '......KyyYYYYYYYyK........',
    '.....KyyYYYYYYYYYyK.......',
    '.....KYYYYYYYYYYYYK.......',
    '....KYWEYYYYYYYYYYYK......',
    '...KYYEEYYYYYYYYYYYK.KKKK.',
    '..KYYYYYYYYYYYYYYYYK.KYYYK',
    '.KYYYYYYYYYYYYYYYYYWYYYYYK',
    '.KYYYYYYYYYYYYYYYYYWYYYYYK',
    '...KYYYYYYYYYYYYYYYK.KDDDK',
    '....KYYYYYYYYYYYYYYK.KKKK.',
    '.....KDDDDDDDDDDDDDK......',
    '......KDDDDDDDDDDDK.......',
    '.......KDDDDDDDDDK........',
    '........KDDDDDDDK.........',
    '.........KDDDDDK..........',
    '..........KDDDK...........',
    '...........KKK............'
  ],
  palette: {
    Y: '#ffd91f',
    y: '#ffec6e',
    D: '#d9a800',
    W: '#f4f4f4',
    K: '#5b4300',
    E: '#141414'
  },
  tailCols: 6,
  pixelScale: 0.5
};

// ネオンテトラ(細身で青と赤のライン)
const neonTetra: FishSpecies = {
  name: 'neonTetra',
  rows: [
    '............KFFK............',
    '............KFFK............',
    '......KKKKKKKKKK........KK..',
    '....KKSSSSSSSSSSKK.....KFFF.',
    '..KKEECCCCCCCCCCCCK...KFFFF.',
    '.KSSEECCCCCCCCCCCCcSKKFFFFF.',
    'KSSSSSSSSSSSRRRRRRRRRRFFFFF.',
    '.KssssssssssRRRRRRRRrKFFFFF.',
    '..KKssssssssrrrrrrrKK.KFFFF.',
    '....KKKsssssssssKKK....KFFK.',
    '.......KKKKKKKKK........KK..',
    '..........KFFK..............'
  ],
  palette: {
    C: '#35e0f0',
    c: '#1fa8c8',
    R: '#e8413a',
    r: '#b02a26',
    S: '#cfdce2',
    s: '#93a8b0',
    F: '#bcd8e0',
    K: '#16242c',
    E: '#0a141c'
  },
  tailCols: 6,
  pixelScale: 0.5
};

// ベタ(紫の体に大きく流れるマゼンタのひれ)
const betta: FishSpecies = {
  name: 'betta',
  rows: [
    '.......KMMK.......................',
    '......KMmMMK..........KMMMMK......',
    '.....KMmMMMMK.......KMMMMMMMMK....',
    '....KMmMMMMMK......KMmMMMMMMMMK...',
    '...KKKKKKKKKKK....KMmMMMMMMMMMMK..',
    '..KpPPPPPPPPPK...KMMmMMMMRMMMMMK..',
    '.KpPEPPPPPPPPK..KMmMMMRMMMMMMMMK..',
    'KpPPEPPPPPPPPPPMMmMMRMMMMMMMMMMK..',
    'KPPPPPPPPPPPPPPPMmMMRMMMMMMMMMMMK.',
    'KVPPPPPPPPPPPPPVMmMMRMMMMMMMMMMMK.',
    '.KVVPPPPPPPPPVKMMmMMRMMMMMMMMMK...',
    '..KKVVVVVVVVVK..KMmMMRMMMMMMK.....',
    '....KKKKKKKKK....KMmMRMMMMMK......',
    '.....KMMMMMMK.....KMmMMMMMK.......',
    '......KMMMMK........KMMMMK........',
    '.......KMMK.........KKKK..........',
    '........KMK.......................'
  ],
  palette: {
    P: '#8054d8',
    p: '#a57ce8',
    V: '#5c3aa8',
    M: '#e056b8',
    m: '#f08ad0',
    R: '#b03090',
    K: '#1d1133',
    E: '#0d081f'
  },
  tailCols: 19,
  pixelScale: 0.5
};

// 紅白の錦鯉風(白地に赤い模様)
const koi: FishSpecies = {
  name: 'koi',
  rows: [
    '...........KwwwwK.................',
    '..........KwwwwwwK................',
    '.......KKKKKKKKKKKK..........KK...',
    '.....KKWWRRRRWWWRRRRK.......KWWK..',
    '....KEWRRRRRRWWRRRRRWKK....KWWWK..',
    '...KWEWRRRRRWWWWRRRRWWWWKKKWWWWK..',
    '..KWWWRRRRWWWWWWRRRWWWWWWKWWWW....',
    'KKWWWWRRRWWWWWWWWWWWWWWWWWKWWW....',
    'KKwWWWWWWWWWWWWWWWWWWWWWWwKWWW....',
    '.KwwwwwwwwwwwwwwwwwwwwwwwKKWWW....',
    '..KwwwwwwwwwwwwwwwwwwwwKK.KWWWK...',
    '...KwwwwwwwwwwwwwwwwwwK....KWWWK..',
    '....KKwwwwwwwwwwwwwwKK......KWWK..',
    '......KKKKKKKKKKKKKK.........KK...',
    '.........KwwK.....................'
  ],
  palette: {
    W: '#faf6ee',
    w: '#ddd5c5',
    R: '#e23d2e',
    r: '#b52a1e',
    K: '#2a2020',
    E: '#141414'
  },
  tailCols: 8,
  pixelScale: 0.5
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
