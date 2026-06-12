import { Box } from '@mantine/core';
import { useEffect, useRef } from 'react';
import { createAquarium } from './aquarium/createAquarium';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // StrictMode の二重マウントでも安全に初期化・破棄する
    let unmounted = false;
    let destroy: (() => void) | undefined;
    createAquarium(container).then((destroyFn) => {
      if (unmounted) {
        destroyFn();
        return;
      }
      destroy = destroyFn;
    });

    return () => {
      unmounted = true;
      destroy?.();
    };
  }, []);

  return <Box ref={containerRef} pos='fixed' top={0} left={0} w='100vw' h='100vh' style={{ overflow: 'hidden' }} />;
}
