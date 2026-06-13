import { type AquariumHandle, createAquarium } from '../createAquarium';

// テスト水槽の固定サイズ。全テストでこの値を前提にしてよい。
export const TANK_WIDTH = 800;
export const TANK_HEIGHT = 600;

export type MountedAquarium = {
  handle: AquariumHandle;
  canvas: HTMLCanvasElement;
  // 水槽内座標(x, y)をポインターダウンとしてcanvasへ送る
  tapAt: (x: number, y: number) => void;
  // テスト終了時に必ず呼ぶこと。呼ばないと後続テストへcanvasが残る
  cleanup: () => void;
};

// 固定サイズの水槽をDOMにマウントし、手動tickモードで初期化する
export const mountAquarium = async (): Promise<MountedAquarium> => {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = `${TANK_WIDTH}px`;
  container.style.height = `${TANK_HEIGHT}px`;
  document.body.appendChild(container);

  const handle = await createAquarium(container, { manualTick: true });
  const canvas = container.querySelector('canvas');
  if (!canvas) {
    throw new Error('水槽のcanvasが生成されていません');
  }

  const tapAt = (x: number, y: number): void => {
    const rect = canvas.getBoundingClientRect();
    canvas.dispatchEvent(
      new PointerEvent('pointerdown', {
        clientX: rect.left + x,
        clientY: rect.top + y,
        bubbles: true,
        pointerId: 1,
        pointerType: 'mouse',
        isPrimary: true,
        button: 0,
        buttons: 1
      })
    );
  };

  const cleanup = (): void => {
    handle.destroy();
    container.remove();
  };

  return { handle, canvas, tapAt, cleanup };
};
