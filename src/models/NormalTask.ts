import type { INormalTask } from './INormalTask';
import type { TaskArgs } from './TaskArgs';
import type { Category } from './Category';

export class NormalTask implements INormalTask {
  public readonly id: string;
  public title: string;
  public description: string | null;
  public categories: Category[];
  public status: 'uncompleted' | 'completed' | 'deadline-passed';
  public deadline: Date;
  public completedAt: Date | null;

  constructor(args: TaskArgs) {
    if (!args.id) {
      args.id = crypto.randomUUID();
    }

    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.status = args.status;
    this.deadline = new Date(args.deadline);
    this.completedAt = args.completedAt ? new Date(args.completedAt) : null;
  }

  /**
   * タスクの状態を取得して TaskArgs として返す
   */
  getArgs(): TaskArgs {
    return {
      id: this.id,
      type: 'normal',
      title: this.title,
      description: this.description,
      categories: [...this.categories],
      status: this.status,
      deadline: new Date(this.deadline),
      completedAt: this.completedAt ? new Date(this.completedAt) : null,
    };
  }

  /**
   * TaskArgs を用いてタスクのプロパティ（タイトル、説明、カテゴリー）を更新する
   */
  setArgs(args: TaskArgs): void {
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
  }

  /**
   * タスクを完了状態にし、完了日時を記録する
   */
  complete(): void {
    this.status = 'completed';
    this.completedAt = new Date();
  }

  /**
   * タスクの完了状態を取り消し、完了日時をリセットする
   */
  uncomplete(): void {
    this.status = 'uncompleted';
    this.completedAt = null;
  }

  /**
   * 期限が過ぎているかどうかを判定し、状態を更新する
   */
  updateStatus(): void {
    if (this.status !== 'completed' && this.isDeadlinePassed()) {
      this.status = 'deadline-passed';
    }
  }

  /**
   * 期限が過ぎているかどうかを判定する
   */
  isDeadlinePassed(): boolean {
    return this.deadline.getTime() < Date.now();
  }
}

