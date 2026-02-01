import React, { memo } from 'react';

const NoiseOverlay = memo(function NoiseOverlay() {
  return (
    <div className="fixed inset-0 noise-bg z-0"></div>
  );
});

NoiseOverlay.displayName = 'NoiseOverlay';

export default NoiseOverlay;
