import type { Category } from "../models/Category";
import type { ICategoryRepository } from "./ICategoryRepository";

export class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Category[] = [];

  async getAllCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const category = this.categories.find(c => c.id === id);
    return category ?? null;
  }

  async createCategory(category: Category): Promise<void> {
    this.categories.push(category);
  }

  async updateCategory(category: Category): Promise<void> {
    const index = this.categories.findIndex(c => c.id === category.id);

    if (index !== -1) {
      this.categories[index] = category;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    this.categories = this.categories.filter(c => c.id !== id);
  }
}