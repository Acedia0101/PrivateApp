import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'surpriseapp',

  projectId: 'h9gfx3jy',
  dataset: 'production',
  
  basePath: '/studio', // <--- Add this line to align with your app folder route

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
});