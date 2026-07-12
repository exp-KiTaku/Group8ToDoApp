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

  constructor(args: TaskArgs) {
    // 期限日時が過去の場合は例外をスロー
    if (args.deadline.getTime() < Date.now()) {
      throw new Error('期限日時に過去の時刻を設定することはできません。');
    }

    if (args.intervalDays === undefined || args.intervalDays <= 0) {
      throw new Error('習慣タスクには正の intervalDays が必要です。');
    }

    this.id = args.id ?? crypto.randomUUID();
    this.title = args.title;
    this.description = args.description;
    this.categories = [...args.categories];
    this.intervalDays = args.intervalDays;

    // 初期の子タスクを1件作成（未完了状態）
    const firstHabitId = crypto.randomUUID();
    this.habitId = [firstHabitId];
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
    let result =
      `[HabitTask] ${this.title}\n` +
      `  ID: ${this.id}\n` +
      `  説明: ${this.description ?? 'なし'}\n` +
      `  カテゴリー: ${categoryNames || 'なし'}\n` +
      `  繰り返し間隔: ${this.intervalDays}日\n` +
      `  履歴:\n`;

    for (let i = 0; i < this.habitId.length; i++) {
      const completedAtValue = this.completedAt[i];
      const completedAtStr = completedAtValue
        ? completedAtValue.toLocaleString()
        : '未完了';
      result +=
        `    [${i + 1}] habitId: ${this.habitId[i]}\n` +
        `        状態: ${this.status[i]}\n` +
        `        期限: ${this.deadline[i].toLocaleString()}\n` +
        `        完了日時: ${completedAtStr}\n`;
    }

    return result;
  }

  /**
   * リマインダー機能のプレースホルダー
   */
  remind(): void {
    const lastIndex = this.habitId.length - 1;
    console.log(
      `[リマインダー] 習慣タスク「${this.title}」の次の期限は ${this.deadline[lastIndex].toLocaleString()} です。`
    );
  }

  /**
   * 指定した habitId の子タスクを完了状態にする。
   * 末尾の未完了タスクの場合のみ、次回タスクを自動生成する。
   */
  complete(habitId: string): void {
    const index = this.getIndex(habitId);

    this.status[index] = 'completed';
    this.completedAt[index] = new Date();

    // 末尾の未完了タスクを完了した場合のみ、次回タスクを生成
    if (index === this.habitId.length - 1) {
      this.append();
    }
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
   * 末尾のdeadlineを基準に intervalDays を足した次回タスクを生成して配列に追加する
   */
  append(): void {
    const lastDeadline = this.deadline[this.deadline.length - 1];
    const nextDeadline = new Date(lastDeadline);
    nextDeadline.setDate(nextDeadline.getDate() + this.intervalDays);

    const newHabitId = crypto.randomUUID();
    this.habitId.push(newHabitId);
    this.status.push('uncompleted');
    this.deadline.push(nextDeadline);
    this.completedAt.push(null);
  }

  /**
   * 指定した habitId の子タスクを削除する。
   * 削除対象が末尾の未完了タスクの場合、削除前にそのdeadlineを基準として次回タスクを生成する。
   * スキップ履歴自体は保持しない。
   */
  remove(habitId: string): void {
    const index = this.getIndex(habitId);
    const isLast = index === this.habitId.length - 1;
    const isUncompleted = this.status[index] !== 'completed';

    // 末尾の未完了タスクの場合は、削除前に次回タスクを生成
    if (isLast && isUncompleted) {
      // 削除対象のdeadlineを基準に次回タスクを生成
      const targetDeadline = this.deadline[index];
      const nextDeadline = new Date(targetDeadline);
      nextDeadline.setDate(nextDeadline.getDate() + this.intervalDays);

      const newHabitId = crypto.randomUUID();
      this.habitId.push(newHabitId);
      this.status.push('uncompleted');
      this.deadline.push(nextDeadline);
      this.completedAt.push(null);
    }

    // 対象タスクを削除
    this.habitId.splice(index, 1);
    this.status.splice(index, 1);
    this.deadline.splice(index, 1);
    this.completedAt.splice(index, 1);
  }

  /**
   * 末尾の子タスクをスキップして次の生成予定時刻に新規タスクを生成する
   */
  skipHabit(): void {
    const lastIndex = this.habitId.length - 1;
    if (lastIndex < 0) {
      throw new Error('スキップ対象の子タスクが存在しません。');
    }

    const lastHabitId = this.habitId[lastIndex];
    this.remove(lastHabitId);
  }

  /**
   * 指定した habitId の子タスクの期限が過ぎているかどうかを判定する
   */
  isDeadlinePassed(habitId: string): boolean {
    const index = this.getIndex(habitId);
    return this.deadline[index].getTime() < Date.now();
  }
}
