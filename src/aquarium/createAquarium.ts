import { Application, Container, type FederatedPointerEvent, Graphics, Sprite, type Texture } from 'pixi.js';
import {
  bubbleArt,
  bubbleSmallArt,
  coralArt,
  coralOrangeArt,
  type FishSpecies,
  fishSpeciesList,
  foodArt,
  leafLeftArt,
  leafLeftDarkArt,
  leafRightArt,
  leafRightDarkArt,
  rockArt
} from './pixelArt';
import { createPixelTexture, createSandTexture, makeTailFlapRows } from './pixelTexture';

// ドット絵の拡大倍率(輪郭をはっきり保つ)
const SCALE = 4;
// 画面上部の1割が水面より上(空気層)
const SURFACE_RATIO = 0.1;
// 砂地の上端位置
const SAND_RATIO = 0.84;

type FishState = {
  sprite: Sprite;
  frames: [Texture, Texture];
  frameIndex: number;
  frameTimer: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  scale: number;
  pixelScale: number;
  depthMin: number;
  depthMax: number;
  shyness: number;
  appetite: number;
  turnRate: number;
  mode: 'wander' | 'flee' | 'seek';
  targetX: number;
  targetY: number;
  retargetTimer: number;
  fleeTimer: number;
  wigglePhase: number;
};

type BubbleState = {
  sprite: Sprite;
  baseX: number;
  y: number;
  vy: number;
  phase: number;
};

type FoodState = {
  sprite: Sprite;
  x: number;
  y: number;
  vy: number;
  phase: number;
  life: number;
};

type RippleState = {
  g: Graphics;
  x: number;
  y: number;
  age: number;
};

type PlantState = {
  segments: Sprite[];
  baseX: number;
  baseY: number;
  phase: number;
  swaySpeed: number;
  swayAmount: number;
  scale: number;
};

type RayState = {
  g: Graphics;
  phase: number;
};

type FishPersonality = {
  species: FishSpecies;
  scale: number;
  speed: number;
  depthMin: number;
  depthMax: number;
  shyness: number;
  appetite: number;
  turnRate: number;
};

const randomBetween = (min: number, max: number): number => min + Math.random() * (max - min);

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

export const createAquarium = async (container: HTMLElement): Promise<() => void> => {
  const app = new Application();
  await app.init({
    resizeTo: container,
    antialias: false,
    backgroundColor: 0x1b6fae
  });
  container.appendChild(app.canvas);

  // レイヤー構成(下から順に描画される)
  const backgroundLayer = new Container();
  const lightLayer = new Container();
  const decorLayer = new Container();
  const foodLayer = new Container();
  const fishLayer = new Container();
  const bubbleLayer = new Container();
  const effectLayer = new Container();
  const surfaceG = new Graphics();
  app.stage.addChild(backgroundLayer, lightLayer, decorLayer, foodLayer, fishLayer, bubbleLayer, effectLayer, surfaceG);

  // 共有テクスチャを一度だけ生成
  const bubbleTexture = createPixelTexture(bubbleArt.rows, bubbleArt.palette);
  const bubbleSmallTexture = createPixelTexture(bubbleSmallArt.rows, bubbleSmallArt.palette);
  const foodTexture = createPixelTexture(foodArt.rows, foodArt.palette);
  const rockTexture = createPixelTexture(rockArt.rows, rockArt.palette);
  const coralTexture = createPixelTexture(coralArt.rows, coralArt.palette);
  const coralOrangeTexture = createPixelTexture(coralOrangeArt.rows, coralOrangeArt.palette);
  const leafTextures: [Texture, Texture][] = [
    [
      createPixelTexture(leafLeftArt.rows, leafLeftArt.palette),
      createPixelTexture(leafRightArt.rows, leafRightArt.palette)
    ],
    [
      createPixelTexture(leafLeftDarkArt.rows, leafLeftDarkArt.palette),
      createPixelTexture(leafRightDarkArt.rows, leafRightDarkArt.palette)
    ]
  ];
  const fishTextures = new Map<string, [Texture, Texture]>();
  for (const species of fishSpeciesList) {
    fishTextures.set(species.name, [
      createPixelTexture(species.rows, species.palette),
      createPixelTexture(makeTailFlapRows(species.rows, species.tailCols, 2), species.palette)
    ]);
  }

  const fishes: FishState[] = [];
  const bubbles: BubbleState[] = [];
  const foods: FoodState[] = [];
  const ripples: RippleState[] = [];
  const plants: PlantState[] = [];
  const rays: RayState[] = [];
  let sandSprite: Sprite | null = null;
  let elapsed = 0;
  let bubbleTimer = 0;

  const surfaceY = (): number => app.screen.height * SURFACE_RATIO;
  const sandY = (): number => app.screen.height * SAND_RATIO;

  // 水中の遊泳可能域に収める
  const clampFishY = (y: number): number => clamp(y, surfaceY() + 30, sandY() - 20);

  const buildPlant = (baseX: number, baseY: number, segmentCount: number, variant: number): void => {
    const [leftTexture, rightTexture] = leafTextures[variant];
    const scale = SCALE * randomBetween(1, 1.7);
    const segments: Sprite[] = [];
    for (let i = 0; i < segmentCount; i++) {
      const leaf = new Sprite(i % 2 === 0 ? leftTexture : rightTexture);
      leaf.scale.set(scale);
      leaf.anchor.set(0.5, 1);
      decorLayer.addChild(leaf);
      segments.push(leaf);
    }
    plants.push({
      segments,
      baseX,
      baseY,
      phase: Math.random() * Math.PI * 2,
      swaySpeed: randomBetween(0.8, 1.4),
      swayAmount: randomBetween(1.2, 2.4),
      scale
    });
  };

  // 画面サイズに依存する背景・装飾を(再)構築する
  const buildEnvironment = (): void => {
    const w = app.screen.width;
    const h = app.screen.height;

    for (const child of backgroundLayer.removeChildren()) child.destroy({ children: true });
    for (const child of decorLayer.removeChildren()) child.destroy({ children: true });
    for (const child of lightLayer.removeChildren()) child.destroy({ children: true });
    plants.length = 0;
    rays.length = 0;
    if (sandSprite) {
      sandSprite.texture.destroy(true);
      sandSprite = null;
    }

    // 水のグラデーション(レトロ感を残すため帯状に塗り分ける)
    const waterColors = [
      0x6fd2ee, 0x5cc3e6, 0x4bb2dd, 0x3ea2d2, 0x3492c7, 0x2c83bc, 0x2575b2, 0x1f68a8, 0x1a5c9e, 0x165294
    ];
    const bg = new Graphics();
    const bandTop = surfaceY();
    const bandHeight = (h - bandTop) / waterColors.length;
    waterColors.forEach((color, i) => {
      bg.rect(0, bandTop + bandHeight * i, w, bandHeight + 1).fill(color);
    });
    // 水面より上(空気層)
    bg.rect(0, 0, w, bandTop).fill(0xd8f2fb);
    backgroundLayer.addChild(bg);

    // 砂地
    const sandHeight = h - sandY();
    const sandTexture = createSandTexture(Math.ceil(w / SCALE), Math.ceil(sandHeight / SCALE));
    sandSprite = new Sprite(sandTexture);
    sandSprite.scale.set(SCALE);
    sandSprite.y = sandY();
    backgroundLayer.addChild(sandSprite);

    // 岩
    const rockCount = Math.max(2, Math.floor(w / 450));
    for (let i = 0; i < rockCount; i++) {
      const rock = new Sprite(rockTexture);
      const rockScale = SCALE * randomBetween(1.2, 2.2);
      rock.scale.set(rockScale);
      rock.anchor.set(0.5, 1);
      rock.x = ((i + 0.5) / rockCount) * w + randomBetween(-60, 60);
      rock.y = sandY() + randomBetween(8, sandHeight * 0.5);
      decorLayer.addChild(rock);
    }

    // サンゴ
    const coralCount = Math.max(3, Math.floor(w / 320));
    for (let i = 0; i < coralCount; i++) {
      const coral = new Sprite(i % 2 === 0 ? coralTexture : coralOrangeTexture);
      coral.scale.set(SCALE * randomBetween(1.2, 2));
      coral.anchor.set(0.5, 1);
      coral.x = ((i + Math.random()) / coralCount) * w;
      coral.y = sandY() + randomBetween(10, sandHeight * 0.6);
      decorLayer.addChild(coral);
    }

    // 水草(株ごとに2〜3本まとめて群生させる)
    const plantClusterCount = Math.max(4, Math.floor(w / 260));
    for (let i = 0; i < plantClusterCount; i++) {
      const clusterX = ((i + Math.random() * 0.8) / plantClusterCount) * w;
      const stalks = 2 + Math.floor(Math.random() * 2);
      for (let s = 0; s < stalks; s++) {
        const baseX = clusterX + randomBetween(-26, 26);
        const baseY = sandY() + randomBetween(6, sandHeight * 0.6);
        buildPlant(baseX, baseY, Math.floor(randomBetween(7, 14)), (i + s) % 2);
      }
    }

    // 光のゆらぎ(斜めに差し込む光の柱)
    const rayCount = Math.max(3, Math.floor(w / 320));
    for (let i = 0; i < rayCount; i++) {
      const g = new Graphics();
      const topX = ((i + 0.3) / rayCount) * w + randomBetween(-40, 40);
      const topWidth = randomBetween(24, 60);
      const slant = randomBetween(80, 180);
      g.poly([
        topX,
        bandTop,
        topX + topWidth,
        bandTop,
        topX + topWidth + slant,
        h,
        topX + slant - topWidth * 0.5,
        h
      ]).fill({
        color: 0xbfeaff,
        alpha: 0.16
      });
      g.blendMode = 'add';
      lightLayer.addChild(g);
      rays.push({ g, phase: Math.random() * Math.PI * 2 });
    }
  };

  const personalities: FishPersonality[] = [
    {
      species: fishSpeciesList[0],
      scale: 1.6,
      speed: 70,
      depthMin: 0.2,
      depthMax: 0.55,
      shyness: 1,
      appetite: 280,
      turnRate: 2.2
    },
    {
      species: fishSpeciesList[0],
      scale: 1.3,
      speed: 85,
      depthMin: 0.25,
      depthMax: 0.6,
      shyness: 1.3,
      appetite: 320,
      turnRate: 2.6
    },
    {
      species: fishSpeciesList[1],
      scale: 1.8,
      speed: 55,
      depthMin: 0.15,
      depthMax: 0.5,
      shyness: 0.8,
      appetite: 300,
      turnRate: 1.8
    },
    {
      species: fishSpeciesList[2],
      scale: 1.7,
      speed: 40,
      depthMin: 0.35,
      depthMax: 0.75,
      shyness: 0.6,
      appetite: 260,
      turnRate: 1.4
    },
    {
      species: fishSpeciesList[3],
      scale: 1.1,
      speed: 110,
      depthMin: 0.1,
      depthMax: 0.45,
      shyness: 1.6,
      appetite: 360,
      turnRate: 3.2
    },
    {
      species: fishSpeciesList[3],
      scale: 1,
      speed: 120,
      depthMin: 0.12,
      depthMax: 0.4,
      shyness: 1.6,
      appetite: 360,
      turnRate: 3.4
    },
    {
      species: fishSpeciesList[4],
      scale: 1.7,
      speed: 45,
      depthMin: 0.3,
      depthMax: 0.7,
      shyness: 0.7,
      appetite: 240,
      turnRate: 1.5
    },
    {
      species: fishSpeciesList[5],
      scale: 2,
      speed: 60,
      depthMin: 0.4,
      depthMax: 0.8,
      shyness: 0.9,
      appetite: 300,
      turnRate: 1.6
    }
  ];

  const waterTop = (): number => surfaceY() + 30;
  const waterBottom = (): number => sandY() - 20;

  const depthToY = (ratio: number): number => waterTop() + (waterBottom() - waterTop()) * ratio;

  const pickWanderTarget = (fish: FishState): void => {
    const margin = 60;
    fish.targetX = randomBetween(margin, app.screen.width - margin);
    fish.targetY = clampFishY(randomBetween(depthToY(fish.depthMin), depthToY(fish.depthMax)));
    fish.retargetTimer = randomBetween(2.5, 7);
  };

  const spawnFishes = (): void => {
    for (const p of personalities) {
      const frames = fishTextures.get(p.species.name);
      if (!frames) continue;
      const sprite = new Sprite(frames[0]);
      sprite.anchor.set(0.5);
      const fish: FishState = {
        sprite,
        frames,
        frameIndex: 0,
        frameTimer: 0,
        x: randomBetween(80, app.screen.width - 80),
        y: clampFishY(randomBetween(depthToY(p.depthMin), depthToY(p.depthMax))),
        vx: randomBetween(-1, 1) < 0 ? -p.speed : p.speed,
        vy: 0,
        baseSpeed: p.speed,
        scale: p.scale,
        pixelScale: p.species.pixelScale,
        depthMin: p.depthMin,
        depthMax: p.depthMax,
        shyness: p.shyness,
        appetite: p.appetite,
        turnRate: p.turnRate,
        mode: 'wander',
        targetX: 0,
        targetY: 0,
        retargetTimer: 0,
        fleeTimer: 0,
        wigglePhase: Math.random() * Math.PI * 2
      };
      pickWanderTarget(fish);
      fishLayer.addChild(sprite);
      fishes.push(fish);
    }
  };

  const spawnBubble = (x: number, y: number): void => {
    const small = Math.random() < 0.4;
    const sprite = new Sprite(small ? bubbleSmallTexture : bubbleTexture);
    sprite.anchor.set(0.5);
    sprite.scale.set(SCALE * randomBetween(0.5, 1));
    bubbleLayer.addChild(sprite);
    bubbles.push({
      sprite,
      baseX: x,
      y,
      vy: randomBetween(30, 70),
      phase: Math.random() * Math.PI * 2
    });
  };

  const spawnFood = (x: number): void => {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const sprite = new Sprite(foodTexture);
      sprite.anchor.set(0.5);
      sprite.scale.set(SCALE * 0.75);
      foodLayer.addChild(sprite);
      foods.push({
        sprite,
        x: clamp(x + randomBetween(-30, 30), 10, app.screen.width - 10),
        y: surfaceY() + randomBetween(4, 14),
        vy: randomBetween(16, 28),
        phase: Math.random() * Math.PI * 2,
        life: 45
      });
    }
  };

  const spawnRipple = (x: number, y: number): void => {
    const g = new Graphics();
    effectLayer.addChild(g);
    ripples.push({ g, x, y, age: 0 });

    // 近くの魚は波紋から逃げる
    for (const fish of fishes) {
      const dx = fish.x - x;
      const dy = fish.y - y;
      const dist = Math.hypot(dx, dy);
      const fleeRadius = 220 * fish.shyness;
      if (dist > fleeRadius) continue;
      fish.mode = 'flee';
      fish.fleeTimer = randomBetween(1, 1.8) * fish.shyness;
      const away = dist > 1 ? 1 / dist : 0;
      fish.targetX = clamp(fish.x + dx * away * 320, 40, app.screen.width - 40);
      fish.targetY = clampFishY(fish.y + dy * away * 320);
    }
  };

  const onPointerDown = (event: FederatedPointerEvent): void => {
    const { x, y } = event.global;
    if (y < surfaceY()) {
      // 水面より上のクリックは餌やり
      spawnFood(x);
      return;
    }
    spawnRipple(x, y);
  };

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', onPointerDown);

  const updateFish = (fish: FishState, dt: number): void => {
    if (fish.mode === 'flee') {
      fish.fleeTimer -= dt;
      if (fish.fleeTimer <= 0) {
        fish.mode = 'wander';
        pickWanderTarget(fish);
      }
    } else {
      // 近くの餌を探す(逃走中は無視)
      let nearest: FoodState | null = null;
      let nearestDist = fish.appetite;
      for (const food of foods) {
        const dist = Math.hypot(food.x - fish.x, food.y - fish.y);
        if (dist >= nearestDist) continue;
        nearest = food;
        nearestDist = dist;
      }
      if (nearest) {
        fish.mode = 'seek';
        fish.targetX = nearest.x;
        fish.targetY = clampFishY(nearest.y);
        if (nearestDist < 16 * fish.scale + 8) {
          nearest.life = 0;
          fish.mode = 'wander';
          pickWanderTarget(fish);
        }
      } else if (fish.mode === 'seek') {
        fish.mode = 'wander';
        pickWanderTarget(fish);
      }
    }

    if (fish.mode === 'wander') {
      fish.retargetTimer -= dt;
      const arrived = Math.hypot(fish.targetX - fish.x, fish.targetY - fish.y) < 30;
      if (fish.retargetTimer <= 0 || arrived) pickWanderTarget(fish);
    }

    const speedMul = fish.mode === 'flee' ? 2.4 : fish.mode === 'seek' ? 1.5 : 1;
    const speed = fish.baseSpeed * speedMul;
    const dx = fish.targetX - fish.x;
    const dy = fish.targetY - fish.y;
    const dist = Math.max(Math.hypot(dx, dy), 1);
    const desiredVx = (dx / dist) * speed;
    const desiredVy = (dy / dist) * speed;
    const turn = clamp(fish.turnRate * (fish.mode === 'flee' ? 2 : 1) * dt, 0, 1);
    fish.vx += (desiredVx - fish.vx) * turn;
    fish.vy += (desiredVy - fish.vy) * turn;

    fish.x += fish.vx * dt;
    fish.y += fish.vy * dt;
    fish.x = clamp(fish.x, 30, app.screen.width - 30);
    fish.y = clampFishY(fish.y);

    // 尾びれのパタパタ(速いほど速く動かす)
    const flapSpeed = 3 + (Math.hypot(fish.vx, fish.vy) / fish.baseSpeed) * 4;
    fish.frameTimer += dt * flapSpeed;
    if (fish.frameTimer >= 1) {
      fish.frameTimer = 0;
      fish.frameIndex = fish.frameIndex === 0 ? 1 : 0;
      fish.sprite.texture = fish.frames[fish.frameIndex];
    }

    fish.wigglePhase += dt * 2;
    const facingRight = fish.vx > 0;
    const spriteScale = SCALE * fish.scale * fish.pixelScale;
    fish.sprite.scale.set(facingRight ? -spriteScale : spriteScale, spriteScale);
    fish.sprite.x = fish.x;
    fish.sprite.y = fish.y + Math.sin(fish.wigglePhase) * 2;
    const tilt = clamp(Math.atan2(fish.vy, Math.abs(fish.vx) + 20) * 0.6, -0.45, 0.45);
    fish.sprite.rotation = facingRight ? tilt : -tilt;
  };

  const drawSurface = (): void => {
    const w = app.screen.width;
    const top = surfaceY();
    surfaceG.clear();
    // 波の形を計算
    const step = 8;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let x = 0; x <= w + step; x += step) {
      const wave = Math.sin(x * 0.02 + elapsed * 1.8) * 3 + Math.sin(x * 0.045 - elapsed * 1.2) * 2;
      xs.push(x);
      ys.push(top + wave);
    }
    // 空気層を波形に沿って塗りつぶす
    const polyPoints: number[] = [0, 0, w, 0];
    for (let i = xs.length - 1; i >= 0; i--) {
      polyPoints.push(xs[i], ys[i]);
    }
    surfaceG.poly(polyPoints).fill(0xd8f2fb);
    // 水面の波ライン
    surfaceG.moveTo(xs[0], ys[0]);
    for (let i = 1; i < xs.length; i++) {
      surfaceG.lineTo(xs[i], ys[i]);
    }
    surfaceG.stroke({ color: 0xeafaff, width: 3, alpha: 0.9 });
  };

  const tick = (dt: number): void => {
    elapsed += dt;

    for (const fish of fishes) updateFish(fish, dt);

    // 水草のゆらぎ
    for (const plant of plants) {
      const segH = leafTextures[0][0].height * plant.scale - 2;
      plant.segments.forEach((leaf, i) => {
        const sway = Math.sin(elapsed * plant.swaySpeed + plant.phase + i * 0.45) * plant.swayAmount * (i + 1) * 0.6;
        leaf.x = plant.baseX + sway;
        leaf.y = plant.baseY - i * segH;
      });
    }

    // 光のゆらぎ
    for (const ray of rays) {
      ray.g.alpha = 0.5 + Math.sin(elapsed * 0.7 + ray.phase) * 0.4;
    }

    // 泡の生成と上昇
    bubbleTimer -= dt;
    if (bubbleTimer <= 0) {
      bubbleTimer = randomBetween(0.4, 1.4);
      spawnBubble(randomBetween(20, app.screen.width - 20), sandY() + randomBetween(-10, 20));
    }
    for (let i = bubbles.length - 1; i >= 0; i--) {
      const bubble = bubbles[i];
      bubble.y -= bubble.vy * dt;
      bubble.phase += dt * 3;
      bubble.sprite.x = bubble.baseX + Math.sin(bubble.phase) * 6;
      bubble.sprite.y = bubble.y;
      if (bubble.y > surfaceY() + 10) continue;
      bubble.sprite.destroy();
      bubbles.splice(i, 1);
    }

    // 餌の沈降
    for (let i = foods.length - 1; i >= 0; i--) {
      const food = foods[i];
      food.life -= dt;
      if (food.life <= 0) {
        food.sprite.destroy();
        foods.splice(i, 1);
        continue;
      }
      if (food.y < sandY() - 6) {
        food.y += food.vy * dt;
        food.phase += dt * 2.5;
        food.x += Math.sin(food.phase) * 8 * dt;
      }
      food.sprite.x = food.x;
      food.sprite.y = food.y;
    }

    // 波紋の拡大とフェードアウト
    for (let i = ripples.length - 1; i >= 0; i--) {
      const ripple = ripples[i];
      ripple.age += dt;
      const progress = ripple.age / 1.1;
      if (progress >= 1) {
        ripple.g.destroy();
        ripples.splice(i, 1);
        continue;
      }
      const alpha = (1 - progress) * 0.8;
      ripple.g.clear();
      ripple.g.circle(ripple.x, ripple.y, 12 + progress * 90).stroke({ color: 0xeafaff, width: 3, alpha });
      ripple.g.circle(ripple.x, ripple.y, 4 + progress * 55).stroke({ color: 0xbfeaff, width: 2, alpha: alpha * 0.7 });
    }

    drawSurface();
  };

  const onResize = (): void => {
    app.stage.hitArea = app.screen;
    buildEnvironment();
    for (const fish of fishes) {
      fish.x = clamp(fish.x, 30, app.screen.width - 30);
      fish.y = clampFishY(fish.y);
      pickWanderTarget(fish);
    }
  };

  buildEnvironment();
  spawnFishes();
  app.renderer.on('resize', onResize);
  app.ticker.add((ticker) => {
    tick(Math.min(ticker.deltaMS / 1000, 0.05));
  });

  return () => {
    app.renderer.off('resize', onResize);
    app.destroy(true, { children: true, texture: true });
  };
};
