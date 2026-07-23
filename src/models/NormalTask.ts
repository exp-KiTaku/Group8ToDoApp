import type { INormalTask } from './INormalTask';
import type { TaskArgs } from './TaskArgs';
import { Category } from './Category';
import type { NormalTaskDTO } from './NormalTaskDTO';

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

  /**
   * タスクが30日以上期限切れかどうかを判定し、削除すべきかどうかを判定する
   */
  isOld(): boolean {
    const now = Date.now();
    const deadlineTime = this.deadline.getTime();
    const timeDiff = now - deadlineTime;
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    return daysDiff > 30;
  }

  clone(): NormalTask {
    return new NormalTask({
      id: this.id,
      type: 'normal',
      title: this.title,
      description: this.description,
      categories: [...this.categories],
      status: this.status,
      deadline: new Date(this.deadline),
      completedAt: this.completedAt ? new Date(this.completedAt) : null,
    });
  }

  static fromDTO(obj: NormalTaskDTO): NormalTask {
    return new NormalTask({
      id: obj.id,
      type: 'normal',
      title: obj.title,
      description: obj.description,
      categories: obj.categories.map((cat: any) => new Category(cat.id, cat.name, cat.color)),
      status: obj.status,
      deadline: new Date(obj.deadline),
      completedAt: obj.completedAt ? new Date(obj.completedAt) : null,
    });
  }

  toDTO(): NormalTaskDTO {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      categories: this.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        color: cat.color
      })),
      status: this.status,
      deadline: new Date(this.deadline),
      completedAt: this.completedAt ? new Date(this.completedAt) : null,
    };
  }
}