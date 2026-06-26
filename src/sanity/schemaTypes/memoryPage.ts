// schemas/memoryPage.ts
export default {
  name: 'memoryPage',
  title: 'Memory Book Pages',
  type: 'document',
  fields: [
    {
      name: 'pageNumber',
      title: 'Page Number (Order)',
      type: 'number',
      description: 'The order this page will show up in the book (e.g., 1, 2, 3...)',
      validation: (Rule: any) => Rule.required().integer().positive(),
    },
    {
      name: 'title',
      title: 'Page Title/Heading',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'letter',
      title: 'Your Letter / Message',
      type: 'text',
      description: 'Write your heart out here.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Memory Picture',
      type: 'image',
      options: {
        hotspot: true, // Allows you to crop perfectly in the studio
      },
    },
  ],
  orderings: [
    {
      title: 'Book Order',
      name: 'pageNumberAsc',
      by: [{ field: 'pageNumber', direction: 'asc' }],
    },
  ],
}