import { defineConfig } from 'orval';

export default defineConfig({
  ams: {
    output: {
      mode: 'tags-split',
      target: 'src/shared/api/ams.ts',
      schemas: 'src/shared/api/model',
      client: 'react-query',
    },
    input: {
      target: 'http://localhost:3000/api/v1-yaml',
    },
  },
});
