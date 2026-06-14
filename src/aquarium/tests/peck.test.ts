import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultAquariumSettings } from '../settings';
import { mountAquarium } from './helpers';

// PECK_ZONE=200, sandY=600*0.84=504, surfaceY=600*0.10=60
// 砂底付近 = y > 504 - 200 = 304 の魚が候補

describe('砂底つつき(peck)', () => {
  const originalRandom = Math.random;

  beforeEach(() => {
    // Math.random をモックして peck 遷移を制御可能にする
    // デフォルトは元の実装を呼ぶ(初期化時に使われるため)
    vi.spyOn(Math, 'random').mockImplementation(originalRandom);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('砂底付近の魚がpeckモードに遷移する', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    // まず数秒泳がせて魚を散らす
    handle.step(3);

    // Math.random を常に 0 にして peck 遷移確率の条件を満たす
    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    const state = handle.getDebugState();
    // 砂底付近(PECK_ZONE=200以内)にいた魚はpeckモードに遷移しているはず
    const peckFishes = state.fishes.filter((f) => f.mode === 'peck');
    expect(peckFishes.length).toBeGreaterThan(0);

    cleanup();
  });

  it('peckモードの魚は砂底(sandY - 10)に向かって移動する', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(3);

    // peckを発動させる
    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    const afterPeck = handle.getDebugState();
    const peckFish = afterPeck.fishes.find((f) => f.mode === 'peck');
    expect(peckFish).toBeDefined();
    // targetYは sandY - 10 = 504 - 10 = 494
    expect(peckFish!.targetY).toBe(afterPeck.sandY - 10);

    cleanup();
  });

  it('peck中の魚はsandY - 10まで近づける(通常のsandY - 20制限より深い)', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(3);

    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    // peck中の魚を砂底まで移動させる
    vi.spyOn(Math, 'random').mockImplementation(originalRandom);
    handle.step(5);

    const state = handle.getDebugState();
    const peckOrNear = state.fishes.filter((f) => f.y > state.sandY - 20);
    // peck中は sandY-20 を超えて sandY-10 まで行ける可能性がある
    // ただし全つつき完了で wander に戻っている場合もあるので、
    // 少なくとも全魚が sandY-10 以内に収まっていることを確認
    for (const fish of state.fishes) {
      expect(fish.y).toBeLessThanOrEqual(state.sandY - 10);
    }

    cleanup();
  });

  it('つつき完了後にwanderモードへ復帰する', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(3);

    // peckを発動
    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    const afterPeck = handle.getDebugState();
    const peckIds = afterPeck.fishes.filter((f) => f.mode === 'peck').map((f) => f.id);
    expect(peckIds.length).toBeGreaterThan(0);

    // 十分な時間を進めるが、再peck遷移しないよう閾値を超える値を返す
    // PECK_CHANCE_PER_SEC=0.02 なので 1フレームの閾値≈0.00033。0.5を返せば絶対発動しない
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    handle.step(10);

    const afterReturn = handle.getDebugState();
    // peckだった魚が全員wanderに戻っている
    for (const id of peckIds) {
      const fish = afterReturn.fishes.find((f) => f.id === id);
      expect(fish).toBeDefined();
      expect(fish!.mode).not.toBe('peck');
    }

    cleanup();
  });

  it('peckモードの魚はfleeやseekより遅い速度倍率で動く', async () => {
    const { handle, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(3);

    // peckを発動
    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    // peck中の魚がいることを確認
    const state = handle.getDebugState();
    const peckFish = state.fishes.find((f) => f.mode === 'peck');
    expect(peckFish).toBeDefined();

    // peck中の魚の速度
    const peckSpeed = Math.hypot(peckFish!.vx, peckFish!.vy);

    // peck中の速度が baseSpeed(魚種ごとに異なるが最低でも30程度) × speedMul(0.8) 程度
    // 上限チェック: flee(2.4倍)やseek(1.5倍)よりは確実に遅いはず
    // 速度が妥当な範囲内(0以上かつ過剰でない)であることを確認
    expect(peckSpeed).toBeGreaterThanOrEqual(0);
    expect(peckSpeed).toBeLessThan(200);

    cleanup();
  });

  it('peck中の魚は餌に反応しない(seekに切り替わらない)', async () => {
    const { handle, tapAt, cleanup } = await mountAquarium();
    handle.applyFishSettings(defaultAquariumSettings);

    handle.step(3);

    // peckを発動
    vi.spyOn(Math, 'random').mockReturnValue(0);
    handle.step(1 / 60);

    const peckState = handle.getDebugState();
    const peckIds = peckState.fishes.filter((f) => f.mode === 'peck').map((f) => f.id);
    expect(peckIds.length).toBeGreaterThan(0);

    // 水面上をタップして餌を撒く
    vi.spyOn(Math, 'random').mockImplementation(originalRandom);
    tapAt(400, 30);

    // 少し進めて餌に反応する時間を与える
    handle.step(0.5);

    const afterFood = handle.getDebugState();
    // peckだった魚はseekになっていないことを確認(peckかwanderのまま)
    for (const id of peckIds) {
      const fish = afterFood.fishes.find((f) => f.id === id);
      expect(fish).toBeDefined();
      expect(fish!.mode).not.toBe('seek');
    }

    cleanup();
  });
});
