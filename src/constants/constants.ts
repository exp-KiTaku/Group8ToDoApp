import { Category } from '../models/Category'

export const CATEGORY_ID_ALL = `00000000-0000-0000-0000-000000000000`;
export const CATEGORY_ALL = new Category(
  CATEGORY_ID_ALL,
  'すべて',
  '#888'
);