import { Category } from '../models/Category';
import type { ICategoryRepository } from './ICategoryRepository';
import type { CategoryDTO } from '../models/CategoryDTO';
import { injectable } from 'inversify';

@injectable()
export class LocalStorageCategoryRepository implements ICategoryRepository {
  private readonly storageKey = 'categories';

  async getAllCategories(): Promise<Category[]> {
    const categoriesJson = localStorage.getItem(this.storageKey);
    if (!categoriesJson) {
      return [];
    }
    const categoriesArray = JSON.parse(categoriesJson) as CategoryDTO[];
    return categoriesArray.map(Category.fromDTO);
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await this.getAllCategories();
    const category = categories.find(c => c.id === id);
    return category ?? null;
  }

  async createCategory(category: Category): Promise<void> {
    const categories = await this.getAllCategories();
    categories.push(category);
    localStorage.setItem(this.storageKey, JSON.stringify(categories.map(c => c.toDTO())));
  }

  async updateCategory(category: Category): Promise<void> {
    const categories = await this.getAllCategories();
    const index = categories.findIndex(c => c.id === category.id);
    if (index !== -1) {
      categories[index] = category;
      localStorage.setItem(this.storageKey, JSON.stringify(categories.map(c => c.toDTO())));
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const categories = await this.getAllCategories();
    const filteredCategories = categories.filter(c => c.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(filteredCategories.map(c => c.toDTO())));
  }
}