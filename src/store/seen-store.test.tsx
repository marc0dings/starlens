import AsyncStorage from '@react-native-async-storage/async-storage';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { SeenStoreProvider, useSeen } from './seen-store';

function wrapper({ children }: PropsWithChildren) {
  return <SeenStoreProvider>{children}</SeenStoreProvider>;
}

describe('useSeen', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('starts empty and eventually reports loaded', async () => {
    const { result } = await renderHook(() => useSeen(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    expect(result.current.seenCount).toBe(0);
    expect(result.current.isSeen('orion')).toBe(false);
  });

  it('toggles a constellation between seen and not seen', async () => {
    const { result } = await renderHook(() => useSeen(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await act(async () => {
      result.current.toggleSeen('orion');
    });
    expect(result.current.isSeen('orion')).toBe(true);
    expect(result.current.seenCount).toBe(1);

    await act(async () => {
      result.current.toggleSeen('orion');
    });
    expect(result.current.isSeen('orion')).toBe(false);
    expect(result.current.seenCount).toBe(0);
  });

  it('keeps constellations independent of each other', async () => {
    const { result } = await renderHook(() => useSeen(), { wrapper });
    await waitFor(() => expect(result.current.isLoaded).toBe(true));

    await act(async () => {
      result.current.toggleSeen('orion');
      result.current.toggleSeen('cassiopeia');
    });

    expect(result.current.isSeen('orion')).toBe(true);
    expect(result.current.isSeen('cassiopeia')).toBe(true);
    expect(result.current.isSeen('cygnus')).toBe(false);
    expect(result.current.seenCount).toBe(2);
  });

  it('persists to AsyncStorage so a freshly mounted provider picks it up', async () => {
    const first = await renderHook(() => useSeen(), { wrapper });
    await waitFor(() => expect(first.result.current.isLoaded).toBe(true));

    await act(async () => {
      first.result.current.toggleSeen('cassiopeia');
    });

    await waitFor(async () => {
      const raw = await AsyncStorage.getItem('starlens.seenConstellations');
      expect(raw).toContain('cassiopeia');
    });

    const second = await renderHook(() => useSeen(), { wrapper });
    await waitFor(() => expect(second.result.current.isLoaded).toBe(true));
    expect(second.result.current.isSeen('cassiopeia')).toBe(true);
  });
});
