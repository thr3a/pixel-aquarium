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

// ライムグリーンのエンゼルフィッシュ風(縦じまの入ったひし形の体)
const limeAngel: FishSpecies = {
  name: 'limeAngel',
  rows: [
    '...................KKKK.',
    '................KKKAAAAK',
    '..............KKCAAAFKK.',
    '............KKBHAAAKK...',
    '..........KKDDDAAAK.....',
    '.........KKDBBAAAFK.....',
    '........KDDBBAAAAK......',
    '......KKDBBBCAAAIK......',
    '....KKHHDBBBAAAAK....KKK',
    '....AHADBBBCAAACK..KKBBK',
    '...KHAADBBBCAAABK.KBBBBK',
    '..KAAAADBBBCAAABBKBBBBK.',
    '.KAAAAADBBBCAAABBKBBBBK.',
    '.KADKAADBBBCAAABBKGBBBK.',
    'KKAKKAADBBBCAAABBKGBBBK.',
    'KAAAAAADBBBCAAABBKGBBBK.',
    'KFFAAAADBBBCAAABGKIGBBK.',
    '..KFFAAHDBBBAAABK.KGGBBK',
    '...KFFFADGGBAAAFK..KKGGK',
    '....KFFFCGGGAAAAK....KKK',
    '.....KFFFCIIIAAAK.......',
    '......KFKFKKKFFAAK......',
    '.......KBKFK.KKFAAFK....',
    '.........KK....KKFAAK...',
    '.................KKKK...'
  ],
  palette: {
    A: '#beef2a',
    B: '#2fddd2',
    C: '#8ae7ae',
    D: '#91edd7',
    F: '#9ed118',
    G: '#17c7b9',
    H: '#c6f57f',
    I: '#1ab29d',
    K: '#1b231f'
  },
  tailCols: 6,
  pixelScale: 0.5
};

// ブダイ風(ターコイズの体にオレンジのひれと模様)
const parrotfish: FishSpecies = {
  name: 'parrotfish',
  rows: [
    '...........KKKKKKK................',
    '..........KBBBBBBBKK..............',
    '.........KCFFFFFBBBBK.............',
    '......KKKAAAAAAACDBBBKK........KK.',
    '.....KAAAAAAAAAAAAAFBBBK......KBBK',
    '....KAAAAAAAAAAAAAAAADBBK....KBBK.',
    '...KAAAAAAAAAAAAAAAAAAFDK...KBBAK.',
    '..KAAGEAAAAAAAAAAAAAAAAAKKKKBBAAK.',
    '.KAAAGEAAAAAAAFFAAAAAAAAACBBBAAAK.',
    'KAAAAEEAAAAACFBBFAAAAAAAABBBBBBFK.',
    'KAAAAAAAAAFFBBBBFAAAAAAAABBBBBBAK.',
    'KKKKAAAAAFBBBBBBCAAAAACCCDBBBBAAK.',
    '.KCAAAAABFBBBBBFAAACCCCCKKKKBBBAK.',
    '..KCCAABBBFBBBFCCCCCCCDDK...KKBBK.',
    '...KCCBBBBBFFFFCCCCCDDBK......KBBK',
    '....KKDBBBBBCCCCCCFDBDDK.......KK.',
    '......KDDBBBCCCCDDDBBDK...........',
    '.......KKKBBKKDDBBBDK.............',
    '..........KBBKKKBDBK..............',
    '...........KBBK.KK................',
    '............KK....................'
  ],
  palette: {
    A: '#1addcf',
    B: '#f18928',
    C: '#12af9e',
    D: '#bb6c21',
    F: '#139380',
    G: '#edf5f4',
    E: '#010509',
    K: '#1e2421'
  },
  tailCols: 7,
  pixelScale: 0.5
};

// ツノダシ(白黒の帯と黄色、長く伸びる背びれ)
const moorishIdol: FishSpecies = {
  name: 'moorishIdol',
  rows: [
    '...................KKKKKKKK.',
    '................KKKAAAAAAAAK',
    '..............KKAAAAACFKKKK.',
    '............KKAAAAAFKKK.....',
    '..........KKAAAAAHKKK.......',
    '.........KAAAAAAGKBK........',
    '........KKAAAAAKKBK.........',
    '.......KGGAAABKGDBK.........',
    '......KGGKAAAGKKDBBK....KK..',
    '.....KGGKKAAAGKKABBK...KDDK.',
    '....KHGKKKAAAGKKKDBBK.KDDBK.',
    '...KAAKKKKAAAGKKKKBBKKBDBK..',
    '..KFAAHKKKAAABKKKKADDBBBBK..',
    '..KAAEAKKKAAABKKKKKDBBBBBK..',
    '.KAAEEAKKKAAADBKKKKADBBBBK..',
    'KAAAAAAKKKAAAADBKKKBBBBBBK..',
    'KHCAAAKKKKGAAAABKKKKBKKBBBK.',
    '.KKCCCKGKKGAAAACKKKKBK.KBBK.',
    '...KKCFKKKKKCCCCBKKKK...KK..',
    '.....KFFKKKKFCCCCKKKK.......',
    '......KKKKKKKHCCCBKKKK......',
    '.........KKKKKKKCCBKKKK.....',
    '..........KKK...KKKKKKK.....'
  ],
  palette: {
    A: '#f5f3ed',
    B: '#ebd633',
    C: '#d8d5cb',
    D: '#faeb54',
    F: '#bbb8b2',
    G: '#4f4d4c',
    H: '#989691',
    E: '#050506',
    K: '#282624'
  },
  tailCols: 6,
  pixelScale: 0.5
};

// ミントグリーンのハギ風(黄色い背と尾びれ)
const mintTang: FishSpecies = {
  name: 'mintTang',
  rows: [
    '............KKKKKKK.................',
    '..........KKBBBBBBBKKK..............',
    '.........KBBBBBBBBBBBBKK............',
    '.......KKBCCCCCCCBBBBBBBK...........',
    '......KAGGAAAAAAAGGIBBBBBK.......KK.',
    '.....KGCAAAAAAAAAAAGGBBBBBK.....KBBK',
    '....KGFAAAAAAAAAAAAAAGBBBBK....KBBBK',
    '...KGFFAAAAAAAAAAAAAAAGBBBBK..KBBBK.',
    '..KHFFFFAAAAAAAAAAAAAAAACBBK.KBBBK..',
    '..KFFFHFGAAAAAAAAAAAAAAAACKKKBBBBK..',
    '..KFFHHFGAAAAAAAAAAAAAAAAAGCBBBBBK..',
    '.KFFFHHFGAAAADAAAAAAAAAAAAABBBBBBK..',
    'KFFFFFFFGAAABBBDAAAAAAAAAABBIBBBBK..',
    'KGCFFFFFGABBBBBDAAAAAAAAADDIIBBBBK..',
    '.KKCFFFFAFBBBBDDAAAAAAAADDKKKBBBBK..',
    '.KGCCFFFABBBBBDAAAAAADDDDGGK.KBBBK..',
    '..KCCCCADADDDDDAADDDDDDDCAGK..KBBBK.',
    '...KKCCADDDDDDDDDDDDDDDGGGK....KBBBK',
    '.....KGADDDDDDDDDDDDDAGGGGK.....KBBK',
    '......KKDADDDDDDDDDDCGGGGK.......KK.',
    '........KKDDDDDDDDGCGGGAK...........',
    '..........KBBKKKKGGGGGKK............',
    '..........KBBBK..KKKKK..............',
    '...........KKBBK....................',
    '.............KK.....................'
  ],
  palette: {
    A: '#57e5bd',
    B: '#e5ee3d',
    C: '#beedd4',
    D: '#36d2a3',
    F: '#def5ea',
    G: '#8ee8ca',
    H: '#040407',
    I: '#8ed574',
    K: '#212621'
  },
  tailCols: 7,
  pixelScale: 0.5
};

// グッピー(黄色い体に大きく広がるピンクの尾)
const guppy: FishSpecies = {
  name: 'guppy',
  rows: [
    '...................KKKKK............',
    '.................KKAAAAAK.....KKKK..',
    '...............KKAAAAAAAK...KKBBBBK.',
    '.............KKAAAAAAAGK..KKBBBBBBBK',
    '...KKKKKKKKKKAAAAAAAAAK..KBBBAAAAAAK',
    '.KKDDDDDDDDDDDDCGGAAAKK.KBBAAABBBBK.',
    '.KDDDCCCCCDCCCCCDCKKKKKKBAAAABBBBBBK',
    'KDCHECCCCCDCCCCCCCIKKKKAAABBBBBBBBBK',
    'KCCEECCCCHDCCDDCCIIBBBAAABBBAAAAAAK.',
    '.KCCCCCHDCHCHCCIIIBBBBAAAAAAAAAAAAK.',
    '..KJFCCFHCHCDDIIBAAABAAABBBBBBBBBBK.',
    '...KKFFFFFFHHDBBBAAAAAAAABBBBBBBBBBK',
    '.....KKKJJJJJGGKKKKKKKGAAABBBBBBBBBK',
    '.......KKKBAAK........KAAAAAABBBBBBK',
    '..........KAAAG........KAABAAAAAAAK.',
    '...........KKAAK........KAABBBAAAAK.',
    '.............KK.........KAAAABBBBBK.',
    '.........................KAAAABBBBBK',
    '..........................KGAAAAAAK.',
    '...........................KKAAAAK..',
    '.............................KKKK...'
  ],
  palette: {
    A: '#e8438d',
    B: '#f455a8',
    C: '#f3e349',
    D: '#f5ef8d',
    F: '#e0ded3',
    G: '#ac2457',
    H: '#f0efe4',
    I: '#fa767c',
    J: '#cbc1b9',
    E: '#0e0a12',
    K: '#1e1721'
  },
  tailCols: 11,
  pixelScale: 0.5
};

// ハナゴイ風(サーモンピンクの体に紫のひれ)
const fairyBasslet: FishSpecies = {
  name: 'fairyBasslet',
  rows: [
    '...............KKKKKK........',
    '............KKKCCCCCBK.......',
    '..........KKCCCCCCCBCK.......',
    '.........KBCCBCCBCBBK........',
    '.......KKCBBCCCBCBBBK........',
    '......KAAAAADBBCBCBK.........',
    '.....KAAAAAAAAABBBK.....KKKK.',
    '....KAAAAAAAAAAABBK....KCCCCK',
    '...KAAAAAAAAAAAAABK..KKCCBBBK',
    '..KAAAAAAAAAAADAAAD..BCCBBBK.',
    '.KAAGEAAAAAAAAAADAAADCCBBBB..',
    'KAAAEEAAAAAAAAAAAAAAADBBBB...',
    'KAAAAAAAAAAAAAAAADDDDDCBBB...',
    '.KAAAAAAAAAAAAAADDDKKBBCCBBK.',
    '..KAAAAAAAAAAAADDKK..KBBCCCBK',
    '...KAAAAAAAAADDDBK....KKBCBCK',
    '....KKDDDDDDDDBBBB......KKKK.',
    '......KKBBBBBBBCCB...........',
    '........KBCCCBBBBBBK.........',
    '.........KFCCCCCBCCCK........',
    '.........KKKKBCCCCBKK........',
    '.............KKKKKKK.........',
    '.............KKKKKK..........'
  ],
  palette: {
    A: '#fb7c73',
    B: '#9a4ad0',
    C: '#aa5be2',
    D: '#f15791',
    F: '#0c0707',
    G: '#fcfbfa',
    E: '#0a0715',
    K: '#171229'
  },
  tailCols: 7,
  pixelScale: 0.5
};

// レインボーフィッシュ(銀色の頭から虹色に変わる体)
const rainbowfish: FishSpecies = {
  name: 'rainbowfish',
  rows: [
    '...............KK..............',
    '..............KAAK.............',
    '.............KAAAAK............',
    '........KKKKKAAAAAAKK..........',
    '......KKBBGGCCHRAAAAAK.........',
    '....KKLLLLGGCCCPPPMAAKK....KKKK',
    '..KKLLLBLDDDGCCCHPPMRAAK..KAAAK',
    '.KLBLBBBLDDDGGGCCCPPMRAAKKAAAAK',
    'KLBBLEBBBDDDDDGGCCCHPRRAAAAAAK.',
    'KIBBEEBBBFFDDDDGCCCCHPMRAAAAAK.',
    '.KIIBBBBFFFFDDDGGGCCCHMRKKAAAK.',
    '..KIIBBIJJFFFFDDGQQCNNNKK.KAAAK',
    '...KIIIFJJJFFFFDGQQNNMK....KKKK',
    '....KKIIIJJJJFFFQNNMMK.........',
    '......KKKKKIKKKKKNMNK..........',
    '..........KC.K...KKK...........',
    '..........KI.K.................',
    '...........K.K.................',
    '............K..................'
  ],
  palette: {
    A: '#e3383e',
    B: '#ccd6d0',
    C: '#3fdbba',
    D: '#d8ee3b',
    F: '#dcad25',
    G: '#8fe84e',
    H: '#3196d5',
    I: '#a3a39f',
    J: '#de7326',
    L: '#e1e7dd',
    M: '#2a6ad3',
    N: '#1762b4',
    P: '#2a8be1',
    Q: '#70c936',
    R: '#7959c1',
    E: '#0b090d',
    K: '#1c181c'
  },
  tailCols: 5,
  pixelScale: 0.5
};

// 青いハゼ風(細長い体に青のグラデーションとライムの背びれ)
const blueGoby: FishSpecies = {
  name: 'blueGoby',
  rows: [
    '................KK.........................',
    '...............KCCK........................',
    '..............KCCCK........................',
    '.............KCCCK....KKKKKKK..............',
    '............KCCICK...KCCCCCCCKKK...........',
    '.....KKKKKKKK.DBBKKKKIIIICCCCCCCKK.........',
    '..KKKHHHDBBBBBBBBBBBBBBBBBBBICCCCCK..KKKK..',
    '.KDDHHHBBBBBBBBBBBBBBBBBBBBBBBBBIIKKKAAAGK.',
    'KHHDDJEBBBBBBBBBBBBBBBBBBBBBBBBBBBBBHHHHAAK',
    'KAGGGEEADAAAAAAAAAAAAAAAAAAAADBBBBBBDDDDDAK',
    'KFAGGKKGKAAAAAAAAAAAAAAAAAAAAAAAHHDDHHHAAAK',
    '.KAAGGAGKAGGGGGGGGGAAAAAAAAAAAAAHHDDHHHAAGK',
    '.KKFFFAAAFAAAAAAAAAAAAAAFAAFFFFFFFKKFFFFAAK',
    '..KKKKFFAFFFFFFFAAAAAAAFFFFFFGGGKK.KKGGGGK.',
    '.....KKKKKKKKAAKKKKKKKKGAGGAGGKK.....KKKK..',
    '............KGGK.......KKGGGKK.............',
    '............KGGK.........KKK...............',
    '.............KK............................'
  ],
  palette: {
    A: '#5ddfc5',
    B: '#207ae7',
    C: '#a5e432',
    D: '#19baee',
    F: '#3fcbac',
    G: '#7de8b6',
    H: '#2be0e7',
    I: '#72cf51',
    J: '#f5f8f8',
    E: '#04080a',
    K: '#10171a'
  },
  tailCols: 6,
  pixelScale: 0.5
};

export const fishSpeciesList: FishSpecies[] = [
  clownfish,
  blueTang,
  yellowAngel,
  neonTetra,
  betta,
  koi,
  limeAngel,
  parrotfish,
  moorishIdol,
  mintTang,
  guppy,
  fairyBasslet,
  rainbowfish,
  blueGoby
];

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
