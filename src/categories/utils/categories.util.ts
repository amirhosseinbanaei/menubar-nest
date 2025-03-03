import { CategoryRelations } from '../types/relations-category.type';

const categoryRelationsHandler = (relations?: CategoryRelations) => {
  switch (relations) {
    case 'all':
      return [
        'translations',
        'translations.language',
        'subcategories',
        'subcategories.translations',
        'subcategories.translations.language',
      ];
    case 'translations':
      return ['translations', 'translations.language'];
    case 'subcategories':
      return [
        'subcategories',
        'subcategories.translations',
        'subcategories.translations.language',
      ];
    default:
      return [];
  }
};

export { categoryRelationsHandler };
