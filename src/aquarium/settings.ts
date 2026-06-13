import { fishCatalog } from './fishCatalog';

// 魚1種ぶんの設定(泳がせるかどうかと、泳がせる数)
export type FishSetting = {
  enabled: boolean;
  count: number;
};

export type AquariumSettings = {
  fish: Record<string, FishSetting>;
};

export const FISH_COUNT_MIN = 1;
export const FISH_COUNT_MAX = 3;

// 初期構成(従来デモと同じく、クマノミとネオンテトラだけ2匹にする)
const defaultCounts: Record<string, number> = {
  clownfish: 2,
  neonTetra: 2
};

export const defaultAquariumSettings: AquariumSettings = {
  fish: Object.fromEntries(
    fishCatalog.map((entry) => [entry.species.name, { enabled: true, count: defaultCounts[entry.species.name] ?? 1 }])
  )
};

// localStorage から復元した値を検証し、欠けている魚種の補完と数の範囲チェックを行う
export const normalizeAquariumSettings = (stored: AquariumSettings): AquariumSettings => {
  const fish: Record<string, FishSetting> = {};
  for (const entry of fishCatalog) {
    const name = entry.species.name;
    const fallback = defaultAquariumSettings.fish[name];
    const saved = stored.fish?.[name];
    const count = typeof saved?.count === 'number' ? Math.round(saved.count) : fallback.count;
    fish[name] = {
      enabled: typeof saved?.enabled === 'boolean' ? saved.enabled : fallback.enabled,
      count: Math.min(FISH_COUNT_MAX, Math.max(FISH_COUNT_MIN, count))
    };
  }
  return { fish };
};
