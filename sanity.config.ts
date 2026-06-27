import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemaTypes'; // <--- VERIFY THIS PATH IS CORRECT

export default defineConfig({
  name: 'default',
  title: 'surpriseapp',

  projectId: 'your_project_id', 
  dataset: 'production',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes, // <--- Links your exported array
  },
});