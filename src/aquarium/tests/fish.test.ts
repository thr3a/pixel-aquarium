import { describe, expect, it } from 'vitest';
import { defaultAquariumSettings } from '../settings';
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
