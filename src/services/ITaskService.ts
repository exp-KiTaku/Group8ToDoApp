import type { ITask } from '../models/ITask';
import type { TaskArgs } from '../models/TaskArgs';
import type { Category } from '../models/Category';

export interface ITaskService {
  getAllTasks(): Promise<ITask[]>;
  getTaskById(id: string): Promise<ITask | null>;
  getAllTaskArgs(): Promise<TaskArgs[]>;
  getTaskArgsById(id: string): Promise<TaskArgs | null>;
  getTasksByCategories(categories: Category[]): Promise<ITask[]>;
  getTaskArgsByCategories(categories: Category[]): Promise<TaskArgs[]>;
  getTaskArgsByStatus(status: 'uncompleted' | 'completed' | 'deadline-passed'): Promise<TaskArgs[]>;
  getTaskArgsByCategoriesAndStatus(categories: Category[], status: 'uncompleted' | 'completed' | 'deadline-passed'): Promise<TaskArgs[]>;
  createTask(args: TaskArgs): Promise<void>;
  updateTask(args: TaskArgs): Promise<void>; // 変更するタスクのIDを含むTaskArgsを渡す
  deleteTask(id: string): Promise<void>;
  completeTask(id: string): Promise<void>; // 通常タスクは普通にID, 習慣タスクは子タスクのIDを指定
  uncompleteTask(id: string): Promise<void>; // 通常タスクは普通にID, 習慣タスクは子タスクのIDを指定
  skipHabitTask(id: string): Promise<void>; // 習慣タスクの親IDを指定
}