import type { TaskArgs } from './TaskArgs';
import type { Category } from './Category';

export interface ITask {
  readonly id: string; // 識別用ID;
  title: string;
  description: string | null;
  categories: Category[];
  status: (`uncompleted` | `completed` | `deadline-passed`) | (`uncompleted` | `completed` | `deadline-passed`)[]; // 通常タスクの場合は単一の状態, 習慣タスクの場合は各子タスクの状態を配列で保持
  deadline: Date | Date[]; // 通常タスクの場合はDate, 習慣タスクの場合はDate[]を使用
  completedAt: (Date | null) | (Date | null)[]; // 完了時刻  未完了の場合にnullを用いる

  // 通常タスクの場合は引数なし、習慣タスクの場合は引数にhabitIdを指定する
  getArgs(habitId?: string): TaskArgs;
  setArgs(args: TaskArgs, habitId?: string): void;
  complete(habitId?: string): void;
  uncomplete(habitId?: string): void;
  updateStatus(habitId?: string): void;
  isDeadlinePassed(habitId?: string): boolean;
  clone(): ITask;
}
