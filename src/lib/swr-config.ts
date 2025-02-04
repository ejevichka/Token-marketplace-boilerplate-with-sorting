// lib/swr-config.ts

import cache from '~/utils/cache'; // Adjust the path as per your project structure

const swrConfig = {
  provider: () => cache,
};

export default swrConfig;
