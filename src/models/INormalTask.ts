import type { ITask } from './ITask';
import type { TaskArgs } from './TaskArgs';

export interface INormalTask extends ITask {
  deadline: Date;
  isCompleted: boolean;
  completedAt: Date | null;

  getArgs(): TaskArgs;
  setArgs(args: TaskArgs): void;
  complete(): void;
  uncomplete(): void;
  updateStatus(): void;
  isDeadlinePassed(): boolean;
}