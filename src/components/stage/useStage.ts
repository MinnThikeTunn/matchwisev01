import { useSyncExternalStore } from 'react';
import { stageStore, StageState } from '../../lib/twoStage';

export function useStage(): StageState {
  return useSyncExternalStore(
    stageStore.subscribe,
    stageStore.getSnapshot,
    stageStore.getServerSnapshot,
  );
}
