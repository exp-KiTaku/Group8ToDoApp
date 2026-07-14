import type { Category } from '../models/Category';

export interface ICategoryService {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(name: string, color: string): Promise<void>;
  updateCategory(id: string, name: string, color: string): Promise<void>;
  deleteCategory(id: string): Promise<void>;
}



