export default {
  name: 'product',
  title: 'المنتجات',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
    },
    {
      name: 'price',
      title: 'السعر (ر.س)',
      type: 'number',
    },
    {
      name: 'image',
      title: 'صورة المنتج',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'description',
      title: 'وصف المنتج',
      type: 'text',
    },
  ],
}