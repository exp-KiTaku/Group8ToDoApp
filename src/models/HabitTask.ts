import type { IHabitTask } from './IHabitTask';
import type { TaskArgs } from './TaskArgs';
import type { Category } from './Category';

export class HabitTask implements IHabitTask {
  public readonly id: string;
  public title: string;
  public description: string | null;
  public categories: Category[];
  public habitId: string[];
  public status: ('uncompleted' | 'completed' | 'deadline-passed')[];
  public deadline: Date[];
  public completedAt: (Date | null)[];
  public intervalDays: number;

  constructor(args: TaskArgs, newHabitId: string) {
    if (args.intervalDays === undefined || args.intervalDays <= 0) {
      throw new Error('習慣タスクには正の intervalDays が必要です。');
    }

    if (!args.id) {
      args.id = crypto.randomUUID();
    }

    this.id = args.id;
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.intervalDays = args.intervalDays;

    // 初期の子タスクを1件作成（未完了状態）
    this.habitId = [newHabitId];
    this.status = [args.status];
    this.deadline = [new Date(args.deadline)];
    this.completedAt = [args.completedAt ? new Date(args.completedAt) : null];
  }

  /**
   * 指定した habitId のインデックスを取得する（見つからない場合は例外）
   */
  private getIndex(habitId: string): number {
    const index = this.habitId.indexOf(habitId);
    if (index === -1) {
      throw new Error(`habitId "${habitId}" が見つかりません。`);
    }
    return index;
  }

  /**
   * 全ての子タスクの TaskArgs を配列で返す
   */
  getAllArgs(): TaskArgs[] {
    return this.habitId.map((_, i) => this.buildArgs(i));
  }

  /**
   * 指定した habitId の TaskArgs を返す
   */
  getArgs(habitId: string): TaskArgs {
    const index = this.getIndex(habitId);
    return this.buildArgs(index);
  }

  /**
   * インデックスを指定して TaskArgs を構築する
   */
  private buildArgs(index: number): TaskArgs {
    if (index < 0 || index >= this.habitId.length) {
      throw new Error(`インデックス ${index} は habitId 配列の範囲外です（長さ: ${this.habitId.length}）。`);
    }

    return {
      id: this.id,
      type: 'habit',
      title: this.title,
      description: this.description,
      categories: [...this.categories],
      status: this.status[index],
      deadline: new Date(this.deadline[index]),
      completedAt: this.completedAt[index] ? new Date(this.completedAt[index]) : null,
      intervalDays: this.intervalDays,
    };
  }

  /**
   * TaskArgs を用いて指定した habitId の子タスクのプロパティを更新する
   */
  setArgs(args: TaskArgs, habitId: string): void {
    const index = this.getIndex(habitId);
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.status[index] = args.status;
    this.deadline[index] = new Date(args.deadline);
    this.completedAt[index] = args.completedAt ? new Date(args.completedAt) : null;
    if (args.intervalDays !== undefined) {
      this.intervalDays = args.intervalDays;
    }
  }


  /**
   * 指定した habitId の子タスクを完了状態にする。
   * 完了処理のみを行い、次回タスクの生成はService側の責務とする。
   */
  complete(habitId: string): void {
    const index = this.getIndex(habitId);

    this.status[index] = 'completed';
    this.completedAt[index] = new Date();
  }

  /**
   * 指定した habitId の子タスクの完了状態を取り消す
   */
  uncomplete(habitId: string): void {
    const index = this.getIndex(habitId);
    this.status[index] = 'uncompleted';
    this.completedAt[index] = null;
  }

  /**
   * 全ての子タスクの状態を更新する
   */
  updateAllStatus(): void {
    for (const hId of this.habitId) {
      this.updateStatus(hId);
    }
  }

  /**
   * 指定した habitId の子タスクの状態を更新する（期限切れ判定）
   */
  updateStatus(habitId: string): void {
    const index = this.getIndex(habitId);
    if (this.status[index] !== 'completed' && this.isDeadlinePassed(habitId)) {
      this.status[index] = 'deadline-passed';
    }
  }

  /**
   * 末尾のdeadlineを基準に intervalDays を足した次回タスクを生成して配列に追加する。
   * IDはService側で生成して引数として渡す。
   */
  append(newHabitId: string): void {
    const lastDeadline = this.deadline[this.deadline.length - 1];
    const nextDeadline = new Date(lastDeadline);
    nextDeadline.setDate(nextDeadline.getDate() + this.intervalDays);

    this.habitId.push(newHabitId);
    this.status.push('uncompleted');
    this.deadline.push(nextDeadline);
    this.completedAt.push(null);
  }

  /**
   * 指定した habitId の子タスクを削除する。
   * 純粋な削除のみを行い、次回タスクの生成はService側の責務とする。
   */
  remove(habitId: string): void {
    const index = this.getIndex(habitId);

    this.habitId.splice(index, 1);
    this.status.splice(index, 1);
    this.deadline.splice(index, 1);
    this.completedAt.splice(index, 1);
  }



  /**
   * 指定した habitId の子タスクの期限が過ぎているかどうかを判定する
   */
  isDeadlinePassed(habitId: string): boolean {
    const index = this.getIndex(habitId);
    return this.deadline[index].getTime() < Date.now();
  }

  clone(): HabitTask {
    // コンストラクタを利用して親情報をコピー
    const copy = new HabitTask(
      {
        id: this.id,
        type: "habit",
        title: this.title,
        description: this.description,
        categories: [...this.categories],
        status: this.status[0],
        deadline: new Date(this.deadline[0]),
        completedAt: this.completedAt[0]
          ? new Date(this.completedAt[0]!)
          : null,
        intervalDays: this.intervalDays,
      },
      this.habitId[0]
    );

    // 子タスク情報をディープコピー
    copy.habitId = [...this.habitId];
    copy.status = [...this.status];
    copy.deadline = this.deadline.map(d => new Date(d));
    copy.completedAt = this.completedAt.map(d =>
      d ? new Date(d) : null
    );

    return copy;
  }

}
