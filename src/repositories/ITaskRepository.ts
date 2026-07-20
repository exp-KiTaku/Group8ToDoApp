import type { TaskArgs } from '../models/TaskArgs';
import type { ITask } from '../models/ITask';

export interface ITaskRepository {
  getAllTasks(): Promise<ITask[]>; // 通常タスクと習慣タスクの親をまとめて取得
  getTaskById(id: string): Promise<ITask | null>; // 通常タスクと習慣タスクの親をidで取得 habitIdならその親を取得
  getAllTaskArgs(): Promise<TaskArgs[]>; // 通常タスクと習慣タスクの子をまとめて取得
  getTaskArgsById(id: string): Promise<TaskArgs | null>; // 通常タスクと習慣タスクの子をidで取得 習慣親のidならnull
  createTask(task: ITask): Promise<void>;
  updateTask(task: ITask): Promise<void>; // id一致するTaskなかったら何も起きない
  deleteTask(id: string): Promise<void>;  // id一致するTaskなかったら何も起きない
}