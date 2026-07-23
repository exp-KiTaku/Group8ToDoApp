import type { ITask } from './ITask';
import type { TaskArgs } from './TaskArgs';

export interface INormalTask extends ITask {
  status: `uncompleted` | `completed` | `deadline-passed`;
  deadline: Date;
  completedAt: Date | null;

  getArgs(): TaskArgs;
  setArgs(args: TaskArgs): void;
  complete(): void;
  uncomplete(): void;
  updateStatus(): void;
  isDeadlinePassed(): boolean;
  isOld(): boolean; // 30日以上期限切れかどうかを判定し、削除すべきかどうかを判定する
  clone(): INormalTask;
}