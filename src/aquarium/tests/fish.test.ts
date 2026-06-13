import { describe, expect, it } from 'vitest';
import { fishCatalog } from '../fishCatalog';
import { type AquariumSettings, defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

// デフォルト設定での魚の合計数(有効な魚種のcountの総和)
const defaultFishTotal = Object.values(defaultAquariumSettings.fish).reduce(
  (sum, setting) => sum + (setting.enabled ? setting.count : 0),
  0
);

describe('魚の遊泳', () => {
  it('デフォルト設定の合計数だけ魚が生成され、全員が遊泳可能域に収まる', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const state = handle.getDebugState();
    expect(state.fishes).toHaveLength(defaultFishTotal);
    for (const fish of state.fishes) {
      // 遊泳可能域: 水面+30px 〜 砂地-20px (createAquarium の clampFishY と同じ)
      expect(fish.y).toBeGreaterThanOrEqual(state.surfaceY + 30);
      expect(fish.y).toBeLessThanOrEqual(state.sandY - 20);
    }
    cleanup();
  });

  it('水中タップで近くの魚が逃避モードになり、時間経過で通常遊泳へ戻る', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // 画面端のクランプの影響を受けないよう、中央にいちばん近い魚を狙う
    const before = handle.getDebugState();
    const centerX = before.screenWidth / 2;
    const centerY = (before.surfaceY + before.sandY) / 2;
    const target = before.fishes.reduce((best, fish) =>
      Math.hypot(fish.x - centerX, fish.y - centerY) < Math.hypot(best.x - centerX, best.y - centerY) ? fish : best
    );
    tapAt(target.x - 50, target.y);

    const afterTap = handle.getDebugState();
    expect(afterTap.fishes.find((fish) => fish.id === target.id)?.mode).toBe('flee');
    expect(afterTap.rippleCount).toBeGreaterThan(0);

    // 逃避時間は最長でも約3.3秒(fleeTimer = 1.8 × shyness最大1.84)
    handle.step(5);
    expect(handle.getDebugState().fishes.find((fish) => fish.id === target.id)?.mode).toBe('wander');
    cleanup();
  });
});

describe('魚の設定', () => {
  it('全14種を2匹ずつ設定すると28匹生成され、各種ちょうど2匹ずつになる', async () => {
    const { handle, cleanup } = await mountAquarium();
    const allTwoSettings: AquariumSettings = {
      fish: Object.fromEntries(fishCatalog.map((entry) => [entry.species.name, { enabled: true, count: 2 }]))
    };
    handle.applyFishSettings(allTwoSettings);

    const state = handle.getDebugState();
    expect(state.fishes).toHaveLength(28);

    const countBySpecies = new Map<string, number>();
    for (const fish of state.fishes) {
      countBySpecies.set(fish.speciesName, (countBySpecies.get(fish.speciesName) ?? 0) + 1);
    }
    expect(countBySpecies.size).toBe(14);
    for (const [, count] of countBySpecies) {
      expect(count).toBe(2);
    }
    cleanup();
  });

  it('設定変更で魚が増減し、残る個体は維持される', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);
    const snapshot1Ids = new Set(handle.getDebugState().fishes.map((f) => f.id));

    // 全種 count:1 に変更(clownfish と neonTetra が1匹ずつ減る)
    const allOneSettings: AquariumSettings = {
      fish: Object.fromEntries(fishCatalog.map((entry) => [entry.species.name, { enabled: true, count: 1 }]))
    };
    handle.applyFishSettings(allOneSettings);
    const snapshot2 = handle.getDebugState();
    expect(snapshot2.fishes).toHaveLength(14);

    // 残る個体は全て元のid集合の部分集合
    for (const fish of snapshot2.fishes) {
      expect(snapshot1Ids.has(fish.id)).toBe(true);
    }

    // clownfish を disabled にする
    const noClownfish: AquariumSettings = {
      fish: Object.fromEntries(
        fishCatalog.map((entry) => [entry.species.name, { enabled: entry.species.name !== 'clownfish', count: 1 }])
      )
    };
    handle.applyFishSettings(noClownfish);
    const snapshot3 = handle.getDebugState();
    expect(snapshot3.fishes).toHaveLength(13);
    expect(snapshot3.fishes.filter((f) => f.speciesName === 'clownfish')).toHaveLength(0);
    cleanup();
  });

  it('同一設定の再適用では個体が置き換えられない', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);
    const ids1 = new Set(handle.getDebugState().fishes.map((f) => f.id));

    handle.applyFishSettings(defaultAquariumSettings);
    const ids2 = new Set(handle.getDebugState().fishes.map((f) => f.id));

    expect(ids1.size).toBe(ids2.size);
    for (const id of ids1) {
      expect(ids2.has(id)).toBe(true);
    }
    cleanup();
  });

  it('魚は泳ぎ続け、遊泳可能域から出ない', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const before = handle.getDebugState();
    const beforeById = new Map(before.fishes.map((f) => [f.id, { x: f.x, y: f.y }]));

    handle.step(2);
    const after = handle.getDebugState();

    for (const fish of after.fishes) {
      const prev = beforeById.get(fish.id);
      if (prev) {
        const dist = Math.hypot(fish.x - prev.x, fish.y - prev.y);
        expect(dist).toBeGreaterThan(0);
      }
    }

    handle.step(20);
    const final = handle.getDebugState();
    for (const fish of final.fishes) {
      expect(Number.isFinite(fish.x)).toBe(true);
      expect(Number.isFinite(fish.y)).toBe(true);
      expect(fish.x).toBeGreaterThanOrEqual(30);
      expect(fish.x).toBeLessThanOrEqual(770);
      expect(fish.y).toBeGreaterThanOrEqual(90);
      expect(fish.y).toBeLessThanOrEqual(484);
    }
    cleanup();
  });
});
