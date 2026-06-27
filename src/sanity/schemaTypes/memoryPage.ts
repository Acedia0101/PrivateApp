// src/sanity/schemaTypes/memoryPage.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: 'memoryPage',
  title: 'Memory Book Pages',
  type: 'document', // <--- TRIPLE CHECK THIS IS EXACTLY 'document'
  fields: [
    defineField({
      name: 'pageNumber',
      title: 'Page Number (Order)',
      type: 'number',
    }),
    defineField({
      name: 'title',
      title: 'Page Title/Heading',
      type: 'string',
    }),
    defineField({
      name: 'letter',
      title: 'Your Letter / Message',
      type: 'text',
    }),
    defineField({
      name: 'image',
      title: 'Memory Picture',
      type: 'image',
      options: { hotspot: true }
    }),
  ],
});