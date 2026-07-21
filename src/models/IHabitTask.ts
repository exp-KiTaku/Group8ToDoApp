import type { ITask } from './ITask';
import type { TaskArgs } from './TaskArgs';

export interface IHabitTask extends ITask {
  habitId: string[]; // 各タスクの識別用ID 必ず1以上存在させる インデックスはhabitIdの順番に対応する
  status: (`uncompleted` | `completed` | `deadline-passed`)[]; // 各子タスクの状態を配列で保持
  deadline: Date[];
  completedAt: (Date | null)[];
  intervalDays: number;

  getAllArgs(): TaskArgs[];
  getArgs(habitId: string): TaskArgs;
  setArgs(args: TaskArgs, habitId: string): void;
  complete(habitId: string): void;
  uncomplete(habitId: string): void;
  updateAllStatus(): void;
  updateStatus(habitId: string): void;
  append(newHabitId: string): void; // 末尾に子タスクを追加する（IDはService側で生成して渡す）
  remove(habitId: string): void;
  isDeadlinePassed(habitId: string): boolean;
}