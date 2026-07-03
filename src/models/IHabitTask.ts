import type { ITask } from './ITask';
import type { TaskArgs } from './TaskArgs';

export interface IHabitTask extends ITask {
  habitId: string[]; // 各タスクの識別用ID 必ず1以上存在させる インデックスはhabitIdの順番に対応する
  deadline: Date[];
  isCompleted: boolean[];
  completedAt: (Date | null)[];
  intervalDays: number;

  getAllArgs(): TaskArgs[];
  getArgs(habitId: string): TaskArgs;
  setArgs(args: TaskArgs, habitId: string): void;
  complete(habitId: string): void;
  uncomplete(habitId: string): void;
  updateAllStatus(): void;
  updateStatus(habitId: string): void;
  append(): void; // 末尾に子タスクを追加する
  remove(habitId: string): void;
  skipHabit(): void; // 末尾の子タスクを取りやめて次の生成予定時刻に生成 末尾以外に使わせないようにする？
  isDeadlinePassed(habitId: string): boolean;
}