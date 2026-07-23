import { Category } from '../models/Category';
import type { ICategoryService } from '../services/ICategoryService';
import type { ICategoryRepository } from '../repositories/ICategoryRepository';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import { TYPES } from '../infrastructure/types';
import { inject, injectable } from 'inversify';

@injectable()
export class CategoryService implements ICategoryService {
  private categoryRepository: ICategoryRepository;
  private taskRepository: ITaskRepository;

  constructor(
    @inject(TYPES.ICategoryRepository) categoryRepository: ICategoryRepository,
    @inject(TYPES.ITaskRepository) taskRepository: ITaskRepository
  ) {
    this.categoryRepository = categoryRepository;
    this.taskRepository = taskRepository;
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.getAllCategories();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.getCategoryById(id);
  }

  async createCategory(name: string, color: string): Promise<void> {
    var newId = crypto.randomUUID(); // Generate a new UUID for the category
    var addingCategory = new Category(newId, name, color);

    await this.categoryRepository.createCategory(addingCategory);
  }

  async updateCategory(id: string, name: string, color: string): Promise<void> {
    const category = await this.categoryRepository.getCategoryById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    category.name = name;
    category.color = color;
    await this.categoryRepository.updateCategory(category);
  }

  async isCategoryUsed(id: string): Promise<boolean> {
    const allTasks = await this.taskRepository.getAllTasks();
    return allTasks.some(task => task.categories.some(category => category.id === id));
  }

  async deleteCategory(id: string): Promise<void> {
    const isUsed = await this.isCategoryUsed(id);
    if (isUsed) {
      throw new Error('Cannot delete category because it is used by some tasks');
    }

    await this.categoryRepository.deleteCategory(id);
  }
}
