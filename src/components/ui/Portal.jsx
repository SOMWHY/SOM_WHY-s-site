import React, { memo } from 'react';
import { createPortal } from 'react-dom';

const Portal = memo(function Portal({ children, container = document.body }) {
  return createPortal(children, container);
});

Portal.displayName = 'Portal';

export default Portal;