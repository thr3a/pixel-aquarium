import { describe, expect, it } from 'vitest';
import { defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

describe('逃避と波紋', () => {
  it('逃げる向きはタップ地点の反対方向', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const before = handle.getDebugState();
    const centerX = before.screenWidth / 2;
    const centerY = (before.surfaceY + before.sandY) / 2;
    const target = before.fishes.reduce((best, fish) =>
      Math.hypot(fish.x - centerX, fish.y - centerY) < Math.hypot(best.x - centerX, best.y - centerY) ? fish : best
    );

    // 魚の左60pxをタップ → 魚は右へ逃げるはず
    tapAt(target.x - 60, target.y);

    const afterTap = handle.getDebugState();
    const fleeFish = afterTap.fishes.find((f) => f.id === target.id);
    expect(fleeFish?.mode).toBe('flee');
    expect(fleeFish?.targetX).toBeGreaterThan(target.x);

    // 0.3秒後にvxが正(右向き)
    handle.step(0.3);
    const afterStep = handle.getDebugState();
    const movedFish = afterStep.fishes.find((f) => f.id === target.id);
    expect(movedFish?.vx).toBeGreaterThan(0);
    cleanup();
  });

  it('タップ地点から410px超の魚は逃げない', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    const before = handle.getDebugState();
    const centerX = before.screenWidth / 2;
    const centerY = (before.surfaceY + before.sandY) / 2;
    const target = before.fishes.reduce((best, fish) =>
      Math.hypot(fish.x - centerX, fish.y - centerY) < Math.hypot(best.x - centerX, best.y - centerY) ? fish : best
    );

    const tapX = target.x - 50;
    const tapY = target.y;
    tapAt(tapX, tapY);

    const afterTap = handle.getDebugState();
    for (const preFish of before.fishes) {
      const dist = Math.hypot(preFish.x - tapX, preFish.y - tapY);
      if (dist > 410) {
        const postFish = afterTap.fishes.find((f) => f.id === preFish.id);
        expect(postFish?.mode).not.toBe('flee');
      }
    }
    cleanup();
  });

  it('波紋は1.1秒で消える', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    tapAt(400, 300);
    expect(handle.getDebugState().rippleCount).toBe(1);

    // 0.5秒後はまだ存在する
    handle.step(0.5);
    expect(handle.getDebugState().rippleCount).toBe(1);

    // 累計1.5秒後には消えている(寿命1.1秒)
    handle.step(1);
    expect(handle.getDebugState().rippleCount).toBe(0);
    cleanup();
  });

  it('水中タップでは餌が出ない', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    tapAt(400, 300);
    expect(handle.getDebugState().foods).toHaveLength(0);
    cleanup();
  });
});
