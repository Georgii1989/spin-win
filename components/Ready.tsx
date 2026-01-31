'use client';

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export function Ready() {
  useEffect(() => {
    // Скрываем splash-экран Base Mini App как можно раньше
    sdk.actions.ready();
  }, []);

  // Компонент ничего не рендерит
  return null;
}