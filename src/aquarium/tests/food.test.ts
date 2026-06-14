import { describe, expect, it } from 'vitest';
import { fishCatalog } from '../fishCatalog';
import { type AquariumSettings, defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

// 魚0匹の設定(全種無効)
const noFishSettings: AquariumSettings = {
  fish: Object.fromEntries(fishCatalog.map((entry) => [entry.species.name, { enabled: false, count: 1 }])),
  debug: false
};

describe('餌やり', () => {
  it('水面上タップで餌が撒かれ、波紋・逃避は起きない', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // y=30 は水面(60)より上
    tapAt(400, 30);

    const state = handle.getDebugState();
    expect(state.foods.length).toBeGreaterThanOrEqual(3);
    expect(state.foods.length).toBeLessThanOrEqual(5);

    for (const food of state.foods) {
      expect(food.x).toBeGreaterThanOrEqual(370);
      expect(food.x).toBeLessThanOrEqual(430);
      expect(food.y).toBeGreaterThanOrEqual(64);
      expect(food.y).toBeLessThanOrEqual(74);
    }

    expect(state.rippleCount).toBe(0);
    expect(state.fishes.filter((f) => f.mode === 'flee')).toHaveLength(0);
    cleanup();
  });

  it('餌は沈み、砂地で止まる', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(noFishSettings);

    tapAt(400, 30);

    const initial = handle.getDebugState();
    let prevYById = new Map(initial.foods.map((f) => [f.id, f.y]));

    // 3回 step(1) して各回の沈降量を確認
    for (let i = 0; i < 3; i++) {
      handle.step(1);
      const s = handle.getDebugState();
      for (const food of s.foods) {
        const prevY = prevYById.get(food.id);
        if (prevY !== undefined) {
          const dy = food.y - prevY;
          // 沈降速度 16〜28 px/s に余裕を持たせ 14〜30 で判定
          expect(dy).toBeGreaterThanOrEqual(14);
          expect(dy).toBeLessThanOrEqual(30);
        }
      }
      prevYById = new Map(s.foods.map((f) => [f.id, f.y]));
    }

    // さらに step(30) で砂地に到達・停止しているはず(累計33秒)
    handle.step(30);
    const final = handle.getDebugState();
    expect(final.foods.length).toBeGreaterThan(0);
    for (const food of final.foods) {
      expect(food.y).toBeGreaterThanOrEqual(490);
      expect(food.y).toBeLessThanOrEqual(499);
    }
    cleanup();
  });

  it('餌は45秒で消える', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(noFishSettings);

    tapAt(400, 30);

    // 44秒後はまだ残っている
    handle.step(44);
    expect(handle.getDebugState().foods.length).toBeGreaterThanOrEqual(1);

    // さらに2秒(累計46秒)で消える(寿命45秒)
    handle.step(2);
    expect(handle.getDebugState().foods).toHaveLength(0);
    cleanup();
  });

  it('魚が餌に反応する(seek または捕食)', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const before = handle.getDebugState();
    const centerX = before.screenWidth / 2;
    const centerY = (before.surfaceY + before.sandY) / 2;
    const nearestFish = before.fishes.reduce((best, fish) =>
      Math.hypot(fish.x - centerX, fish.y - centerY) < Math.hypot(best.x - centerX, best.y - centerY) ? fish : best
    );

    // 最も中央に近い魚のx真上をタップ
    tapAt(nearestFish.x, 30);
    const initialFoodCount = handle.getDebugState().foods.length;

    let success = false;
    for (let i = 0; i < 60; i++) {
      handle.step(0.5);
      const state = handle.getDebugState();
      const seeking = state.fishes.some((f) => f.mode === 'seek');
      const eaten = state.foods.length < initialFoodCount;
      if (seeking || eaten) {
        success = true;
        break;
      }
    }

    expect(success).toBe(true);
    cleanup();
  });

  it('seek中の魚は餌に近づく', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const before = handle.getDebugState();
    const centerX = before.screenWidth / 2;
    const centerY = (before.surfaceY + before.sandY) / 2;
    const nearestFish = before.fishes.reduce((best, fish) =>
      Math.hypot(fish.x - centerX, fish.y - centerY) < Math.hypot(best.x - centerX, best.y - centerY) ? fish : best
    );

    tapAt(nearestFish.x, 30);
    const initialFoodCount = handle.getDebugState().foods.length;

    let seekFishId: number | null = null;
    let foundByEating = false;

    for (let i = 0; i < 60; i++) {
      handle.step(0.5);
      const state = handle.getDebugState();
      const seekFish = state.fishes.find((f) => f.mode === 'seek');
      if (seekFish) {
        seekFishId = seekFish.id;
        break;
      }
      if (state.foods.length < initialFoodCount) {
        foundByEating = true;
        break;
      }
    }

    // 食べた場合はこの検証はスキップして成功
    if (foundByEating || seekFishId === null) {
      cleanup();
      return;
    }

    const seekState = handle.getDebugState();
    const currentSeekFish = seekState.fishes.find((f) => f.id === seekFishId);
    if (!currentSeekFish || currentSeekFish.mode !== 'seek') {
      cleanup();
      return;
    }

    // 最も近い餌を特定
    const nearestFood = seekState.foods.reduce((best, food) => {
      const distBest = Math.hypot(best.x - currentSeekFish.x, best.y - currentSeekFish.y);
      const distCurr = Math.hypot(food.x - currentSeekFish.x, food.y - currentSeekFish.y);
      return distCurr < distBest ? food : best;
    });

    const distBefore = Math.hypot(currentSeekFish.x - nearestFood.x, currentSeekFish.y - nearestFood.y);

    handle.step(0.3);
    const afterState = handle.getDebugState();
    const fishAfter = afterState.fishes.find((f) => f.id === seekFishId);
    const foodAfter = afterState.foods.find((f) => f.id === nearestFood.id);

    // 魚か餌が消えていた(食べた・モード変化)場合は検証せず成功
    if (!fishAfter || fishAfter.mode !== 'seek' || !foodAfter) {
      cleanup();
      return;
    }

    const distAfter = Math.hypot(fishAfter.x - foodAfter.x, fishAfter.y - foodAfter.y);
    expect(distAfter).toBeLessThan(distBefore);
    cleanup();
  });
});
