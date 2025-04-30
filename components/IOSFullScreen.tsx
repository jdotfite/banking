'use client';

import { useEffect } from 'react';
import { setupIOSFullscreen } from '@/lib/utils/iosFullscreen';

export default function IOSFullscreen() {
  useEffect(() => {
    setupIOSFullscreen();
  }, []);

  return null;
}
