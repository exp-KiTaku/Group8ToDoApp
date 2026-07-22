import type { TaskArgs } from "../models/TaskArgs";
import type { ITask } from "../models/ITask";
import { HabitTask } from "../models/HabitTask";
import type { ITaskRepository } from "./ITaskRepository";

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: ITask[] = [];

  async getAllTasks(): Promise<ITask[]> {
    return [...this.tasks];
  }

  async getTaskById(id: string): Promise<ITask | null> {
    // 親IDを探す
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      return task;
    }

    // habitIdを探す
    for (const task of this.tasks) {
      if (task instanceof HabitTask) {
        if (task.habitId.includes(id)) {
          return task;
        }
      }
    }

    return null;
  }

  async getAllTaskArgs(): Promise<TaskArgs[]> {
    const result: TaskArgs[] = [];

    for (const task of this.tasks) {
      if (task instanceof HabitTask) {
        result.push(...task.getAllArgs());
      } else {
        result.push(task.getArgs());
      }
    }

    return result;
  }

  async getTaskArgsById(id: string): Promise<TaskArgs | null> {
    for (const task of this.tasks) {
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
    this.tasks.push(task);
  }

  async updateTask(task: ITask): Promise<void> {
    const index = this.tasks.findIndex(t => t.id === task.id);

    if (index !== -1) {
      this.tasks[index] = task;
    }
  }

  async deleteTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  async appendHabitTask(id: string, newId: string): Promise<void> {
    const task = this.tasks.find(task => task.id === id);

    if (task instanceof HabitTask) {
      task.append(newId);
    }
  }
}