import type { ITaskRepository } from './ITaskRepository';
import type { TaskArgs } from '../models/TaskArgs';
import type { ITask } from '../models/ITask';
import { HabitTask } from '../models/HabitTask';
import { NormalTask } from '../models/NormalTask';
import type { NormalTaskDTO } from '../models/NormalTaskDTO';
import type { HabitTaskDTO } from '../models/HabitTaskDTO';
import { injectable } from 'inversify';

@injectable()
export class LocalStorageTaskRepository implements ITaskRepository {
  private storageNormalKey = 'normalTasks';
  protected storageHabitKey = 'habitTasks';

  async getAllNormalTasks(): Promise<NormalTask[]> {
    const normalTasksJson = localStorage.getItem(this.storageNormalKey);
    let normalTasks: NormalTask[] = [];

    if (normalTasksJson) {
      const tasksArray = JSON.parse(normalTasksJson) as NormalTaskDTO[];
      normalTasks = tasksArray.map((taskData) => NormalTask.fromDTO(taskData));
    }

    return normalTasks;
  }

  async getAllHabitTasks(): Promise<HabitTask[]> {
    const habitTasksJson = localStorage.getItem(this.storageHabitKey);
    let habitTasks: HabitTask[] = [];

    if (habitTasksJson) {
      const tasksArray = JSON.parse(habitTasksJson) as HabitTaskDTO[];
      habitTasks = tasksArray.map((taskData) => HabitTask.fromDTO(taskData));
    }

    return habitTasks;
  }

  async getAllTasks(): Promise<ITask[]> {
    const normalTasks = await this.getAllNormalTasks();
    const habitTasks = await this.getAllHabitTasks();

    return [...normalTasks, ...habitTasks];
  }

  async getTaskById(id: string): Promise<ITask | null> {
    const allTasks = await this.getAllTasks();
    
    // 親IDを探す
    const task = allTasks.find(task => task.id === id);
    if (task) {
      return task.clone();
    }

    // habitIdを探す
    for (const task of allTasks) {
      if (task instanceof HabitTask && task.habitId.includes(id)) {
        return task.clone();
      }
    }

    return null;
  }

  async getAllTaskArgs(): Promise<TaskArgs[]> {
    const allTasks = await this.getAllTasks();
    const result: TaskArgs[] = [];

    for (const task of allTasks) {
      if (task instanceof HabitTask) {
        result.push(...task.getAllArgs());
      } else {
        result.push(task.getArgs());
      }
    }

    return result;
  }

  async getTaskArgsById(id: string): Promise<TaskArgs | null> {
    const allTasks = await this.getAllTasks();

    for (const task of allTasks) {
      if (task instanceof HabitTask) {
        if (task.habitId.includes(id)) {
          return task.getArgs(id);
        }
      } else {
        if (task.id === id) {
          return task.getArgs();
        }
      }
    }

    return null;
  }

  async createTask(task: ITask): Promise<void> {
    if (task instanceof HabitTask) {
      const habitTasks = await this.getAllHabitTasks();
      habitTasks.push(task);
      localStorage.setItem(this.storageHabitKey, JSON.stringify(habitTasks.map(t => t.toDTO())));
    }

    if (task instanceof NormalTask) {
      const normalTasks = await this.getAllNormalTasks();
      normalTasks.push(task);
      localStorage.setItem(this.storageNormalKey, JSON.stringify(normalTasks.map(t => t.toDTO())));
    }
  }

  async updateTask(task: ITask): Promise<void> {
    if (task instanceof HabitTask) {
      const habitTasks = await this.getAllHabitTasks();
      const index = habitTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        habitTasks[index] = task;
        localStorage.setItem(this.storageHabitKey, JSON.stringify(habitTasks.map(t => t.toDTO())));
      }
    }

    if (task instanceof NormalTask) {
      const normalTasks = await this.getAllNormalTasks();
      const index = normalTasks.findIndex(t => t.id === task.id);
      if (index !== -1) {
        normalTasks[index] = task;
        localStorage.setItem(this.storageNormalKey, JSON.stringify(normalTasks.map(t => t.toDTO())));
      }
    }
  }

  async deleteTask(id: string): Promise<void> {
    // 親ID(通常タスク・習慣タスク)ならタスクごと削除
    const normalTasks = await this.getAllNormalTasks();
    const habitTasks = await this.getAllHabitTasks();

    const indexNormal = normalTasks.findIndex(task => task.id === id);
    const indexHabit = habitTasks.findIndex(task => task.id === id);

    if (indexNormal !== -1) {
      normalTasks.splice(indexNormal, 1);
      localStorage.setItem(this.storageNormalKey, JSON.stringify(normalTasks.map(t => t.toDTO())));
      return;
    }

    if (indexHabit !== -1) {
      habitTasks.splice(indexHabit, 1);
      localStorage.setItem(this.storageHabitKey, JSON.stringify(habitTasks.map(t => t.toDTO())));
      return;
    }

    // 子ID(習慣タスク)ならその子だけ削除
    for (const habitTask of habitTasks) {
      if (habitTask.habitId.includes(id)) {
        habitTask.remove(id);
        await this.updateTask(habitTask);
        return;
      }
    }
  }

  async appendHabitTask(id: string, newId: string): Promise<void> {
    const habitTasks = await this.getAllHabitTasks();
    const habitTask = habitTasks.find(task => task.id === id);

    if (habitTask) {
      habitTask.append(newId);
      await this.updateTask(habitTask);
    }
  }
}