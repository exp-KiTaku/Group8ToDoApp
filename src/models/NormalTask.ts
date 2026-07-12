import type { INormalTask } from './INormalTask';
import type { TaskArgs } from './TaskArgs';
import type { Category } from './Category';

export class NormalTask implements INormalTask {
  public readonly id: string;
  public title: string;
  public description: string | null;
  public categories: Category[];
  public isCompleted: boolean;
  public status: 'uncompleted' | 'completed' | 'deadline-passed';
  public deadline: Date;
  public completedAt: Date | null;

  constructor(args: TaskArgs) {
    // 期限日時が過去の場合は例外をスロー
    if (!args.id && args.deadline.getTime() < Date.now()) {
      throw new Error('期限日時に過去の時刻を設定することはできません。');
    }

    this.id = args.id ?? crypto.randomUUID();
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.isCompleted = args.status === 'completed';
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
   * TaskArgs を用いてタスクのプロパティを更新する
   */
  setArgs(args: TaskArgs): void {
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.status = args.status;
    this.isCompleted = args.status === 'completed';
    this.deadline = new Date(args.deadline);
    this.completedAt = args.completedAt ? new Date(args.completedAt) : null;
  }

  /**
   * タスクの内容（タイトル、説明、カテゴリーなど）を編集・更新する
   */
  editTask(title: string, description: string | null, categories: Category[]): void {
    this.title = title;
    this.description = description;
    this.categories = [...categories];
  }

  /**
   * タスク情報を表示用にフォーマットして返す
   */
  display(): string {
    const categoryNames = this.categories.map((c) => c.name).join(', ');
    const completedAtStr = this.completedAt ? this.completedAt.toLocaleString() : '未完了';
    return (
      `[NormalTask] ${this.title}\n` +
      `  ID: ${this.id}\n` +
      `  説明: ${this.description ?? 'なし'}\n` +
      `  カテゴリー: ${categoryNames || 'なし'}\n` +
      `  状態: ${this.status}\n` +
      `  期限: ${this.deadline.toLocaleString()}\n` +
      `  完了日時: ${completedAtStr}`
    );
  }

  /**
   * リマインダー機能のプレースホルダー
   */
  remind(): void {
    console.log(`[リマインダー] タスク「${this.title}」の期限は ${this.deadline.toLocaleString()} です。`);
  }

  /**
   * タスクを完了状態にし、完了日時を記録する
   */
  complete(): void {
    this.isCompleted = true;
    this.status = 'completed';
    this.completedAt = new Date();
  }

  /**
   * タスクの完了状態を取り消し、完了日時をリセットする
   */
  uncomplete(): void {
    this.isCompleted = false;
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
   * タスクを削除する（削除フラグ的な処理）
   */
  remove(): void {
    console.log(`タスク「${this.title}」(ID: ${this.id}) を削除しました。`);
  }
}
