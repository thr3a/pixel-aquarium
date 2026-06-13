import { describe, expect, it } from 'vitest';
import { defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

// 餌を食べた瞬間の演出(B-1): 「パクッ」と口を開ける chomp 演出と、口元から立つ小さな泡。
// 捕食は確率的に起こるため、餌を多めに撒いて細かい刻みで進め、最初の捕食フレームを捕まえる。

describe('餌を食べる瞬間の演出', () => {
  it('餌を食べた魚は「パクッ」演出(chomping)になる', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // 各魚の真上に餌を撒き、どれかが確実に到達するようにする
    for (const fish of handle.getDebugState().fishes) {
      tapAt(fish.x, 30);
    }
    const initialFoodCount = handle.getDebugState().foods.length;
    expect(initialFoodCount).toBeGreaterThan(0);

    let sawChomp = false;
    let foodEaten = false;
    // 0.05秒刻みで最大30秒(餌寿命45秒未満なので消滅と混同しない)
    for (let i = 0; i < 600; i++) {
      handle.step(0.05);
      const state = handle.getDebugState();
      if (state.fishes.some((f) => f.chomping)) sawChomp = true;
      if (state.foods.length < initialFoodCount) foodEaten = true;
      if (sawChomp) break;
    }

    // 餌が実際に消費され、かつ chomp 演出が発火していること
    expect(foodEaten).toBe(true);
    expect(sawChomp).toBe(true);
    cleanup();
  });

  it('餌を食べた瞬間に口元へ小さな泡が複数立つ', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    for (const fish of handle.getDebugState().fishes) {
      tapAt(fish.x, 30);
    }

    let prevBubbleIds = new Set(handle.getDebugState().bubbles.map((b) => b.id));
    let prevChomping = false;
    let eatBubbleCount = 0;

    for (let i = 0; i < 600; i++) {
      handle.step(0.05);
      const state = handle.getDebugState();
      const chompingFishes = state.fishes.filter((f) => f.chomping);
      const newlyChomping = chompingFishes.length > 0 && !prevChomping;

      if (newlyChomping) {
        // この刻みで新規に出現した泡のうち、chomp 中の魚の口元(80px以内)に湧いたものを数える
        const newBubbles = state.bubbles.filter((b) => !prevBubbleIds.has(b.id));
        eatBubbleCount = newBubbles.filter((b) =>
          chompingFishes.some((f) => Math.hypot(b.x - f.x, b.y - f.y) < 80)
        ).length;
        break;
      }

      prevBubbleIds = new Set(state.bubbles.map((b) => b.id));
      prevChomping = chompingFishes.length > 0;
    }

    // spawnEatBubbles は 2〜3 個生成するので、口元に2個以上の新規泡が立つはず
    expect(eatBubbleCount).toBeGreaterThanOrEqual(2);
    cleanup();
  });
});
