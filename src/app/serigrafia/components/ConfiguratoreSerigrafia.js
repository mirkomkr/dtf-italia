'use client';

// Refactored to use modular architecture. 
// See src/components/configurator/serigrafia/SerigrafiaContainer.jsx

import SerigrafiaContainer from '@/components/configurator/serigrafia/SerigrafiaContainer';

export default function ConfiguratoreSerigrafia(props) {
  return <SerigrafiaContainer {...props} />;
}