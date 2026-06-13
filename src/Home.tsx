import { Box } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useMemo, useRef } from 'react';
import { AquariumSettingsDrawer } from './AquariumSettingsDrawer';
import { type AquariumHandle, createAquarium } from './aquarium/createAquarium';
import { type AquariumSettings, defaultAquariumSettings, normalizeAquariumSettings } from './aquarium/settings';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const aquariumRef = useRef<AquariumHandle | null>(null);
  const [storedSettings, setStoredSettings] = useLocalStorage<AquariumSettings>({
    key: 'pixel-aquarium-settings',
    defaultValue: defaultAquariumSettings
  });
  // 保存値に魚種の追加や不正値があっても水槽が壊れないように正規化する
  const settings = useMemo(() => normalizeAquariumSettings(storedSettings), [storedSettings]);
  const settingsRef = useRef(settings);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // StrictMode の二重マウントでも安全に初期化・破棄する
    let unmounted = false;
    let handle: AquariumHandle | undefined;
    createAquarium(container).then((created) => {
      if (unmounted) {
        created.destroy();
        return;
      }
      handle = created;
      aquariumRef.current = created;
      created.applyFishSettings(settingsRef.current);
    });

    return () => {
      unmounted = true;
      aquariumRef.current = null;
      handle?.destroy();
    };
  }, []);

  // 設定が変わったら泳いでいる魚へ反映する
  useEffect(() => {
    settingsRef.current = settings;
    aquariumRef.current?.applyFishSettings(settings);
  }, [settings]);

  return (
    <>
      <Box ref={containerRef} pos='fixed' top={0} left={0} w='100vw' h='100vh' style={{ overflow: 'hidden' }} />
      <AquariumSettingsDrawer settings={settings} onChange={setStoredSettings} />
    </>
  );
}
