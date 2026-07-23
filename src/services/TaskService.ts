import type { ITask } from '../models/ITask';
import type { TaskArgs } from '../models/TaskArgs';
import { NormalTask } from '../models/NormalTask';
import { HabitTask } from '../models/HabitTask';
import { Category } from '../models/Category';
import type { ITaskRepository } from '../repositories/ITaskRepository';
import type { ITaskService } from '../services/ITaskService';
import { TYPES } from '../infrastructure/types';
import { inject, injectable } from 'inversify';

@injectable()
export class TaskService implements ITaskService {
  private taskRepository: ITaskRepository;

  constructor(@inject(TYPES.ITaskRepository) taskRepository: ITaskRepository) {
    this.taskRepository = taskRepository;
  }

  private sortTaskArgsByDeadline(taskArgsArray: TaskArgs[]): TaskArgs[] {
    return taskArgsArray.sort((a, b) => a.deadline.getTime() - b.deadline.getTime());
  }

  private filterTaskByCategory(taskArray: ITask[], category: Category): ITask[] {
    return taskArray.filter(task => task.categories.some(cat => cat.id === category.id));
  }

  private filterTaskArgsByCategory(taskArgsArray: TaskArgs[], category: Category): TaskArgs[] {
    return taskArgsArray.filter(taskArg => taskArg.categories.some(cat => cat.id === category.id));
  }

  private filterTaskArgsByStatus(taskArgsArray: TaskArgs[], status: 'uncompleted' | 'completed' | 'deadline-passed'): TaskArgs[] {
    return taskArgsArray.filter(taskArg => taskArg.status === status);
  }

  async getAllTasks(): Promise<ITask[]> {
    return this.taskRepository.getAllTasks();
  }

  async getTaskById(id: string): Promise<ITask | null> {
    return this.taskRepository.getTaskById(id);
  }

  async getAllTaskArgs(): Promise<TaskArgs[]> {
    return this.sortTaskArgsByDeadline(await this.taskRepository.getAllTaskArgs());
  }

  async getTaskArgsById(id: string): Promise<TaskArgs | null> {
    return this.taskRepository.getTaskArgsById(id);
  }

  async getTasksByCategory(category: Category): Promise<ITask[]> {
    const allTasks = await this.taskRepository.getAllTasks();

    return this.filterTaskByCategory(allTasks, category);
  }

  async getTaskArgsByCategory(category: Category): Promise<TaskArgs[]> {
    const allTaskArgs = await this.taskRepository.getAllTaskArgs();

    return this.sortTaskArgsByDeadline(this.filterTaskArgsByCategory(allTaskArgs, category));
  }

  async getTaskArgsByStatus(status: 'uncompleted' | 'completed' | 'deadline-passed'): Promise<TaskArgs[]> {
    const allTaskArgs = await this.taskRepository.getAllTaskArgs();

    return this.sortTaskArgsByDeadline(this.filterTaskArgsByStatus(allTaskArgs, status));
  }

  async getTaskArgsByCategoryAndStatus(category: Category, status: 'uncompleted' | 'completed' | 'deadline-passed'): Promise<TaskArgs[]> {
    const allTaskArgs = await this.taskRepository.getAllTaskArgs();

    return this.sortTaskArgsByDeadline(this.filterTaskArgsByCategory(this.filterTaskArgsByStatus(allTaskArgs, status), category)); // ByCategoryとByStatusの合わせ技
  }

  async createTask(args: TaskArgs): Promise<void> {
    var newId = crypto.randomUUID();
    var newTask: ITask;

    args.id = newId;
    
    if (args.type === `normal`) {
      newTask = new NormalTask(args);
    } else {
      // args.type === `habit` の場合
      var newHabitId = crypto.randomUUID();
      newTask = new HabitTask(args, newHabitId);
    }

    await this.taskRepository.createTask(newTask);
  }

  async updateTask(args: TaskArgs): Promise<void> {
    if (!args.id) {
      throw new Error('Task ID is required for update');
    }

    const task = await this.taskRepository.getTaskById(args.id);
    if (!task) {
      return; // ID一致するTaskがなかった場合は何も起きない
    }

    task.setArgs(args);
    await this.taskRepository.updateTask(task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.taskRepository.deleteTask(id);
  }

  async completeTask(id: string): Promise<void> {
    const task = await this.taskRepository.getTaskById(id); // 通常タスクの場合は単にID, 習慣タスクの場合は子タスクのIDを指定 (親が返ってくる)
    if (!task) {
      return; // ID一致するTaskがなかった場合は何も起きない
    }

    if (task instanceof HabitTask) {
      // idが親タスクを指定していないか確認する
      if (!task.habitId.includes(id)) {
        return;
      }

      // 習慣タスクの場合は、子タスクのIDを指定して完了する
      task.complete(id);

      if (task.habitId.at(-1) === id) {
        // 末尾の子タスクを完了した場合は、新しい子タスクを追加する
        const newHabitId = crypto.randomUUID();
        task.append(newHabitId);
      }
    } else {
      // 通常タスクの場合は単に完了する
      task.complete();
    }

    await this.taskRepository.updateTask(task);
  }

  async uncompleteTask(id: string): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task) {
      return; // ID一致するTaskがなかった場合は何も起きない
    }

    if (task instanceof HabitTask) {
      // idが親タスクを指定していないか確認する
      if (!task.habitId.includes(id)) {
        return;
      }

      // 習慣タスクの場合は、子タスクのIDを指定して未完了にする
      task.uncomplete(id);
    } else {
      // 通常タスクの場合は、単に未完了にする
      task.uncomplete();
    }

    await this.taskRepository.updateTask(task);
  }

  async skipHabitTask(id: string): Promise<void> {
    const task = await this.taskRepository.getTaskById(id);
    if (!task || !(task instanceof HabitTask)) {
      return; // ID一致するTaskがなかった場合、または習慣タスクでない場合は何も起きない
    }

    // 末尾の子タスクを取りやめて次の生成予定時刻に生成する
    const lastHabitId = task.habitId.at(-1);
    const newHabitId = crypto.randomUUID();

    task.remove(lastHabitId!);
    task.append(newHabitId);

    await this.taskRepository.updateTask(task);
  }
}
