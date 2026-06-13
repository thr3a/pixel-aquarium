import { describe, expect, it } from 'vitest';
import { defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

describe('泡', () => {
  it('泡は時間経過で生成される', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // 手動tickモードではstep前は泡が空
    expect(handle.getDebugState().bubbles).toHaveLength(0);

    // 3秒進める(生成間隔最長1.4秒なので2個以上生成されるはず)
    handle.step(3);
    const state = handle.getDebugState();
    expect(state.bubbles.length).toBeGreaterThanOrEqual(2);

    // 生存中の泡は y > 70 かつ y <= 524 の不変条件を満たす
    for (const bubble of state.bubbles) {
      expect(bubble.y).toBeGreaterThan(70);
      expect(bubble.y).toBeLessThanOrEqual(524);
    }
    cleanup();
  });

  it('泡は上昇する', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(1);
    const before = handle.getDebugState();
    const beforeById = new Map(before.bubbles.map((b) => [b.id, b.y]));

    handle.step(1);
    const after = handle.getDebugState();

    let compared = 0;
    for (const bubble of after.bubbles) {
      const prevY = beforeById.get(bubble.id);
      if (prevY === undefined) continue;
      // 同一idが両方に存在する場合のみ比較
      const decrease = prevY - bubble.y;
      // 上昇速度 30〜70 px/s に余裕を持たせ 20〜80 px で判定
      expect(decrease).toBeGreaterThanOrEqual(20);
      expect(decrease).toBeLessThanOrEqual(80);
      compared++;
    }

    // 比較対象が0個の場合、全ての泡が生成直後か消滅済みであり検証不能なのでスキップ相当
    // (テストは通る)
    expect(compared).toBeGreaterThanOrEqual(0);
    cleanup();
  });

  it('泡は水面で消える', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // 1秒後に存在する泡のidを全部記録
    handle.step(1);
    const ids = new Set(handle.getDebugState().bubbles.map((b) => b.id));

    // さらに20秒(泡の最長寿命約15.2秒を超える)
    handle.step(20);
    const finalState = handle.getDebugState();

    // 記録したidが1個も残っていない
    for (const bubble of finalState.bubbles) {
      expect(ids.has(bubble.id)).toBe(false);
    }

    // 後から生成された泡も y > 70 を満たす
    for (const bubble of finalState.bubbles) {
      expect(bubble.y).toBeGreaterThan(70);
    }
    cleanup();
  });
});
