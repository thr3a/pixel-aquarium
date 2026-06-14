import { ActionIcon, Box, Drawer, Group, Select, Stack, Switch, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSettings } from '@tabler/icons-react';
import { useMemo } from 'react';
import { fishCatalog } from './aquarium/fishCatalog';
import { createFishPreview } from './aquarium/fishPreview';
import { type AquariumSettings, FISH_COUNT_MAX, FISH_COUNT_MIN, type FishSetting } from './aquarium/settings';

type AquariumSettingsDrawerProps = {
  settings: AquariumSettings;
  onChange: (settings: AquariumSettings) => void;
};

// 水槽の雰囲気に合わせた深い青のパネル配色
const panelText = '#dff2fc';
const panelSubText = '#9cc8e4';
const inputStyles = {
  input: {
    backgroundColor: 'rgba(223, 242, 252, 0.08)',
    borderColor: 'rgba(223, 242, 252, 0.25)',
    color: panelText
  }
};

const countOptions = Array.from({ length: FISH_COUNT_MAX - FISH_COUNT_MIN + 1 }, (_, i) => String(FISH_COUNT_MIN + i));

export const AquariumSettingsDrawer = ({ settings, onChange }: AquariumSettingsDrawerProps) => {
  const [opened, { open, close }] = useDisclosure(false);
  const previews = useMemo(
    () => new Map(fishCatalog.map((entry) => [entry.species.name, createFishPreview(entry.species)])),
    []
  );

  const updateFish = (name: string, patch: Partial<FishSetting>): void => {
    onChange({
      ...settings,
      fish: { ...settings.fish, [name]: { ...settings.fish[name], ...patch } }
    });
  };

  return (
    <>
      <ActionIcon
        size='lg'
        radius='xl'
        variant='filled'
        aria-label='水槽の設定を開く'
        onClick={open}
        style={{
          position: 'fixed',
          left: 16,
          bottom: 16,
          zIndex: 10,
          backgroundColor: 'rgba(9, 32, 60, 0.5)',
          border: '1px solid rgba(223, 242, 252, 0.35)',
          color: panelText,
          backdropFilter: 'blur(2px)'
        }}
      >
        <IconSettings size={20} />
      </ActionIcon>

      <Drawer
        opened={opened}
        onClose={close}
        position='left'
        size={340}
        title='水槽の設定'
        overlayProps={{ backgroundOpacity: 0.15, blur: 1 }}
        styles={{
          content: { backgroundColor: 'rgba(9, 32, 60, 0.92)', color: panelText },
          header: { backgroundColor: 'transparent', color: panelText },
          close: { color: panelSubText }
        }}
      >
        <Stack gap='sm'>
          <Text size='xs' c={panelSubText}>
            泳がせる魚と数を選べます
          </Text>
          {fishCatalog.map((entry) => {
            const name = entry.species.name;
            const setting = settings.fish[name];
            const preview = previews.get(name);
            return (
              <Group key={name} justify='space-between' wrap='nowrap' opacity={setting.enabled ? 1 : 0.45}>
                <Group gap='sm' wrap='nowrap'>
                  <Box w={64} style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                    {preview && (
                      <img
                        src={preview.url}
                        width={preview.width}
                        height={preview.height}
                        alt={entry.label}
                        style={{ imageRendering: 'pixelated' }}
                      />
                    )}
                  </Box>
                  <Text size='sm'>{entry.label}</Text>
                </Group>
                <Group gap='xs' wrap='nowrap'>
                  <Select
                    data={countOptions}
                    value={String(setting.count)}
                    onChange={(value) => {
                      if (!value) return;
                      updateFish(name, { count: Number(value) });
                    }}
                    disabled={!setting.enabled}
                    allowDeselect={false}
                    size='xs'
                    w={64}
                    styles={inputStyles}
                  />
                  <Switch
                    checked={setting.enabled}
                    onChange={(event) => updateFish(name, { enabled: event.currentTarget.checked })}
                    size='sm'
                    color='cyan'
                  />
                </Group>
              </Group>
            );
          })}

          <Group
            justify='space-between'
            wrap='nowrap'
            mt='md'
            pt='md'
            style={{ borderTop: '1px solid rgba(223, 242, 252, 0.15)' }}
          >
            <Text size='sm'>デバッグモード</Text>
            <Switch
              checked={settings.debug}
              onChange={(event) => onChange({ ...settings, debug: event.currentTarget.checked })}
              size='sm'
              color='cyan'
            />
          </Group>
        </Stack>
      </Drawer>
    </>
  );
};
